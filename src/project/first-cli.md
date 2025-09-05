# 开发第一款自己的脚手架CLI

我们日常工作中经常使用到脚本如: `node server.js`, `npm run dev`, npx create XXX等命令，有没有考虑自己做一个工具来解放日常中需要频繁手动操作的动作呢？今天这篇文章就从从零到一实现命令行的角度讲一下如何开发一个自己的CLI工具。

通过本文，你将学习到：

1. 什么是CLI工具以及它的基本原理
2. 如何创建一个简单的命令行工具
3. 如何使用交互式命令行提升用户体验
4. 如何开发实用的图片压缩CLI工具
5. 如何结合Git钩子实现自动化流程

让我们通过几个循序渐进的关卡来掌握CLI开发技巧！


## 首先明确背景

CLI全称是Command Line Interface（命令行界面），它是一种通过文本命令与计算机交互的方式。在前端开发领域，CLI工具的出现极大地提高了开发效率，比如Vue CLI、Create React App等。
现代CLI工具主要是基于Node.js环境开发的，它利用了Node.js跨平台的特性，使得同一个CLI工具可以在不同的操作系统上运行。可以理解shell脚本也是CLI的一种形式。
在Node.js环境中，我们可以通过以下方式创建一个可执行的CLI脚本：


开发CLI工具的关键点：

1. **基础结构**：使用Node.js的`#!/usr/bin/env node`和package.json的bin字段,来让命令行知道执行哪个脚本
2. **用户体验**：提供交互式界面和清晰的帮助信息
3. **功能实现**：利用现有库和API简化开发
4. **发布分享**：通过npm发布，让更多人受益
5. **自动化集成**：结合Git钩子和CI/CD工具实现自动化流程

> 好,废话不多说,咱们直接开始第一关 !

## 第一关：创建一个简单的CLI工具

我们先实现一个简单的CLI工具，它的功能是在命令行中输入 `hello` 后，打印 `hello world`。然后我们加点难度，使用cowsay库打印一头ASCII艺术风格的牛。

### 步骤1：初始化项目

```bash
# 创建项目目录
mkdir hello-cli
cd hello-cli

# 初始化package.json
npm init -y
```

### 步骤2：创建入口文件

```js
// index.js
#!/usr/bin/env node

/**
 * 简单的CLI工具入口文件
 * #!/usr/bin/env node 这一行称为shebang，它告诉系统使用node来执行这个文件
 */
console.log('Hello World!');
```

### 步骤3：配置package.json

```json
{
  "name": "hello-cli",
  "version": "1.0.0",
  "description": "A simple CLI tool",
  "main": "index.js",
  "bin": {
    "hello": "./index.js" // 这里的hello 就是未来你执行脚本的命令
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["cli"],
  "author": "",
  "license": "ISC"
}
```

这里的关键是`bin`字段，它定义了命令名称到文件路径的映射。当我们全局安装这个包时，npm会创建一个名为`hello`的命令，执行时会运行`index.js`文件。

### 步骤4：本地测试

```bash
# 在项目目录下执行，将当前包链接到全局
npm link

# 现在可以在任何地方使用hello命令
hello
```

### 步骤5：添加cowsay功能

现在让我们使用cowsay库来打印一头ASCII艺术风格的牛,这个不是我原创,有个库就可以直接使用的,咱们小小的模仿它一把：

```js
// index.js
#!/usr/bin/env node

/**
 * 使用cowsay库的CLI工具
 * @see https://opensource.com/article/18/12/linux-toy-cowsay
 */

// 如果安装了cowsay库，可以直接使用
// const cowsay = require('cowsay');

// 为了演示，我们直接内置一个简单版本的cowsay功能
function simpleCowsay(text) {
  const line = '-'.repeat(text.length + 2);
  return `
   ${'_'.repeat(text.length + 2)}
  < ${text} >
   ${'-'.repeat(text.length + 2)}
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
  `;
}

console.log(simpleCowsay('Hello World!'));
```

