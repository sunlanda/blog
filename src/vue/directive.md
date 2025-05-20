# vue中的自定义指令
指令是什么东西,在vue生态中是什么地位,使用场景是什么

## 先说常见指令
* v-show 
* v-if
* v-for
* v-model
* v-cloak

## 指令是一种什么思想
plugin 插件思考  
option el 还有install 

## 从零到一实现一个自定义指令
### v-resize


```vue
<RemoteBiReport
    :origin="origin"
    :width="clientW"
    :height="clientH"
    v-resize="handleResize"
/>
```
js逻辑部分主要有

<<< @/demo/directive/resize.js

###  v-permission 
权限控制 permissionData

<<< @/demo/directive/permission.js

###  v-loading 
按钮加载

###  v-loadmore 
下拉框刷新


## 如何结合业务场景
* 元素显隐
* 样式调整
