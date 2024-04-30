import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "前端知识体系",
  srcDir: './src',
  outDir: './docs',
  // base: '/',
  base: '/blog/',
  description: "一个前端基础知识补充",
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
      {
        text: 'JS基础',
        collapsed:false,
        items: [
          { text: '序言', link: '/js/chapter1' },
          { text: '数据类型', link: '/js/javascript-type' },
          // { text: '作用域', link: '/js/let-const' },
          { text: 'this,call apply bind 区别', link: '/js/this' },
          { text: 'event事件代理', link: '/js/event' },
          { text: 'typescript快速入门', link: '/js/ts-first' },
          // { text: '函数', link: '/js/function' },
          // { text: 'ECMA规范&lt;es6-es2024&gt;', link: '/js/ecma' },
        ]
      },
      // {
      //   text: '样式style相关',
      //   collapsed:false,
      //   items: [
      //     { text: '序言', link: '/css/chapter1' },
      //     { text: 'css常见问题', link: '/css/flex' },
      //     { text: '预处理sass/less', link: '/css/flex' },
      //     { text: 'flex流行布局', link: '/css/flex' },
      //   ]
      // },
      {
        text: '工程化与团队',
        collapsed:false,
        items: [
          { text: '如何进行多git源ssh配置', link: '/project/git-gitlab-github-sshkey' },
          // { text: '预处理sass/less', link: '/engineering/flex' },
          // { text: 'flex流行布局', link: '/engineering/flex' },
        ]
      },
      {
        text: '最佳实践',
        collapsed:false,
        items: [
          // { text: '网站群公共头注入实践', link: '/performance/portal-bar' },
          { text: '如何通过github actions部署vitepress 静态网站？', link: '/project/how-to-deploy-static-page-for-github-action' },
          { text: 'iothub物模型管理OSS实践', link: '/project/nodejs-s3-oss' },
          { text: '服务器运维工具ansible的部署实践', link: '/project/rhel-ansible' },
          // { text: 'Vue & Nuxt.js对京东云官网的SSR实践', link: '/performance/nuxt-ssr' },
          // { text: '如何排查线上问题', link: '/performance/how-can-i-fix-the-bug' },
          // { text: '如何写故障报告', link: '/performance/write-bug-report' },
        ]
      },
      {
        text: '算法',
        collapsed:false,
        items: [
          { text: '如何实现一个累加函数? add(1)(2) = 3', link: '/algorithm/add-plus-add' },
        ]
      },
      {
        text: '页面性能指标',
        collapsed:false,
        items: [
          { text: '页面性能时间', link: '/performance/how-to-get-performance-target' },
          // { text: '如何进行性能优化', link: '/performance/optimization' },
        ]
      },
      // {
      //   text: '荐书',
      //   collapsed:false,
      //   items: [
      //     { text: '高级程序(红宝书)V4', link: '/books/02' },
      //     { text: '犀牛书V7', link: '/books/01' },
      //   ]
      // },
      // {
      //   text: 'Vue.js',
      //   collapsed:true,
      //   items: [
      //     { text: 'vue生命周期', link: '/markdown-examples' },
      //     { text: 'vue3新特性', link: '/api-examples' }
      //   ]
      // }
    ],
    socialLinks: [
      // { icon: 'github', link: 'https://github.com/sunlanda/blog' }
    ],
  }
})
