# 用插件的逻辑实现一个计算器

>  如果直接写好计算器中的函数方法功能,是不好扩展的,我想讲一下如何用插件实现,在设计主程序的时候,允许用户自定义插件,来扩展计算器的功能,
>  比如用户想添加一个求平方的功能,只需要写一个插件,然后在主程序中引入这个插件,就可以使用这个插件的功能了,
>  这样就可以在不修改主程序的情况下,扩展计算器的功能了,这就是插件的优势所在.


* 设计一个类 Calculator 。该类应提供加法、减法、乘法、除法和乘方等数学运算功能。同时，它还应支持连续操作的方法链式调用。Calculator 类的构造函数应接受一个数字作为 result 的初始值。

你的 Calculator 类应包含以下方法：

* add - 将给定的数字 value 与 result 相加，并返回更新后的 Calculator 对象。
* subtract - 从 result 中减去给定的数字 value ，并返回更新后的 Calculator 对象。
* multiply - 将 result 乘以给定的数字 value ，并返回更新后的 Calculator 对象。
* divide - 将 result 除以给定的数字 value ，并返回更新后的 Calculator 对象。如果传入的值为 0 ，则抛出错误 "Division by zero is not allowed" 。
* power - 计算 result 的幂，指数为给定的数字 value ，并返回更新后的 Calculator 对象。（result = result ^ value ）
* getResult - 返回 result 的值。
结果与实际结果相差在 10-5 范围内的解被认为是正确的。

actions 是一个有效的 JSON 字符串数组
values 是一个有效的 JSON 字符串数组
2 <= actions.length <= 2 * 104
1 <= values.length <= 2 * 104 - 1
actions[i] 是 "Calculator", "add", "subtract", "multiply", "divide", "power", 和 "getResult" 其中的元素
第一个操作总是 "Calculator"
最后一个操作总是 "getResult"



## 示例 1：

输入：
actions = ["Calculator", "add", "subtract", "getResult"], 
values = [10, 5, 7]
输出：8
解释：
new Calculator(10).add(5).subtract(7).getResult() // 10 + 5 - 7 = 8

## 示例 2：
输入：
actions = ["Calculator", "multiply", "power", "getResult"], 
values = [2, 5, 2]
输出：100
解释：
new Calculator(2).multiply(5).power(2).getResult() // (2 * 5) ^ 2 = 100

## 示例 3：
输入：
actions = ["Calculator", "divide", "getResult"], 
values = [20, 0]
输出："Division by zero is not allowed"
解释：
new Calculator(20).divide(0).getResult() // 20 / 0 


```js

// +-x/ 四个方法 并支持链式调用
class Calculator{
    Calculator = (actions,values) => {
        console.log("🚀 ~ --->:", actions,values)
        return this
    }
    add = (target) => {
        this.value += target;
        console.log("🚀 ~ Calculator ~ this.value:", this.value)
        return this
    }
    subtract = (target) => {
        this.value-= target
      return this
    }
    multiply = (target) => {
        this.value = this.value * target
        return this
     
    }
    divide = (target) => {
        if(target == 0){
            throw new Error("")
        }
        this.value = this.value / target
        return this
     
    }
    power = (target) => {
        this.value = Math.pow(this.value, target)
        return this
     
    }
    getResult = () => {
     return this.value
    }
}
// const cal = new Calculator()
// console.log("🚀 ~ ---->: ", cal.add(33).subtract(30).power(2).getResult())
// console.log("🚀 ~ ---->: ", cal['add'](12)['getResult']())

const actions = ["Calculator", "add", "subtract", "getResult"]
const values = [10, 5, 7]

const cal = new Calculator()
console.log("🚀 ~ cal:", cal.Calculator(actions,values))



// actions = ["Calculator", "multiply", "power", "getResult"], 
// values = [2, 5, 2]
// actions = ["Calculator", "divide", "getResult"], 
// values = [20, 0]

```