# 代码风格统一规范

https://www.prettier.cn/playground/

## prettier
### 安装
```bash
npm install --save-dev --save-exact prettier
```
也可以全局安装 单独针对某个项目或者目录进行使用
```bash
npm install --global prettier
prettier --write .
```


### 配置
```json
{
  "singleQuote": true,
  "semi": false,
  "printWidth": 120,
  "tabWidth": 2,
  "useTabs": false,
}

```js
// .prettierrc.js
module.exports = {
  semi: true,
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'avoid',
  endOfLine: 'lf',
  vueIndentScriptAndStyle: true
};

```

### 执行
```bash
npx prettier --write .
```

### 配合husky使用   

### 大厂规范
* 每次提交都要格式化
* 每次都要检查代码中异常并抛出
* 如果有异常，提交就不能通过