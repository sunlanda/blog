
# 模块化与amd cmd规范的理解



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


#### 隐式绑定

```js
const fn = function(){

}
const
```


## 模块

AMD（Asynchronous Module Definition，异步模块定义）和 CMD（Common Module Definition，通用模块定义）是JavaScript中的两种模块定义规范，它们主要用于解决不同JavaScript文件之间的依赖和模块化问题。随着ECMAScript 2015（也称为ES6）的发布，JavaScript原生支持了模块功能，引入了`import`和`export`语法，从而改变了模块化开发的方式。下面分别介绍AMD、CMD和ES6模块之间的区别：

### AMD

- **异步加载**：AMD规范主要用于浏览器环境，强调异步加载模块，允许指定回调函数。这种方式不会阻塞页面的加载。
- **代表库**：RequireJS是AMD规范的最著名实现。
- **语法示例**：
  ```javascript
  // 定义模块
  define(['dependency'], function(dependency) {
      // 模块代码
  });

  // 使用模块
  require(['module'], function(module) {
      // 使用module
  });
  ```

### CMD

- **按需加载**：CMD规范也是用于浏览器，但它更强调按需加载，即在需要的时候才执行相应的模块。
- **代表库**：SeaJS是CMD规范的主要实现。
- **语法示例**：
  ```javascript
  // 定义模块
  define(function(require, exports, module) {
      var dependency = require('dependency');
      // 模块代码
  });

  // CMD通常不需要像AMD那样使用require来加载模块，而是在定义模块时声明依赖。
  ```

### 与ES6模块的关系

- **原生支持**：ES6模块是JavaScript语言层面的标准，得到了浏览器和Node.js的原生支持。它不需要额外的库来实现模块功能。
- **静态结构**：ES6模块的导入（`import`）和导出（`export`）是静态的，这意味着它们不能放在条件语句中，使得工具可以在编译时进行代码分析和优化。
- **语法示例**：
  ```javascript
  // 导出模块
  export function myFunction() {
      // 函数体
  }

  // 导入模块
  import { myFunction } from 'module';
  ```

总结来说，AMD和CMD是早期JavaScript社区为解决模块化开发问题而提出的规范，它们通过库的形式提供模块化支持。而ES6模块则是JavaScript语言标准的一部分，提供了原生的模块化支持，使得模块化开发更加简洁和高效。随着ES6模块的普及，AMD和CMD的使用逐渐减少。



《理解模块化与 AMD、CMD 规范及使用 Rollup 打包》

在前端开发中，模块化是一种重要的设计理念，它可以提高代码的可维护性、可复用性和可扩展性。而 AMD（Asynchronous Module Definition）和 CMD（Common Module Definition）是两种常见的 JavaScript 模块化规范。同时，Rollup 是一个强大的 JavaScript 模块打包工具，可以将不同模块化规范的代码打包成高效的输出。

**一、模块化的重要性**

模块化是将一个大型的软件系统分解为多个独立的、可复用的模块的过程。在前端开发中，模块化有以下几个重要的好处：

1. 提高代码的可维护性：将代码分解为独立的模块可以使每个模块的功能更加清晰，通过合理的命名迅速就能理解并定位问题所在。
2. 提高代码的可复用性：独立出的模块是为了提高项目中重复使用，减少了重复开发的工作量。同时，模块的封装性可以让你在代码精进之路上不断添砖加瓦,沉淀自己的代码段素材,而不是每次都从零开始。
3. 提高代码的可扩展性：通过模块化，可以方便地添加新的功能模块，每个模块可以独立地进行扩展和升级，不会对整个系统造成影响。

**二、AMD 和 CMD 规范**

1. AMD 规范
   - AMD 是一种异步模块定义规范，它主要用于解决浏览器环境下的模块加载问题。在 AMD 规范中，模块的定义和加载是异步进行的，这可以避免在加载模块时阻塞页面的渲染。
   - AMD 规范的核心是使用`define`函数来定义模块，使用`require`函数来加载模块。例如：
