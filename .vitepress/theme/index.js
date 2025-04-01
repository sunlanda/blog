/*
 * @Date: 2025-04-01 14:22:34
 * @LastEditTime: 2025-04-01 14:24:15
 * @FilePath: /blog/.vitepress/theme/index.js
 * @Author: sunlanda relaxto@qq.com
 * @LastEditors: sunlanda relaxto@qq.com
 */
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'

export default {
  extends: DefaultTheme,
  // 使用注入插槽的包装组件覆盖 Layout
  Layout: Layout
}