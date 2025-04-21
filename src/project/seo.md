# seo 优化举措

## 为什么要做
公司网站一般toC的基本都需要对外展示产品,toB公司也会因为客户
seo做好能带来的好处 , 提高公司网站在搜索引擎抓取排名的权重,从而提高曝光率,带来流量.

## seo看哪些指标
* baiduSpider 爬虫规则 机器能识别语义化 -> 单页面应用/html应用
* 更新频率(发布文章)有新内容(结构 再爬取)

## 作为技术应该如何优化
* robots.txt 设定爬虫抓取策略 - sitemap 生成CMS 一般都有
* 在书写html代码时规划语义化标签, ul li 优于 div
  * img|mp4|video 要+ alt 标签
  * tab -> tabindex 顺序 
* 一定要服务端渲染 单页面spa 非常不利于seo , 或者就回到java模板时代(项目还是会耦合)
* 如果有移动端 移动端要使用响应式设计(兼容多个尺寸) google : Mobile-friendly test 工具策测试友好
* 简洁的URL 譬如 / pruducts/mobile/iphone-12 好于 index.php?id=123&category=mobule&product=iphone
* 加载速度也是衡量网站易用性的一个指标,速度要快

## 如何验证seo权重 
* 观察流量来源 ga数据分析  cnzz 判断自然流量来源
* 服务器访问日志->IP -> 点击后referer收集 (是能知道百度点击)


```xml
<url>
    <loc>https://www.jdcloud.com/cn/news/detail/53</loc>
    <lastmod>2021-05-18</lastmod>
    <changefreq>daily</changefreq>
    <priority>0,8</priority>
</url>
```
url：表示一个URL的开始标签,里面包裹具体信息
loc：表示该URL的具体地址。
lastmod：2021-05-18 可能表示该页面的最后修改时间。
changefreq：daily 表示该页面的更新频率为每天。
priority：0.8表 示该页面的优先级，数值范围通常在0.0到1.0之间，数值越大表示优先级越高。





## 参考

