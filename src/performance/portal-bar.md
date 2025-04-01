# 京东云公共头(common header)背后的故事

## 背景
我们

## 思路
多个网站矩阵需要保证头部VI加载的内容一致,就需要一个公共调用的组件,并且这个组件需要满足: 
* 兼容多种接入方式,jquery vue react 等
* 自带样式和接口请求,要求加载可用
* 最好接入方便,无需调试 (支持国际化,移动端自适应等)


## 细节
公共头的编写一开始有一些,问题
* 加载页面会抖动 , 毕竟内容是放在script 中加载出来的 (从尾部放到头部)
* 推动部门样式统一管理,加载一个common.css 
* 改过很多版本, jquery template 字符串拼接的,接口字段很不友好
* 逻辑打架,header头种植 登录态cookie,语言cookie

### 截图 

`头部`
![header]()


`尾部`
![footer]()

* 交互展示
* 多语言展示
* rwd展示
* 小程序嵌入展示

## 收获
* 学会了为多个部门提供公共资源的能力,非常考验耐心,提高部门协作能力,站高一级看问题(搜索大家各自的需求) 梳理成研发内容, 研发反哺产品输出原型

## 参考
* [京东云官网](https://www.jdcloud.com)


## 感悟
第一次做这么多大部门一起用的工具,也感受到了团队协作的快乐,等完全上线的时候已经认识了很多业务线的开发同事了,还是很开心的,
刚做的时候我认为技术上对我是一个挑战,如何插入header,什么时候插入,兄弟部门的项目技术栈是否匹配等问题,但是要从前期调研每个部门的诉求,人力替换成本等因素考虑下来,发现技术反而是最好做的一环,在基本确定以jquery + script 引入html的思路后,后面基本就是实现了.

* 学会了单独使用gulp打包一段js,将html模板通过template的方式进行组装,
* 写入国际化逻辑和自适应逻辑  (配置host进行代码测试 同domain)
* 插入时机和首屏加载速度的测试(保证页面加载的时候不弹跳 - 分离约定样式 和html)
* 也尝试用了puppteer来批量抓取部门页面的首页进行截图 上传到oss进行验证(一个工具化提效的视野开阔起来)

```shell
npm install puppeteer 
```

```js

const puppeteer = require('puppeteer');

(async () => {
  // 启动浏览器
  const browser = await puppeteer.launch();
  
  // 创建新页面
  const page = await browser.newPage();

  // 设置视窗大小
  await page.setViewport({width: 1920, height: 1080});

  // 打开网站并截图
  await page.goto('https://www.jdcloud.com');
  await page.screenshot({path: 'jdcloud_homepage.png'});

  // 打开另一个网站并截图
  await page.goto('https://www.jd.com');
  await page.screenshot({path: 'jd_homepage.png'});

  // 关闭浏览器
  await browser.close();
})();
pup.desc []
//  定义数组  
// screen 截图 
// save 本地文件目录 -> 当前日期 为目录 -> 网站名称正则匹配作为文件名称 
```


## 配图
* puppteer 爬取内容的截图
* 公共头部 header  footer 的图片 

## 核心代码
约定规范 .header 
template -> insert 
gulp 打包 -> portalBar.js 
puppter -> 批量进行截图验证 

