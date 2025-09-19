# 技术思考-从搭建一个SaaS平台说起

最近几年一直在公司做toB交付,从一个个需求中了解到,有些功能和设计是比较通用的,可以抽离出来,做成一个SaaS平台,供其他客户使用.
也有一些标准件可以提前准备.

## 业务逻辑
* 租户开通和管理
* 

## 前后端注意
* 数据权限
  * router menu
  * tennetId
* 内容定制
  * pageConfig
  * version components
* 通用功能 (配置)
  * json schema
  * logo/title/bgc/colors/skinstheme

## 后端
* files (文件OSS存储)
* http  (接口统一筛选)
* 网关 安全

租户数据管理与保存逻辑: 定期删除

## 大型SAAS文件如何管理? 

请参考这篇文章: saas-file-manage.md