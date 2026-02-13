/**
 * 统一请求封装 - 清凤时光 API
 *
 * 开发时用 http://localhost:8000，上线后改为正式域名
 * 微信开发者工具需勾选「不校验合法域名」
 */

const BASE_URL = 'http://localhost:8000'
// 上线时切换为：
// const BASE_URL = 'https://kilock.v4.kilock.site'

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  needAuth?: boolean
}

interface ApiResult<T = any> {
  code: number
  message: string
  data: T
}

/** 发起请求 */
function request<T = any>(options: RequestOptions): Promise<T> {
  return new Promise((resolve, reject) => {
    const header: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (options.needAuth !== false) {
      const token = wx.getStorageSync('token')
      if (token) {
        header['Authorization'] = `Bearer ${token}`
      }
    }

    wx.request({
      url: `${BASE_URL}${options.url}`,
      method: options.method || 'GET',
      data: options.data,
      header,
      timeout: 5000,
      success: (res: any) => {
        const statusCode = res.statusCode
        if (statusCode === 401) {
          // Token 过期，清除并重新登录
          wx.removeStorageSync('token')
          wx.removeStorageSync('userInfo')
          autoLogin()
          reject(new Error('登录已过期，请重试'))
          return
        }
        if (statusCode >= 400) {
          const d = res.data || {}
          const msg = d.detail || d.message || '请求失败'
          reject(new Error(msg))
          return
        }
        const body = res.data as ApiResult<T>
        if (body.code !== undefined && body.code !== 0) {
          reject(new Error(body.message || '请求失败'))
          return
        }
        resolve(body.data as T)
      },
      fail: (err) => {
        console.error('request fail:', err)
        reject(new Error('网络请求失败'))
      },
    })
  })
}

/** 自动登录（静默） */
function autoLogin(): Promise<void> {
  return new Promise((resolve) => {
    wx.login({
      success: (loginRes) => {
        if (!loginRes.code) { resolve(); return }
        request<{ token: string; userInfo: any }>({
          url: '/api/auth/login',
          method: 'POST',
          data: { code: loginRes.code },
          needAuth: false,
        }).then((data) => {
          wx.setStorageSync('token', data.token)
          wx.setStorageSync('userInfo', data.userInfo)
          const app = getApp<IAppOption>()
          if (app) app.globalData.userInfo = data.userInfo
          resolve()
        }).catch(() => resolve())
      },
      fail: () => resolve(),
    })
  })
}

// ============ 具体 API 方法 ============

// --- Auth ---
function loginWithCode(code: string, nickName = '', avatarUrl = '') {
  return request<{ token: string; userInfo: any }>({
    url: '/api/auth/login',
    method: 'POST',
    data: { code, nick_name: nickName, avatar_url: avatarUrl },
    needAuth: false,
  })
}

function updateProfile(nickName: string, avatarUrl: string) {
  return request<any>({
    url: '/api/auth/update-profile',
    method: 'POST',
    data: { nick_name: nickName, avatar_url: avatarUrl },
  })
}

// --- User ---
function getUserProfile() {
  return request<any>({ url: '/api/user/profile' })
}

// --- Home ---
function getBanners() {
  return request<any[]>({ url: '/api/home/banners', needAuth: false })
}

function getHotProducts() {
  return request<any[]>({ url: '/api/home/hot-products', needAuth: false })
}

// --- Menu ---
function getCategories() {
  return request<any[]>({ url: '/api/menu/categories', needAuth: false })
}

function getProducts(categoryId?: number) {
  const url = categoryId ? `/api/menu/products?category_id=${categoryId}` : '/api/menu/products'
  return request<any[]>({ url, needAuth: false })
}

function getSpecOptions() {
  return request<{ ice: any[]; sugar: any[]; topping: any[] }>({
    url: '/api/menu/spec-options',
    needAuth: false,
  })
}

// --- Stores ---
function getStores(keyword?: string, lat?: number, lng?: number) {
  const params: string[] = []
  if (keyword) params.push(`keyword=${encodeURIComponent(keyword)}`)
  if (lat !== undefined) params.push(`lat=${lat}`)
  if (lng !== undefined) params.push(`lng=${lng}`)
  const qs = params.length ? `?${params.join('&')}` : ''
  return request<any[]>({ url: `/api/stores${qs}`, needAuth: false })
}

function getStoreDetail(id: number) {
  return request<any>({ url: `/api/stores/${id}`, needAuth: false })
}

// --- Addresses ---
function getAddresses() {
  return request<any[]>({ url: '/api/addresses' })
}

function createAddress(data: any) {
  return request<any>({ url: '/api/addresses', method: 'POST', data })
}

function updateAddress(id: number, data: any) {
  return request<any>({ url: `/api/addresses/${id}`, method: 'PUT', data })
}

function deleteAddress(id: number) {
  return request<any>({ url: `/api/addresses/${id}`, method: 'DELETE' })
}

function setDefaultAddress(id: number) {
  return request<any>({ url: `/api/addresses/${id}/default`, method: 'PUT' })
}

// --- Orders ---
function createOrder(data: any) {
  return request<any>({ url: '/api/orders', method: 'POST', data })
}

function getOrders(status?: string) {
  const qs = status ? `?status=${status}` : ''
  return request<any[]>({ url: `/api/orders${qs}` })
}

function getOrderDetail(id: number) {
  return request<any>({ url: `/api/orders/${id}` })
}

function payOrder(id: number) {
  return request<any>({ url: `/api/orders/${id}/pay`, method: 'PUT' })
}

function cancelOrder(id: number) {
  return request<any>({ url: `/api/orders/${id}/cancel`, method: 'PUT' })
}

function deleteOrder(id: number) {
  return request<any>({ url: `/api/orders/${id}`, method: 'DELETE' })
}

function getOrderCount() {
  return request<any>({ url: '/api/orders/count' })
}

export {
  request,
  autoLogin,
  loginWithCode,
  updateProfile,
  getUserProfile,
  getBanners,
  getHotProducts,
  getCategories,
  getProducts,
  getSpecOptions,
  getStores,
  getStoreDetail,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  createOrder,
  getOrders,
  getOrderDetail,
  payOrder,
  cancelOrder,
  deleteOrder,
  getOrderCount,
}
