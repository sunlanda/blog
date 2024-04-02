## 作用域

函数声明 和 函数调用 不在意顺序先后 (使用debugger 试一下函数声明是什么样的)
但是变量声明 需要 先于 变量调用
函数内部的变量调用可以拿到函数外部的
但是函数外部变量的调用拿不到函数内部的变量声明

明白:
* 作用域是向上查找的 (层级) 最高指向windows
* 

**作用域let  const var**
```js

let a = 'global'
console.log(a)

function course(){

}

```

**作用域**

```js
function teacher(){
  let d = "dd"
  console.log(d)
}
if(true){

  let e = "ee"
  console.log(e)
  let f = "ff"
  console.log(f)
}
console.log(e) // undefined
console.log(f)
console.log(d)

```
函数作用域 和 块级作用域( if(true){})

let 和 const 是具备块级作用域的隔离的 


**隔离私有变量**

```js
// 模块化鼻祖
let {e,f} =  (function (){
  var e  = 'ee'
  var f  = 'ff'
  return {
    e,f
  }
}())
console.log(e,f)
 // IIFE 立即执行函数  

var g = e + f;
console.log(g)
```


```js
// 是否一样
(function(a, b) {
  console.log(a + b);
})(1,2)

(function(a, b) {
  console.log(a + b);
}(1,2))
```

## this

```js
function zhaowa(){
  console.log("🚀 ~ zhaowa ~ zhaowa:", this) // 此时指向 windows
}
const zhaowa = function(){
  console.log(this) //  ->windows
}
zhaowa()

function zhaowa(){
  console.log(this) //  ->windows
  function  zhaowa1(){
    console.log(this) //  ->windows
  }
  zhaowa1()
}
zhaowa()
```


#### 隐式绑定

```js
const fn = function(){

}
const
```



#### call apply  bind 区别

* call apply 传参不同 依次传参 | 数组传入
* bind 直接返回不同 

#### bind 原理  => 要求手写bind
解题思路: 
* 1 说明原理 写下注释
* 2 根据注释 实现代码

```js
// 手写bind  bind 位置 (挂在哪里 ) -> function.prototype



```