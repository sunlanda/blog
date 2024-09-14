<!--
 * @Author: sunlanda relaxto@qq.com
 * @Date: 2024-04-25 10:53:04
 * @LastEditors: sunlanda relaxto@qq.com
 * @LastEditTime: 2024-04-30 14:07:00
 * @FilePath: /blog/src/js/let-const.md
-->
# 如何正确认识作用域并用好它? 


在JavaScript中有一个很重要的概念就是作用域.如果你有以下困惑,那作用域这篇文章应该能帮你理清作用域的概念: 
* 问: 函数声明和函数调用位置有区别吗?函数调用写在函数前面为啥也能调用成功?
::: tip 回答:
函数声明 和 函数调用 不在意顺序先后 (使用debugger 试一下函数声明是什么样的)
:::

* 问: 定义变量关键词 `var` 为什么必须先声明再调用呢?能不能先调用?
::: tip 回答:
因为相较于函数的函数提升,变量提升的只有定义,没有赋值的提升.
:::

* var const let 有什么区别?我应该在什么地方使用他们? 
::: tip 回答:
var属于早期的作用域调用(es5?),在js执行环境时会将var的变量进行提升,但再赋值之前如果产生该变量的调用,则变量值为undefined;不会报错 
但如果使用var
:::

*  什么是块级作用域? 和全局作用域有什么不同? 
::: tip 回答:
块级作用域
全局作用域基于window,在browser运行环境中默认声明变量会指向顶层 window 
配图(windows -> 老师)
:::



但是变量声明 需要 先于 变量调用
函数内部的变量调用可以拿到函数外部的
但是函数外部变量的调用拿不到函数内部的变量声明

明白:
* 作用域是向上查找的 (层级) 最高指向windows
* 
## 变量声明 & 函数声明

```js
getFunc()
function getFunc(){
  console.log(`函数${getFunc.name}被调用`) // 函数getFunc被调用
}
getFunc()

console.log(a) // 报错并中断执行 抛出错误: ReferenceError: Cannot access 'a' before initialization
let a;
console.log(a) // 拿不到a的值,但是会打印a结果为: undefined
a = "an apple !"
console.log(a) // 正常打印a结果为: an apple !
```



## 作用域let  const var
```js

var _var_a = '_var_a'
let _let_a = '_let_a'
const _const_a = '_const_a'

function innerFunc(){
  console.log( _var_a, _let_a, _const_a )
}

```

**作用域**

```js
function teacher(){
  let d = "dd"
  console.log(d) // 正常打印 dd
}
if(true){

  let e = "ee"
  console.log(e)
  let f = "ff"
  console.log(f)
}
console.log(e) // undefined
console.log(f) // 正常打印 ff


```
函数作用域 和 块级作用域( if(true){})

let 和 const 是具备块级作用域的隔离的 




