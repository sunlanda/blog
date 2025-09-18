import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import {VITE_BLOG_TITLE} from "../config/index.js"
// https://vitepress.dev/reference/site-config
export default withMermaid(defineConfig({
  title: VITE_BLOG_TITLE || "前端知识体系",

  srcDir: './src',
  outDir: './docs',
  // base: '/',
  base: '/blog',
  description: "一个前端基础知识补充",
  // lastUpdated:true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo:"/logo.svg",
    nav: [
      { text: '首页', link: '/' },
      { text: '关于', link: '/about/resume' },
      // { text: '前端面经', link: '/demo/markdown-examples' },
      // { text: '样式style相关', link: '/css/flex' },
    ],
    // algolia
    search: {
      provider: 'local'
    },
    aside: true, // left false
    sidebar: [
      { text: '序言', link: '/js/chapter1' },
      // {
      //   text: 'JS基础',
      //   collapsed: true,
      //   items: [
      //     { text: '数据类型', link: '/js/javascript-type' },
      //     { text: '作用域', link: '/js/let-const' },
      //     { text: 'this,call apply bind 区别', link: '/js/this' },
      //     { text: 'event事件代理', link: '/js/event' },
      //     { text: 'typescript快速入门', link: '/js/ts-first' },
      //     { text: 'ES Module模块化', link: '/js/modules' },
          
          // { text: '函数', link: '/js/function' },
          // { text: 'ECMA规范&lt;es6-es2024&gt;', link: '/js/ecma' },

          // { text: 'vue生命周期', link: '/markdown-examples' },
          // { text: 'vue3新特性', link: '/api-examples' }
          // { text: 'react.js从基础到熟练', link: '/api-examples' }
          // { text: 'ECMA规范&lt;es6-es2024&gt;', link: '/js/ecma' },
        // ]
      // },
      // {
      //   text: '样式style相关',
      //   collapsed: false,
      //   items: [
      //     { text: '序言', link: '/css/chapter1' },
      //     { text: 'css常见问题', link: '/css/flex' },
      //     { text: '预处理器postcss自定义样式函数', link: '/css/flex' },
      //     { text: 'flex流行布局', link: '/css/flex' },
      //   ]
      // },
      {
        text: '工程化与团队',
        collapsed: false,
        items: [
          { text: '开发第一款自己的脚手架cli', link: '/project/first-cli' },
          { text: '如何进行多git源ssh配置', link: '/project/git-gitlab-github-sshkey' },
          { text: '前端开发快速入门Docker', link: '/project/docker' },
          { text: '使用next.js开发一个全栈电商网站', link: '/react/next-fullstack' },
          // { text: '代码的评审中你需要知道的几个细节', link: '/project/git-flow-check' },
          // { text: '如何写一个函数库并发布npm', link: '/project/npmpublish' },
          // { text: 'webpack自定义plugin', link: '/project/webpack-plugin' },
          // { text: 'rollup快速打包组件', link: '/project/rollup-tutotal' },
          // { text: 'cjs和esmodule有什么区别', link: '/project/cjs' },
          // { text: 'RPA:一个能帮你做事的机器人', link: '/py/rpa' },
          // { text: '如何使用n8n为你搭建自动化工作流', link: '/py/n8n' },
          // { text: '预处理sass/less', link: '/engineering/flex' },
          // { text: 'flex流行布局', link: '/engineering/flex' },
        ]
      },
      {
        text: '安全',
        collapsed: false,
        items: [
          { text: '让你的网站支持HTTPS', link: '/project/https-letusencrypt' },
        ]
      },
      {
        text: '最佳实践',
        collapsed: false,
        items: [
          // { text: '网站群公共头注入实践', link: '/performance/portal-bar' },
          { text: '使用sentry私有化异常监控sentry部署', link: '/project/sentry-for-error-report' },
          { text: '如何通过github actions部署vitepress 静态网站？', link: '/project/how-to-deploy-static-page-for-github-action' },
          { text: 'node.js操作京东云云存储的文件上传下载实践', link: '/project/nodejs-s3-oss' },
          { text: '服务器运维工具ansible的部署实践', link: '/project/rhel-ansible' },
          { text: '数据大屏兼容适配方案', link: '/css/media-query' },
          // { text: '京东云国际化实践', link: '/project/portal-i18n' },
          // { text: 'Vue & Nuxt.js对京东云官网的SSR实践', link: '/performance/nuxt-ssr' },
          // { text: 'chrome插件编写', link: '/project/chrome-extension' },
          // { text: 'vscode插件编写', link: '/project/vscode-extension' },
          // { text: 'Three.js入门', link: '/project/threejs-tutoial' },
          // { text: '如何排查线上问题', link: '/performance/how-can-i-fix-the-bug' },
          // { text: '如何写故障报告', link: '/performance/write-bug-report' },
        ]
      },
      // {
      //   text: '算法 & 面试题',
      //   collapsed: false,
      //   items: [
          // { text: '累加函数 add(1)(2)=3', link: '/algorithm/add-plus-add' },
          // { text: '微任务宏任务判断执行结果', link: '/algorithm/js-promise' },
          // { text: '算法入门指引', link: '/algorithm/index' },
          // { text: '数组排序', link: '/algorithm/sort' },
          // { text: '递归引发的思考', link: '/algorithm/recurrence' },
          // { text: '动态规划', link: '/algorithm/dp' },
          // { text: '树结构', link: '/algorithm/sort' },
          // { text: '图', link: '/algorithm/sort' },
          // { text: '链表', link: '/algorithm/sort' },
      //   ]
      // },
      {
        text: '性能优化',
        collapsed: false,
        items: [
          { text: '页面性能时间', link: '/performance/how-to-get-performance-target' },
          // { text: '浏览器执行顺序', link: '/algorithm/execute-sequence' },
          { text: '性能优化的一些实践分享', link: '/performance/optimization' },
        ]
      },
      // {
      //   text: '荐书',
      //   collapsed: false,
      //   items: [
      //     { text: '高级程序(红宝书)V4', link: '/books/02' },
      //     { text: '犀牛书V7', link: '/books/01' },
      //   ]
      // },
    ],
    socialLinks: [
      // { icon: 'github', link: 'https://github.com/sunlanda/blog' }
    ],
  },

  // Mermaid 配置选项
  mermaid: {
    // 可选：自定义 Mermaid 配置
    theme: 'default',
  },
  // 可选：插件自身的配置
  mermaidPlugin: {
    class: "mermaid", // 可以设置额外的 CSS 类
  },
  vite: {
    // 添加依赖优化
    optimizeDeps: {
      include: ['dayjs', 'moment', '@braintree/sanitize-url']
    },
    // 添加别名配置
    resolve: {
      alias: {
        'moment-mini': 'moment'
      }
    }
  }
  // resolve:{
  //   alias:{
  //     "@":"/src"
  //   }
  // }
}))
