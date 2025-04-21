# 官网国际化方案 

## 逻辑
* browser提取前三个lang
* 映射语言(cn/us)
* 跳转并显示(translate lang/no support tips)



## i18n方案操作

## event 切换 中英文
* 无刷效果
* 有刷新效果 url改变(current)
* 
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
配图 ![](jnpm-iopt-fe-base)

## UA识别 
通过用户IP/浏览器使用语言/系统语言
权重判断后 对语言进行默认加载 不做设置 只做识别后加载对应语言文件

## 两种方案
cn/en https://joyspace.jd.com/meeting/yRg3tCcWq9xr7gdA82Gm

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