# 官网自适应

## 移动端是趋势

## 场景
PC 小程序 M站 都可以访问

* 一套内容  一套URL
* 兼容不同访问尺寸 
* 小程序进行内嵌

## 带来的价值和收益
* 后台数据查看UA 其实已经得出20%左右的数字 
* 通过手机京东云产品的  用户触达率

## 当时挑战
* 历史项目中样式已经很多,而且是template生成的html css ,拉着ui重新做设计class规范 譬如rwd- j-header 等等 ,前端做了sass模块化划分最终打包出来的模块都是改动较小且有复用几率的, 
* 移动端适配问题 - 譬如不同手机的测试问题 (学会了众测,远程云端测试,ADB SYNC 蓝叠启动器等不同方式验证) , 技术手段写了苹果的安全距离(写了公共方法,获取屏幕宽高,devicePixiRetino) 计算像素和DPI
* 图片加载资源的问题 - 从大屏转到移动端访问 之前还是大图 加载性能不太好,会有页面跳动和白屏露出,体验不好,前端做了懒加载,滚动到屏幕中进行load 
* 


## 代码示例

```
@media-screen  query 
max < 768 1024 1080
```


