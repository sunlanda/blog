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
          { text: '数据类型', link: '/js/string-array-object' },
          { text: '作用域', link: '/js/effect-region' },
          { text: 'this指向', link: '/js/this' },
          { text: '函数', link: '/js/function' },
          { text: 'ECMA规范&lt;es6-es2024&gt;', link: '/js/ecma' },
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
      // {
      //   text: '工程化',
      //   collapsed:false,
      //   items: [
      //     { text: '序言', link: '/engineering/flex' },
      //     { text: '预处理sass/less', link: '/engineering/flex' },
      //     { text: 'flex流行布局', link: '/engineering/flex' },
      //   ]
      // },
      {
        text: '页面性能指标',
        collapsed:false,
        items: [
          { text: '页面性能时间', link: '/performance/how-to-get-performance-target' },
          { text: '如何进行性能优化', link: '/performance/optimization' },
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
