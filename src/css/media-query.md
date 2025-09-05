# 如何让你的数据大屏根据缩放和宽高自动缩放? 
这种经常称呼为自适应, 就是页面内容宽高根据屏幕大小自动缩放,字体,图片,位置都是较为合适的展示方式.

## 为什么要做好大屏缩放？

在数据可视化大屏项目中，缩放适配是一个非常关键的问题，做好大屏缩放有以下几个重要原因：

1. **设计与实际展示环境的差异**：大屏项目通常按照特定分辨率（如1920×1080）进行设计，但实际展示环境可能使用不同尺寸和分辨率的显示设备。

2. **多终端适配需求**：同一个大屏项目可能需要在会议室大屏、个人电脑、平板等不同设备上展示，屏幕尺寸和比例各不相同。

3. **浏览器窗口调整**：用户可能会调整浏览器窗口大小，或在不同尺寸的显示器之间切换。

4. **全屏与非全屏模式切换**：用户在使用过程中可能会在全屏和窗口模式之间切换，需要保持一致的视觉体验。

5. **内容完整性保证**：无论在什么尺寸下，都需要确保关键数据和图表完整展示，不被截断或变形。

6. **专业性体现**：良好的缩放适配是数据大屏专业性的体现，能提升用户体验和项目质量。

7. **避免滚动条**：数据大屏通常需要一屏展示所有内容，避免出现滚动条影响整体视觉效果。

8. **保持设计的视觉比例**：确保设计师精心设计的视觉效果在不同尺寸下依然保持原有的美感和比例。

## 解决方案

### 1. 使用视口媒体查询（Media Query）适配不同尺寸

媒体查询可以针对不同屏幕尺寸设置不同的样式，常见的断点有768px、1200px、1680px、1920px等，搭配百分比布局实现响应式设计。

```css
/* 基础样式 - 适用于所有尺寸 */
.dashboard-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-wrap: wrap;
}

.chart-item {
  width: 25%; /* 默认四等分 */
  height: 300px;
  padding: 10px;
  box-sizing: border-box;
}

/* 小屏幕设备 - 平板 */
@media screen and (max-width: 768px) {
  .chart-item {
    width: 50%; /* 二等分 */
    height: 250px;
  }
  
  .dashboard-title {
    font-size: 20px;
  }
}

/* 中等屏幕设备 - 小型笔记本 */
@media screen and (min-width: 769px) and (max-width: 1200px) {
  .chart-item {
    width: 33.33%; /* 三等分 */
  }
  
  .dashboard-title {
    font-size: 24px;
  }
}

/* 大屏幕设备 - 标准显示器 */
@media screen and (min-width: 1201px) and (max-width: 1680px) {
  .chart-item {
    width: 25%; /* 四等分 */
  }
  
  .dashboard-title {
    font-size: 28px;
  }
}

/* 超大屏幕设备 - 大型显示器或投影 */
@media screen and (min-width: 1681px) {
  .chart-item {
    width: 20%; /* 五等分 */
  }
  
  .dashboard-title {
    font-size: 32px;
  }
}
```

### 2. Scale缩放方案（最常用）

Transform scale方案是大屏项目中最常用的缩放方案，它通过CSS的transform属性对整个容器进行等比例缩放，保持设计稿的原始比例。

