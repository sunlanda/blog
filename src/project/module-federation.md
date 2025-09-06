

模块联邦（Module Federation）是 webpack 5 引入的一项革命性特性，允许多个独立构建的应用在运行时动态共享代码，实现真正意义上的“微前端”架构。

## 模块联邦是什么

模块联邦允许不同项目之间像本地模块一样相互引用和共享代码，无需重新打包。它支持在运行时加载远程模块，极大提升了代码复用和团队协作效率。

## 为什么要使用它

- **代码复用**：多个项目可共享通用组件、工具库，无需重复开发和打包。
- **独立部署**：各子应用可独立开发、独立部署，互不影响。
- **动态加载**：按需加载远程模块，减少主包体积，加快首屏速度。
- **微前端支持**：天然适配微前端架构，提升大型项目可维护性。

## 优势

- **提升开发效率**：团队可并行开发，减少重复劳动。
- **灵活升级**：子应用可独立升级，主应用无需频繁发布。
- **资源共享**：公共依赖（如 UI 库、工具库）只需加载一次，节省带宽和内存。

## 劣势

- **配置复杂**：需要合理配置 exposes、remotes、shared 等参数。
- **兼容性问题**：不同框架、不同版本间的依赖冲突需谨慎处理。
- **运行时依赖**：远程模块不可用时，主应用功能可能受限。
- **调试难度提升**：跨项目调试和错误追踪相对复杂。

## 例子：vue2 是否能共享代码给 vue3 或 react？

理论上，模块联邦支持不同技术栈间的代码共享，但需注意以下几点：

- **共享纯 JS 工具库**：如 lodash、moment 等，vue2、vue3、react 均可直接共享。
- **共享 UI 组件**：vue2 组件无法直接给 vue3 或 react 用（因语法和运行时不同），但可以将组件打包为 Web Components 或纯 JS 库后共享。
- **最佳实践**：建议将可复用逻辑抽离为纯 JS 库，通过模块联邦共享，UI 层各自实现。

**示例：共享工具库**

主应用（vue3/react）`webpack.config.js` 配置：

```js:/Users/landa/hub/blog/src/project/module-federation-example/webpack.config.js
plugins: [
  new ModuleFederationPlugin({
    name: 'mainApp',
    remotes: {
      utilsApp: 'utilsApp@http://localhost:9001/remoteEntry.js'
    },
    shared: ['lodash']
  })
]
```

工具库应用（vue2）`webpack.config.js` 配置：

```js:/Users/landa/hub/blog/src/project/module-federation-utils/webpack.config.js
plugins: [
  new ModuleFederationPlugin({
    name: 'utilsApp',
    filename: 'remoteEntry.js',
    exposes: {
      './math': './src/math.js'
    },
    shared: ['lodash']
  })
]
```

主应用中动态加载远程模块：

```js:/Users/landa/hub/blog/src/project/module-federation-example/src/loadUtils.js
import('utilsApp/math').then(module => {
  const add = module.add;
  console.log(add(1, 2));
});
```

## 共享成功后性能优化建议

- **依赖去重**：通过 shared 配置，确保如 react、vue、lodash 等依赖只加载一份，减少重复包体积。
- **按需加载**：只在需要时加载远程模块，避免一次性加载全部资源。
- **缓存远程模块**：利用浏览器缓存和 CDN，提升二次访问速度。
- **异步加载**：利用 webpack 的异步 chunk，提升首屏渲染速度。

## 可做公共抽离的资源

- **工具库**：如 lodash、moment、axios 等。
- **UI 组件库**：如 element-ui、ant-design-vue（需保证兼容性）。
- **业务通用模块**：如权限校验、国际化、日志收集等。
- **静态资源**：如图片、字体、样式表等，可通过 CDN 或公共包分发。

---

模块联邦为大型前端项目带来了极大的灵活性和扩展性，但也需要合理规划和配置，才能发挥其最大优势。对于跨框架共享，建议优先抽离纯 JS 逻辑，UI 层各自实现，确保兼容性和可维护性。

