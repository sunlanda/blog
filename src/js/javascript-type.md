# 如何判断JavaScript数据类型 ? 

* 问: 为什么说typeof无法精准判断数据类型?
::: tip 回答:
typeof在判断null时也会返回object, typeof在判断array时返回object,
typeof null 返回 "object" 是一个历史遗留问题。在JavaScript的早期版本中，null被认为是一个空的对象引用
:::

* 问: 如果需要精准区分 Array 或者 Object, 应该怎么做?
::: tip 回答:
Object.prototype.toString.call() 可以派上用场. 利用了原型链上toString方法将要判断的数据类型传入call的第一个参数
:::

* 问: typeof 和 instanceOf 有什么区别?
::: tip 回答:
作用: typeof作为简单类型的判断方法,检测值类型, instanceOf用于检测一个对象是否是某个Class的实例
返回值: typeof 返回一个字符串是该数据的类型, instanceOf返回布尔值.
:::

## 使用typeof 
```js

console.log(typeof ''); // 'string' 
console.log(typeof 0); // 'number' 
console.log(typeof null); // 'object' 
console.log(typeof undefined); // 'undefined' 
console.log(typeof Symbol()); // 'symbol' 
console.log(typeof [1,2,3,4,5]); // 'object' 
console.log(typeof new Error()); // 'object' 
console.log(typeof new Date()); // 'object' 
console.log(typeof new RegExp()); // 'object' 
```

## 使用Object.prototype.toString.call
```js
console.log(Object.prototype.toString.call(null)); // '[object Null]' 
console.log(Object.prototype.toString.call(undefined)); // '[object Undefined]' 
console.log(Object.prototype.toString.call(NaN)); // '[object Number]' 
console.log(Object.prototype.toString.call(Error)); // '[object Function]' 
console.log(Object.prototype.toString.call(2)); // '[object Number]' 
console.log(Object.prototype.toString.call('')); // '[object String]' 
console.log(Object.prototype.toString.call({})); // '[object Object]' 
console.log(Object.prototype.toString.call([])); // '[object Array]' 
console.log(Object.prototype.toString.call(new Date())); // '[object Date]' 
console.log(Object.prototype.toString.call(new RegExp())); // '[object RegExp]' 
console.log(Object.prototype.toString.call(Symbol(1))); // '[object Symbol]' 
// nodejs 环境中的变量
console.log(Object.prototype.toString.call(process)); // '[object process]' 
console.log(Object.prototype.toString.call(global)); // '[object global]' 

```

## 使用instanceOf

```js
class Animal{
  getName(){
    console.log("获取动物名字")
  }
}
class Monkey extends Animal{
  getName(){
    console.log("获取猴子名字")
  }
}
class Human extends Animal{
  getName(){
    console.log("获取人类名字")
  }
}
var engineer = new Human()
engineer.getName()

// 工程师继承自 -> 人类
// 人类继承自 -> 动物
// 猴子继承自 -> 动物

console.log(engineer instanceof Human); // true
console.log(engineer instanceof Animal); // true
console.log(engineer instanceof Monkey); // false

```

## 总结
通过上面打印可以得知,typeof 只能判断部分数据类型,如果想精准的获知数据类型,需要熟知这些方法的意义.并灵活运用.
