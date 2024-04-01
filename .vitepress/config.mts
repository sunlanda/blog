import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "iver",
  srcDir: './src',
  base: '/', //  '/blog/'
  description: "一个前端博客",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo:"/logo.svg",
    nav: [
      { text: '首页', link: '/' },
      { text: '前端面经', link: '/demo/markdown-examples' },
      { text: '样式style相关', link: '/css/flex' },
    ],
    // algolia
    search: {
      provider: 'local'
    },
    aside: true, // left false
    sidebar: [
      {
        text: '样式style相关',
        collapsed:false,
        items: [
          { text: 'css', link: '/css/flex' },
          { text: 'flex', link: '/css/flex' },
        ]
      },
      {
        text: '页面性能指标',
        collapsed:false,
        items: [
          { text: '页面性能时间', link: '/performance/how-to-get-performance-target' },
        ]
      },
      // {
      //   text: 'JS基础',
      //   collapsed:false,
      //   items: [
      //     { text: 'var,let,const', link: '/markdown-examples' },
      //     { text: 'this指向', link: '/api-examples' }
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
      { icon: 'github', link: 'https://github.com/sunlanda/blog' }
    ],
  }
})
