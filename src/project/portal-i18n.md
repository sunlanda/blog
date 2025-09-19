# 官网国际化方案 

## 核心实现逻辑
* 浏览器navigator.languages提取数组前三个lang
* 映射语言(cn/us)
* 跳转并显示(翻译过的文字lang)
* 如果没有对应语言默认跳转 en 然后提示no support tips



## 页面实现效果
### 默认访问指定url
通过/cn /en等路由访问即可跳转对应语言内容

### 通过按钮点击/下拉切换 中英文
* 无刷新效果 (直接改变i18n中locale)
* 有刷新效果 url改变(current地址需要跳转)

![click-change](/jdcloud-check-lang.png)



## json 存放
* localStorage 
* CDN JSON
* indexDB
* http 接口 -> cms内容配置

![set-storage](/jdcloud-storage-en.png)


## 语言包加载思路 
* 放到indexedDB中 -> SRM 
* 放到jnpm中 京东云
* key 英文 $.t("product.header.maintitle")
配图 ![npm包管理内容](/jnpm-iopt-fe-base.png)

## UA识别 
通过用户IP/浏览器使用语言/系统语言
权重判断后 对语言进行默认加载 不做设置 只做识别后加载对应语言文件

## 两种方案
cn/en
![i18n方案1](/i18n-case1.png)
![i18n方案2](/i18n-case2.png)

## 测试方式
1. 通过顶栏切换语言 有写入cookie动作
2. 通过底栏切换语言 有写入cookie动作 
3. 通过修改url内容 如把www.jdcloud.com/cn/ 改为 www.jdcloud.com/en/ 有写入cookie动作 
4. 没有英文提示的需要给提示 
![show-tips](/jdcloud-en-tips.png)
配图
 
## 注意的地方:
* 对cookie 中 jdcloud_sitelang 操作时 请备注 domain为 .jdcloud.com  不然会只对当前url域生效 起不到公用作用
* 写入cookie时 请设置expires 或者 max-age (尽可能保持久就可以 portal时长定的50年)
* 写入值 只能为 cn (中文)  en (英文)  通过window.navigator.languages 获取的台湾/zh-TW/zh-HK/en-GB/en-US等 均需要自行处理为 cn和 en , us也区分不同us