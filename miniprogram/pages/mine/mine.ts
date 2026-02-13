import { getOrderCount } from '../../utils/api'
import { isLoggedIn, logout as authLogout, loginWithProfile } from '../../utils/auth'

const mineApp = getApp<IAppOption>()

Page({
  data: {
    userInfo: null as any,
    isLoggedIn: false,
    pendingCount: 0,
    makingCount: 0,
    tempAvatarUrl: '',
    tempNickname: '',
  },

  onShow() {
    const userInfo = mineApp.globalData.userInfo || wx.getStorageSync('userInfo')
    if (userInfo && isLoggedIn()) {
      mineApp.globalData.userInfo = userInfo
      this.setData({
        userInfo: userInfo,
        isLoggedIn: true,
      })
    } else {
      this.setData({
        userInfo: null,
        isLoggedIn: false,
      })
    }

    this.countOrders()
  },

  countOrders() {
    if (!isLoggedIn()) {
      this.setData({ pendingCount: 0, makingCount: 0 })
      return
    }

    getOrderCount().then(function(counts) {
      this.setData({
        pendingCount: counts.pending || 0,
        makingCount: counts.making || 0,
      })
    }.bind(this)).catch(function() {})
  },

  /** 用户选择头像回调 */
  onChooseAvatar(e: any) {
    var avatarUrl = e.detail.avatarUrl
    if (avatarUrl) {
      this.setData({ tempAvatarUrl: avatarUrl })
    }
  },

  /** 昵称输入回调 */
  onNicknameInput(e: any) {
    var value = (e.detail && e.detail.value) || ''
    this.setData({ tempNickname: value })
  },

  /** 确认登录：拿 code + 头像 + 昵称 调后端 */
  confirmLogin() {
    var self = this
    var nickname = (this.data.tempNickname || '').replace(/^\s+|\s+$/g, '')
    var avatarUrl = this.data.tempAvatarUrl || ''

    if (!avatarUrl) {
      wx.showToast({ title: '请先选择头像', icon: 'none' })
      return
    }
    if (!nickname) {
      wx.showToast({ title: '请输入昵称', icon: 'none' })
      return
    }

    wx.showLoading({ title: '登录中...' })

    wx.login({
      success: function(loginRes) {
        if (!loginRes.code) {
          wx.hideLoading()
          wx.showToast({ title: '获取登录凭证失败', icon: 'none' })
          return
        }
        loginWithProfile(loginRes.code, nickname, avatarUrl).then(function() {
          wx.hideLoading()
          var userInfo = mineApp.globalData.userInfo || wx.getStorageSync('userInfo')
          self.setData({
            userInfo: userInfo,
            isLoggedIn: true,
            tempAvatarUrl: '',
            tempNickname: '',
          })
          wx.showToast({ title: '登录成功', icon: 'success' })
          self.countOrders()
        }).catch(function() {
          wx.hideLoading()
          wx.showToast({ title: '登录失败，请重试', icon: 'none' })
        })
      },
      fail: function() {
        wx.hideLoading()
        wx.showToast({ title: '微信登录失败', icon: 'none' })
      },
    })
  },

  goOrders(e: WechatMiniprogram.TouchEvent) {
    var tab = e.currentTarget.dataset.tab || 'all'
    wx.switchTab({
      url: '/pages/orders/orders',
      success: function() {
        wx.setStorageSync('ordersTab', tab)
      },
    })
  },

  goAddress() {
    wx.navigateTo({ url: '/pages/address/address' })
  },

  goProfile() {
    if (!this.data.isLoggedIn) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    wx.showToast({ title: '功能开发中', icon: 'none' })
  },

  contactService() {
    wx.makePhoneCall({
      phoneNumber: '400-888-8888',
      fail: function() {
        wx.setClipboardData({
          data: '400-888-8888',
          success: function() {
            wx.showToast({ title: '客服电话已复制', icon: 'none' })
          },
        })
      },
    })
  },

  goAbout() {
    wx.showModal({
      title: '关于我们',
      content: '清凤时光 — 用心做好每一杯茶\n\n版本：v1.0.0',
      showCancel: false,
      confirmText: '知道了',
      confirmColor: '#F5A623',
    })
  },

  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      confirmColor: '#F5A623',
      success: function(res) {
        if (res.confirm) {
          authLogout()
          this.setData({
            userInfo: null,
            isLoggedIn: false,
            pendingCount: 0,
            makingCount: 0,
          })
          wx.showToast({ title: '已退出登录', icon: 'none' })
        }
      }.bind(this),
    })
  },
})
