# 数组铺平的几种方法

## 原本是一个数组维度的问题
但是涉及了不少算法的思想,所以这里重点讲解一下


## 原生es模块提供了 flat方法

```js
//  方法一：数组自带的扁平化方法,flat的参数代表的是需要展开几层，如果是Infinity的话，就是不管嵌套几层，全部都展开
let arr1 = [4, 1, 2, 3, 6, [7, 8, [3, 9, 10, [4, 6, 11]]]];
console.log(arr1.flat(Infinity))

```

## 自己写函数实现


### 正则表达式
```js
// 先JSON.stringify()后 对[] 进行 /g全局的替换

```



### reduce
```js
//方法2：使用数组方法join和字符串方法split进行数组扁平化
function Myflat(arr){
    return arr.reduce((prev, item) => {
        return prev.concat(Array.isArray(item) ? Myflat(item) : item);
    }, [])
}
console.log(Myflat(arr1));

```

### 其实用到了递归思路

同样递归的使用还有 这篇文章: 如何实现深拷贝(深度/广度)