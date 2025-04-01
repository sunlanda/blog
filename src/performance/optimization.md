# 如何优化网站访问速度

## 了解网站中资源形态

* 资源大小(bundled/gzip)
* 资源来源 (本地/cdn)
* 加载方式 (preload/layload)


## 了解网站运行生命周期


## 逐条解决

* 更快
* 更近
* 体积更小

## 分环节解决问题
1. 通过webpack-analysis 分析资源大小分布
2. 了解资源类型,对应loader进行压缩混淆处理(js/png)
3. 提取公共js/css/image到cdn(更新频率)
4. 页面特殊场景(瀑布流lazyload/分包不同应用加载不同js)

## 案例说明


* 分析打包前:
![action](/portal-speed-01.png)

* 分析打包后:
![action](/portal-speed-02.png)

* 整体对比:
![action](/to-fast-page.jpeg)

* 参考w3c:
![action](/navigation-timing-attributes.png)



## 解析资源路径

history hash 一个为啥需要配置nginx 
hash模式下路径资源地址是明确的  
history 需要try file 

## nginx 
正向代理 (隐藏请求来源- 掩盖请求方)
反向代理 (隐藏服务来源- 掩盖服务方) 

## 拆分浏览器url 
protocol
domain host
path
hash 
query 

## 网络侧性能优化
* 静态资源请求

## 客户端渲染请求
* 浏览器渲染时 



compiler 和 runtime
编译 和运行

运行时: 主谓宾 
从静态资源加载过来的是文件 -> html  
document 主入口 只要正确加载html -> link script  样式和逻辑就按顺序加载了 

一定是串行的: 
加载-> 解析 -> 渲染
* 加载: html 中读取js css png/svg 等文件
    * script -> sync defer
    * link -> preload prefetch 预加载 预触达 (只是做了加载的动作)
文件解析加载的性能? 
网页和请求的资源都在同域下 | 不在一起 


## 主流的三种加载内容状态

1. 同域下的直接加载 ../js/chunk.js
2. 要加载的文件是一个包: js css 需要**转义文件** 压缩文件
    1. gzip nginx 开启后访问会加速
    2. 其他格式 https://en.wikipedia.org/wiki/HTTP_compression https://juejin.cn/post/6844904148622639111
3. 返回回来其实是一个服务端渲染好的 

如何优化性能(资源加速): 
* CDN 减小物理距离 | 体积 | cookie 携带用户信息
* 接口和资源 动静分离 资源拉取请求 和业务分开的好处 可以分开进行缓存, 设置超时时间|网关安全等
* 服务端渲染SSR SPA会下载整个应用的js,服务端渲染拿到的已经是服务端加工好的东西 ,前端看到的是html

## 写法上优化
* css -> preload prefetch  放前面 避免js阻塞样式跳动
    * preload 提前加载资源(脚本样式字体等) 以便需要更快的使用,在浏览器空闲时完成加载,不会阻塞文档解析.适用于页面加载后立即使用的资源
    * prefetch 预取资源,用于未来导航或未来使用的资源,在浏览器空闲时加载,不会阻塞文档解析,适用于用户可能会访问后续页面资源.(list->detail适用detail的css放入prefetch) 
* script -> defer async
    * defer 延迟脚本执行,知道文档解析完成,按顺序加载和执行并有依赖关系
    * async 异步,加载完后立即执行,加载顺序不确定,谁先加载完谁就执行,用在独立的js模块和没有相互依赖的文档

## 荐书
* 计算机网络 - 大学教材
* TCP IP详解
包头包体发送逻辑和时机 -> 书里有内容解释



## 参考
* [w3c: A Primer for Web Performance Timing APIs](https://w3c.github.io/perf-timing-primer/)