```js
// 基于设计稿尺寸等比例缩放（假设设计稿是1920×1080）
function setScale() {
  // 获取容器DOM
  const dashboard = document.getElementById('dashboard');
  
  // 设计稿尺寸
  const designWidth = 1920;
  const designHeight = 1080;
  
  // 当前窗口尺寸
  const windowWidth = document.documentElement.clientWidth || document.body.clientWidth;
  const windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
  
  // 计算缩放比例
  const widthScale = windowWidth / designWidth;
  const heightScale = windowHeight / designHeight;
  
  // 取最小的缩放比，确保内容完全展示
  const scale = Math.min(widthScale, heightScale);
  
  // 设置缩放和居中
  dashboard.style.transform = `scale(${scale})`;
  dashboard.style.transformOrigin = 'left top';
  
  // 计算居中位置
  if (widthScale > heightScale) {
    // 高度撑满，宽度居中
    const marginLeft = (windowWidth - designWidth * scale) / 2;
    dashboard.style.marginLeft = `${marginLeft}px`;
    dashboard.style.marginTop = '0px';
  } else {
    // 宽度撑满，高度居中
    const marginTop = (windowHeight - designHeight * scale) / 2;
    dashboard.style.marginLeft = '0px';
    dashboard.style.marginTop = `${marginTop}px`;
  }
  
  // 设置容器原始尺寸
  dashboard.style.width = `${designWidth}px`;
  dashboard.style.height = `${designHeight}px`;
}

// 初始化时调用
setScale();

// 监听窗口大小变化
window.addEventListener('resize', setScale);
```

### 3. 百分比流式布局

使用百分比定义元素尺寸，使其能够根据父容器大小自动调整。

```css
.dashboard-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header-section {
  height: 10%;
  width: 100%;
}

.main-content {
  height: 80%;
  width: 100%;
  display: flex;
}

.left-panel {
  width: 30%;
  height: 100%;
}

.center-panel {
  width: 40%;
  height: 100%;
}

.right-panel {
  width: 30%;
  height: 100%;
}

.footer-section {
  height: 10%;
  width: 100%;
}
```

### 4. 监听窗口宽高变化

因为用户可能会拖动窗口大小，所以需要监听窗口宽高变化，及时更新页面内容。

```js
// Vue组件中的实现
export default {
  data() {
    return {
      screenWidth: 0,
      screenHeight: 0,
      scale: 1
    }
  },
  mounted() {
    // 初始化尺寸
    this.initSize();
    
    // 监听窗口大小变化
    window.addEventListener('resize', this.handleResize);
    
    // 组件销毁时移除监听
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('resize', this.handleResize);
    });
  },
  methods: {
    initSize() {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      this.calculateScale();
    },
    handleResize() {
      // 使用防抖函数优化性能
      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer);
      }
      
      this.resizeTimer = setTimeout(() => {
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        this.calculateScale();
      }, 100);
    },
    calculateScale() {
      // 计算缩放比例的逻辑
      const baseWidth = 1920; // 设计稿宽度
      const baseHeight = 1080; // 设计稿高度
      
      const widthScale = this.screenWidth / baseWidth;
      const heightScale = this.screenHeight / baseHeight;
      
      // 取最小的缩放比例，确保内容完全展示
      this.scale = Math.min(widthScale, heightScale);
      
      // 应用缩放
      this.applyScale();
    },
    applyScale() {
      const dashboard = this.$refs.dashboard;
      if (!dashboard) return;
      
      dashboard.style.transform = `scale(${this.scale})`;
      dashboard.style.transformOrigin = 'left top';
      
      // 计算并应用居中位置
      // ...
    }
  }
}
```

### 5. 监听浏览器缩放比例变化

浏览器的缩放比例(devicePixelRatio)变化也会影响大屏的显示效果，需要进行监听和处理。

```js
// 监听浏览器缩放比例变化
function listenForZoomChanges() {
  // 存储初始缩放比例
  let lastPixelRatio = window.devicePixelRatio;
  
  // 创建媒体查询列表来检测缩放变化
  const mediaQueryList = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
  
  // 监听媒体查询变化
  mediaQueryList.addEventListener('change', () => {
    // 如果缩放比例发生变化
    if (window.devicePixelRatio !== lastPixelRatio) {
      // 更新存储的缩放比例
      lastPixelRatio = window.devicePixelRatio;
      
      // 调整大屏显示
      adjustDashboardForZoom();
    }
  });
}

// 根据浏览器缩放调整大屏
function adjustDashboardForZoom() {
  const zoomFactor = window.devicePixelRatio;
  console.log(`浏览器缩放比例变为: ${zoomFactor}`);
  
  // 根据缩放比例调整大屏元素
  // 例如，可以反向调整某些元素大小，以抵消浏览器缩放的影响
  const dashboard = document.getElementById('dashboard');
  
  // 如果浏览器放大，我们可以适当缩小元素
  // 如果浏览器缩小，我们可以适当放大元素
  const compensationScale = 1 / zoomFactor;
  
  // 应用补偿缩放，但需要与原有缩放方案结合考虑
  // ...
  
  // 重新计算和应用主缩放方案
  setScale();
}

// 初始化时调用
listenForZoomChanges();
```

