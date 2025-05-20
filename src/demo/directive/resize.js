import Vue from 'vue';

// 自定义 resize 指令
const resize = {
  inserted(el, binding) {
    console.log("🚀 ~ inserted ~ el:", el)
    // 获取绑定的回调函数
    const callback = binding.value;
    if (typeof callback !== 'function') {
      console.warn('v-resize 指令需要一个函数作为参数');
      return;
    }
    
    // 使用节流函数包装回调，设置800ms的节流时间
    const throttledCallback = throttle(callback, 800);
    
    // 保存节流后的回调函数，以便在unbind时移除
    el._resizeCallback = throttledCallback;
    
    // 添加resize事件监听
    window.addEventListener('resize', throttledCallback);
  },
  
  unbind(el) {
    // 移除resize事件监听
    if (el._resizeCallback) {
      window.removeEventListener('resize', el._resizeCallback);
      delete el._resizeCallback;
    }
  }
};

// 节流函数
function throttle(fn, delay) {
  let timer = null;
  let lastTime = 0;
  
  return function(...args) {
    const now = Date.now();
    const remaining = delay - (now - lastTime);
    
    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastTime = now;
      fn.apply(this, args);
    } else if (!timer) {
      timer = setTimeout(() => {
        lastTime = Date.now();
        timer = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}

// 注册全局指令
Vue.directive('resize', resize);

export default resize;