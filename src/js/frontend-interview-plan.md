# 高级前端工程师10天复习计划

> 重要性标识：⭐ 基础 ⭐⭐ 重要 ⭐⭐⭐ 核心 ⭐⭐⭐⭐ 高频 ⭐⭐⭐⭐⭐ 必考

## 第1天：前端基础与浏览器原理

### 浏览器加载与渲染 ⭐⭐⭐⭐⭐
- 浏览器加载过程（关键渲染路径）
  - HTML解析、DOM树构建
  - CSS解析、CSSOM树构建
  - JavaScript加载与执行
  - 渲染树构建、布局、绘制
- 重排(reflow)与重绘(repaint)
- 合成层与GPU加速

### 事件循环与异步编程 ⭐⭐⭐⭐⭐
- Event Loop详解
  - 宏任务(MacroTask)与微任务(MicroTask)
  - 任务队列优先级
- setTimeout/setInterval原理与注意事项
- requestAnimationFrame与requestIdleCallback

### 网络基础 ⭐⭐⭐⭐
- HTTP/1.1、HTTP/2、HTTP/3特性与区别
- HTTPS原理与安全机制
- 常见状态码与使用场景
- 缓存策略（强缓存、协商缓存）
- 跨域解决方案（CORS、JSONP、代理）

## 第2天：JavaScript核心与进阶

### JavaScript核心概念 ⭐⭐⭐⭐⭐
- 作用域与闭包
- this指向与绑定规则
- 原型链与继承
- 执行上下文与变量提升

### 异步编程进阶 ⭐⭐⭐⭐
- Promise原理与实现
  - Promise/A+规范
  - 手写Promise实现
- async/await原理
- Generator函数与迭代器

### 模块化开发 ⭐⭐⭐
- CommonJS、AMD、CMD规范
- ES Modules与动态导入
- UMD通用模块定义
- 模块化最佳实践

## 第3天：前端工程化与构建工具

### Webpack深入 ⭐⭐⭐⭐
- 核心概念（entry、output、loader、plugin）
- 构建优化与性能提升
- 自定义loader开发
- 自定义plugin开发
- v3/v4/v5版本差异与迁移

### 现代构建工具 ⭐⭐⭐
- Vite原理与优势
  - ESM与按需加载
  - 插件开发与HMR
- Rollup使用场景
  - 库打包最佳实践
  - Tree-shaking原理
- Babel配置与插件开发

### 工程化最佳实践 ⭐⭐⭐
- 代码规范与Lint工具（ESLint、Prettier）
- Git工作流与版本控制
- CI/CD流程与工具
- 包管理工具对比（npm、yarn、pnpm）

## 第4天：CSS进阶与布局技术

### 现代CSS技术 ⭐⭐⭐
- CSS变量与计算函数
- 预处理器（Sass、Less、PostCSS）
- CSS Modules与CSS-in-JS
- 主题切换与换肤实现

### 响应式与自适应布局 ⭐⭐⭐⭐
- Flex布局详解与实践
- Grid布局系统
- 移动端适配策略
  - viewport设置
  - rem/em/vw/vh单位选择
  - 媒体查询最佳实践

### 性能优化 ⭐⭐⭐
- CSS性能优化技巧
- 关键CSS提取
- 动画性能与优化

## 第5天：React生态与原理

### React核心原理 ⭐⭐⭐⭐⭐
- 虚拟DOM原理与Diff算法
- Fiber架构解析
- 调和过程(Reconciliation)
- 生命周期详解与最佳实践

### React Hooks ⭐⭐⭐⭐
- Hooks原理与实现
- 常用Hooks使用场景与注意事项
- 自定义Hooks设计模式

### React状态管理 ⭐⭐⭐
- Context API使用场景
- Redux核心概念与中间件
- Mobx响应式原理
- Recoil/Jotai等原子化状态管理

### React性能优化 ⭐⭐⭐⭐
- 渲染优化策略
- React.memo与useMemo/useCallback
- 代码分割与懒加载

## 第6天：Vue生态与原理

### Vue2与Vue3对比 ⭐⭐⭐⭐
- 响应式系统对比（Object.defineProperty vs Proxy）
- 生命周期变化
- 组件API设计变化
- 模板编译优化

### Vue核心原理 ⭐⭐⭐⭐⭐
- 响应式系统实现
- 虚拟DOM与Diff算法
- 模板编译过程
- 依赖收集与更新