### 6. 路由跳转时的缩放处理

在单页应用中，路由跳转后也需要重新计算和应用缩放。

```js
// 在Vue Router的全局导航守卫中处理
router.afterEach((to, from) => {
  // 如果跳转到大屏相关页面
  if (to.meta.isDashboard) {
    // 等待DOM更新后再计算缩放
    Vue.nextTick(() => {
      // 重新计算和应用缩放
      setScale();
    });
  }
});

// 或者在组件内监听路由变化
export default {
  watch: {
    '$route'(to, from) {
      // 路由变化后重新计算缩放
      this.$nextTick(() => {
        this.calculateScale();
      });
    }
  }
}
```

## 实现案例：完整的大屏自适应方案

下面提供几个实际案例，展示如何在不同场景下实现大屏的自适应缩放。

### 案例1：完整的大屏自适应容器组件

这个案例提供了一个完整的大屏容器组件，集成了所有缩放适配功能，包括：

1. 基于设计稿尺寸的等比例缩放
2. 窗口大小变化监听
3. 浏览器缩放监听
4. 路由变化监听
5. 全屏切换支持

```vue
<!-- DashboardContainer.vue -->
<template>
  <div class="dashboard-wrapper" ref="wrapper">
    <!-- 缩放容器 -->
    <div 
      class="dashboard-container" 
      ref="container"
      :style="containerStyle"
    >
      <!-- 大屏内容插槽 -->
      <slot></slot>
      
      <!-- 全屏按钮 -->
      <div class="fullscreen-btn" @click="toggleFullScreen">
        <i :class="isFullScreen ? 'exit-fullscreen-icon' : 'fullscreen-icon'"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardContainer',
  props: {
    // 设计稿宽度
    designWidth: {
      type: Number,
      default: 1920
    },
    // 设计稿高度
    designHeight: {
      type: Number,
      default: 1080
    },
    // 是否保持原始比例
    keepRatio: {
      type: Boolean,
      default: true
    },
    // 背景颜色
    backgroundColor: {
      type: String,
      default: '#151a26'
    }
  },
  data() {
    return {
      // 缩放比例
      scale: 1,
      // 容器宽度
      wrapperWidth: 0,
      // 容器高度
      wrapperHeight: 0,
      // 左边距
      marginLeft: 0,
      // 上边距
      marginTop: 0,
      // 是否全屏
      isFullScreen: false,
      // 浏览器缩放比例
      browserZoom: 1,
      // 防抖定时器
      resizeTimer: null,
      // 媒体查询列表
      mediaQueryList: null,
      // 缩放变化处理函数
      zoomChangeHandler: null,
      // 上次浏览器缩放比例
      lastPixelRatio: window.devicePixelRatio
    };
  },
  computed: {
    // 容器样式
    containerStyle() {
      return {
        width: `${this.designWidth}px`,
        height: `${this.designHeight}px`,
        transform: `scale(${this.scale})`,
        transformOrigin: 'left top',
        marginLeft: `${this.marginLeft}px`,
        marginTop: `${this.marginTop}px`,
        backgroundColor: this.backgroundColor
      };
    }
  },
  mounted() {
    // 初始化
    this.initSize();
    
    // 监听窗口大小变化
    window.addEventListener('resize', this.handleResize);
    
    // 监听浏览器缩放
    this.listenForZoomChanges();
    
    // 监听路由变化
    this.$router && this.$watch('$route', () => {
      this.$nextTick(() => {
        this.calculateScale();
      });
    });
    
    // 监听全屏变化
    document.addEventListener('fullscreenchange', this.handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', this.handleFullScreenChange);
    document.addEventListener('mozfullscreenchange', this.handleFullScreenChange);
    document.addEventListener('MSFullscreenChange', this.handleFullScreenChange);
  },
  methods: {
    // 初始化尺寸
    initSize() {
      this.browserZoom = window.devicePixelRatio;
      this.updateWrapperSize();
      this.calculateScale();
    },
    
    // 更新容器尺寸
    updateWrapperSize() {
      const wrapper = this.$refs.wrapper;
      if (!wrapper) return;
      
      this.wrapperWidth = wrapper.clientWidth;
      this.wrapperHeight = wrapper.clientHeight;
    },
    
    // 计算缩放比例
    calculateScale() {
      if (!this.$refs.wrapper) return;
      
      // 更新容器尺寸
      this.updateWrapperSize();
      
      // 计算宽高比例
      const widthScale = this.wrapperWidth / this.designWidth;
      const heightScale = this.wrapperHeight / this.designHeight;
      
      if (this.keepRatio) {
        // 保持原始比例，取最小值
        this.scale = Math.min(widthScale, heightScale);
        
        // 计算居中位置
        this.marginLeft = (this.wrapperWidth - this.designWidth * this.scale) / 2;
        this.marginTop = (this.wrapperHeight - this.designHeight * this.scale) / 2;
      } else {
        // 不保持原始比例，拉伸填满
        this.scale = 1;
        this.marginLeft = 0;
        this.marginTop = 0;
        
        // 直接设置容器大小
        const container = this.$refs.container;
        if (container) {
          container.style.width = `${this.wrapperWidth}px`;
          container.style.height = `${this.wrapperHeight}px`;
        }
      }
      
      // 发出缩放变化事件
      this.$emit('scale-change', this.scale);
    },
    
    // 处理窗口大小变化（带防抖）
    handleResize() {
      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer);
      }
      
      this.resizeTimer = setTimeout(() => {
        this.calculateScale();
      }, 100);
    },
    
    // 监听浏览器缩放比例变化
    listenForZoomChanges() {
      // 创建媒体查询列表来检测缩放变化
      const mediaQueryList = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      this.mediaQueryList = mediaQueryList;
      
      // 监听媒体查询变化
      const zoomChangeHandler = () => {
        // 如果缩放比例发生变化
        if (window.devicePixelRatio !== this.lastPixelRatio) {
          // 更新存储的缩放比例
          this.lastPixelRatio = window.devicePixelRatio;
          this.browserZoom = window.devicePixelRatio;
          
          // 重新计算缩放
          this.calculateScale();
        }
      };
      
      this.zoomChangeHandler = zoomChangeHandler;
      mediaQueryList.addEventListener('change', zoomChangeHandler);
    },
    
    // 切换全屏
    toggleFullScreen() {
      if (!this.isFullScreen) {
        // 进入全屏
        const wrapper = this.$refs.wrapper;
        if (wrapper.requestFullscreen) {
          wrapper.requestFullscreen();
        } else if (wrapper.webkitRequestFullscreen) {
          wrapper.webkitRequestFullscreen();
        } else if (wrapper.mozRequestFullScreen) {
          wrapper.mozRequestFullScreen();
        } else if (wrapper.msRequestFullscreen) {
          wrapper.msRequestFullscreen();
        }
      } else {
        // 退出全屏
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    },
    
    // 处理全屏变化
    handleFullScreenChange() {
      this.isFullScreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      
      // 全屏状态变化后重新计算缩放
      this.$nextTick(() => {
        this.calculateScale();
      });
    }
  },
  beforeDestroy() {
    // 清理事件监听
    window.removeEventListener('resize', this.handleResize);
    
    if (this.mediaQueryList && this.zoomChangeHandler) {
      this.mediaQueryList.removeEventListener('change', this.zoomChangeHandler);
    }
    
    document.removeEventListener('fullscreenchange', this.handleFullScreenChange);
    document.removeEventListener('webkitfullscreenchange', this.handleFullScreenChange);
    document.removeEventListener('mozfullscreenchange', this.handleFullScreenChange);
    document.removeEventListener('MSFullscreenChange', this.handleFullScreenChange);
    
    // 清理定时器
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
  }
};
</script>

<style scoped>
.dashboard-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: #0a0c10;
}

.dashboard-container {
  position: absolute;
  transform-origin: left top;
  transition: transform 0.3s ease-in-out;
}

.fullscreen-btn {
  position: absolute;
  right: 20px;
  top: 20px;
  width: 40px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s;
}

.fullscreen-btn:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.fullscreen-icon,
.exit-fullscreen-icon {
  width: 20px;
  height: 20px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.fullscreen-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>');
}

.exit-fullscreen-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>');
}
</style>
```

