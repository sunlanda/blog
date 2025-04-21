# 使用nuxtjs让网站支持SEO

## 业务背景
公司官网 -> vue  TDK每

## 痛点
TDK 没有充分展示
robots 没有对应的抓取策略  浏览器爬虫权重低
初始页面加载较慢  -> 配图

## 接入成果

`asyncData` 使用: service 层调用接口,
`render` 生成: 将vue页面render成html 

## SSG SSR CSR 区别
* 直接看 thomas 的内容生成
* 结合next.js  nuxt 后端ssg渲染 进行讲解 ,区分SPA

## 价值亮点
* 满足业务SEO诉求: 从jdcloud中做到了,SEO TDK的植入 ,曾经做到过第一屏关键词(SEO /都做到过)
* 提高访问速度, 将加载渲染花费时间成功挪到了CDN上和服务器上,因为静态资源 (空间换时间)

## 有一点没有处理好的地方
* 就是报错的时候  - 因为接口报错 导致输出 404页面 不友好 
* 应该在1.0的时候尽快升级(0.9的文档) 保持项目稳定 (后面看很多API)

## 新思想
文件目录 对应 url访问顺序
* 动态数据如: product/:id -> _id.vue