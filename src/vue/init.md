# 快速入门vue.js (Vue3)

## 入手方式
* 官网demo playground  - 方便测试新特性
* 利用vite 初始化一个vue3项目 然后将vue2中拷贝1-2个页面进行测试

## why v3

- ts 大型项目
- hooks
- 更快 vite
- 声明式编程

## 基本使用

- ref toRefs reactive
  ref 是声明一个响应式变量,一般用来存储基础数据,譬如 string,number,boolean, 当然也可以存储object,array,这时就有人会问了,那他和reactive有啥区别
  而reactive的区别就是不需要使用.value 就可以直接访问. 被ref包裹的数组是响应式数据,即使是`引用类型`也可以被`追踪`.
  toRefs 会将非响应式数据转换为响应式数据,在script中通过.value进行访问,在template中则不需要

- shadowreactive shadowref
shadowXXX 的意思是只是浅层是动态数据, 

- onMounted
生命周期中的一个重要节点,就是挂载到dom上后,
- computed
这是一个计算属性,
```js
// 只返回某个值的加工 
const currentGrade = 59.5;
const scoreLevel = computed(()=>{
   if (currentGrade >= 60) {
      return '及格,允许毕业';
    } else {
      return '不及格,补考吧';
    }
})

// 也可以进行set使用
const scoreLe
```

- watch
- nextTick

```js
import { ref, reactive, onMounted, toRefs, watch, nextTick, computed, h } from 'vue';
// 使用方法直接从vue中引入
```

## 核心-数据传递

- defineEmits
- defineProps
- defineExpose

今天聊一下 父子关系数据通信和传值, 掌握这个核心思想后,不管哪个前端框架只要涉及组件式开发,你上眼就能会.
来,咱们开始第一点,业务复杂且有通用的模版是否需要抽离公共组件,以此来提升组件复用率,提高开发效率.
那咱们从业务逻辑出发,TODOLIST开始, 一个layout.vue 父组件,里面包含两个子组件, leftMenu.vue 左侧菜单, rightContent.vue 右侧内容编辑区域, 如果在右侧进行增删改查,左侧的目录是会更新的.
好 这样一个场景就包含了父子组件数据通信和传值, 首先咱们来从几个维度分析一下:

- 页面结构: 1> 1.1 + 1.2
- 数据: 1 是layout,可以存入全局数据,譬如skin,项目名称等. 1.1是左侧list 需要存有哪些待办事项, 1.2 右侧需要存入form表单. 这个和现在业务dialog和tableList 是同一个道理.后面咱们展开.
- 逻辑角度: 在1.2填入数据点击保存的时候,这些字段被打包成一条数据存入list(可以是sql/storage/vuex),已供1.1使用.假设1.1只能和1进行通信. 1.1 和 1.2无法直接通信,那是不是可以让1作为统一的中转站.来监听


### 在父子组件中建立数据与事件的关联:
layout 因为要承接两个子组件的通讯需求,所以要有两个子组件的ref定义,一个1.2

```tsx
// 1 layout.vue

<leftMenu
  ref="leftMenuRef"
></leftMenu>


<rightContent
  :saveCallback="rightContentSaveCallback"
  ref="rightContentRef"
></rightContent>

  // save节点后回调刷新目录树
  const leftMenuRef = ref(null);
  const rightContentSaveCallback = (e) => {
    leftMenuRef.value.onUpdateTree()
  }

```
如何才能更新左侧目录的数据呢? 需要暴露一个方法给父级组件.咱们取一个语义化点的名字: onUpdateTree,在函数中重新调用后端接口拿到最新数据.

```tsx
// 1.1 leftMenu.vue
const selectedKeys = ref([]);
const onUpdateTree = ()=>{
  // API.query().then()...
}
defineExpose({ selectedKeys, onUpdateTree });
```

当我在保存右侧数据时,利用父级传递过来的函数: saveCallback进行调用
```tsx
// 1.2 rightContent.vue
const props = defineProps({
  saveCallback: {
    type: Function,
  },
});

<button @click="submitEvt">保存</button>

let { saveCallback } = props;

const submitEvt = ()=> {
  saveFormDataEvent.then(res => {
    if (res.code === 0) {
      message.success('保存成功！');
      saveCallback();
    }
  });
  }
```
所以最后的调用链条就是, a  b  c , c->submit -> a -> triggerUpdate -> b

## setup

相比于2 做了什么
函数式编程 (.js)

这么写的时候  return 的东西可以被this拿到
```js
export default {
  setup(){
    return {}
  }
}
```
当这么写的时候, 浅层变量都可以拿到,可以理解成函数中的变量声明,声明的都是可以拿到的.
```tsx
<script setup> 
  import {defineEmits, defineProps}  from "vue"
  const varibleList = []
  const props = defineProps({
    ...
  })
</script>
```

## 结合Typescript

@types/vue -> 引入类型不报错
tsconfig.json -> 配置@alias 点击