### 案例2：iframe嵌入式大屏组件（增强版）

这个案例展示了如何通过iframe嵌入第三方大屏（如Datart），并处理其宽高适配，同时增加了浏览器缩放监听功能。

```vue
<!-- EnhancedBiReport.vue -->
<template>
  <div class="content">
    <!-- loading遮罩 -->
    <div id="mask" class="mask" v-if="maskShow || !iframeShow">
      <a-spin size="large" :spinning="true" class="spin"></a-spin>
    </div>
    <!-- 加载大屏 -->
    <div v-if="!maskShow">
      <iframe
        v-show="iframeShow"
        :src="src"
        frameborder="0"
        :width="frameWidth"
        :height="frameHeight"
        @load="onIframeLoad"
      ></iframe>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    width: {
      type: Number,
      default: 1200,
    },
    height: {
      type: Number,
      default: 800,
    },
    // 大屏编码
    code: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      maskShow: true,
      iframeShow: false,
      src: "",
      frameWidth: 1200,
      frameHeight: 700,
      lastPixelRatio: window.devicePixelRatio, // 存储初始浏览器缩放比例
      mediaQueryList: null, // 存储媒体查询对象
      resizeTimer: null, // 用于防抖
    };
  },
  computed: {},
  mounted() {
    this.setIframeSrcView();
    
    // 监听窗口大小变化
    window.addEventListener('resize', this.handleResize);
    
    // 监听浏览器缩放变化
    this.listenForZoomChanges();
    
    // 组件销毁时移除监听器
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('resize', this.handleResize);
      if (this.mediaQueryList && this.zoomChangeHandler) {
        this.mediaQueryList.removeEventListener('change', this.zoomChangeHandler);
      }
    });
  },
  watch: {
    width(val) {
      this.frameWidth = val;
    },
    height(val) {
      this.frameHeight = val;
    },
    code(val) {
      if (val) {
        this.setIframeSrcView();
      }
    },
    // 监听路由变化，重新计算尺寸
    '$route'() {
      this.$nextTick(() => {
        this.handleResize();
      });
    }
  },
  methods: {
    // 设置iframe源
    setIframeSrcView() {
      let code = this.code || this.$route.query.code;
      if (!code) return;
      
      let isprod = window.location.hostname.indexOf("prod") >= 0;
      this.src = isprod
        ? `https://prod.xxx.com/datart/shareDashboard/${code}?type=NONE`
        : `http://test.xxx.com/datart/shareDashboard/${code}?type=NONE`;

      this.$nextTick(() => {
        setTimeout(() => {
          // 设置位置
          this.src = this.src + `&platformId=XXX`
          this.frameWidth = this.width;
          this.frameHeight = this.height;
          this.maskShow = false;
        }, 200);
      });
    },
    onIframeLoad() {
      this.iframeShow = true;
    },
    // 处理窗口大小变化（带防抖）
    handleResize() {
      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer);
      }
      
      this.resizeTimer = setTimeout(() => {
        // 根据窗口大小调整iframe尺寸
        this.adjustIframeSize();
      }, 100);
    },
    // 调整iframe尺寸
    adjustIframeSize() {
      // 可以根据实际需求调整计算逻辑
      // 例如，考虑浏览器缩放比例的影响
      const zoomFactor = window.devicePixelRatio;
      const compensationScale = 1 / zoomFactor;
      
      // 应用尺寸调整
      this.frameWidth = this.width * compensationScale;
      this.frameHeight = this.height * compensationScale;
      
      console.log(`调整iframe尺寸: ${this.frameWidth}x${this.frameHeight}, 缩放比例: ${zoomFactor}`);
    },
    // 监听浏览器缩放比例变化
    listenForZoomChanges() {
      // 创建媒体查询列表来检测缩放变化
      const mediaQueryList = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      this.mediaQueryList = mediaQueryList;
      
      // 监听媒体查询变化
      const zoomChangeHandler = () => {
        // 如果缩放比例发生变化
        if (window.devicePixelRatio !== this.lastPixelRatio) {
          // 更新存储的缩放比例
          this.lastPixelRatio = window.devicePixelRatio;
          
          // 调整iframe大小
          this.adjustIframeSize();
        }
      };
      
      // 保存处理函数引用以便后续清理
      this.zoomChangeHandler = zoomChangeHandler;
      mediaQueryList.addEventListener('change', zoomChangeHandler);
    }
  },
};
</script>
<style scoped>
.content {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 10;
}

