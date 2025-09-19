
## PC、H5监控探针接入代码
### 方式一: 以npm方式安装探针
a. 自动完成将探针脚本做为第一个资源插入到.html文件中;
b. 将探针脚本copy到打包工程publicPath下;
c. 上传SourceMap文件到SGM;

步骤：
1. npm i @sunlanda/sgm-web
2. 插件支持: Webpack、Vite、Rollup
3. 修改配置:
```javascript
const { SgmWebWebpackPlugin, SgmWebVitePlugin } = require('@sunlanda/sgm-web')
// 或（以下引入方式nodejs版本需v13+）
const SgmWebWebpackPlugin = require('@sunlanda/sgm-web/webpack') // Webpack
const SgmWebVitePlugin = require('@sunlanda/sgm-web/vite')    // Vite
const SgmWebPlugin = require('@sunlanda/sgm-web/rollup')  // Rollup

/*** 例1: 基于Webpack打包 (在 webpack.config.js 中修改配置) **/
const SgmWebWebpackPlugin = require('@sunlanda/sgm-web/webpack')
module.exports = {
  ...
  plugins: [
    ...
    new SgmWebWebpackPlugin({ // 说明：webpack3/4中需将它做为最后一个插件
      sid: 'c8a42d2210f8489c93*****',
      pid: '9HwAEg@TcOt0a.Oded*****'
    })
  ]
}

/*** 例2: 基于Webpack打包的Vue (在 vue.config.js 中修改配置) **/
const SgmWebWebpackPlugin = require('@sunlanda/sgm-web/webpack')
module.exports = {
  configureWebpack: {
    ...
    plugins: [
      ...
      new SgmWebWebpackPlugin({
        sid: 'c8a42d2210f8489c93*****',
        pid: '9HwAEg@TcOt0a.Oded*****'
      })
    ]
  }
}

/*** 例3: 基于Vite打包 (在 vite.config.js 中修改配置) **/
const SgmWebVitePlugin = require('@sunlanda/sgm-web/vite')
export default defineConfig({
  ...
  plugins: [
    ...
    SgmWebVitePlugin({
      sid: 'c8a42d2210f8489c93*****',
      pid: '9HwAEg@TcOt0a.Oded*****'
    })
  ]
})
```
##### 参数说明
参数 | 类型 | 描述 | 是否必须 | 默认值
--- | --- | --- | --- | ---
sid | String | 加解密盐值 | 是 | -
pid | String | 应用唯一标识 | 是 | -
userKeys | String | 用户ID取值变量，多个以逗号分隔 | 否 | 默认取Cookie中的pin,pt_pin,pwdt_id
initDomain | String | 初始化配置通道 | 否 |
screenshot | Boolean | 开启截屏功能 | 否 | false (说明：3.1.0 开始支持，注意：开启需注意行业合规问题)
options | Object | 高级设置 { isRemote, include, exclude } | 否 | -
###### options说明
参数 | 类型 | 描述 | 默认值
--- | --- | --- | ---
isRemote | Boolean | 是否从远程下载探针脚本。当值为false时，探针将下载到打包后工程下，建议process.env.NODE_ENV === "production"时要这样做。| false
isRemoveMap | Boolean | 上传成功后，是否删除打包后工程下.map文件。| false
include | Array / String | 指定的.html文件注入探针JS，例：include:"index.html" 或 include:["index.html","home.htm"] | -
exclude | Array / String | 排除指定的.html文件不注入探针JS，例：exclude:"login.html" 或 exclude:["/static/login.html",".htm"]  | -


### 方式 以CDN方式安装探针
在index.html中引入script标签。建议：将探针做为第一个资源引入（否则之前加载的JS中有报错将监控不到）
```html
<script crossorigin src="https://aaa.bbb.com/sgm-web-x.x.x.js" name="SGMH5" sid="每个项目唯一值" pid="应用信息ID"></script>
```
##### 参数说明
参数 | 类型 | 描述 | 是否必须 | 默认值
--- | --- | --- | --- | ---
crossorigin | String | 开启跨域 | 是 | anonymous
name | String | 探针类型标识 | 是 | SGMH5
sid | String | 加解密盐值 | 是 | -
pid | String | 应用唯一标识 | 是 | -
userKeys | String | 用户ID取值变量，多个以逗号分隔 | 否 | 默认取Cookie中的pin,pt_pin,pwdt_id
initDomain | String | 初始化配置通道 | 否 |  
screenshot | Boolean | 开启截屏功能 | 否 | false (说明：3.1.0 开始支持，注意：开启需注意行业合规问题)




 