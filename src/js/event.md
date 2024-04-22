event.md

# 事件监听 addEventListener
element.addEventListener(event, function, useCapture);　
element 是要绑定事件监听器的 DOM 元素。
event 是要监听的事件类型的字符串（不带 "on"），比如 "click"、"mouseover" 等。
function 是事件触发时要调用的函数。
useCapture 是一个布尔值，可选参数，默认为 false（冒泡）。当值为 true 时，表示在捕获阶段触发事件处理函数。

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>demo</title>
</head>

<body>
  <div id="app">
    01 -js
    <button id="btn">click me </button>

    <script src="./js/event.js"></script>
    <script>
     // ...
    </script>
  </div>
</body>

</html>

```



```js

      /**
       * @param targetNode 节点名称 document.getElementById
       * @param eventType 绑定事件类型 click message https://developer.mozilla.org/zh-CN/docs/Web/Events
       * @param callback function 回调函数
       */
      function eventBind(target, eventType, callback) {
        if (target.addEventListener) {
          // 现代浏览器中使用addEventListener
          target.addEventListener(eventType, callback);
        } else if (target.attachEvent) {
          // 老版本IE中使用attachEvent
          target.attachEvent('on' + eventType, callback);
        } else {
          // 为了兼容性，使用onclick、onmouseover等传统方式
          target['on' + eventType] = callback;
        }
      }
      
      /**
       * cosl  console.log的简单封装
       */
      function cosl(){
        function info(message) {
          return console.info(message)
        }
        function log(message) {
          return console.log(message)
        }
        function error(message) {
          throw new Error(message)
        }
        return {
          info,
          log,
          error,
        }
      }
      const funcConsole = cosl()
      // funcConsole.log('我是log信息,被调用')
      // funcConsole.info('我是info信息,被调用')
      // funcConsole.error('我是error信息,被调用')
      

      /**
       * Cosl console的构造函数版本 
       */
      class Cosl{
        constructor(){
          console.log("class 初始化")
        }
        info (message) {
          return console.info(message)
        }
        log (message) {
          return console.log(message)
        }
        error (message) {
          throw new Error(message)
        }
      }
      const classConsole = new Cosl()
      classConsole.log('我是log信息,被调用')
      // classConsole.info('我是info信息,被调用')
      // classConsole.error('我是error信息,被调用')

      var btn = document.getElementById("btn");
      // 1. 面向过程绑定 
      // btn.addEventListener("click",function () { //   console.log('被点击',this) // })

      // 2. 封装function后调用 
      // eventBind(btn, "click", function () { funcConsole.log('function 函数被点击') })
      
      // 3. class 构造函数调用 
      // eventBind(btn, "click", function () { classConsole.log('class 构造函数被点击') })
      eventBind(btn, "click", classConsole.log('我在被点击时执行'))

···