.spin {
  color: #1890ff;
}
</style>
```

### 案例3：使用自定义指令实现窗口大小变化监听

这个案例展示了如何使用Vue自定义指令来监听窗口大小变化，并自动调整大屏尺寸。

```vue
<!-- ResizeDirective.js -->
<script>
// 自定义resize指令
export const resize = {
  inserted(el, binding) {
    // 创建ResizeObserver实例
    const observer = new ResizeObserver(() => {
      // 调用绑定的处理函数
      binding.value();
    });
    
    // 观察元素尺寸变化
    observer.observe(el);
    
    // 保存observer实例以便后续清理
    el._resizeObserver = observer;
    
    // 同时监听window的resize事件
    window.addEventListener('resize', binding.value);
    el._windowResizeHandler = binding.value;
  },
  unbind(el) {
    // 清理ResizeObserver
    if (el._resizeObserver) {
      el._resizeObserver.disconnect();
      delete el._resizeObserver;
    }
    
    // 清理window resize事件监听
    if (el._windowResizeHandler) {
      window.removeEventListener('resize', el._windowResizeHandler);
      delete el._windowResizeHandler;
    }
  }
};
</script>
```

```vue
<!-- ResizableContainer.vue -->
<template>
  <div class="resizable-container" ref="container" v-resize="handleResize">
    <slot></slot>
  </div>
