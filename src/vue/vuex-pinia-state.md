# Vue中的状态管理

## 为什么要做状态管理

在Vue应用开发中，随着应用规模的增长，组件间的数据共享变得越来越复杂。传统的父子组件通信（props/emit）在面对以下场景时会显得力不从心：

- **跨层级组件通信**：祖父组件需要向孙子组件传递数据
- **兄弟组件通信**：同级组件间需要共享状态
- **全局状态管理**：用户信息、主题设置、权限等需要在多个组件中访问
- **复杂业务逻辑**：购物车、表单数据、缓存等需要统一管理

状态管理库提供了一个**单一数据源**的解决方案，让数据流向更加清晰和可预测。

## 使用Vuex/Pinia管理数据有什么好处

### Vuex的优势
- **集中式存储**：所有组件的状态集中管理
- **可预测性**：严格的单向数据流，便于调试
- **开发工具支持**：Vue DevTools完美集成
- **时间旅行调试**：可以回溯状态变化

### Pinia的优势（Vue3推荐）
- **更好的TypeScript支持**：天然支持类型推断
- **更简洁的API**：去除了mutations，只保留state、getters、actions
- **模块化设计**：每个store都是独立的
- **更小的包体积**：按需引入，tree-shaking友好
- **支持Vue2和Vue3**：向后兼容

## 如何处理同步异步数据的取值/设置值

### Pinia中的数据处理

```javascript
// stores/user.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useUserStore = defineStore('user', () => {
  // 状态定义
  const userInfo = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  // 计算属性（getters）
  const isLoggedIn = computed(() => !!userInfo.value)
  const userName = computed(() => userInfo.value?.name || '游客')
  
  // 同步操作
  const setUserInfo = (info) => {
    userInfo.value = info
  }
  
  // 异步操作
  const fetchUserInfo = async (userId) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.get(`/api/users/${userId}`)
      userInfo.value = response.data
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // 登出操作
  const logout = () => {
    userInfo.value = null
    // 清除本地存储
    localStorage.removeItem('token')
  }
  
  return {
    // 状态
    userInfo,
    loading,
    error,
    // 计算属性
    isLoggedIn,
    userName,
    // 方法
    setUserInfo,
    fetchUserInfo,
    logout
  }
})
```

### 在组件中使用

```vue
<template>
  <div>
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">错误：{{ error }}</div>
    <div v-else-if="isLoggedIn">
      欢迎，{{ userName }}！
      <button @click="handleLogout">退出登录</button>
    </div>
    <div v-else>
      <button @click="handleLogin">登录</button>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 解构响应式数据
const { userInfo, loading, error, isLoggedIn, userName } = storeToRefs(userStore)

// 方法可以直接解构
const { fetchUserInfo, logout } = userStore

const handleLogin = async () => {
  try {
    await fetchUserInfo(123)
  } catch (err) {
    console.error('登录失败:', err)
  }
}

const handleLogout = () => {
  logout()
}
</script>
```

## 协作过程中如何注意模块的划分

### 按业务功能划分Store

```
stores/
├── user.js          # 用户相关状态
├── product.js       # 商品相关状态
├── cart.js          # 购物车状态
├── order.js         # 订单状态
└── common.js        # 通用状态（主题、语言等）
```

### Store设计原则

1. **单一职责**：每个store只负责一个业务领域
2. **命名规范**：使用清晰的命名约定
3. **状态扁平化**：避免过度嵌套的状态结构
4. **接口一致性**：相似的操作保持API一致

```javascript
// stores/product.js
export const useProductStore = defineStore('product', () => {
  const products = ref([])
  const currentProduct = ref(null)
  const categories = ref([])
  
  // 获取商品列表
  const fetchProducts = async (params = {}) => {
    // 实现逻辑
  }
  
  // 获取商品详情
  const fetchProductDetail = async (id) => {
    // 实现逻辑
  }
  
  // 搜索商品
  const searchProducts = async (keyword) => {
    // 实现逻辑
  }
  
  return {
    products,
    currentProduct,
    categories,
    fetchProducts,
    fetchProductDetail,
    searchProducts
  }
})
```

