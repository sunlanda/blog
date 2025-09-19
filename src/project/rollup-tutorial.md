# rollup打包使用

## 写组件

## 测试组件

在不发布到npm的情况下，你可以通过以下几种方法在本地引用前端组件库进行测试：

### 方法一：使用 `npm link`
`npm link` 是 npm 提供的一个实用命令，它可以在本地环境中创建一个符号链接，将你的组件库项目链接到其他项目中，从而实现本地引用。以下是具体步骤：
1. **在组件库项目中创建链接**：打开终端，进入组件库项目的根目录，然后运行以下命令：
```bash
npm link
```
该命令会在全局的 `node_modules` 目录下创建一个指向你组件库项目的符号链接。
2. **在测试项目中链接组件库**：打开另一个终端，进入你要进行测试的项目的根目录，运行以下命令：
```bash
npm link your-component-library-name
```
其中 `your-component-library-name` 是你组件库 `package.json` 文件中的 `name` 字段的值。执行此命令后，测试项目的 `node_modules` 目录下会创建一个指向全局 `node_modules` 中你组件库的符号链接，这样你就可以在测试项目中像使用普通依赖一样使用你的组件库了。
3. **在测试项目中使用组件库**：在测试项目的代码中引入并使用组件库中的组件，例如：
```jsx
// 假设你的组件库导出了一个名为 Button 的组件
import { Button } from 'your-component-library-name';

function App() {
    return (
        <div>
            <Button>Click me</Button>
        </div>
    );
}

export default App;
```
4. **解除链接**：当你完成测试后，可以在测试项目的根目录下运行以下命令来解除链接：
```bash
npm unlink your-component-library-name
```
同时，在组件库项目的根目录下运行以下命令来移除全局的符号链接：
```bash
npm unlink
```

### 方法二：使用相对路径引用
如果你只是想简单地在本地测试组件库，也可以使用相对路径来引用组件库。具体步骤如下：
1. **复制组件库代码**：将组件库项目的代码复制到测试项目的某个目录下，例如 `./src/components-library`。
2. **在测试项目中使用相对路径引入组件**：在测试项目的代码中使用相对路径来引入组件库中的组件，例如：
```jsx
// 假设你的组件库位于 ./src/components-library 目录下，并且导出了一个名为 Button 的组件
import { Button } from '../components-library';

function App() {
    return (
        <div>
            <Button>Click me</Button>
        </div>
    );
}

export default App;
```
这种方法的优点是简单直接，不需要使用 `npm link` 命令；缺点是如果组件库代码有更新，你需要手动复制更新后的代码到测试项目中。

### 方法三：使用 `yalc`
`yalc` 是一个类似于 `npm link` 的工具，但它提供了更方便的版本管理和依赖更新功能。以下是使用 `yalc` 的具体步骤：
1. **安装 `yalc`**：在全局环境中安装 `yalc`：
```bash
npm install -g yalc
```
2. **在组件库项目中发布到 `yalc`**：打开终端，进入组件库项目的根目录，然后运行以下命令：
```bash
yalc publish
```
该命令会将组件库的当前版本发布到 `yalc` 的本地仓库中。
3. **在测试项目中添加组件库依赖**：打开另一个终端，进入你要进行测试的项目的根目录，运行以下命令：
```bash
yalc add your-component-library-name
```
其中 `your-component-library-name` 是你组件库 `package.json` 文件中的 `name` 字段的值。执行此命令后，测试项目的 `node_modules` 目录下会添加你的组件库，并且 `package.json` 文件中会记录该依赖。
4. **在测试项目中使用组件库**：在测试项目的代码中引入并使用组件库中的组件，方法与使用 `npm link` 时相同。
5. **更新组件库**：当你对组件库代码进行了更新后，可以在组件库项目的根目录下再次运行 `yalc publish` 命令，然后在测试项目的根目录下运行 `yalc update` 命令来更新组件库的版本。
6. **移除组件库依赖**：当你完成测试后，可以在测试项目的根目录下运行以下命令来移除组件库依赖：
```bash
yalc remove your-component-library-name
```

以上三种方法都可以在不发布到 npm 的情况下在本地引用前端组件库进行测试，你可以根据自己的需求选择合适的方法。 


## 发布组件



## 为什么要写这篇文章? 
vite打包的核心支持

## 能在前端提效

## 对标竞对是哪些

* turbopack 是vite的打包工具，它的打包速度快，打包体积小，打包结果与vite一致。
* rollup 是一个 javascript 模块打包器，它的打包速度快，打包体积小，打包结果与vite一致。
* webpack 是一个 javascript 模块打包器，它的打包速度慢，打包体积大，打包结果与vite不一致。
* parcel 是一个 javascript 模块打包器，它的打包速度快，打包体积小，打包结果与vite一致。

表格横向对比,各自打包器的打包速度和打包体积

| 打包器 | 打包速度 | 打包体积 | 打包结果 |
| ------ | ------ | ------ | ------ |
| turbopack | 快 | 小 | 一致 |
| rollup | 快 | 小 | 一致 |
| webpack | 慢 | 大 | 不一致 |
| parcel | 快 | 小 | 一致 |

## 如何使用rollup打包组件

示例代码
```js

```


## rollup 常用插件