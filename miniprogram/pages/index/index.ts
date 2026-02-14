// index.ts
import { getBanners } from '../../utils/api'
import { banners as mockBanners, products as mockProducts } from '../../utils/mock-data'
import { isLoggedIn } from '../../utils/auth'

const app = getApp<IAppOption>()

Page({
  data: {
    statusBarHeight: 20,
    navBarHeight: 44,
    banners: [] as any[],
    currentBanner: 0,
    nickName: '',
    isLoggedIn: false,
    screenRatio: 1,
    recommendProducts: [] as any[],
    showSpec: false,
    selectedProduct: null as any,
  },

  onLoad() {
    const sysInfo = wx.getWindowInfo()
    const menuBtn = wx.getMenuButtonBoundingClientRect()
    const statusBarHeight = sysInfo.statusBarHeight || 20
    const navBarHeight = (menuBtn.top - statusBarHeight) * 2 + menuBtn.height

    const screenWidth = sysInfo.windowWidth || 375
    const screenRatio = screenWidth / 375

    this.setData({
      statusBarHeight,
      navBarHeight,
      screenRatio,
    })

    this.loadData()
    this.loadRecommend()
  },

  onShow() {
    this.refreshUserState()
  },

  refreshUserState() {
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo')
    if (userInfo && isLoggedIn()) {
      this.setData({
        isLoggedIn: true,
        nickName: userInfo.nickName || userInfo.nick_name || '茶友',
      })
    } else {
      this.setData({
        isLoggedIn: false,
        nickName: '',
      })
    }
  },

  loadData() {
    getBanners().then(function(banners) {
      if (banners && banners.length > 0) {
        this.setData({ banners: banners })
      } else {
        this.setData({ banners: mockBanners })
      }
    }.bind(this)).catch(function() {
      this.setData({ banners: mockBanners })
    }.bind(this))
  },

  loadRecommend() {
    // 取热门商品前 6 个作为推荐
    const hotProducts = mockProducts
      .filter(function(p) { return p.categoryId === 'hot' })
      .slice(0, 6)

    // 如果热门不足 6 个，补充其他高销量商品
    if (hotProducts.length < 6) {
      const rest = mockProducts
        .filter(function(p) { return p.categoryId !== 'hot' })
        .sort(function(a, b) { return b.sales - a.sales })
        .slice(0, 6 - hotProducts.length)
      hotProducts.push(...rest)
    }

    this.setData({ recommendProducts: hotProducts })
  },

  onBannerChange(e: WechatMiniprogram.SwiperChange) {
    this.setData({
      currentBanner: e.detail.current,
    })
  },

  showRecommendSpec(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id
    const product = this.data.recommendProducts.find(function(p: any) { return p.id === id })
    if (!product) return
    this.setData({ selectedProduct: product, showSpec: true })
  },

  onSpecConfirm(e: WechatMiniprogram.CustomEvent) {
    const { product, specs, count, totalPrice } = e.detail

    app.addToCart({
      id: product.id,
      name: product.name,
      price: totalPrice / count,
      image: product.image,
      ice: specs.ice,
      iceLabel: specs.iceLabel,
      sugar: specs.sugar,
      sugarLabel: specs.sugarLabel,
      toppings: specs.toppings,
      toppingLabels: specs.toppingLabels,
      count,
    })

    this.setData({ showSpec: false })
    wx.showToast({ title: '已加入购物车', icon: 'success' })
  },

  onSpecClose() {
    this.setData({ showSpec: false })
  },

  goPickup() {
    wx.navigateTo({ url: '/pages/pickup/pickup' })
  },

  goDelivery() {
    wx.navigateTo({ url: '/pages/delivery/delivery' })
  },

  goMenu() {
    wx.switchTab({ url: '/pages/menu/menu' })
  },
})
