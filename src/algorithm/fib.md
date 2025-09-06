# 斐波那契额数列 


```js
const set = new Set()
set.add(1)
set.add(2)
set.add(1)

console.log(set)



// 斐波那契数列
function fib(n) {

  let a = 1;
  let b = 1;
  while (--n) {
    const t = b;
    b += a;
    a = t

  }
  return a
}

console.log(fib(5));

// 执行中断后 控制权交出去 
// generate函数允许中断 支持写个死循环 在某些条件给到外界 
function* genFib() {
  let a = 1;
  let b = 1;
  while (true) {
    yield a; // 把a出让出去 交出控制权 
    const t = b;
    b += a;
    a = t
  }
}
console.log(Object.prototype.toString.call(genFib))

const obj = {
  key1: "val1",
  key2: "val2",
  // [Symbol.iterator]: function () {
  [Symbol.iterator]: function () {
    let i = 1;
    console.log(i)
    return {
      next: function () {
        // return this.key1
        // return {value: this.key1, done: false}
        return { value: obj[`key${i++}`], done: i == 1 ? false : true }
      }
    }
  }
}
for (const i of obj) {
  console.log(i);
}
```