执行`hello`命令，你会看到一头可爱的ASCII牛说"Hello World!"：

```
   ______________
  < Hello World! >
   --------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

如果你想使用完整的cowsay库，可以安装并使用它：

```bash
npm install cowsay
```

```js
// 使用cowsay库的版本
#!/usr/bin/env node
const cowsay = require('cowsay');

console.log(cowsay.say({
  text: 'Hello World!',
  e: 'oo',  // 眼睛
  T: 'U '   // 舌头
}));
```

参考：https://opensource.com/article/18/12/linux-toy-cowsay

到这里,你应该明白了hello命令行和cowsay讲了两个东西,一个是暴露一个公共脚本(link)给用户执行用,一个是直接执行一个脚本,有没有办法让奶牛是固定的,但是奶牛说的话我可以自定义呢? 咱们往下看.

## 第二关：交互式环境切换CLI

在实际开发中，我们经常需要在不同的环境之间切换，比如：

```bash
npm run dev:aaa
npm run dev:bbb
npm run dev:ccc
```

每次都要记住并输入完整的命令很麻烦。现在我们要实现一个脚本，在命令行中输入 `dev` 后，提供一个交互式界面让用户选择要启动的环境，然后自动执行对应的命令。

### 步骤1：创建新项目

```bash
mkdir dev-cli
cd dev-cli
npm init -y
```

### 步骤2：安装依赖

我们将使用两个流行的库：
- `commander`：用于解析命令行参数
- `inquirer`：用于创建交互式命令行界面

```bash
# 如果要安装依赖，可以执行：
# npm install commander inquirer
```

### 步骤3：创建入口文件

```js
// index.js
#!/usr/bin/env node

/**
 * 交互式环境切换CLI工具
 * 使用commander处理命令行参数，inquirer提供交互式选择界面
 */

// 如果已安装依赖，可以解除下面的注释
// const { program } = require('commander');
// const inquirer = require('inquirer');
const { spawn } = require('child_process');

// 模拟commander和inquirer的基本功能，实际使用时请安装这些依赖
const program = {
  version: (v) => ({ description: (d) => ({ action: (fn) => fn() }) }),
  parse: () => {}
};

const inquirer = {
  prompt: async (questions) => {
    // 在实际代码中，这里会显示交互式界面
    console.log('请选择要启动的环境：');
    console.log('1. dev:aaa');
    console.log('2. dev:bbb');
    console.log('3. dev:ccc');
    
    // 模拟用户选择了第一个选项
    return { environment: 'dev:aaa' };
  }
};

/**
 * 执行npm脚本的函数
 * @param {string} script - 要执行的npm脚本名称
 */
function runScript(script) {
  console.log(`正在启动 npm run ${script}...`);
  
  // 创建子进程执行npm命令
  const child = spawn('npm', ['run', script], {
    stdio: 'inherit', // 将子进程的输入输出流连接到父进程
    shell: true
  });
  
  // 监听子进程退出事件
  child.on('close', (code) => {
    if (code !== 0) {
      console.log(`npm run ${script} 执行失败，退出码: ${code}`);
    }
  });
}

// 主程序
program
  .version('1.0.0')
  .description('交互式环境切换CLI工具')
  .action(async () => {
    try {
      // 提供环境选择
      const environments = ['dev:aaa', 'dev:bbb', 'dev:ccc'];
      
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'environment',
          message: '请选择要启动的环境:',
          choices: environments
        }
      ]);
      
      // 执行选择的环境对应的npm脚本
      runScript(answers.environment);
    } catch (error) {
      console.error('发生错误:', error);
    }
  });

