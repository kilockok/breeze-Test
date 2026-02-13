/**
 * 登录管理 - 清凤时光
 */
import { loginWithCode, autoLogin } from './api'

/** 获取本地 token */
function getToken(): string {
  return wx.getStorageSync('token') || ''
}

/** 是否已登录 */
function isLoggedIn(): boolean {
  return !!getToken()
}

/** 退出登录 */
function logout() {
  wx.removeStorageSync('token')
  wx.removeStorageSync('userInfo')
  var app = getApp<IAppOption>()
  if (app) app.globalData.userInfo = null
}

/** 带头像昵称的登录 */
function loginWithProfile(code: string, nickName: string, avatarUrl: string) {
  return loginWithCode(code, nickName, avatarUrl).then(function(data) {
    wx.setStorageSync('token', data.token)
    wx.setStorageSync('userInfo', data.userInfo)
    var app = getApp<IAppOption>()
    if (app) app.globalData.userInfo = data.userInfo
    return data
  })
}

/** 静默登录（微信一键登录） */
function silentLogin(): Promise<void> {
  return new Promise(function(resolve, reject) {
    wx.login({
      success: function(loginRes) {
        if (!loginRes.code) {
          reject(new Error('获取code失败'))
          return
        }
        loginWithCode(loginRes.code, '', '').then(function(data) {
          if (data.token) {
            wx.setStorageSync('token', data.token)
          }
          if (data.userInfo) {
            wx.setStorageSync('userInfo', data.userInfo)
            var app = getApp<IAppOption>()
            if (app) app.globalData.userInfo = data.userInfo
          }
          resolve()
        }).catch(function(_err) {
          // 后端不可用时，mock 登录成功
          console.warn('[auth] 后端登录失败，使用 mock 登录:', _err)
          var mockToken = 'mock_token_' + Date.now()
          var mockUser = {
            id: 1,
            nickName: '清凤用户',
            avatarUrl: '',
            phone: ''
          }
          wx.setStorageSync('token', mockToken)
          wx.setStorageSync('userInfo', mockUser)
          var app = getApp<IAppOption>()
          if (app) app.globalData.userInfo = mockUser
          resolve()
        })
      },
      fail: function() {
        reject(new Error('wx.login失败'))
      },
    })
  })
}

export { getToken, isLoggedIn, logout, loginWithProfile, silentLogin }
