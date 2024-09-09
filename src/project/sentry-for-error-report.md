# 私有化部署-sentry监控平台部署实践
![price](/logos/sentry.svg)


大家好,近期在业务中提出有监控平台的使用需求,而且是需要私有化部署的,遂在网上找了下开源的错误上报平台,目前选`sentry` 是因为从github的star数,贡献量看都是比较高的.也比较符合我们toB私有化业务的场景, 所以今天就讲一下`sentry`的私有化部署.

在开始之前我们先假想一下如果从零到一搭建一套错误监控平台大概是什么样的:
![sentry](/sentry/struct-overview.png)
看起来要做很多功能对吗? 别担心, `sentry` 就是一个开箱即用的一套错误监控平台,部署成功后就可以快速进行使用.并且包含图中常用的功能.


::: tip 这篇能学到什么
从零到一部署一套`sentry`监控平台的私有化版本(self-hosted),并举例一个前端项目接入`sentry`进行报错信息上报.让你轻松的拼凑业务系统中监控的这一块版图.
:::




私有化 VS SaaS系统在这里我从几个简单的维度来对比一下SaaS和私有化的差异, 让各位有个直观的感受.


| 类型 | 付费体系 | 应用归属 | 数据归属 | 运维方式 | 支持内网 | 是否可以二开|
| - | - | - | - | - | - | -|
| 付费SaaS | 按年/按用户量 | 公网网址访问(可能有独立二级域名) | 在SaaS服务商 | 7 * 24 商务技术支持 | 不行 | 有api可接入的可以, 一般高级版会有 |
| Hosted-自部署 | 一次性买断/开源 | 自定义服务器和域名 | 在自己服务器本地/或自定云端 | 自己团队 | 可以 | 有api可接入的可以 |

## `sentry` SaaS版本收费一览

这里强调一下`sentry` 和 `getsentry` 是不一样的. 一个是SaaS版本在官网,一个私有化版本在github上仓库,这里的区别大家注意甄别

* SaaS版本: https://sentry.io/
* 私有化版本: https://github.com/getsentry/self-hosted/ 

![price](/sentry/price.png)

> 因为对外掏钱要走申请,比较麻烦,而且我们本身动手能力就比较强 (对吧) ,所以直接跳过外采, 咱们看开源 + 二开.

## 开源要注意避坑license
虽然平时我们也经常使用开源的组件和三方库,也会直接拿一些开源的应用部署来使用,但是一旦涉及商业交付,要考虑是否允许闭源,是否允许二次宣发,宣发时是否要带上原作者信息等等.
这里整理了一张常见license的分支图,帮助你选择合适的开源项目进行使用.
![price](/sentry/license.png)


可以看到Apache还是比较宽松的. 其他许可大家可以自行判断如何使用.

> 从现在开始咱们简称 getsentry/self-hosted 为 `sentry`. 

## 前置环境
部署`sentry`需要有一台服务器(最好是linux-ubuntu),提前装好docker, python(没有的话可以选官方或者共享市场中带docker的镜像, python一般linux自带无需安装) 
我们看下 `sentry` 的部署要求:

### 服务器和docker要求

* Docker 19.03.6+
* Compose 2.19.0+
* 4 CPU Cores
* 16 GB RAM
* 20 GB Free Disk Space

### 基本操作
修改docker mirror镜像源 -> 这样可以安装更快
配置好记得重启

```shell
sudo systemctl daemon-reload
sudo systemctl restart docker 
# 重启让配置生效

docker info
# mirrors是否生效 得到 : ->>>>  就OK
# Registry Mirrors: https://ojzwya4p.mirror.aliyuncs.com/
```
#### 下载`sentry`应用包
```
git clone https://github.com/getsentry/self-hosted.git
```

这里咱们采用gitclone 进行演示, 一般clone下来默认是最新版本, 为防止本文时效性失效,建议拉下来后 git checkout 24.5.0 // 因为我自己用的是这个版本,

#### 安装`sentry`应用

切换完版本后 cd self-hosted

#### 这时先不要着急install.sh 有几个配置要修改

```sh
sentry/sentry.config.py
# 找到: system.internal-url-prefix   -> 修改为当前服务器的域名 + 端口
```

```sh
sentry/config.yml
# 找到: ORIGIN_ 一般在最后一行 -> 修改可访问数组为当前服务器域名+端口

```

进入项目目录后执行 install.sh 
需要Y/N就一路Y, 中间有提示需要输入账号密码, 这里如果不小心选了N 也没关系,后面贴出补救办法.
```
账号: sunlanda@xx.com 
密码: 不限

```
创建完账号后, 代表我们的应用被初始化完毕可以启动了 ,

同样的目录执行: 
```shell
docker compose up -d 
# 启动应用命令

```

启动完成后 ,我们访问本机器 -> 简称domain,  就是 http://domain:9000  就能看到`sentry` 登录界面,
这里如果遇到9000不可访问,可以查一下安全组问题,下面介绍异常问题解决

### 异常问题解决

* install.sh 执行卡在 download images  -> 检查源是否为国内一般4个小时内都可以拉取完毕
* 报错apt 找不到 -> linux系统不是Ubuntu/debian,大概用的是CentOS 最好在Ubuntu上操作
* 9000端口不可访问 , 需要登录机器的运营平台 ( [京东云的机器安全组在这里 ACL](https://docs.jdcloud.com/cn/virtual-private-cloud/security-group-features) )
* 添加邮箱用户时选了否 ,没有账号可以登录  -> 
```sh
docker-compose run --rm web createuser --email testsentry@xx.com --password 123456 --superuser
```

### 登录后界面操作
如果以上都顺利执行后就可以看到登录后的界面,长这样.
![price](/sentry/monitor.png)


## 应用接入流程

### 1 安装npm包
在项目-> 创建项目  或者直接访问: domain:9000/organizations/xxx/projects/new/
如果你是vue或者react的应用 ,接入非常简单, 官方提供npm包后即可调用:

```sh
# react.js
npm i @sentry/react
# vue.js
npm i @sentry/vue


```
### 2 配置DSN

这里的DSN 来自 项目 -> 创建项目配置处拿到: 
![dsn](/sentry/carbon.png)

### 3 接入测试
拿一个前端项目举例,我在handleSubmit方法处添加了一个不存在的调用: this.unDefinedFuc()
在前端点击调用后,`sentry`就会监听到报错向DSN地址发送请求, 这样就拿到TypeError这个结果, 至此, 这套系统完成MVP版本闭环.
```jsx
function unDefinedFuc(){
    throw new Error("sentry - error - test")
}
<button onClick={unDefinedFuc} > getError</button>
```



## 总结与思考

通过自己搭建这一套监控平台下来, 能学习到很多不同领域的知识譬如: vim编辑yml, docker基本操作, mirror的下载机制,  服务器安全组的理解等等, 能扩充自己的技能也能学习优秀的开源项目是怎么做的.一举多得 ~ 


## 参考文档
* docker 镜像: https://hub.docker.com/r/getsentry/sentry
* sentry 私有化文档: https://develop.sentry.dev/self-hosted/
* 自定义镜像:  https://help.aliyun.com/zh/ecs/user-guide/overview-36
* ACL安全组 https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/working-with-security-groups.html
* 前端接入 https://docs.sentry.io/platforms/javascript/guides/vue/
* npm : https://www.npmjs.com/package/@sentry/vue