program.parse(process.argv);
```

### 步骤4：配置package.json

```json
{
  "name": "dev-cli",
  "version": "1.0.0",
  "description": "Interactive environment switcher",
  "main": "index.js",
  "bin": {
    "dev": "./index.js"
  },
  "scripts": {
    "dev:aaa": "echo \"Starting development environment AAA\"",
    "dev:bbb": "echo \"Starting development environment BBB\"",
    "dev:ccc": "echo \"Starting development environment CCC\""
  },
  "keywords": ["cli", "dev"],
  "author": "",
  "license": "ISC"
}
```

### 步骤5：本地测试

```bash
npm link
dev
```

执行`dev`命令后，你会看到一个交互式菜单，可以选择要启动的环境。选择后，CLI会自动执行对应的npm脚本。
到这里,你应该明白了加入交互式输入的意义了对吧,既然能下拉选择,是不是就可以允许用户输入任何字符呢? 

### 进阶功能

咱们接着增强这个CLI工具：

1. 添加命令行参数，直接指定环境：`dev --env=aaa`
2. 记住上次选择，下次默认选中
3. 支持自定义配置文件，动态加载可用环境

```js
// 示例：添加直接指定环境的功能
program
  .version('1.0.0')
  .description('交互式环境切换CLI工具')
  .option('-e, --env <environment>', '直接指定要启动的环境')
  .action(async (options) => {
    try {
      const environments = ['dev:aaa', 'dev:bbb', 'dev:ccc'];
      
      // 如果通过命令行参数指定了环境
      if (options.env) {
        const scriptName = `dev:${options.env}`;
        if (environments.includes(scriptName)) {
          runScript(scriptName);
          return;
        } else {
          console.warn(`环境 ${options.env} 不存在，请从列表中选择`);
        }
      }
      
      // 否则提供交互式选择
      const answers = await inquirer.prompt([/* ... */]);
      runScript(answers.environment);
    } catch (error) {
      console.error('发生错误:', error);
    }
  });
```
到这里,你就完成了一个完整的切换环境的CLI工具,用户可以通过命令行参数指定环境,也可以通过交互式选择环境,还可以记住上次选择的环境,下次默认选中.不到100行代码,是不是很简单? 

## 第三关：图片压缩CLI工具

在前端开发中，图片优化是提升网站性能的重要一环。现在我们要基于TinyPNG API实现一个本地图片压缩工具，提供以下功能：

1. 压缩当前目录下的所有图片或指定图片
2. 选择图片压缩质量（有范围）
3. 选择压缩后的图片输出目录

### 步骤1：创建项目

```bash
mkdir img-compressor
cd img-compressor
npm init -y
```

### 步骤2：安装依赖

我们需要以下依赖：
- `tinify`：TinyPNG的官方Node.js客户端
- `commander`：处理命令行参数
- `inquirer`：交互式命令行界面
- `glob`：文件匹配模式
- `chalk`：命令行输出着色

```bash
# 如果要安装依赖，可以执行：
# npm install tinify commander inquirer glob chalk
```

### 步骤3：创建入口文件

```js
// index.js
#!/usr/bin/env node

/**
 * 图片压缩CLI工具
 * 基于TinyPNG API实现图片压缩功能
 * 提供交互式选项配置压缩参数
 */

// 模拟依赖，实际使用时请安装这些依赖
const fs = require('fs');
const path = require('path');
// const tinify = require('tinify');
// const { program } = require('commander');
// const inquirer = require('inquirer');
// const glob = require('glob');
// const chalk = require('chalk');

