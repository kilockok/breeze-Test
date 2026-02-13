// app.ts
import { silentLogin } from './utils/auth'

App<IAppOption>({
  globalData: {
    userInfo: null,
    cart: [] as any[],
    selectedStore: null,
    addressList: [] as any[],
    selectedAddress: null,
    orderType: 'pickup' // 'pickup' | 'delivery'
  },
  onLaunch() {
    // 恢复购物车
    var cart = wx.getStorageSync('cart') || []
    this.globalData.cart = cart

    // 恢复用户信息（持久化）
    var userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.globalData.userInfo = userInfo
    }

    // 静默登录：有 token 时刷新，无 token 时不自动登录
    var token = wx.getStorageSync('token')
    if (token) {
      silentLogin().catch(function() {})
    }
  },

  // 保存购物车到本地
  saveCart() {
    wx.setStorageSync('cart', this.globalData.cart)
  },

  // 添加到购物车
  addToCart(item: any) {
    var cart = this.globalData.cart
    var existIndex = cart.findIndex(function(c: any) {
      return c.id === item.id &&
        c.ice === item.ice &&
        c.sugar === item.sugar &&
        JSON.stringify(c.toppings) === JSON.stringify(item.toppings)
    })
    if (existIndex > -1) {
      cart[existIndex].count += item.count || 1
    } else {
      cart.push({ ...item, count: item.count || 1 })
    }
    this.globalData.cart = cart
    this.saveCart()
  },

  // 获取购物车总数
  getCartCount(): number {
    return this.globalData.cart.reduce(function(sum: number, item: any) { return sum + item.count }, 0)
  },

  // 获取购物车总价
  getCartTotal(): number {
    return this.globalData.cart.reduce(function(sum: number, item: any) { return sum + item.price * item.count }, 0)
  },

  // 清空购物车
  clearCart() {
    this.globalData.cart = []
    this.saveCart()
  }
})
