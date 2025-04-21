# vue.js 中的slot(作用域插槽)

> slot 是vue中组件传值和组件封装的一个很重要的概念.


## slot 
```jsx
// Parent.vue
<child-component>
    <p> 分发的内容</p>
    <p> 更多分发的内容</p>
</child-component>

<child-component>
    <slot>
        <p>如果slot没有,这就是默认展示的内容</p>
    </slot>
</child-component>

```
```tsx

<template>
    {{props.name}}
</template>
```

## 具名slot

## 父子组件之间传值

[参考文档] (https://cn.vuejs.org/guide/components/slots.html#slots)

一句话概括: slot 就是父组件预留一定位置,在合适条件下展示动态内容的一种方法

* 基本概念 - 内容与出口 作用域  default
* 具名插槽
* 条件插槽
* 动态插槽名
* 作用域插槽