// 模拟chalk的颜色输出
const chalk = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`
};

/**
 * 获取图片文件列表
 * @param {string} pattern - 文件匹配模式
 * @returns {Promise<string[]>} - 匹配的文件路径列表
 */
async function getImageFiles(pattern) {
  // 实际代码中使用glob包
  console.log(`查找匹配 ${pattern} 的图片文件...`);
  // 模拟返回一些图片文件
  return [
    'image1.png',
    'image2.jpg',
    'subfolder/image3.png'
  ];
}

/**
 * 压缩单个图片
 * @param {string} inputPath - 输入图片路径
 * @param {string} outputPath - 输出图片路径
 * @param {number} quality - 压缩质量 (0-100)
 * @returns {Promise<void>}
 */
async function compressImage(inputPath, outputPath, quality) {
  console.log(chalk.blue(`压缩图片: ${inputPath} -> ${outputPath} (质量: ${quality})`));
  
  // 确保输出目录存在
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // 实际代码中使用tinify API , key请登录网站自行获取
  // tinify.key = 'YOUR_API_KEY';
  // const source = tinify.fromFile(inputPath);
  // const compressed = source.resize({
  //   method: "scale",
  //   quality: quality / 100
  // });
  // return compressed.toFile(outputPath);
  
  // 模拟压缩过程
  console.log(chalk.green(`✓ 成功压缩 ${inputPath}`));
  console.log(`  原始大小: ${Math.floor(Math.random() * 1000) + 500}KB`);
  console.log(`  压缩后: ${Math.floor(Math.random() * 300) + 100}KB`);
  console.log(`  节省: ${Math.floor(Math.random() * 70) + 30}%`);
}

/**
 * 主程序
 */
async function main() {
  // 模拟commander和inquirer
  const program = {
    version: () => program,
    description: () => program,
    option: () => program,
    parse: () => {},
    opts: () => ({})
  };
  
  const inquirer = {
    prompt: async () => ({
      imageSource: 'all',
      quality: 80,
      outputDir: './compressed'
    })
  };
  
  program
    .version('1.0.0')
    .description('图片压缩CLI工具')
    .option('-s, --source <source>', '图片源 (all|path)', 'all')
    .option('-q, --quality <quality>', '压缩质量 (1-100)', '80')
    .option('-o, --output <output>', '输出目录', './compressed')
    .parse(process.argv);
  
  const options = program.opts();
  
  // 如果没有通过命令行参数指定选项，则使用交互式界面
  if (!options.source || !options.quality || !options.output) {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'imageSource',
        message: '要压缩哪些图片?',
        choices: [
          { name: '当前目录下所有图片', value: 'all' },
          { name: '指定图片', value: 'specific' }
        ],
        default: 'all'
      },
      {
        type: 'input',
        name: 'specificPath',
        message: '输入图片路径 (支持glob模式，如 *.png):',
        when: (answers) => answers.imageSource === 'specific'
      },
      {
        type: 'number',
        name: 'quality',
        message: '压缩质量 (1-100):',
        default: 80,
        validate: (value) => {
          const valid = !isNaN(parseInt(value)) && value >= 1 && value <= 100;
          return valid || '请输入1到100之间的数字';
        }
      },
      {
        type: 'input',
        name: 'outputDir',
        message: '压缩后的图片输出目录:',
        default: './compressed'
      }
    ]);
    
    // 合并交互式选项和命令行选项
    Object.assign(options, answers);
  }
  
  try {
    // 确定要处理的图片文件
    let imageFiles;
    if (options.imageSource === 'all' || options.source === 'all') {
      imageFiles = await getImageFiles('**/*.{png,jpg,jpeg}');
    } else {
      const pattern = options.specificPath || options.source;
      imageFiles = await getImageFiles(pattern);
    }
    
    if (imageFiles.length === 0) {
      console.log(chalk.yellow('没有找到匹配的图片文件'));
      return;
    }
    
    console.log(chalk.blue(`找到 ${imageFiles.length} 个图片文件`));
    
    // 压缩质量
    const quality = parseInt(options.quality);
    
    // 输出目录
    const outputDir = options.outputDir || options.output;
    
    // 处理每个图片文件
    for (const file of imageFiles) {
      const outputPath = path.join(outputDir, file);
      await compressImage(file, outputPath, quality);
    }
    
    console.log(chalk.green('\n✓ 所有图片压缩完成!'));
  } catch (error) {
    console.error(chalk.red('压缩过程中发生错误:'), error);
    process.exit(1);
  }
}

// 执行主程序
main().catch(console.error);
```

