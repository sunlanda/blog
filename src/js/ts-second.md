# TypeScript 面试考察点

作为面试官，我会从以下几个方面考察你的 TypeScript 知识：

## 基础概念

1. **类型系统**
   - TypeScript 与 JavaScript 的关系和区别
   - 静态类型检查的优势
   - TypeScript 的类型推断机制

2. **基本类型**
   - 原始类型（string, number, boolean, null, undefined, symbol, bigint）
   - 复杂类型（array, tuple, enum, any, void, never, unknown）
   - 字面量类型和联合类型

## 进阶类型操作

1. **类型别名与接口**
   - type 与 interface 的区别和使用场景
   - 接口继承与合并
   - 可选属性、只读属性

2. **高级类型**
   - 联合类型与交叉类型
   - 条件类型 (T extends U ? X : Y)
   - 映射类型 (Partial, Required, Pick, Omit 等)
   - 索引类型和索引访问类型
   - keyof 和 typeof 操作符

3. **泛型**
   - 泛型的基本概念和使用
   - 泛型约束与默认值
   - 泛型在函数、类、接口中的应用
   - 实际工作中的泛型最佳实践

## 实战应用

1. **类型声明文件**
   - .d.ts 文件的作用和编写
   - 如何为第三方库编写类型声明
   - @types 命名空间

2. **TypeScript 配置**
   - tsconfig.json 的关键配置项
   - 严格模式 (strict) 的作用
   - 模块解析策略

3. **设计模式与最佳实践**
   - 如何利用 TypeScript 实现常见设计模式
   - 类型安全的事件系统设计
   - 如何处理 any 类型

## 面试题示例

1. **基础题**：
   - 解释 `unknown` 和 `any` 的区别
   - 如何使用类型守卫 (Type Guards)
   - 什么是类型断言，何时使用它

2. **中级题**：
   - 如何实现一个类型安全的事件发布订阅系统
   - 解释并实现一个 `DeepReadonly<T>` 类型
   - 如何使用 TypeScript 的条件类型实现类型过滤

3. **高级题**：
   - 实现一个类型递归，比如 `DeepPartial<T>`
   - 如何设计一个类型安全的 API 请求库
   - 讨论 TypeScript 中的协变与逆变

4. **实战题**：
   - 给你一段有类型问题的代码，请你修复它
   - 如何优化一个项目中的 TypeScript 类型定义
   - 如何处理第三方库缺少类型定义的情况

## 评分标准

1. **基础掌握程度**：对 TypeScript 基本概念的理解
2. **深度**：对高级类型和类型操作的理解
3. **实战经验**：解决实际问题的能力和经验
4. **最佳实践**：是否了解 TypeScript 的最佳实践和常见陷阱
5. **思维方式**：是否能够用类型思维解决问题

通过这些方面的考察，可以全面评估你对 TypeScript 的掌握程度和实际应用能力。