## 何时清空或者重置Store中的数据

### 常见的重置场景

1. **用户登出**：清空用户相关的所有状态
2. **路由切换**：清空页面特定的临时状态
3. **表单重置**：清空表单相关状态
4. **错误恢复**：清空错误状态

### 实现重置方法

```javascript
// stores/form.js
export const useFormStore = defineStore('form', () => {
  // 初始状态
  const initialState = {
    name: '',
    email: '',
    phone: '',
    address: ''
  }
  
  const formData = ref({ ...initialState })
  const errors = ref({})
  const isSubmitting = ref(false)
  
  // 重置表单
  const resetForm = () => {
    formData.value = { ...initialState }
    errors.value = {}
    isSubmitting.value = false
  }
  
  // 部分重置
  const resetErrors = () => {
    errors.value = {}
  }
  
  return {
    formData,
    errors,
    isSubmitting,
    resetForm,
    resetErrors
  }
})
```

### 使用$reset方法（Pinia提供）

```javascript
// 在组件中重置整个store
const formStore = useFormStore()
formStore.$reset() // 重置到初始状态
```

## 案例实践

### 案例1：收集线索的表单管理

#### 创建表单Store

```javascript
// stores/leadForm.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useLeadFormStore = defineStore('leadForm', () => {
  // 表单数据状态
  const formData = ref({
    name: '',
    phone: '',
    email: '',
    company: '',
    position: '',
    requirement: '',
    source: 'website'
  })
  
  // 表单验证错误
  const errors = ref({})
  
  // 提交状态
  const isSubmitting = ref(false)
  const submitSuccess = ref(false)
  
  // 计算属性：表单是否有效
  const isFormValid = computed(() => {
    return formData.value.name && 
           formData.value.phone && 
           formData.value.email &&
           Object.keys(errors.value).length === 0
  })
  
  // 更新表单字段
  const updateField = (field, value) => {
    formData.value[field] = value
    // 清除该字段的错误
    if (errors.value[field]) {
      delete errors.value[field]
    }
  }
  
  // 验证表单
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.value.name.trim()) {
      newErrors.name = '姓名不能为空'
    }
    
    if (!formData.value.phone.trim()) {
      newErrors.phone = '电话不能为空'
    } else if (!/^1[3-9]\d{9}$/.test(formData.value.phone)) {
      newErrors.phone = '请输入正确的手机号'
    }
    
    if (!formData.value.email.trim()) {
      newErrors.email = '邮箱不能为空'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
      newErrors.email = '请输入正确的邮箱格式'
    }
    
    errors.value = newErrors
    return Object.keys(newErrors).length === 0
  }
  
  // 提交表单
  const submitForm = async () => {
    if (!validateForm()) {
      return false
    }
    
    isSubmitting.value = true
    
    try {
      const response = await axios.post('/api/leads', formData.value)
      submitSuccess.value = true
      
      // 提交成功后重置表单
      setTimeout(() => {
        resetForm()
      }, 2000)
      
      return response.data
    } catch (error) {
      console.error('提交失败:', error)
      throw error
    } finally {
      isSubmitting.value = false
    }
  }
  
  // 重置表单
  const resetForm = () => {
    formData.value = {
      name: '',
      phone: '',
      email: '',
      company: '',
      position: '',
      requirement: '',
      source: 'website'
    }
    errors.value = {}
    isSubmitting.value = false
    submitSuccess.value = false
  }
  
  // 保存草稿到本地存储
  const saveDraft = () => {
    localStorage.setItem('leadFormDraft', JSON.stringify(formData.value))
  }
  
  // 加载草稿
  const loadDraft = () => {
    const draft = localStorage.getItem('leadFormDraft')
    if (draft) {
      formData.value = { ...formData.value, ...JSON.parse(draft) }
    }
  }
  
  return {
    // 状态
    formData,
    errors,
    isSubmitting,
    submitSuccess,
    // 计算属性
    isFormValid,
    // 方法
    updateField,
    validateForm,
    submitForm,
    resetForm,
    saveDraft,
    loadDraft
  }
})
```

