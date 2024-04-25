<!--
 * @Author: sunlanda relaxto@qq.com
 * @Date: 2024-03-26 21:25:35
 * @LastEditors: sunlanda relaxto@qq.com
 * @LastEditTime: 2024-04-23 15:08:16
 * @FilePath: /blog/README.md
-->
# blog-vite

这是一个vitepress搭建的博客网站.


### 博客编写目的


### 文章编写规范

* 锚点跳转(右侧二三级均可配) ##站点配置 {#site-config}
* 一二级标题 #h1 ##h2 ###h3
* 加粗 **bold**
* 高亮  其中`<root>`是根目录  扩展名支持`.js`,`.ts`
* 链接跳转 [项目根目录](../guide/routing#root-and-source-directory)
* 无序列表 - **Vite** - **vue**
* 详情语法  

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::

* 大段代码块  ```ts console.log(666) ```
* 小段代码块 - 类型：`boolean | 'localhostLinks' | (string | RegExp | ((link: string) => boolean))[]`
* 徽标  实验性特性: <Badge type="warning" text="experimental" />
* emoji  [emoji](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.mjs)
* 使用组件component和预处理器  [使用组件component和预处理器](https://vitepress.dev/zh/guide/using-vue)

