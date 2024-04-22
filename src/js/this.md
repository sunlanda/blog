# this 指向

## 谁调用就指向谁


```js
/**
 * this 指向,通过案例可以得知
 * 1. 谁调用的this就指向谁
 * 2. 在函数体内声明fn 调用fn是指向window
 * 3. 
 */
window.name = "window_name" // browser 浏览器环境
global.name = "window_name" // nodejs环境
var money = {
  name:'monkey',
  sayHello(){
    console.log(this)
    return this.name
  }
}
var elephant = {
  name:"elephant",
  sayHello(){
    // console.log(this)
    // return this.name
    let _temp = money.sayHello()
    console.log("🚀 ~:", _temp)
    return _temp
  }
}
var tiger = {
  name:"tiger",
  sayHello(){
    // console.log(this)
    let fn = money.sayHello
    return fn()
  }
}
// console.log(money.sayHello());
// console.log(elephant.sayHello());
console.log(tiger.sayHello());

```


## call apply bind 


### call
首先call 是一个方法 一个函数的方法
在function.call(fn) 调用时将function的this指针指向fn

```js
function Product(name, price) {
  this.name = name;
  this.price = price;
}

function Food(name, price) {
  Product.call(this, name, price);
  this.category = 'food';
}
// console.log(new Food('cheese', 5).name);

```

### apply 
apply的使用方法和call一样,但是在调用时传入参数改变为数组 ,
利用apply 传入数组的特性来解决一些业务问题 譬如比大小 正常Math.max()方法 : 0 个或多个数字，将在其中选择，并返回最大的值。


```js
var arr =[4343,45,6,654,6,443]
console.log(Math.max(...arr))
console.log(Math.max.apply(Math,arr))

// const arr = [1, 2, 3];
const max = arr.reduce((a, b) => Math.max(a, b), -Infinity);
console.log("🚀 ~ max:", max)

```




### call apply bind 三者对比

```js
func.call(this, "eat", "bananas") 
// 等同于
func.apply(this, ["eat", "bananas"])
// 在 call()中函数参数在 call() 中逐个作为列表传递
// 在 apply() 中它们会组合在一个对象中，通常是一个数组
//  bind() 返回一个新函数,当调用新函数时,

let _tempBind = func.bind(this)

```


## 如何改变this 指向
* ()=>{} 箭头函数
* bind call apply 


```js
// 可以得出结论 1. 调用者如果是window下或者的属性方法,那this指向window,

// 箭头函数this指向谁  在哪里定义指向谁 | 箭头函数外this指向谁就指向谁 | 箭头函数中没有this
var cat = {
  name:'我的名字是喵喵',
  sayName(){
    console.log("函数sayName调用 ")
    console.log(this)
  },
  sayName: function(){
    console.log("函数sayName function调用")
    console.log(this)
    // function函数 this -> window -> 因为function是全局声明
    setTimeout(function(){
      console.log(this)
    },200)
    // 箭头函数this -> cat  因为箭头函数会将this带过来 (解决指向问题) 
    setTimeout(()=>{
      console.log(this)
    },200)
  },
}
cat.sayName()
```

```jsx
// 又比如react中的的事件绑定 getBtnDetail为什么用箭头函数就可以拿到this呢？
function getBtnDetail(e){
  console.log("clicked ~",e)
}
// 
<div onClick={ (e)=>{this.getBtnDetail(e)} }>button</div>

```