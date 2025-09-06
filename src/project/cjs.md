# cjs 和 esmodule 有什么区别

> cjs esm umd(antd) 发布一个包 三证齐全

## 介绍背景

## ecmascript  

```js
import Lodash from "lodash"
import {sortby} from "lodash"

export default ModuleA;
expport {
    ModuleB,
    ModuleC
}
```

## cjs
```js
var http = requrire("http")

module.exports = {}
```