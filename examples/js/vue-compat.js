/**
 * Vue 兼容层
 * 用于在模块联邦环境中处理Vue2和Vue3的兼容性问题
 */

// 动态获取Vue实例
let Vue;

// 尝试不同的方式获取Vue实例
function getVueInstance() {
  // 已经获取过Vue实例，直接返回
  if (Vue) return Vue;
  
  try {
    // 方法1: 通过ES模块导入
    const vueModule = require('vue');
    Vue = vueModule.default || vueModule;
  } catch (e) {
    try {
      // 方法2: 通过全局变量获取
      Vue = window.Vue;
    } catch (e) {
      console.warn('无法获取Vue实例，某些功能可能无法正常工作');
      // 提供一个空对象作为fallback
      Vue = {};
    }
  }
  
  return Vue;
}

/**
 * 设置全局属性
 * 兼容Vue2的Vue.prototype和Vue3的app.config.globalProperties
 */
function setGlobalProperty(key, value) {
  const vue = getVueInstance();
  
  if (!vue) return;
  
  // Vue2
  if (vue.prototype) {
    vue.prototype[key] = value;
    return;
  }
  
  // Vue3
  if (vue.app && vue.app.config && vue.app.config.globalProperties) {
    vue.app.config.globalProperties[key] = value;
    return;
  }
  
  // 如果都不支持，尝试使用window作为fallback
  window[key] = value;
}

/**
 * 获取全局属性
 * 兼容Vue2的Vue.prototype和Vue3的app.config.globalProperties
 */
function getGlobalProperty(key) {
  const vue = getVueInstance();
  
  if (!vue) return undefined;
  
  // Vue2
  if (vue.prototype && vue.prototype[key] !== undefined) {
    return vue.prototype[key];
  }
  
  // Vue3
  if (vue.app && vue.app.config && vue.app.config.globalProperties && 
      vue.app.config.globalProperties[key] !== undefined) {
    return vue.app.config.globalProperties[key];
  }
  
  // 如果都不支持，尝试使用window作为fallback
  return window[key];
}

/**
 * 获取国际化函数
 */
function getI18nFunction() {
  const vue = getVueInstance();
  
  if (!vue) return (item) => item;
  
  if (vue.I18n && vue.I18n.t) {
    return vue.I18n.t;
  }
  
  // 尝试从全局属性中获取
  const $t = getGlobalProperty('$t');
  if (typeof $t === 'function') {
    return $t;
  }
  
  // 默认返回一个简单的函数
  return (item) => item;
}

export {
  getVueInstance,
  setGlobalProperty,
  getGlobalProperty,
  getI18nFunction
};