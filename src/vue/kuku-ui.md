# 使用vue3 + antv封装业务组件库

## 链接
kuku-ui 

相信很多小伙伴在使用vue3进行开发的时候总会发现有些组件是基础组件库如(antv,element)没法囊括的,
这里就提炼一些日常的业务组件库,同时将二次封装的思路和踩的一些坑记录下来,希望对小伙伴们有帮助~

## 依赖版本
一般是固定一个大版本 譬如vue3.X + antv4.X 
* 考虑全局config 并使用 HOC思想做二次封装 ,这样做的好处是保留原有文档的参数属性,扩展自己业务中使用到的参数和方法
* 基本都是组合类型的组件,所以本文会重点讲解 slot 和 props 传递部分

## 文档搭建
vitepress 
demo展示
交互演练场

## 1. 如何脚手架

```sh
npm i kuku-ui -S
```
配置并发布npm 
暴露files 和 文件

`MIT协议`



## 2. 动态注册组件

glob -> App.components 
component.name -> component.render()

## 3. 组件调试
* router Demo.vue 给测试数据
* 其他项目使用npm link进行测试
* 单元测试

```sh
npm link 
```


## 实现一个select无线滚动 


## 实现一个移动端滚动刷新列表
k-h5-table  -> 针对移动端

## 实现一个detail面板
## 实现一个list 表格 + form 查询 