* [nuxt.js - SEO and Meta](https://nuxt.com/docs/getting-started/seo-meta)
* 


----

针对前端程序员看的网站seo书籍 单⻚面应用下的seo如何做 -ssr 如何和爬虫埋点做关联 -百度sem⻓尾词 GA cnzz 国内友商列表
社会化营销的基本要求 微信微博分享你的网 站时发生了什么
评分 网站影响力 小型/中型 大型-关注bbs和 帮助文档的网站
标签语义化 真正用起来html5 summary header
Forrester 市场报告建议 有openApi文档 (类 似 测评网站 打分)
meta标签的配置 title
keyword 关键字
description 描述
name="viewport" content="" 视口配置 http-equiv="Cache-Control" content="no- cache, no-store, must-revalidate" http-equiv='X-UA-Compatible'
content="IE=edge" 让ie使用最新的渲染 Referrer 传递
<meta name="referrer" content=" always">
传递完整的 url
<meta name="referrer" content="origin" >
     只传递站点，不包含路径和参数等
https://mp.weixin.qq.com/s/hy0qauQ_hv AJNMYOHvnxLg
                  第 1 ⻚，共 3 ⻚
网站seo特性-20180424
property 富媒体对象 同意被其他社会化网站 引用
http://www.cnblogs.com/zhongxinWang/p/4 105915.html
http://gs.statcounter.com/ 浏览器占比 问题
Link的配置 Css 引入
apple-touch-icon 苹果手机保存到桌面的图 标
favicon icon 浏览器回话⻆标 https://ziyuan.baidu.com/college/courseinfo ?id=267&page=2#03
应对百度搜索的相关优化: https://ziyuan.baidu.com/?castk=LTE%3D
sitemap:
https://www.xml-sitemaps.com/ https://sitemap.webkk.net/ https://webkk.net/




我们计划在Q4对官网进行支持SEO的改版, 此次改版有以下几点改动:
1. 将现有官网技术框架使用服务端渲染的形式进 行展现(一级二级等⻚面展现源码将是不同的, 现在是相同内容)
2. 暴露title, keyword, description等字段到⻚ 面源码

架构层面: 基于vue衍生框架nuxt进行服务端渲染的代码 重构
对首⻚采用预渲染模式 加快访问速度(事先生 成一份静态文件放在cdn上 用户访问到该节点 就可以省去解析渲染的过程) 并入国际化实现cn/en切换(lang 添加语言信 息)
前台⻚面访问时暴露代码中的文本和标签 (TDK Content)

SEO优化:
后台添加title keyword description 方便爬虫 抓取 (需要cms支持)
Img 添加alt title等标识符 (方便机器抓取) WAI-ARIA 视障人士 (特殊标识)
seo改版计划-2018Q4
表单提交tabindex 索引 (按tab键能固定到顺
序位置)

特性优化(可选): 移动端
根据wifi或网速展示小图模式/无图模式 根据设备userAgent类型访问网站展示不 同的效果甚至样式(譬如微信端隐藏顶栏) PWA(适用于docs网站 对该站内容进行缓 存 即使离线也可以访问)

性能优化 模块封装
函数节流
现有jquery的东⻄ 改造自有 压缩图片 (图源与UED统一 IE9) 加nodejs层 调用网关 Gateway

辅助性支持:
设置Cdn缓存时⻓ E-tag/if-modified-since 尽可能消除所有301 302 跳转 referer流转进数据漏斗 监控⻚面流转过程 (访 问-> 点击 -> 注册/购买/转化)

改版完成后能达到什么样的效果:
百度爬虫/google AD能够便捷抓取官网不同⻚ 面信息 有助于搜索竞价排名 提高曝光率 Url规范化(主要是帮助文档 产品⻚ 等模块的产 品字段)




------
# SEO优化全攻略：提升网站排名的实用策略

## 为什么SEO对每个企业都至关重要

在当今数字化时代，无论您经营的是面向消费者的电商平台，还是服务于企业客户的B2B公司，一个良好的SEO策略都是不可或缺的。搜索引擎优化(SEO)不仅仅是一项技术任务，它是连接潜在客户与您业务的桥梁。

当您的网站在搜索引擎结果中排名靠前时，您将获得：
- 持续增长的有机流量
- 更高的品牌可见度和认知度
- 更具成本效益的客户获取渠道
- 建立品牌权威性和可信度

根据研究，超过70%的用户很少点击搜索结果的第一页之后的内容。这意味着，如果您的网站没有出现在首页，您可能正在失去大量潜在客户。

## SEO关键指标解析

### 搜索引擎爬虫行为

搜索引擎如百度的Spider爬虫遵循特定规则来抓取和索引网站内容。了解这些规则对优化至关重要：

- **网站结构识别能力**：爬虫越来越擅长识别语义化内容，但在处理单页应用(SPA)和传统HTML应用时存在差异
- **抓取深度**：爬虫通常会优先抓取网站的主要页面，然后逐步深入
- **抓取频率**：搜索引擎会根据网站的更新频率调整爬取节奏

### 内容更新指标

- **发布频率**：定期发布高质量内容是SEO的基础
- **内容质量**：原创、有深度、解决用户问题的内容更受青睐
- **内容结构**：清晰的标题层级和段落划分有助于爬虫理解内容

## 技术人员的SEO优化指南

### 基础配置优化

```markdown
# robots.txt 示例
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/
Sitemap: https://www.yoursite.com/sitemap.xml
```

- **robots.txt配置**：明确告诉搜索引擎哪些页面可以抓取，哪些不可以
- **sitemap生成**：创建并提交网站地图，帮助搜索引擎更全面地发现您的内容
- **规范链接(canonical URL)**：避免内容重复问题

### HTML语义化优化

- **使用合适的HTML5标签**：如`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`等
- **列表结构化**：使用`<ul>`, `<li>`等标签优于纯`<div>`嵌套
- **多媒体元素优化**：
  ```html
  <!-- 优化示例 -->
  <img src="product.jpg" alt="iPhone 12 Pro 暗夜蓝 256GB 版本展示图" />
  <video src="demo.mp4" title="产品使用教程" alt="如何使用我们的软件服务">
  ```
- **无障碍优化**：添加适当的`tabindex`属性确保键盘导航顺序合理

### 渲染策略选择

- **服务端渲染(SSR)**：对SEO最友好，搜索引擎可直接获取完整内容
- **静态站点生成(SSG)**：预渲染页面，兼顾性能和SEO
- **SPA优化**：如必须使用单页应用，考虑预渲染或服务端渲染关键页面

### 移动端优化

- **响应式设计**：确保网站在各种设备上都能良好展示
- **移动优先索引**：搜索引擎现在主要使用移动版本进行索引
- **测试工具**：使用Google的Mobile-friendly测试工具验证移动友好性

### URL结构优化

```
✅ 好的URL: https://www.example.com/products/mobile/iphone-12
❌ 不好的URL: https://www.example.com/index.php?id=123&category=mobile&product=iphone
```

- **简洁明了**：URL应当简短且包含关键词
- **层级清晰**：反映网站的逻辑结构
- **避免参数堆积**：减少查询参数的使用

### 性能优化

- **页面加载速度**：目标是首次内容绘制(FCP)小于2秒
- **核心网页指标(Core Web Vitals)**：优化LCP、FID和CLS指标
- **资源压缩**：压缩图片、CSS和JavaScript文件
- **缓存策略**：合理设置HTTP缓存头

## SEO效果验证方法

### 数据分析工具应用

- **百度统计/Google Analytics**：分析自然搜索流量来源和趋势
- **搜索控制台**：监控索引状态、点击率和排名变化
- **热力图工具**：了解用户在页面上的行为模式

### 日志分析

- **服务器访问日志**：分析搜索引擎爬虫的访问频率和模式
- **IP来源追踪**：识别流量的地理分布
- **Referer数据收集**：确定用户从哪些搜索引擎和关键词进入网站

## 结语

SEO是一个持续优化的过程，而非一次性工作。技术优化只是SEO的一部分，结合高质量内容创作和用户体验改进，才能获得最佳效果。通过实施本文提到的优化策略，您的网站将在搜索引擎中获得更好的可见度，为业务带来持续增长的有机流量。

记住，SEO是一场马拉松，而非短跑。持之以恒地优化和调整，才能在激烈的线上竞争中脱颖而出。