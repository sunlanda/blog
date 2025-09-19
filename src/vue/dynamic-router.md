# 动态路由获取思路
```js

// 假设后端返回的数据结构大致是这样 (这是一个简化示例)
// 其中 componentPath 是相对于你的 views 目录的路径字符串
/*
[
  {
    path: '/rich',
    name: 'richTextEditor',
    componentPath: 'demo/richTextEditor/index.vue', // 后端返回的路径字符串
    meta: { title: '富文本编辑器', roles: ['admin', 'editor'] },
    children: [] // 可能包含子菜单
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    componentPath: 'dashboard/index.vue',
    meta: { title: '仪表盘', roles: ['admin'] }
  }
  // ... 更多菜单项
]
*/

// 在前端处理这个数据时，你可以编写一个函数来动态创建 component 引用
function createComponent(componentPath) {
  if (!componentPath) {
    return null; // 或者一个默认的空组件/布局组件
  }
  // 注意这里的路径拼接和动态 import 语法
  // @/views/ 是你的组件根目录别名
  // /* @vite-ignore */ 是 Vite 的一个 magic comment，告诉 Vite 不要尝试静态分析所有可能的路径
  // /* @webpackChunkName: "[request]" */ 是 Webpack 的一个 magic comment，用于 chunk naming
  // 确保 componentPath 是正确的相对路径，不包含前导斜杠
  const componentFullPath = `@/views/${componentPath}`;
  try {
     // 使用 try...catch 捕获可能发生的导入错误
     return () => import(/* @vite-ignore */ /* @webpackChunkName: "[request]" */ `${componentFullPath}`);
  } catch (error) {
     console.error(`Error importing component: ${componentFullPath}`, error);
     // 返回一个错误页面组件或 null，以便路由可以优雅地处理
     return () => import('@/views/error-page/404.vue'); // 假设你有一个 404 错误页面组件
  }
}

// 假设后端返回的路由数组存在于变量 backendRoutesData 中

// 处理后端路由数据，生成 Vue Router 可用的路由对象数组
const dynamicRoutes = backendRoutesData.map(routeData => {
  const route = {
    path: routeData.path,
    name: routeData.name,
    component: createComponent(routeData.componentPath), // 这里调用函数生成动态 import
    meta: routeData.meta,
    // ... 其他路由属性
  };

  // 如果有子路由，递归处理
  if (routeData.children && routeData.children.length > 0) {
     route.children = routeData.children.map(childRouteData => ({
         path: childRouteData.path,
         name: childRouteData.name,
         component: createComponent(childRouteData.componentPath),
         meta: childRouteData.meta,
         // ... 其他子路由属性和递归处理子子路由
     }));
  }

  return route;
});

// 然后将这些 dynamicRoutes 添加到你的 router 实例中
// router 实例通常在 router/index.js 中创建并导出
// const router = createRouter({...}); // 假设 router 实例已经创建
// 遍历添加主路由
dynamicRoutes.forEach(route => {
  router.addRoute(route);
});

// 重要的收尾工作：添加一个 404 路由，放在所有动态路由之后
// 这样只有在所有静态和动态路由都找不到匹配时，才会进入 404
router.addRoute({ path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/error-page/404.vue') }); // 假设你的 404 组件在这里





// router/permission.js
import router from './index'; // 导入你的 router 实例
import store from '@/store'; // 假设你使用 Vuex 或 Pinia 管理状态
import { getMenuData } from '@/api/menu'; // 假设这是获取菜单数据的 API 函数
import { createComponent } from './utils'; // 假设上面的 createComponent 函数放在 utils 文件中

// 存储一个标记，判断是否已经添加过动态路由
let hasAddedRoutes = false;

router.beforeEach(async (to, from, next) => {
  // 假设你的登录状态存储在 store.getters.isLoggedIn
  const isLoggedIn = store.getters.isLoggedIn; // 或 store.state.user.token 等

  if (isLoggedIn) {
    // 用户已登录
    if (to.path === '/login') {
      // 如果已登录还去登录页，重定向到首页或其他页面
      next({ path: '/' });
    } else {
      // 已登录，但不是去登录页
      if (hasAddedRoutes) {
        // 如果动态路由已经添加过
        next(); // 直接放行
      } else {
        // 动态路由还没添加，去获取并添加
        try {
          // 1. 获取用户角色/权限信息 (如果后端菜单接口不依赖此，可跳过)
          // const userRoles = store.getters.userRoles; // 假设角色也从后端获取或存储

          // 2. 调用后端接口获取当前用户的菜单/路由数据
          const backendMenuData = await getMenuData(); // 异步请求

          // 3. 处理后端数据，生成 Vue Router 路由对象
          const dynamicRoutes = processBackendMenuData(backendMenuData); // 编写函数处理嵌套结构并调用 createComponent

          // 4. 添加动态路由到 router 实例
          dynamicRoutes.forEach(route => {
            // 注意：addRoute 可以指定父路由的 name 来添加子路由
            // 如果你的 backendMenuData 已经是扁平结构或你处理成了扁平结构
            // 就直接 addRoute(route)
            // 如果是嵌套结构，需要根据父路由名称添加
            // 例如： router.addRoute('Layout', route); // 假设你有一个名为 'Layout' 的父路由包裹所有业务页面
             router.addRoute(route); // 简化示例，直接添加顶层路由，子路由在 createComponent 里递归处理
          });

          // 5. 添加 404 路由作为最后一个匹配项
          // 先检查是否已添加过，防止重复
          if (!router.hasRoute('NotFound')) {
             router.addRoute({ path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/error-page/404.vue') });
          }


          // 6. 标记动态路由已添加
          hasAddedRoutes = true;

          // 7. 重要：使用 next({...to, replace: true}) 进行一次重定向
          // 这是为了确保在动态路由添加完成后，能够正确地访问用户最初想去的页面
          // 因为在第一次进入守卫时，router 可能并不知道 '/to.path' 这个路由存在
          next({ ...to, replace: true });

        } catch (error) {
          // 获取菜单或添加路由失败，可能是权限问题或网络问题
          console.error('Failed to fetch or add dynamic routes:', error);
          // 可以重定向到错误页面或登录页
          // await store.dispatch('user/logout'); // 清除登录状态
          next(`/login?redirect=${to.path}`); // 重定向到登录页
        }
      }
    }
  } else {
    // 用户未登录
    // 检查是否在白名单路径中（无需登录即可访问，如登录页、注册页）
    const whiteList = ['/login', '/register']; // 定义你的白名单路径
    if (whiteList.includes(to.path)) {
      // 在白名单中，放行
      next();
    } else {
      // 不在白名单中，重定向到登录页
      next(`/login?redirect=${to.path}`);
    }
  }
});


// 辅助函数：处理后端返回的菜单数据结构，将其转换为 Vue Router 路由对象数组
// 这个函数的具体实现取决于你后端返回的数据结构
function processBackendMenuData(menuList) {
    const routes = [];
    menuList.forEach(item => {
        const route = {
            path: item.path,
            name: item.name,
            component: createComponent(item.componentPath), // 调用上面定义的创建组件函数
            meta: item.meta || {}, // 后端返回的 meta 信息
            // ... 其他路由属性，如 props, redirect 等
        };

        // 处理子路由（递归）
        if (item.children && item.children.length > 0) {
            route.children = processBackendMenuData(item.children);
        }

        routes.push(route);
    });
    return routes;
}

// 假设你的 router/utils.js 文件中包含了 createComponent 函数
// import { createComponent } from './utils';


```