#### 表单组件实现

```vue
<template>
  <div class="lead-form">
    <h2>联系我们</h2>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>姓名 *</label>
        <input 
          v-model="formData.name"
          @input="handleFieldChange('name', $event.target.value)"
          :class="{ error: errors.name }"
          placeholder="请输入您的姓名"
        />
        <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
      </div>
      
      <div class="form-group">
        <label>手机号 *</label>
        <input 
          v-model="formData.phone"
          @input="handleFieldChange('phone', $event.target.value)"
          :class="{ error: errors.phone }"
          placeholder="请输入手机号"
        />
        <span v-if="errors.phone" class="error-text">{{ errors.phone }}</span>
      </div>
      
      <div class="form-group">
        <label>邮箱 *</label>
        <input 
          v-model="formData.email"
          @input="handleFieldChange('email', $event.target.value)"
          :class="{ error: errors.email }"
          placeholder="请输入邮箱"
        />
        <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
      </div>
      
      <div class="form-group">
        <label>公司</label>
        <input 
          v-model="formData.company"
          @input="handleFieldChange('company', $event.target.value)"
          placeholder="请输入公司名称"
        />
      </div>
      
      <div class="form-group">
        <label>需求描述</label>
        <textarea 
          v-model="formData.requirement"
          @input="handleFieldChange('requirement', $event.target.value)"
          placeholder="请描述您的需求"
          rows="4"
        ></textarea>
      </div>
      
      <div class="form-actions">
        <button 
          type="button" 
          @click="handleSaveDraft"
          class="btn-secondary"
        >
          保存草稿
        </button>
        
        <button 
          type="submit" 
          :disabled="!isFormValid || isSubmitting"
          class="btn-primary"
        >
          {{ isSubmitting ? '提交中...' : '提交' }}
        </button>
      </div>
    </form>
    
    <!-- 成功提示 -->
    <div v-if="submitSuccess" class="success-message">
      提交成功！我们会尽快联系您。
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useLeadFormStore } from '@/stores/leadForm'
import { onMounted } from 'vue'

const leadFormStore = useLeadFormStore()

// 解构响应式状态
const { 
  formData, 
  errors, 
  isSubmitting, 
  submitSuccess, 
  isFormValid 
} = storeToRefs(leadFormStore)

// 解构方法
const { 
  updateField, 
  submitForm, 
  resetForm, 
  saveDraft, 
  loadDraft 
} = leadFormStore

// 处理字段变化
const handleFieldChange = (field, value) => {
  updateField(field, value)
  // 自动保存草稿
  saveDraft()
}

// 处理表单提交
const handleSubmit = async () => {
  try {
    await submitForm()
  } catch (error) {
    alert('提交失败，请稍后重试')
  }
}

// 保存草稿
const handleSaveDraft = () => {
  saveDraft()
  alert('草稿已保存')
}

// 组件挂载时加载草稿
onMounted(() => {
  loadDraft()
})
</script>

<style scoped>
.lead-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input.error, textarea.error {
  border-color: #ff4757;
}

.error-text {
  color: #ff4757;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-primary, .btn-secondary {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  padding: 15px;
  border-radius: 4px;
  margin-top: 20px;
  text-align: center;
}
</style>
```

### 案例2：列表数据管理

#### 创建列表Store

