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


## 参考
* [w3c: A Primer for Web Performance Timing APIs](https://w3c.github.io/perf-timing-primer/)