# 代码的评审中你需要知道的几个细节
我们在团队协作的过程中总是会遇到多人协作开发的情况，这时候就需要我们在代码的评审中注意一些细节，避免出现一些问题。

* pre-fetch 
* husky 提交前校验
* commit cz

## 善用工具
* github / gitlab / 公司自建代码仓库平台
* 流水线 pipeline （github actions / gitlab ci / 公司自建ci平台）
* 代码质量检查工具（eslint / prettier / typescript lint）
* 插件检查 ( 公司自建代码质量检查工具)

## 约定和规范
* 分支规范
feat-XX 
dev-XX
hotfix-XX
release-XX

* 提交规范
fix(mall-view): 修改了mall-view的某个功能

* 代码质量规范
参考 pym8 前端 XXX
样式校验 , tsc 提交前格式化 + 校验

* 代码格式化规范
譬如 eslint / prettier / typescript lint
添加 jsconfig.json  tsconfig.json 


> 围绕这几点 我们梳理一下

## 我们应该注意的点
1. 循序渐进的配置上线流程 (团队中人员,各自技术栈,代码风格, )
2. 主分支dev -> release -> master的时候需要 merge request (至少一个人进行评审)
3. 每周预留一个时间节点, 进行代码的review (可以是线上的review, 也可以是线下的review)
4. 代码的review中需要注意的点
   1. **代码的质量** (是否符合规范, 是否有问题)
   2. **代码的功能** (是否符合需求, 是否有问题)
   3. 代码的性能 (是否有问题)
   4. 代码的安全 (是否有问题)

## 参考
* git-scm 
* git-flow 
* github-action
thoughwork中关于XXX 制品产出物的要求
AI插件保障代码质量的思路



----


# git提交后触发jenkins 自动部署如何实现? 
### 最佳实践

1. **测试**：发布前确保你的CLI工具在不同环境下都能正常工作
2. **文档**：提供详细的使用说明和示例
3. **版本控制**：遵循语义化版本规范
4. **持续集成**：使用GitHub Actions等CI工具自动测试和发布
5. **收集反馈**：鼓励用户提交issue和PR

## 关卡四：Git钩子与自动化部署

在现代开发流程中，自动化是提高效率的关键。Git钩子(hooks)是一种强大的自动化工具，可以在Git的各个生命周期事件触发时执行自定义脚本。结合CLI工具，我们可以实现代码提交前的检查、自动部署等功能。

### Git钩子简介

Git钩子是位于`.git/hooks`目录下的脚本，在Git执行特定操作时会被调用。常用的钩子包括：

- `pre-commit`：提交前执行，可用于代码检查
- `post-commit`：提交后执行，可用于通知
- `pre-push`：推送前执行，可用于运行测试
- `post-merge`：合并后执行，可用于更新依赖

### 使用Husky管理Git钩子

Husky是一个流行的工具，可以帮助我们更方便地管理Git钩子。

#### 步骤1：安装Husky

```bash
npm install husky --save-dev
```

#### 步骤2：配置Husky

在`package.json`中添加配置：

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint && npm run test",
      "pre-push": "npm run test"
    }
  }
}
```

或者使用Husky 6+的新配置方式：

```bash
# 初始化Husky
npx husky install

# 添加pre-commit钩子
npx husky add .husky/pre-commit "npm run lint && npm run test"

# 添加pre-push钩子
npx husky add .husky/pre-push "npm run test"
```

### 创建自定义Git钩子CLI工具

现在，让我们创建一个CLI工具，用于在代码提交前进行检查，并在推送到特定分支时触发Jenkins部署。

```js
// git-hooks-cli/index.js
#!/usr/bin/env node

/**
 * Git钩子CLI工具
 * 用于管理Git钩子和自动化部署
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
// const axios = require('axios'); // 用于HTTP请求

/**
 * 获取Git仓库根目录
 * @returns {string} Git仓库根目录的路径
 */
function getGitRoot() {
  try {
    return execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' }).trim();
  } catch (error) {
    console.error('当前目录不是Git仓库');
    process.exit(1);
  }
}

