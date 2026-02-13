// index.ts
import { getBanners } from '../../utils/api'
import { banners as mockBanners } from '../../utils/mock-data'
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
  },

  onLoad() {
    const sysInfo = wx.getWindowInfo()
    const menuBtn = wx.getMenuButtonBoundingClientRect()
    const statusBarHeight = sysInfo.statusBarHeight || 20
    const navBarHeight = (menuBtn.top - statusBarHeight) * 2 + menuBtn.height

    // 动态 DPI 适配：以 375 为基准计算缩放比
    const screenWidth = sysInfo.windowWidth || 375
    const screenRatio = screenWidth / 375

    this.setData({
      statusBarHeight,
      navBarHeight,
      screenRatio,
    })

    this.loadData()
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

  onBannerChange(e: WechatMiniprogram.SwiperChange) {
    this.setData({
      currentBanner: e.detail.current,
    })
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
