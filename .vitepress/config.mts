/*
 * @Author: landa relaxto@qq.com
 * @Date: 2024-03-28 12:24:35
 * @LastEditors: landa relaxto@qq.com
 * @LastEditTime: 2024-03-28 12:33:14
 * @FilePath: /blog/.vitepress/config.mts
 */
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "sunlanda blog",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '前端面经', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'JS基础',
        items: [
          { text: 'var,let,const', link: '/markdown-examples' },
          { text: 'this指向', link: '/api-examples' }
        ]
      },
      {
        text: 'Vue.js',
        items: [
          { text: 'vue生命周期', link: '/markdown-examples' },
          { text: 'vue3新特性', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