### Vue组合式API ⭐⭐⭐⭐
- Composition API设计理念
- 与Options API对比
- 自定义组合式函数(composables)

### Vue状态管理与路由 ⭐⭐⭐
- Vuex/Pinia状态管理
- Vue Router导航守卫与路由元信息

## 第7天：TypeScript与组件库开发

### TypeScript核心 ⭐⭐⭐⭐
- 类型系统基础
- 泛型与高级类型
- 类型体操实践
- 类型声明文件编写

### TypeScript工程实践 ⭐⭐⭐
- tsconfig配置详解
- 与构建工具集成
- 类型检查优化
- 迁移策略与最佳实践

### 组件库开发 ⭐⭐⭐
- 组件设计原则
- 组件通信模式
- 主题定制与样式隔离
- 文档与测试

### 工具库封装 ⭐⭐
- CLI工具开发(commander/inquirer)
- 工具函数设计与测试
- API设计最佳实践

## 第8天：现代前端架构

### 微前端 ⭐⭐⭐
- 微前端核心概念与优势
- 实现方案对比（single-spa、qiankun、micro-app）
- 应用通信与状态共享
- 样式隔离与JS沙箱

### 模块联邦 ⭐⭐⭐
- Module Federation原理
- 远程模块加载与共享依赖
- 与微前端的关系

### Monorepo ⭐⭐
- Monorepo优势与挑战
- 工具选择（Lerna、Nx、pnpm workspace、Turborepo）
- 依赖管理与构建优化

### 服务端渲染(SSR) ⭐⭐⭐⭐
- SSR原理与优势
- Next.js/Nuxt.js核心功能
- 性能优化与缓存策略
- 同构应用最佳实践

## 第9天：前端性能优化与安全

### 性能优化全景 ⭐⭐⭐⭐
- 性能指标与测量（Core Web Vitals）
- 资源加载优化
  - 图片优化（WebP、懒加载、响应式图片）
  - 字体优化
  - 脚本优化（async/defer）
- 渲染性能优化
- 网络优化（HTTP/2、预加载、预连接）

### 前端缓存策略 ⭐⭐⭐
- 浏览器存储机制（localStorage、sessionStorage、IndexedDB）
- Service Worker与离线应用
- 缓存最佳实践

### 前端安全 ⭐⭐⭐
- XSS攻击与防御
- CSRF攻击与防御
- 点击劫持与防御
- 内容安全策略(CSP)

### 监控与埋点 ⭐⭐⭐
- 前端异常监控
- 性能监控
- 埋点SDK设计与实现
- 数据上报与分析

## 第10天：算法与设计模式

### 前端常见算法 ⭐⭐⭐⭐
- 数组与字符串处理
- 树结构操作（DOM相关）
- 排序与搜索
- 动态规划入门

### 设计模式实践 ⭐⭐⭐
- 创建型模式（单例、工厂、建造者）
- 结构型模式（代理、装饰器、适配器）
- 行为型模式（观察者、策略、命令）
- 前端常用设计模式案例

### 面试技巧与项目亮点 ⭐⭐⭐⭐
- 自我介绍结构化模板
- 项目经验提炼与表达
- 技术难点描述方法
- 回答问题的STAR法则
- 薪资谈判技巧与话术

## 复习重点与大厂面试高频考点

### 必考知识点（⭐⭐⭐⭐⭐）
- JavaScript核心原理（闭包、原型、异步）
- 事件循环与宏微任务
- 框架核心原理（虚拟DOM、Diff算法、响应式系统）
- 性能优化全景

### 高频考点（⭐⭐⭐⭐）
- React Hooks原理与使用
- Vue2/Vue3响应式原理对比
- TypeScript类型系统
- 浏览器渲染原理
- 网络协议与安全
- 服务端渲染

### 进阶考点（⭐⭐⭐）
- 微前端与模块联邦
- 构建工具原理与插件开发
- 设计模式实践
- 前端工程化最佳实践

## 日常复习建议

1. 每天抽出1-2小时进行刻意练习，专注攻克1-2个重点难点
2. 结合实际项目，将理论知识应用到实践中
3. 整理个人知识体系，构建知识图谱
4. 针对薄弱环节，编写demo巩固
5. 模拟面试场景，练习技术表达

祝复习顺利，面试成功！