</template>

<script>
import { resize } from './ResizeDirective';

export default {
  directives: {
    resize
  },
  props: {
    // 是否监听浏览器缩放
    watchBrowserZoom: {
      type: Boolean,
      default: true
    },
    // 是否监听路由变化
    watchRouteChange: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      containerWidth: 0,
      containerHeight: 0,
      resizeTimer: null,
      lastPixelRatio: window.devicePixelRatio,
      mediaQueryList: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.updateDimensions();
      
      // 监听路由变化
      if (this.watchRouteChange && this.$router) {
        this.$watch('$route', () => {
          // 路由变化后，等待DOM更新再计算尺寸
          this.$nextTick(() => {
            this.updateDimensions();
          });
        });
      }
      
      // 监听浏览器缩放
      if (this.watchBrowserZoom) {
        this.listenForZoomChanges();
      }
    });
  },
  methods: {
    // 更新尺寸的方法
    updateDimensions() {
      const container = this.$refs.container;
      if (!container) return;
      
      this.containerWidth = container.clientWidth;
      this.containerHeight = container.clientHeight;
      
      // 考虑浏览器缩放因素
      if (this.watchBrowserZoom) {
        const zoomFactor = window.devicePixelRatio;
        if (zoomFactor !== 1) {
          // 可以根据需要调整补偿算法
          const compensationScale = 1 / zoomFactor;
          this.containerWidth = this.containerWidth * compensationScale;
          this.containerHeight = this.containerHeight * compensationScale;
        }
      }
      
      // 发出尺寸变化事件
      this.$emit('dimensions-change', {
        width: this.containerWidth,
        height: this.containerHeight,
        zoomFactor: window.devicePixelRatio
      });
    },
    
    // resize事件处理函数（带防抖）
    handleResize() {
      // 使用防抖函数优化性能
      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer);
      }
      
      this.resizeTimer = setTimeout(() => {
        this.updateDimensions();
      }, 100);
    },
    
    // 监听浏览器缩放比例变化
    listenForZoomChanges() {
      // 创建媒体查询列表来检测缩放变化
      const mediaQueryList = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      this.mediaQueryList = mediaQueryList;
      
      // 监听媒体查询变化
      const zoomChangeHandler = () => {
        // 如果缩放比例发生变化
        if (window.devicePixelRatio !== this.lastPixelRatio) {
          // 更新存储的缩放比例
          this.lastPixelRatio = window.devicePixelRatio;
          
          // 重新计算尺寸
          this.updateDimensions();
        }
      };
      
      mediaQueryList.addEventListener('change', zoomChangeHandler);
      this.zoomChangeHandler = zoomChangeHandler;
    }
  },
  beforeDestroy() {
    // 清理事件监听
    if (this.mediaQueryList && this.zoomChangeHandler) {
      this.mediaQueryList.removeEventListener('change', this.zoomChangeHandler);
    }
    
    // 清理定时器
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
  }
};
</script>

