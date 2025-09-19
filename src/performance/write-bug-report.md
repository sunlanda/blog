# 埋点事件上报

## 报错抓取
监听console中打印的报错信息,或者throw Error报错

## 点击clstag上报
对某一个按钮,tab,添加 clstag="Header|keycount|jdcloud_home|header_adLink" 这样的数据进行监控,在后台管理系统进行分析 

## 无埋点上报
全局劫持click事件,捕捉点击元素,后台分析点击的位置和元素. 