```javascript
// stores/productList.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useProductListStore = defineStore('productList', () => {
  // 状态定义
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = ref(0)
  const searchKeyword = ref('')
  const selectedCategory = ref('')
  const sortBy = ref('created_at')
  const sortOrder = ref('desc')
  
  // 计算属性
  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
  const hasNextPage = computed(() => currentPage.value < totalPages.value)
  const hasPrevPage = computed(() => currentPage.value > 1)
  
  // 过滤后的商品列表
  const filteredProducts = computed(() => {
    let result = products.value
    
    if (searchKeyword.value) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
      )
    }
    
    if (selectedCategory.value) {
      result = result.filter(product => product.category === selectedCategory.value)
    }
    
    return result
  })
  
  // 获取商品列表
  const fetchProducts = async (params = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const queryParams = {
        page: currentPage.value,
        pageSize: pageSize.value,
        keyword: searchKeyword.value,
        category: selectedCategory.value,
        sortBy: sortBy.value,
        sortOrder: sortOrder.value,
        ...params
      }
      
      const response = await axios.get('/api/products', { params: queryParams })
      
      products.value = response.data.data
      total.value = response.data.total
      
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // 搜索商品
  const searchProducts = async (keyword) => {
    searchKeyword.value = keyword
    currentPage.value = 1 // 重置到第一页
    await fetchProducts()
  }
  
  // 切换分类
  const filterByCategory = async (category) => {
    selectedCategory.value = category
    currentPage.value = 1
    await fetchProducts()
  }
  
  // 排序
  const sortProducts = async (field, order = 'asc') => {
    sortBy.value = field
    sortOrder.value = order
    await fetchProducts()
  }
  
  // 翻页
  const goToPage = async (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      await fetchProducts()
    }
  }
  
  // 下一页
  const nextPage = async () => {
    if (hasNextPage.value) {
      await goToPage(currentPage.value + 1)
    }
  }
  
  // 上一页
  const prevPage = async () => {
    if (hasPrevPage.value) {
      await goToPage(currentPage.value - 1)
    }
  }
  
  // 刷新列表
  const refreshList = async () => {
    await fetchProducts()
  }
  
  // 重置筛选条件
  const resetFilters = async () => {
    searchKeyword.value = ''
    selectedCategory.value = ''
    sortBy.value = 'created_at'
    sortOrder.value = 'desc'
    currentPage.value = 1
    await fetchProducts()
  }
  
  // 添加商品到收藏
  const toggleFavorite = async (productId) => {
    try {
      const product = products.value.find(p => p.id === productId)
      if (product) {
        const newStatus = !product.is_favorite
        await axios.post(`/api/products/${productId}/favorite`, {
          is_favorite: newStatus
        })
        product.is_favorite = newStatus
      }
    } catch (err) {
      console.error('切换收藏状态失败:', err)
    }
  }
  
  return {
    // 状态
    products,
    loading,
    error,
    currentPage,
    pageSize,
    total,
    searchKeyword,
    selectedCategory,
    sortBy,
    sortOrder,
    // 计算属性
    totalPages,
    hasNextPage,
    hasPrevPage,
    filteredProducts,
    // 方法
    fetchProducts,
    searchProducts,
    filterByCategory,
    sortProducts,
    goToPage,
    nextPage,
    prevPage,
    refreshList,
    resetFilters,
    toggleFavorite
  }
})
```

#### 商品列表组件

