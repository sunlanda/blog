# 如何实现一个累加函数? add(1)(2) = 3


## 分析
目前常规的面试题经常会通过一道题来考察面试者多方面的技术掌握的能力.这道题就是这种类型.我们先来分析一下.
* 先分析add函数调用方式,是多个括号连着写,并没有进行链式调用,和常规的add(1)调用传参不一样
* 在下一次调用时需要用到上一次的参数/累加后的返回值
* 拿到最后累加后的值

<!-- * 高阶 add(1)(2,3)([4,5]) = 15  -->

## 代码

01. 先用笨办法实现一版 返回一个函数 函数参数与顶层函数传递的参数进行累加
```js
function add(x) {
  return function(y){
    return x+y
  }
}

```
02. 发现这种情况只适用于(1)(2)两个括号的调用,再多的话就要写很多的`return function`, 所以要应对很多次调用的话,就要考虑高阶函数的方式实现

```js
function add(x) {
  let sum = x;
  function resultFn(y) {
    sum += y;
    return resultFn;
  }
  return resultFn;
}

```
03.  这个高阶函数是实现了,但是累加的值我们怎么拿到呢,调用到最后一次后返回的是个函数不是个数值,这时候我们用到了JavaScript中的一个toString方法,因为如果用字符串 `"" + add(1)(2)`时会触发toString方法,所以我们要在resultFn函数上对toString进行覆写,改变toString的本来实现,直接将拿到的累加数值 `sum` 进行返回.
```js
function add(x) {
  let sum = x;
  function resultFn(y) {
    sum += y;
    return resultFn;
  }
  resultFn.toString = function() {
    return sum;
  };
  return resultFn;
}

```

04. 最后来一个总体注释
 
```js
function add(x) {
  // 将入参x赋值给临时变量sum
  let sum = x;
  // 新建一个函数resultFn接收一个参数y
  function resultFn(y) {
    // 将+=后的值赋值给临时变量
    sum += y;
    // 返回当前函数 注意只返回resultFn 而不是返回resultFn()进行调用
    return resultFn;
  }
  // toString方法覆写 使其能够与字符串相加时获得触发sum返回
  resultFn.toString = function() {
    return sum;
  };
  // 将改造过toString的函数resultFn进行return 
  return resultFn;
}
// 调用测试 => 6
console.log('' + add(1)(2)(3));
```


## 总结

在JavaScript中实现add()()方法累加用到了高阶函数（函数可以作为参数传递和返回值）、闭包（内部函数可以访问定义它们的外部函数的变量）,柯里化(Currying)以及对象的toString方法覆写思路,需要拆解以下步骤:

- 初始调用：当add(1)被调用时，它返回一个内部函数resultFn。这个内部函数接受一个参数y，并且能够访问外部函数add的参数x。这是通过闭包实现的，闭包允许内部函数访问定义它们的外部函数的作用域。

- 累加：内部函数resultFn将其参数y加到之前的和sum上，并返回自身。这样，每次调用这个返回的函数时，它都会继续累加传入的值。

- 链式调用：由于resultFn返回自身，我们可以继续链式调用，如add(1)(2)，每次都会返回可以接受下一个参数的resultFn。

- 输出结果：JavaScript在尝试将对象转换为字符串时会自动调用对象的toString方法。在这里，我们重写了resultFn的toString方法，使其返回当前的累加和sum。因此，当我们在表达式或者字符串模板中使用add(1)(2)(3)时，toString方法会被隐式调用，返回累加的结果。

虽然有点奇技淫巧,但算是一种思路新奇的实现方式. 你学会了吗? 