### 步骤4：配置package.json

```json
{
  "name": "img-compressor",
  "version": "1.0.0",
  "description": "CLI tool for compressing images",
  "main": "index.js",
  "bin": {
    "compress-img": "./index.js"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["cli", "image", "compression", "tinypng"],
  "author": "",
  "license": "ISC"
}
```

### 步骤5：本地测试

```bash
npm link
compress-img
```

执行`compress-img`命令后，你会看到交互式界面，可以选择压缩选项。

### 注意事项

1. 实际使用时，你需要注册TinyPNG API并获取API密钥 
2. TinyPNG API有免费使用限制，每月可压缩500张图片 (咱们测试使用足够了)



## 发布你的CLI工具

开发完成后，我们可以将CLI工具发布到npm仓库，让其他人也能使用。

### 步骤1：准备发布

在发布前，确保你的`package.json`文件配置正确：

```json
{
  "name": "your-cli-tool-name",  // 确保这个名称在npm上是唯一的
  "version": "1.0.0",          // 遵循语义化版本规范
  "description": "Your CLI tool description",
  "main": "index.js",
  "bin": {
    "command-name": "./index.js"  // 用户安装后可以使用的命令名,核心中的核心
  },
  "files": [                    // 指定要发布的文件
    "index.js",
    "lib/**/*"
  ],
  "keywords": ["cli", "tool"],  // 帮助用户搜索到你的包
  "author": "Your Name",
  "license": "MIT",            // 选择一个合适的开源许可证
  "repository": {
    "type": "git",
    "url": "https://github.com/sunlanda/your-cli-tool.git"
  },
  "bugs": {
    "url": "https://github.com/sunlanda/your-cli-tool/issues"
  },
  "homepage": "https://github.com/sunlanda/your-cli-tool#readme"
}
```

`files`字段非常重要，它指定了哪些文件会被发布到npm仓库。如果不指定，npm会使用`.npmignore`文件或`.gitignore`文件来决定哪些文件不发布。

### 步骤2：创建README.md

一个好的README文件对于用户了解和使用你的工具至关重要：

```markdown
# Your CLI Tool Name

简短描述你的CLI工具的功能和用途。譬如奶牛打招呼,版本管理工具,图片压缩等等

## 安装

```bash
npm install -g your-cli-tool-name
```

## 使用方法

```bash
command-name [options]
```

### 选项

- `-v, --version`: 显示版本号
- `-h, --help`: 显示帮助信息
- 其他选项...

## 示例

```bash
command-name --option value
```

## 许可证

MIT
```

### 步骤3：登录并发布

```bash
# 登录到npm
npm login

# 发布包
npm publish
```

如果你是第一次发布包，可能需要先创建npm账号：(npmjs doc)[https://www.npmjs.com/signup]

### 步骤4：更新版本

当你需要更新CLI工具时，遵循语义化版本规范修改版本号：

```bash
# 修改package.json中的version字段，或使用npm命令
npm version patch  # 修复bug (1.0.0 -> 1.0.1)
npm version minor  # 新增功能 (1.0.0 -> 1.1.0)
npm version major  # 不兼容的API变更 (1.0.0 -> 2.0.0)

# 发布新版本
npm publish
```


## 参考
* (npmjs)[https://www.npmjs.com/signup]
* (cowsay)[https://opensource.com/article/18/12/linux-toy-cowsay]
* (commander)[https://www.npmjs.com/package/commander] (nodejs 命令行工具)
* (inquirer)[https://www.npmjs.com/package/inquirer] (nodejs 交互式命令行工具)
* (tinify)[https://www.npmjs.com/package/tinify] (nodejs tinify库)
* (chalk)[https://www.npmjs.com/package/chalk] (nodejs 终端颜色库)
