# 如何优化网站访问速度



### 性能指标优化详解

![cls](/good-cls-values.svg)
![cls](/good-fcp-values-18.svg)
![cls](/good-lcp-values.svg)
![cls](/good-ttfb-values.svg)

| 指标名称          | 指标描述                                                                  | 优化方向                                      |
|---------------|-----------------------------------------------------------------------|-------------------------------------------|
| 首次内容绘制时间（FCP） | 即First Contentful Paint，为首次有内容渲染的时间点。                                 | 优化关键渲染路径、减少阻塞资源、压缩CSS                   |
| 最大内容绘制时间(LCP) | 即Largest Contentful Paint，根据页面首次开始加载的时间点来报告可视区域内可见的最大图像或文本块完成渲染的相对时间。 | 优化图片加载、实现资源预加载、优化服务器响应时间               |
| 累积布局偏移(CLS)   | 即Cumulative Layout Shift，整个页面生命周期内发生的所有意外布局偏移中最大一连串的布局偏移分数。           | 为图片和视频设置尺寸属性、避免动态插入内容、使用固定布局           |
| 完全可交互时间（TTI）  | 即Time to interactive，记录从页面加载开始，到页面处于完全可交互状态所花费的时间。                    | 减少JavaScript执行时间、拆分代码包、延迟加载非关键资源         |
| 总阻塞时间(TBT)    | 即Total Blocking Time，测量 FCP 与 TTI 之间的总时间，这期间，主线程被阻塞的时间过长，无法作出输入响应。    | 优化长任务、使用Web Workers、减少主线程工作量            |
| 首次交互时间（FID）   | 即 First Input Delay，记录页面加载阶段，用户首次交互操作的延时时间。FID指标影响用户对页面交互性和响应性的第一印象。  | 拆分长任务、优化事件处理程序、减少第三方脚本影响              |
| 首次绘制时间（FP）    | 即First Paint，为首次渲染的时间点。                                               | 优化关键CSS、减少重定向、优化字体加载                   |


#### 1. 首次内容绘制时间（FCP）优化

::: details 首次内容绘制是用户对网站速度的第一印象，优化方向包括：
- **优化关键渲染路径**：识别并优先加载关键CSS和JavaScript
- **减少阻塞资源**：将非关键CSS标记为异步加载，使用defer或async属性加载脚本
- **压缩CSS和HTML**：减少文件大小，加快传输和解析速度
- **优化服务器响应时间**：使用CDN、优化服务器配置、实现有效的缓存策略
:::



#### 2. 最大内容绘制时间(LCP)优化

::: details LCP是核心Web指标之一，直接影响用户对页面加载速度的感知：
- **优化图片加载**：使用WebP等现代图片格式、实现懒加载、合理压缩
- **实现资源预加载**：对关键资源使用`<link rel="preload">`
- **优化服务器响应时间**：减少TTFB（首字节时间）
- **优化渲染阻塞资源**：减少或延迟加载非关键CSS和JavaScript
- **实现缓存策略**：利用浏览器缓存和CDN缓存
:::

#### 3. 累积布局偏移(CLS)优化

::: details CLS是衡量视觉稳定性的指标，优化方向包括：
- **为图片和视频设置尺寸属性**：始终包含width和height属性
- **避免在现有内容上方插入内容**：预留空间给动态加载的内容
- **使用transform动画**：替代影响布局的属性动画
- **避免使用FOUT（无样式文本闪烁）**：使用font-display策略
- **为广告位预留空间**：避免广告加载导致的布局偏移
:::

#### 4. 完全可交互时间（TTI）优化

::: details TTI衡量页面从开始加载到完全可交互所需的时间：
- **减少JavaScript执行时间**：优化和压缩代码，移除未使用的代码
- **拆分代码包**：实现代码分割，按需加载
- **延迟加载非关键资源**：使用懒加载技术
- **减少主线程工作**：优化DOM操作，避免复杂计算
- **优化第三方脚本**：审核并减少不必要的第三方脚本
:::


#### 5. 总阻塞时间(TBT)优化

::: details TBT测量主线程被阻塞无法响应用户输入的总时间：
- **优化长任务**：将大型任务拆分为更小的异步任务
- **使用Web Workers**：将密集计算移至后台线程
- **实现代码分割**：避免一次加载大量JavaScript
- **优化第三方脚本**：延迟加载非关键第三方脚本
- **使用requestIdleCallback**：在浏览器空闲时执行非关键任务
:::

#### 6. 首次交互时间（FID）优化

::: details FID衡量用户首次与页面交互到浏览器实际能够响应的时间：
- **拆分长任务**：将任务分解为小于50ms的块
- **优化事件处理程序**：避免复杂的事件处理逻辑
- **使用Web Workers**：将非UI工作移至后台线程
- **减少主线程JavaScript执行**：优先处理用户交互
- **减少第三方脚本影响**：评估并优化第三方代码

:::
#### 7. 首次绘制时间（FP）优化

::: details 首次绘制是浏览器渲染任何在视觉上不同于导航前屏幕内容的时刻：
- **优化关键CSS**：内联关键CSS，延迟加载非关键CSS
- **减少重定向**：避免多次重定向
- **优化字体加载**：使用font-display属性，考虑使用系统字体
- **减少HTTP请求**：合并资源，使用CSS Sprites
- **实现有效的缓存策略**：设置适当的缓存头
:::

## 了解网站中资源形态

* 资源大小 (bundled/gzip)
* 资源来源 (本地/cdn)
* 加载方式 (preload/layload)
* 渲染机制 (CSR/SSR)


## 逐条解决
* 将用户访问服务接口的距离缩短: 远距离 -> 近 (CDN ,服务器部署机房)
* 将你提供的服务内容体积缩小: 大文件 -> 小 ( gzip, 打包前压缩代码, 图片动态裁剪)
* 将内容到达客户浏览器的路途拓宽: 小路 -> 高速公路( 车辆同时通过量,https2.0)
* 将用户访问的数据指标量化 : 性能指标 (监控, 点击报错收集)

## 分环节解决问题
1. 对静态资源添加CDN,对不常改变的包进行缓存,对需要改变的内容做hash处理
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
history 需要try $file 配置nginx 否则刷新会404

[nginx 配置](https://router.vuejs.org/guide/essentials/history-mode.html#nginx)
```shell
location / {
  try_files $uri $uri/ /index.html;
}

```

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

优化前

![](/jcy_oss_origin.png)
优化后
![](/jcy_oss_now.png)



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





## 参考
* [w3c: A Primer for Web Performance Timing APIs](https://w3c.github.io/perf-timing-primer/)
* [TTFB 解释](https://web.dev/articles/ttfb?hl=zh-cn)
* [LCP 解释](https://web.dev/articles/optimize-lcp?hl=zh-cn)