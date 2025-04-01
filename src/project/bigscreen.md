# 如何开发数据驾驶舱(大屏)?

## 具备功能
* 图表展示 (年月日筛选)
* 实时数据(socket / http轮询)
* RWD(responsive web design) 响应式网站H5 pad WEB, RWA(responsive web design for Accessibility) 无障碍人士访问

## 难点解决

* `不同尺寸` 显示效果保持一致 (col row ,media query) `clientY/clientX`倍率等,图片,文字显示大小(font-size) `rem`  windows.`devicePixiRatio`
* `实时数据`: 接口聚合轮询频率,`socket`进行通讯
* `图表融合`: 有不同数据展示不同的表达, 雷达图,柱状图,饼图等 (同比环比占比)
* `加固机制`: 断线重试 -接口,登录拦截(https),登录态续签sign,退出弹窗屏蔽
* `性能优化`: (pwa)缓存,或者cdn加速,不同接口频率拆分, 图片->svg 或者canvas 转化
* 与其他系统的融合,iframe后仍然不影响缩放 (拉伸)
* `视觉升级`: 酷炫3D -> three.js webGL等, 数据流体管道,拖拽切换carmra

## 各个击破的核心代码

### 图表
```sh
npm i echarts -D
```

### 尺寸
**flex 弹性布局**
```vue
 <div class="bg">
      <dv-loading v-if="loading">Loading...</dv-loading>
      <div v-else
           class="host-body">
        <Header/>
        <div class="main-body">
          <div class="left-area">
            <div class="left-select-area">
              <LeftSelectArea/>
            </div>
            <div class="left-area-top">
              <LeftAreaTop/>
            </div>
            <div class="left-area-center">
              <LeftAreaCenter/>
            </div>
            <div class="left-area-bottom">
              <LeftAreaBottom echartsHeight="310px" />
            </div>
          </div>
          <div class="center-area flex-1">
            <div class="center-area-top">
              <CenterAreaTop/>
            </div>
            <div class="center-area-bottom">
              <CenterAreaBottom/>
            </div>
          </div>
          <div class="right-area">
            <div class="right-area-top">
              <RightAreaTop/>
            </div>
            <div class="right-area-bottom">
              <RightAreaBottom/>
            </div>
          </div>
        </div>
      </div>
    </div>
```

```css
.bottom{
    flex:1;
    flex-sharink:"";
}
```

```js
// drawMixin.js
// 屏幕适配 mixin 函数

// * 默认缩放值
const scale = {
  width: '1',
  height: '1',
}

// * 设计稿尺寸（px）
const baseWidth = 1920
const baseHeight = 1080

// * 需保持的比例（默认1.77778）
const baseProportion = parseFloat((baseWidth / baseHeight).toFixed(5))

export default {
  data() {
    return {
      // * 定时函数
      drawTiming: null
    }
  },
  mounted() {
    this.calcRate()
    window.addEventListener('resize', this.resize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    calcRate() {
      const appRef = this.$refs["appRef"]
      if (!appRef) return
      // 当前宽高比
      const currentRate = parseFloat((window.innerWidth / window.innerHeight).toFixed(5))
      if (appRef) {
        if (currentRate > baseProportion) {
          // 表示更宽
          scale.width = ((window.innerHeight * baseProportion) / baseWidth).toFixed(5)
          scale.height = (window.innerHeight / baseHeight).toFixed(5)
          appRef.style.transform = `scale(${scale.width}, ${scale.height}) translate(-50%, -50%)`
        } else {
          // 表示更高
          scale.height = ((window.innerWidth / baseProportion) / baseHeight).toFixed(5)
          scale.width = (window.innerWidth / baseWidth).toFixed(5)
          appRef.style.transform = `scale(${scale.width}, ${scale.height}) translate(-50%, -50%)`
        }
      }
    },
    resize() {
      clearTimeout(this.drawTiming)
      this.drawTiming = setTimeout(() => {
        this.calcRate()
      }, 200)
    }
  },
}
```

**媒体查询**
```css
@media-screen(width< 768px){
    
}
```
**比例缩放**
```js

```

### 