/**
 * 安装Git钩子
 * @param {string} hookName - 钩子名称
 * @param {string} scriptContent - 钩子脚本内容
 */
function installHook(hookName, scriptContent) {
  const gitRoot = getGitRoot();
  const hooksDir = path.join(gitRoot, '.git', 'hooks');
  const hookPath = path.join(hooksDir, hookName);
  
  // 确保hooks目录存在
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }
  
  // 写入钩子脚本
  fs.writeFileSync(hookPath, scriptContent);
  fs.chmodSync(hookPath, '755'); // 设置可执行权限
  
  console.log(`成功安装 ${hookName} 钩子`);
}

/**
 * 创建pre-commit钩子
 * 在提交前运行代码检查
 */
function createPreCommitHook() {
  const scriptContent = `#!/bin/sh

echo "运行代码检查..."

# 运行ESLint
npm run lint

# 如果ESLint失败，阻止提交
if [ $? -ne 0 ]; then
  echo "ESLint检查失败，请修复问题后再提交"
  exit 1
fi

# 运行测试
npm run test

# 如果测试失败，阻止提交
if [ $? -ne 0 ]; then
  echo "测试失败，请修复问题后再提交"
  exit 1
fi

exit 0
`;
  
  installHook('pre-commit', scriptContent);
}

/**
 * 创建post-push钩子
 * 在推送到特定分支后触发Jenkins构建
 */
function createPostPushHook() {
  const scriptContent = `#!/bin/sh

# 获取当前分支
BRANCH=$(git rev-parse --abbrev-ref HEAD)

# 如果是main或master分支，触发Jenkins构建
if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
  echo "推送到 $BRANCH 分支，触发Jenkins构建..."
  
  # 调用Jenkins API触发构建
  # 替换为你的Jenkins URL和API Token
  JENKINS_URL="https://jenkins.example.com"
  JOB_NAME="your-project"
  API_TOKEN="your-api-token"
  
  curl -X POST "$JENKINS_URL/job/$JOB_NAME/build" \
    --user "username:$API_TOKEN" \
    --data-urlencode "" \
    -H "Content-Type: application/x-www-form-urlencoded"
  
  echo "Jenkins构建已触发"
fi

exit 0
`;
  
  installHook('post-push', scriptContent);
}

/**
 * 主程序
 */
function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'install-hooks':
      console.log('安装Git钩子...');
      createPreCommitHook();
      createPostPushHook();
      break;
      
    case 'trigger-deploy':
      const branch = process.argv[3] || 'master';
      console.log(`手动触发 ${branch} 分支的部署...`);
      // 实际代码中调用Jenkins API
      console.log('部署已触发');
      break;
      
    default:
      console.log(`
使用方法：
  git-hooks install-hooks    安装Git钩子
  git-hooks trigger-deploy   手动触发部署
      `);
      break;
  }
}

// 执行主程序
main();
```

### 配置package.json

```json
{
  "name": "git-hooks-cli",
  "version": "1.0.0",
  "description": "CLI tool for managing Git hooks and automated deployment",
  "main": "index.js",
  "bin": {
    "git-hooks": "./index.js"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["git", "hooks", "automation", "deployment"],
  "author": "",
  "license": "ISC"
}
```

### 使用方法

```bash
# 安装CLI工具
npm link

# 安装Git钩子
git-hooks install-hooks

# 手动触发部署
git-hooks trigger-deploy
```

### Jenkins集成

要与Jenkins集成，你需要：

1. 在Jenkins中创建一个项目
2. 启用远程构建触发器，生成一个API Token
3. 在钩子脚本中使用这个Token调用Jenkins API

```bash
# Jenkins API示例
curl -X POST "https://jenkins.example.com/job/your-project/build" \
  --user "username:API_TOKEN" \
  -H "Content-Type: application/x-www-form-urlencoded"
```

### 最佳实践

1. **安全性**：不要在代码中硬编码API Token，使用环境变量或配置文件
2. **错误处理**：添加适当的错误处理和日志记录
3. **团队协作**：确保所有团队成员都安装了相同的钩子
4. **持续集成**：考虑使用GitHub Actions或GitLab CI作为替代方案