```javascript
// 定义一个模块
define(['dep1', 'dep2'], function(dep1, dep2) {
  return {
    // 模块的输出
    method1: function() {
      //...
    }
  };
});

// 加载模块
require(['module1'], function(module1) {
  // 使用模块
  module1.method1();
});
```
   - 在这里，`define`函数接受两个参数：一个数组表示模块的依赖项，一个函数表示模块的实现。当模块的依赖项加载完成后，会调用这个函数，并将依赖项作为参数传递给函数。`require`函数接受一个数组表示要加载的模块，一个函数表示当模块加载完成后的回调函数。

2. CMD 规范
   - CMD 规范也是一种用于浏览器环境的模块化规范，它与 AMD 规范类似，但在一些细节上有所不同。在 CMD 规范中，模块的定义和加载更加简洁，更加接近 CommonJS 规范。
   - CMD 规范的核心是使用`define`函数来定义模块，但是模块的加载是在需要的时候才进行的，而不是在定义模块的时候就指定依赖项。例如：
```javascript
// 定义一个模块
define(function(require, exports, module) {
  // 在需要的时候加载依赖项
  var dep1 = require('dep1');
  var dep2 = require('dep2');

  exports.method1 = function() {
    //...
  };
});
```
   - 在这个例子中，`define`函数接受一个函数作为参数，这个函数接受三个参数：`require`、`exports`和`module`。`require`函数用于加载依赖项，`exports`对象用于输出模块的接口，`module`对象表示当前模块。在模块的实现中，可以根据需要使用`require`函数来加载依赖项。

**三、使用 Rollup 打包不同模块化规范的代码**

Rollup 是一个 JavaScript 模块打包工具，它可以将不同模块化规范的代码打包成高效的输出:

1. 安装 Rollup
   - 首先，需要安装 Rollup。可以使用 npm 进行安装：
```
npm install rollup --save-dev
```

1. 配置 Rollup
   - 创建一个`rollup.config.js`文件，用于配置 Rollup 的打包选项。以下是一个简单的配置文件，用于打包 AMD 和 CMD 规范的代码：
```javascript
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'umd'
  },
  plugins: [
    resolve(),
    commonjs()
  ]
};
```
   - 在这个配置文件中，`input`属性指定了要打包的入口文件，`output`属性指定了打包后的输出文件和格式。这里使用了`umd`格式，这是一种通用的模块定义格式，可以在不同的环境中使用。`plugins`数组中指定了要使用的 Rollup 插件，这里使用了`@rollup/plugin-node-resolve`和`@rollup/plugin-commonjs`插件，用于解析和转换不同模块化规范的代码。

3. 编写代码
   - 创建一个`src`目录，用于存放要打包的代码。以下是一个简单的 AMD 规范的模块和一个 CMD 规范的模块：
```javascript
// src/module1.js (AMD 规范)
define(['dep1'], function(dep1) {
  return {
    method1: function() {
      return dep1.method1() + ' from module1';
    }
  };
});

// src/module2.js (CMD 规范)
define(function(require, exports, module) {
  var dep2 = require('dep2');
  exports.method2 = function() {
    return dep2.method2() + ' from module2';
  };
});
```
   - 在这个例子中，`module1.js`是一个 AMD 规范的模块，它依赖于一个名为`dep1`的模块。`module2.js`是一个 CMD 规范的模块，它依赖于一个名为`dep2`的模块。

4. 运行 Rollup
   - 在命令行中运行以下命令，使用 Rollup 进行打包：
```
npx rollup -c
```
   - 这个命令会使用`rollup.config.js`文件中的配置进行打包，并将打包后的结果输出到`dist`目录中。

总之，模块化是前端开发中的重要理念，AMD 和 CMD 规范是两种常见的 JavaScript 模块化规范，而 Rollup 是一个强大的 JavaScript 模块打包工具。通过理解这些概念和工具，可以更好地组织和管理前端代码，提高开发效率和代码质量。


## 参考
- [ ] 