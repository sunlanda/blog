class MyPromise {
    constructor(executor) {
        // 初始状态为pending
        this.status = 'pending';
        this.value = undefined;
        this.reason = undefined;
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];

        const resolve = value => {
            if (this.status === 'pending') {
                this.status = 'fulfilled';
                this.value = value;
                this.onResolvedCallbacks.forEach(callback => callback(value));
            }
        };

        const reject = reason => {
            if (this.status === 'pending') {
                this.status = 'rejected';
                this.reason = reason;
                this.onRejectedCallbacks.forEach(callback => callback(reason));
            }
        };

        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function'? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function'? onRejected : reason => { throw reason };

        const promise2 = new MyPromise((resolve, reject) => {
            if (this.status === 'fulfilled') {
                setTimeout(() => {
                    try {
                        const x = onFulfilled(this.value);
                        this.resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                });
            }

            if (this.status ==='rejected') {
                setTimeout(() => {
                    try {
                        const x = onRejected(this.reason);
                        this.resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                });
            }

            if (this.status === 'pending') {
                this.onResolvedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            const x = onFulfilled(this.value);
                            this.resolvePromise(promise2, x, resolve, reject);
                        } catch (error) {
                            reject(error);
                        }
                    });
                });

                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            const x = onRejected(this.reason);
                            this.resolvePromise(promise2, x, resolve, reject);
                        } catch (error) {
                            reject(error);
                        }
                    });
                });
            }
        });

        return promise2;
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }

    finally(callback) {
        return this.then(
            value => MyPromise.resolve(callback()).then(() => value),
            reason => MyPromise.resolve(callback()).then(() => { throw reason })
        );
    }

    // 辅助函数，用于处理 resolvePromise 的逻辑
    resolvePromise(promise2, x, resolve, reject) {
        if (promise2 === x) {
            return reject(new TypeError('Chaining cycle detected for promise'));
        }

        if (x!== null && (typeof x === 'object' || typeof x === 'function')) {
            let called;

            try {
                const then = x.then;

                if (typeof then === 'function') {
                    then.call(x, y => {
                        if (called) return;
                        called = true;
                        this.resolvePromise(promise2, y, resolve, reject);
                    }, err => {
                        if (called) return;
                        called = true;
                        reject(err);
                    });
                } else {
                    resolve(x);
                }
            } catch (error) {
                if (called) return;
                called = true;
                reject(error);
            }
        } else {
            resolve(x);
        }
    }

    static resolve(value) {
        if (value instanceof MyPromise) {
            return value;
        }
        return new MyPromise(resolve => resolve(value));
    }

    static reject(reason) {
        return new MyPromise((_, reject) => reject(reason));
    }

    static all(promises) {
        return new MyPromise((resolve, reject) => {
            if (!Array.isArray(promises)) {
                return reject(new TypeError('Promise.all accepts an array'));
            }

            let resolvedCount = 0;
            const result = [];

            promises.forEach((promise, index) => {
                MyPromise.resolve(promise).then(value => {
                    resolvedCount++;
                    result[index] = value;
                    if (resolvedCount === promises.length) {
                        resolve(result);
                    }
                }).catch(reason => {
                    reject(reason);
                });
            });
        });
    }

    static race(promises) {
        return new MyPromise((resolve, reject) => {
            if (!Array.isArray(promises)) {
                return reject(new TypeError('Promise.race accepts an array'));
            }

            promises.forEach(promise => {
                MyPromise.resolve(promise).then(value => {
                    resolve(value);
                }).catch(reason => {
                    reject(reason);
                });
            });
        });
    }
}


// 测试代码
// 使用示例
const myPromise = new MyPromise((resolve, reject) => {
    console.log("🚀 ~ myPromise ~ resolve:", resolve)
    setTimeout(() => {
        resolve('Success!');
    }, 1000);
});

myPromise
  .then(value => {
        console.log(value); // 输出 'Success!'
        setTimeout(() => {
            console.log('01 then ')
        }, 500);
        return 'New value';
    })
  .then(value => {
        console.log(value); // 输出 'New value'
    })
  .catch(err => {
        console.error(err);
    });


// 简易实现: `MyPromise` 类实现了 `Promise` 的基本功能，包括状态管理（`pending`、`fulfilled`、`rejected`），链式调用（`then` 方法），错误捕获（`catch` 方法），以及 `finally` 方法。还实现了一些静态方法，比如 `all` 和 `race`，用于并发处理多个 `Promise`。