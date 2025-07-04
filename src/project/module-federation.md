# 模块联邦兼容性说明 module_federation

## 问题描述

在使用模块联邦时，当主项目（Vue3）引用本项目（Vue2）中的组件或页面时，可能会出现Vue对象为undefined的问题。这是因为模块联邦环境下，不同版本的Vue实例可能无法正确共享。

## 解决方案

我们通过以下方式解决了Vue版本兼容性问题：

1. 创建了Vue兼容层（`src/utils/vue-compat.js`），用于动态获取Vue实例，并提供跨Vue2/Vue3版本的API兼容性。

2. 修改了`util.js`中对Vue的直接引用，改为使用兼容层提供的方法。

3. 重命名了`require`函数为`requireAsset`，避免与Node.js的全局`require`函数冲突。

4. 优化了资源加载逻辑，支持Vite和Webpack不同环境。

## 使用说明

### 在模块联邦环境中使用本项目组件

当在Vue3项目中引用本项目（Vue2）的组件或页面时，不需要特殊处理，兼容层会自动处理Vue版本差异。

### 开发新组件注意事项

1. 不要直接使用`import Vue from 'vue'`，而是使用兼容层提供的方法：

```js
import { getVueInstance, getI18nFunction } from '@/utils/vue-compat';

const Vue = getVueInstance();
const $t = getI18nFunction();
```

2. 不要直接修改`Vue.prototype`，而是使用兼容层提供的方法：

```js
import { setGlobalProperty } from '@/utils/vue-compat';

setGlobalProperty('SOME_KEY', someValue);
```

3. 使用`requireAsset`函数加载资源，而不是直接使用`require`：

```js
import { requireAsset } from '@/utils/util';

const imageUrl = requireAsset('@/assets/images/logo.png');
```

## 技术细节

### Vue兼容层（vue-compat.js）

提供了以下主要功能：

- `getVueInstance()`: 动态获取Vue实例
- `setGlobalProperty()`: 设置全局属性（兼容Vue2的prototype和Vue3的globalProperties）
- `getGlobalProperty()`: 获取全局属性
- `getI18nFunction()`: 获取国际化函数

### 资源加载（util.js）

- 重命名了`require`函数为`requireAsset`，避免命名冲突
- 优化了资源加载逻辑，支持Vite和Webpack不同环境
- 为了向后兼容，保留了原来的`require`函数名