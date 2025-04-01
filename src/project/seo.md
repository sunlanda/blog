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