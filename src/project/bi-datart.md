# 快速驾驭BI报表工具-从开源软件datart谈起

## BI是什么

### 竞品分析
* datart 
* powerBI
* metaBase
* superset
* tableau

### 开源和二开适配性
* 企业使用  不想付费 走二开
* license 协议
* 是否独立部署

## 在组内应用场景是什么
* 客户演示时快速搭建
* 对生产流程,业务指标做清晰梳理和展示,辅助决策
* 解放前端工作量,告别微调echarts的细碎工作量 -> 你还在吭哧吭哧一点点写echarts吗? 改一次发一个版本? 


## BI的核心逻辑
* 海量/不同数据库的类型数据如何提取,筛选,做展示
* 数据加工后返回页面,并关联相应的图表
* 图表是否可以集合成为一个自适应的大屏并且可以复用和分享(包括iframe嵌入使用等)

## 需要服务器指标
* docker / k8s 部署
* 4核8G内存服务器是否够用

## 简单上手使用
### 1. 配置数据源 
链接mysql,clickhouse等
### 2. 配置表结构
计算字段设计

### 3. 配置前端看板

### 4. 对不满足需求的图表进行二开

### 5. 上线发版和分享

### 自己扩展一个AI级别的应用
类似: https://www.datafocus.ai/
在输入框中 给定一个中文描述,展示一套图表, 譬如4月份售后数量>10的企业.

## 参考
[datart大赛作品赏析](https://mp.weixin.qq.com/s/nYMAaiT97NPkm71FpW8LSw)
[自定义插件图表](https://running-elephant.github.io/datart-docs/docs/chart_plugin.html#4-%E5%8F%82%E8%80%83%E9%85%8D%E7%BD%AE%E9%A1%B9%E8%AF%A6%E7%BB%86%E8%AF%B4%E6%98%8E)