```vue
<template>
  <div class="product-list">
    <!-- 搜索和筛选 -->
    <div class="filters">
      <div class="search-box">
        <input 
          v-model="searchInput"
          @keyup.enter="handleSearch"
          placeholder="搜索商品..."
          class="search-input"
        />
        <button @click="handleSearch" class="search-btn">搜索</button>
      </div>
      
      <div class="filter-options">
        <select v-model="selectedCategory" @change="handleCategoryChange">
          <option value="">全部分类</option>
          <option value="electronics">电子产品</option>
          <option value="clothing">服装</option>
          <option value="books">图书</option>
        </select>
        
        <select v-model="currentSort" @change="handleSortChange">
          <option value="created_at:desc">最新发布</option>
          <option value="price:asc">价格从低到高</option>
          <option value="price:desc">价格从高到低</option>
          <option value="sales:desc">销量最高</option>
        </select>
        
        <button @click="handleResetFilters" class="reset-btn">重置</button>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      加载中...
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="error">
      加载失败：{{ error }}
      <button @click="refreshList" class="retry-btn">重试</button>
    </div>
    
    <!-- 商品列表 -->
    <div v-else class="products-grid">
      <div 
        v-for="product in products" 
        :key="product.id" 
        class="product-card"
      >
        <img :src="product.image" :alt="product.name" class="product-image" />
        <div class="product-info">
          <h3 class="product-name">{{ product.name }}</h3>
          <p class="product-price">¥{{ product.price }}</p>
          <p class="product-sales">已售 {{ product.sales }}</p>
          
          <div class="product-actions">
            <button 
              @click="toggleFavorite(product.id)"
              :class="['favorite-btn', { active: product.is_favorite }]"
            >
              {{ product.is_favorite ? '已收藏' : '收藏' }}
            </button>
            <button class="add-cart-btn">加入购物车</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-if="!loading && !error && products.length === 0" class="empty">
      暂无商品数据
    </div>
    
    <!-- 分页 -->
    <div v-if="totalPages > 1" class="pagination">
      <button 
        @click="prevPage" 
        :disabled="!hasPrevPage"
        class="page-btn"
      >
        上一页
      </button>
      
      <span class="page-info">
        第 {{ currentPage }} 页，共 {{ totalPages }} 页
      </span>
      
      <button 
        @click="nextPage" 
        :disabled="!hasNextPage"
        class="page-btn"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductListStore } from '@/stores/productList'

const productListStore = useProductListStore()

// 解构响应式状态
const {
  products,
  loading,
  error,
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  searchKeyword,
  selectedCategory
} = storeToRefs(productListStore)

// 解构方法
const {
  fetchProducts,
  searchProducts,
  filterByCategory,
  sortProducts,
  nextPage,
  prevPage,
  refreshList,
  resetFilters,
  toggleFavorite
} = productListStore

// 本地状态
const searchInput = ref('')
const currentSort = ref('created_at:desc')

// 处理搜索
const handleSearch = () => {
  searchProducts(searchInput.value)
}

// 处理分类筛选
const handleCategoryChange = () => {
  filterByCategory(selectedCategory.value)
}

// 处理排序
const handleSortChange = () => {
  const [field, order] = currentSort.value.split(':')
  sortProducts(field, order)
}

// 重置筛选
const handleResetFilters = () => {
  searchInput.value = ''
  currentSort.value = 'created_at:desc'
  resetFilters()
}

// 组件挂载时获取数据
onMounted(() => {
  fetchProducts()
})

// 监听搜索关键词变化
watch(searchKeyword, (newVal) => {
  searchInput.value = newVal
})
</script>

<style scoped>
.product-list {
  padding: 20px;
}

.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;
}

.search-box {
  display: flex;
  gap: 10px;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
}

.search-btn, .reset-btn, .retry-btn {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.filter-options {
  display: flex;
  gap: 10px;
  align-items: center;
}

.filter-options select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.loading, .error, .empty {
  text-align: center;
  padding: 40px;
  color: #666;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.product-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 15px;
}

.product-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}

.product-price {
  color: #ff4757;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.product-sales {
  color: #666;
  font-size: 12px;
  margin-bottom: 15px;
}

.product-actions {
  display: flex;
  gap: 10px;
}

.favorite-btn, .add-cart-btn {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.favorite-btn.active {
  background-color: #ff4757;
  color: white;
  border-color: #ff4757;
}

.add-cart-btn {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.page-btn {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.page-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.page-info {
  color: #666;
}
</style>
```

## 参考文档

- [Pinia官方文档](https://pinia.vuejs.org/)
- [Vuex官方文档](https://vuex.vuejs.org/)
- [Vue3组合式API](https://cn.vuejs.org/guide/extras/composition-api-faq.html)
- [Vue DevTools](https://devtools.vuejs.org/)
- [状态管理模式](https://cn.vuejs.org/guide/scaling-up/state-management.html)