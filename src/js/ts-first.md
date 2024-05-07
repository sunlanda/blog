# typescript 快速入门

## 常见使用方式

### 基本类型 
```ts
// string number boolean null any
let nickName: string = "李雷";
let age:number = 23;
let isStudent: boolean = true;
let classCard:null = null;
let studentInfo:any = {
    age:23,
    name:"李雷"
}
```

### 联合类型 Union & 字面量 Literal

联合类型可以使用 `keyof`来表达,在类型映射时非常好用
```ts
union：支持多个类型的赋值
let union1: string | number
literal：支持指定值的赋值
let literal1: 1 | '2' | true | [1, '2', false]

// keyof
type Point = { x: number; y: number };
type P = keyof Point; // "x" | "y"
```

### 类型声明 interface  & declare interface
 在TypeScript中，`interface` 和 `declare interface` 确实看起来很相似，但它们在使用上有一些区别。

- `interface` 用于定义 TypeScript 中的接口，用于描述对象的形状（属性和方法）。
- `declare interface` 用于声明已经存在的接口，通常用于引入外部库或模块的类型声明。这种声明告诉编译器这个接口已经存在，不需要编译器再去生成它。

因此，当你需要引入外部库或模块的类型声明时，可以使用 `declare interface` 来告诉编译器这个接口已经存在，不需要重新定义。


### 类型推断 type
定义可以计算的interface  譬如求交集/并集或者三元表达式就会很有用
```typescript
interface Student{
  name:string
  startTime:Date
}
interface Teacher{
  name:string
  courses:string[]
}

// |就是或的意思
type ClassNum  = Teacher | Student

function startCourse(num:ClassNum){
  if('courses' in num){
    // num是老师的字段
  }
  if('startTime' in num){
    // num是学生的字段
  }
}
```
这里引出另一个问题,如果联合类型不是或,而是并,怎么办
```typescript
// 我有两个朋友,一个是韩梅梅,是个人类 ,一个叫做89757,是个机器人
interface HumanFriend {
  name: string
}
interface RobotFriend {
  name: number
}
type  MyFriend = HumanFriend & RobotFriend;
const myBro :MyFriend = {
  name: '韩梅梅'
}
```
// 此时定义myBro就会报错,因为name传递了`string`字符串,不可能实现同一个类型满足`number`和`string`的,所以myBro.name是一个`never`类型
![](/public/ts-first-01.jpg)


### enum 枚举
ts中的枚举值可以使用[]下标对数值进行反向取值.但是汉字不行.
```typescript
enum Sex{
  MAN=10,
  WOMAN
}
console.log('Sex.MAN',Sex.MAN);
console.log('Sex.MAN',Sex[10]);
```

### Omit & Pick & Exclude 
在 `TypeScript` 中，这些是用于处理类型的内置工具类型。

- **Omit**: Omit 类型用于创建一个省略指定属性的新类型。例如：

```typescript
interface User {
  id: number;
  name: string;
  age: number;
}

type UserWithoutId = Omit<User, 'id'>;
// UserWithoutId 现在将不包含 id 属性

const updateUserParams:UserWithoutId = {
    "name":"zhangsan",
    "age":123
}
```

- **Pick**: Pick 类型用于从现有类型中选择指定属性，创建一个新类型。例如：

```typescript
interface User {
  id: number;
  name: string;
  age: number;
}

type UserPicked = Pick<User, 'name' | 'age'>;
// UserPicked 现在只包含 name 和 age 属性
const updateUserParams:UserPicked = {
    "name":"zhangsan",
    "age":123
}

```

- **Exclude**: Exclude 类型用于从一个联合类型中排除指定的类型。例如：

```typescript
type Color = 'red' | 'green' | 'blue';
type NonGreenColor = Exclude<Color, 'green'>;
// NonGreenColor 现在将不包含 'green'
const currentColor:NonGreenColor = "blue"
```
### Record & Partial 


- **Partial**: Partial 类型用于将所有属性变为可选的。例如：

```typescript
interface User {
  id: number;
  name: string;
  age: number;
}

type PartialUser = Partial<User>;
// PartialUser 现在中的所有属性都变成了可选的 const user:User ={} 都不会报错
```

- **Record**: Record 类型用于创建一个新类型，其中键的类型是指定的类型，而值的类型是另一个指定的类型。例如：

```typescript
type Weekday = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
type WorkHours = Record<Weekday, string>;
// 还有type WorkHours = <key in Weekday : string>
// 不使用record的话 还可以这么写: 
type WorkHours2 = {[key in Weekday]:string}
// WorkHours 现在是一个对象，键是星期几，值是字符串类型, 这个非常适合定义下拉框中的枚举值
const weekHours: WorkHours = {
    'Monday':'1',
    'Tuesday':'2',
    'Wednesday':'3',
    'Thursday':'4',
    'Friday':'5'
}
 

// record <type, keys> 第一个参数type传递obj的key  keys 是obj的value类型
type colors = "red"|"green"|"blue"
type _colors = "blue"
const colorMap: Record<colors,string> = {
  red:"#123",
  green:"#123",
  blue:"#123",
}
const colorMap2: {[key in "blue" | "red" | "green"]:string} = {
// const colorMap2: {[key in colors]:string} = {
  red:"#123",
  green:"#123",
  blue:"#123",
}
console.log('colors',colorMap);
```

## 如何理解泛型
日常开发中我们肯定会遇到类型暂时没法确定的情况,而是根据函数运行实际情况来对数据类型进行约束.那么我们就可以使用泛型来解决.
譬如我们定义一个函数叫做formQuery,这个函数的入参接受一个arg,返回一个arg,
正常js的话应该这么写

```js
function formQuery(arg){
  return arg;
}
```
但是添加泛型后,出现了三个T;
* \<T\>  -> 尖括号内的T就是泛型写法,当这里的T写成string,那后面整个T都是string类型
* arg:T  -> 函数入参的类型,和\<T\>保持一致
* :T -> 冒号后面这个T,代表formQuery函数的返回值类型,如果函数体内直接return 123; 那这里的T就需要改为number
```ts
function formQuery<T>(arg: T): T {
  return arg;
}
// 使用泛型函数
let result = formQuery<string>("hello");
let result2 = formQuery<number>(123);
```




## 参考
* [ts官方文档](https://www.typescriptlang.org/download/)
* [keyof中文文档](https://ts.nodejs.cn/docs/handbook/2/keyof-types.html)
* [ts.config.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
* [tsx直接启动ts文件](https://tsx.is/getting-started)