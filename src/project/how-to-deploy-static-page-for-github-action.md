# 如何使用GitHub Workflow部署静态网站?
在现代Web开发中，自动化部署是提高效率和保持项目稳定性的关键。`GitHub Actions`提供了一种强大的方式来自动化软件工作流，包括静态网站的部署。本文将介绍如何使用`GitHub Workflow`部署静态网站到`GitHub Pages`，并以[VitePress](https://vitepress.dev/zh/guide/what-is-vitepress)文档项目为例进行说明。

<span style="display:flex">

![github](/logos/github.svg)

<span style="flex:1 , width:50%"> </span>

![vite](/logos/vite.svg)

</span>

## 使用场景
`GitHub Pages`结合`GitHub Actions`，适合用于自动部署公开的项目和内容。这种组合特别适合开源项目的文档站点、个人或组织的博客、项目展示页等。


## Action(github workflow) 和 gh-pages(`github Pages`)
`GitHub Actions`是GitHub的持续集成和持续部署(CI/CD)工具，允许开发者在GitHub仓库中自动化构建、测试和部署他们的代码。一个Workflow是由一个或多个Actions组成的自动化过程，它们可以被触发器（如push事件）触发。
* Workflow是通过在仓库的`.github/workflows`目录中创建YAML文件来定义的。每个YAML文件代表一个Workflow，可以包含多个任务（jobs），每个任务可以包含一系列步骤（steps），步骤可以是执行脚本或使用市场上现成的Action。
* `GitHub Pages`是GitHub提供的一项服务，允许你直接从GitHub仓库托管网站。它非常适合托管静态网站，如项目文档、个人博客等。`GitHub Pages`支持从仓库的`master`分支、`gh-pages`分支或仓库中的`/docs`文件夹直接部署网站。
![github action](/overview-actions-event.webp)


## 尝试部署一套`VitePress`文档
`VitePress`是一个基于Vue和Vite的静态网站生成器，非常适合用来创建和部署项目文档。
* 如果你有一堆md文档不知道如何发布到博客系统上
* 如果你不想自己转换md到html然后做一堆TDK配置来适应SEO
* 如果你不想从零到一做一个目录管理,样式配置,资源配置等一个博客的基础工作
那么, 你可以试试 `Vitepress`
以下是使用`GitHub Actions`自动部署`VitePress`文档到`GitHub Pages`的步骤：
先看配图,下方有详细解释.
![action](/action-page-01.png)
1. **创建`VitePress`项目**：如果你还没有`VitePress`项目，可以按照[`VitePress`官方文档](https://`vitepress`.vuejs.org/)创建一个。
2. **配置GitHub Workflow**：在你的`VitePress`项目仓库中，创建`.github/workflows/deploy.yml`文件，并添加以下内容：
3. **解决默认以jekyll部署报错的问题**
`GitHub Pages` 默认使用 Jekyll 来构建和部署站点。当你推送代码到一个特定的分支（通常是 gh-pages），`GitHub Pages` 会自动尝试使用 Jekyll 来构建站点。如果你的仓库中包含了 Jekyll 的配置文件或者布局文件，`GitHub Pages` 就会认为你想要使用 Jekyll。
![action error](/action-error-for-jekyll.png)
错误信息表明 Jekyll 尝试转换一个名为 style.scss 的文件，但是在 docs 目录中没有找到这个文件。如果你的项目不是一个 Jekyll 网站，你可能需要在仓库根目录下添加一个名为 .nojekyll 的空文件，这样可以告诉 `GitHub Pages` 不要使用 Jekyll 来构建你的站点。
创建 .nojekyll 文件的步骤可以在你的 `GitHub Actions` 工作流中添加一个步骤来完成：
```yaml
- name: Disable Jekyll
run: touch docs/.nojekyll
```
![action](/action-page-02.png)
1. **推送更改**：将更改推送到GitHub仓库。
![action](/action-page-03.png)
4. **检查Actions**：在GitHub仓库的"Actions"标签页查看部署过程。
如果你不想部署Vitepress,而是部署一个已有静态网站项目，只需将其推送到GitHub仓库，并按照上述步骤配置GitHub Workflow即可实现自动部署。


## 修改CNAME进行域名绑定
如果你想将自定义域名绑定到`GitHub Pages`上，可以在`VitePress`项目的静态文件目录（通常是`public`）中添加一个`CNAME`文件，文件内容为你的自定义域名，例如：
```
www.relaxto.com
```
![action](/github-cname.png)
然后，确保你的域名DNS设置正确指向`GitHub Pages`。GitHub官方文档提供了详细的[指导](https://docs.github.com/en/pages/quickstart)。
通过上述步骤，你可以轻松地使用`GitHub Actions`自动部署静态网站到`GitHub Pages`，无论是项目文档、个人博客还是项目展示页，都可以快速实现自动化部署。


## 参考文档
- [vitepress官方文档](https://vitepress.dev/zh/)
- [github static.yml 例子](https://github.com/actions/starter-workflows/tree/main/pages)
- [github action 快速上手](https://docs.github.com/zh/actions/quickstart)
- [什么是CICD](https://opensource.com/article/18/8/what-cicd)
- [CNAME 设置](https://github.com/sunlanda/sunlanda.github.io/commit/3acfb3b785105a3d5aa901c6e77912fb75808d32)