<style scoped>
.resizable-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
</style>
```

### 使用方法

```vue
<!-- 在父组件中使用 -->
<template>
  <div class="app-container">
    <!-- 方案1：使用完整的大屏容器 -->
    <DashboardContainer>
      <!-- 大屏内容 -->
      <div class="dashboard-content">
        <!-- 图表、表格等组件 -->
        <div class="chart-item">图表1</div>
        <div class="chart-item">图表2</div>
        <!-- 更多内容... -->
      </div>
    </DashboardContainer>
    
    <!-- 方案2：使用iframe嵌入式大屏 -->
    <EnhancedBiReport 
      :width="1200" 
      :height="800" 
      code="dashboard123"
    />
    
    <!-- 方案3：使用自定义指令监听容器 -->
    <ResizableContainer @dimensions-change="onDimensionsChange">
      <div class="custom-dashboard" :style="dashboardStyle">
        <!-- 自定义大屏内容 -->
      </div>
    </ResizableContainer>
  </div>
</template>

<script>
import DashboardContainer from './components/DashboardContainer.vue';
import EnhancedBiReport from './components/EnhancedBiReport.vue';
import ResizableContainer from './components/ResizableContainer.vue';

export default {
  components: {
    DashboardContainer,
    EnhancedBiReport,
    ResizableContainer
  },
  data() {
    return {
      scale: 1,
      dashboardStyle: {}
    };
  },
  methods: {
    onDimensionsChange({ width, height, zoomFactor }) {
      // 根据容器尺寸变化调整大屏样式
      const designWidth = 1920;
      const designHeight = 1080;
      
      // 计算缩放比例
      const scale = Math.min(width / designWidth, height / designHeight);
      this.scale = scale;
      
      // 应用缩放样式
      this.dashboardStyle = {
        width: `${designWidth}px`,
        height: `${designHeight}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'left top'
      };
    }
  }
};
</script>

<style>
.app-container {
  width: 100vw;
  height: 100vh;
}

.dashboard-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

.chart-item {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
}

.custom-dashboard {
  background-color: #151a26;
  color: white;
}
</style>
```

## 总结与最佳实践

在实现数据大屏自适应缩放时，应考虑以下最佳实践：

1. **选择合适的缩放策略**：
   - 对于需要保持设计稿视觉效果的项目，使用 transform scale 方案
   - 对于需要响应式布局的项目，使用媒体查询 + 百分比布局
   - 对于特殊场景（如嵌入式iframe），使用动态计算宽高

2. **全面的监听机制**：
   - 窗口大小变化（resize事件）
   - 浏览器缩放比例变化（devicePixelRatio）
   - 路由跳转（Vue Router导航守卫）
   - 全屏切换（fullscreenchange事件）

3. **性能优化**：
   - 使用防抖函数处理频繁触发的事件
   - 适当使用CSS transition平滑过渡
   - 组件销毁时清理所有事件监听器
   - 使用ResizeObserver代替频繁的resize事件监听

4. **兼容性处理**：
   - 考虑不同浏览器的前缀（如全屏API）
   - 提供降级方案（如不支持ResizeObserver时使用resize事件）
   - 处理不同设备像素比的显示差异

5. **用户体验**：
   - 提供全屏切换按钮
   - 加载过程中显示loading
   - 保证关键数据在各种尺寸下都清晰可见
   - 添加平滑的过渡动画

通过以上方案和最佳实践，可以确保数据大屏在各种环境下都能提供一致、专业的视觉体验，无论是在会议室的大屏幕上展示，还是在个人电脑上查看。
```vue
<!-- bireport.vue -->
<template>
  <div class="content">
    <!-- laoding -->
    <div id="mask" class="mask" v-if="maskShow || !iframeShow">
      <a-spin size="large" :spinning="true" class="spin"></a-spin>
    </div>
    <!-- 加载大屏 -->
    <div v-if="!maskShow">
      <iframe
        v-show="iframeShow"
        :src="src"
        frameborder="0"
        :width="frameWidth"
        :height="frameHeight"
        @load="onIframeLoad"
      ></iframe>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    width: {
      type: Number,
      default: 1200,
    },
    height: {
      type: Number,
      default: 800,
    },
  },
  data() {
    return {
      maskShow: true,
      iframeShow: false,
      src: "",
      frameWidth: 1200,
      frameHeight: 700,
    };
  },
  computed: {},
  mounted() {
    this.setIframeSrcView();
  },
  watch: {
    width(val) {
      this.frameWidth = val;
    },
    height(val) {
      this.frameHeight = val;
    },
    // 解决iframe跳转后还是个iframe导致内容不刷新问题
    "$route.query"(val) {
      this.setIframeSrcView();
    },
  },
  methods: {
    // 路由改变也要执行src改变
    setIframeSrcView() {
      let code = this.$route.query.code;
      let isprod = window.location.hostname.indexOf("prod") >= 0;
      this.src = isprod
        ? `https://prod.xxx.com/datart/shareDashboard/${code}?type=NONE`
        : `http://test.xxx.com/datart/shareDashboard/${code}?type=NONE`;

      this.$nextTick(() => {
        setTimeout(() => {
            // 设置位置
          this.src = this.src + `&platformId=XXX`
          this.frameWidth = this.width;
          this.frameHeight = this.height;
          this.maskShow = false;
        }, 200);
      });
    },
    onIframeLoad() {
      this.iframeShow = true;
    },
  },
};
</script>
```


以上就是bireport.vue组件内容,如果想引入,可以import进行使用,因为我这里使用模块联邦,所以我用remote组件来进行演示

```vue
<!-- overview.vue -->
<template>
  <div class="bi-content" ref="biContent">
      <RemoteBiReport 
        :origin="origin" 
        :width="clientW" 
        :height="clientH" 
        v-resize="handleResize"
      />
  </div>
</template>
<script>    
export default { 
    name: 'bireport',
    components: {
      RemoteBiReport: () => import('remote/bireport.vue'),
    },
    props: {
    }, 
    data() {  
        return {  
          origin:'platform',
          clientW:0, // 初始宽高
          clientH:0, // 初始宽高
        };  
    },  
    created() {
    },

    computed: {  
        
    },  
    mounted() {
      this.$nextTick(() => {
        this.updateDimensions();
      })
    },
    watch: {
    },
    methods: {
      // 更新尺寸的方法
      updateDimensions() {
        let viewDom = this.$refs.biContent;
        this.clientW = (window.innerWidth - 240) || viewDom.clientWidth;
        this.clientH = (window.innerHeight - 40) || viewDom.clientHeight;
      },
      
      // resize事件处理函数
      handleResize() {
        this.updateDimensions();
      }
    }
};  
</script>
```