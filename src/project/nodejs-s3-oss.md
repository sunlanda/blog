# iothub物模型管理OSS实践 

## 背景
业务线中需要搭建一个物模型静态资源管理平台,后端资源比较紧张,老大说你最近不是在搞nodejs嘛,你整一下把,反正给内部使用,你拿来练练手.
光荣的领了KPI后,就开始了调研竞品,思考过如何通过nodejs服务把静态资源管理起来,如数据持久化到SQL/MongoDB等,京东云内部存储方案等(jdcloud OSS)等.

最后选择京东云云存储进行封装原因:
1. 是只有前端做静态资源的增删改查,使用频率又不高,OSS是比较合适的选择就不搭后端服务了.
2. 是自己团队有云存储同事,有问题好沟通,还能在团队内部形成技术栈一致的好处.


**京东云云存储服务**（京东云对象存储服务，简称 `JOS`）和**亚马逊的简单存储服务**（Amazon Simple Storage Service，简称 `Amazon S3`）都是提供云端对象存储的服务，允许用户在云端存储、检索和管理数据。
云存储中亚马逊是妥妥的巨头,不管是全球市场占有率还是文档标准上都是其他家模仿的对象.出的API也第一目标会考虑是否与它兼容. 


## 调研确定思路
* 使用京东云云存储SDK时需提前在[京东云用户中心账户管理](https://uc.jdcloud.com/accesskey/index)下的AccessKey管理页面申请`accesskey`和`secretKey`密钥对（简称AK/SK）
* 学习亚马逊S3基本API
* 学习eggjs框架自带功能(MVC写法) 
* 缕清项目调用关系
![jdcloud-oss-info](/jdcloud-oss-info.png)



## 编写代码

### 启动项目
本次我们使用`egg.js`作为后端框架来启动服务
```json
// package.json 依赖安装 
{
  "dependencies": {
    "aws-sdk": "^2.395.0",
    "egg": "^2.14.2",
    "egg-scripts": "^2.11.0",
    "egg-view-nunjucks": "^2.2.0",
  }
}
```

### 新增router

// 在egg.js 初始项目中我们能看到有`router.js`文件,我们在这里引用/router/deviceList.js 的路由配置
```js
// router.js  

'use strict'
module.exports = app => {
  const { router, controller } = app
  // 默认加载controller下local
  require('./router/local')(app)
  // 组合路由
  require('./router/deviceList')(app)
  // 在home.index中对html页面兜底渲染  await this.ctx.render('index.html')
  router.get('*', controller.home.index)  
  
}

```
### 接口请求设定
  const { router } = app .这里的router是eggjs默认提供的路由接口机制,如果想新增一个接口就在这里注册,router.`HTTPMETHED`(`URL_PATH`,`CONTROLLER`)
* `HTTPMETHED` -> get | post | delete ...
* `URL_PATH` -> '/v1/getList' | '/api/getInstance/:instanceId'
* `CONTROLLER` -> controller.deviceList.getEnv

```js
// router/deviceList.js
module.exports = app => {
  const { router, controller } = app
  // 获取当前运行环境
  router.get('/v1/getEnv', controller.deviceList.getEnv)
  // bucket
  router.post('/v1/upload', controller.deviceList.upload)
  router.post('/v1/listBuckets', controller.deviceList.listBuckets)
  router.post('/v1/listObjects', controller.deviceList.listObjectsEvt)
  router.post('/v1/copyFile', controller.deviceList.copyFile)
  router.get('/v1/deleteOssObject', controller.deviceList.deleteObject)
}

```

### 控制器逻辑
在controller里就要写接口被请求后要做的逻辑处理了,譬如这段代码做了几件事情:
1. 引入`aws-sdk`来使用aws.s3存储
2. 引用相对路径中的prod.json作为aksk配置文件的预置
3. 通过调用s3.listBuckets方法 并将data.Buckets赋值给ctx.body返回给前端
4. try catch逻辑判断如果报错 就this.ctx.logger.info 进行日志上报


这里咱们拿listBuckets做测试

```js
// controller/deviceList.js
const Controller = require('egg').Controller
const fs = require('mz/fs')
const path = require('path')
var AWS = require('aws-sdk')
// config 在前 创建实例在后
class deviceListController extends Controller {
  async getEnv() {
    let { ctx } = this
    const OSSENV = this.config.env
    // console.log('==============',OSSENV)
    ctx.body = OSSENV
  }
  async listBuckets() {
    const { ctx } = this
    const OSSENV = this.config.env || 'stag'
    let s3
    if (OSSENV === 'prod') {
      AWS.config.loadFromPath(path.join(__dirname, 'prod.json'))
      AWS.config.update({ region: 'cn-north-1' })
      s3 = new AWS.S3()
    } else {
      AWS.config.loadFromPath(path.join(__dirname, 'test.json'))
      AWS.config.update({ region: 'cn-east-1' })
      s3 = new AWS.S3()
    }
    try {
      // s3 = new AWS.S3({ apiVersion: '2006-03-01' })
      await s3.listBuckets(function(err, data) {
          if (err) {
            ctx.logger.info(err)
            ctx.body = { error: 'get bucket error' }
          } else {
            console.log(data.Buckets[0].Name)
          }
        })
        .promise()
        .then(data => {
          ctx.body = data.Buckets
        })
    } catch (error) {
      console.log('error ')
      this.ctx.logger.info('OSSENV' + OSSENV)
      // ... logger 上报处理
    }
  }
}
  
```


### prod和stag配置文件json

```json
// controller/test.json
{
    "endpoint": "http://s3.cn-north-1-stag.jcloudcs.com",
    "accessKeyId": "AF9CABAECD726BFC1F945E08C070B7",
    "secretAccessKey": "F6BBE1D86E05301AD0D91A23AF4827",
    "s3ForcePathStyle": true,
    "signatureVersion": "v4",
    "region": "cn-north-1-stag"
}
// controller/prod.json
{
    "endpoint": "http://s3.cn-north-1.jcloudcs.com",
    "accessKeyId": "XXX",
    "secretAccessKey": "XXX",
    "s3ForcePathStyle": true,
    "signatureVersion": "v4",
    "region": "cn-north-1"
}

```

此处的endpoint 取自京东云云平台的对象存储`bucket`详细信息中,是一个公网绝对地址.
`accessKeyId` 和 `secretAccessKey` 是需要调用OSS前需要申请好的密钥服务(可以理解成一个加密后的账号密码,只不过是给机器识别的身份信息,拿着它就能对京东云云服务中的各项云服务进行调用.
![jdcloud-oss-info](/jdcloud-docs-oss.png)

 

## 总结
至此,一个简单的Node.js服务调用S3来管理云存储的项目就搞完了,希望对你有帮助.

## 参考
- [aws-nodejs版本SDK](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-creating-buckets.html)
- [jdcloud oss 兼容S3](https://docs.jdcloud.com/cn/object-storage-service/api/introduction-2)
- [jdcloud sdk 云资源](https://github.com/jdcloud-api/jdcloud-sdk-nodejs)
- [京东云AKSK控制台](https://uc.jdcloud.com/account/accesskey)
- [egg.js官方文档](https://www.eggjs.org/zh-CN/intro/quickstart)
