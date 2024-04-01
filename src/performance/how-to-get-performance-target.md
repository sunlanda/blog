## 如何获取性能指标

`window.performance.timing` 是一个浏览器BOM对象中的一个性能相关的API


![获取资源截图1](/public/performance-1.png)

```js
// 在页面console中执行,

// 获取所有资源加载时间
const resources = window.performance.getEntriesByType('resource');
resources.forEach((resource) => {
  console.log(`${resource.name}: ${resource.responseEnd - resource.startTime}`);
});

// 获取页面导航时间
const navigation = window.performance.getEntriesByType('navigation')[0];
console.log(`页面加载时间: ${navigation.loadEventEnd - navigation.loadEventStart}`);

// 获取首次内容绘制时间
const paintMetrics = window.performance.getEntriesByType('paint');
paintMetrics.forEach((paintMetric) => {
  if (paintMetric.name === 'first-contentful-paint') {
    console.log(`首次内容绘制时间: ${paintMetric.startTime}`);
  }
});


```