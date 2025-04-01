## vue.js + nuxt.js 实现网站的服务端渲染

## 为什么要做SSR


# next.js nuxt.js 服务端渲染的逻辑

## spa
* 初始加载慢 请求数据量大
* seo 不友好


## render 直出
* SSG - server side render
* CSR - client side render
* SSR - server side 

## 使用ssr优点

* 解决seo 优化问题,爬虫更好的支持
* 适用于大量不常改变的静态页面 渲染后做cdn的缓存 加快访问速度
* 可以借助服务端缓存和render 机制,提前渲染好html 进行返回

现有项目改造,可以走目录类型 app/src/pages/_index [detail]等组装方式