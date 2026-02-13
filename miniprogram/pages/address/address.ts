import {
  getAddresses,
  deleteAddress as apiDeleteAddress,
  setDefaultAddress,
} from '../../utils/api'
import { isLoggedIn } from '../../utils/auth'

const app = getApp<IAppOption>()

interface IAddress {
  id: any
  name: string
  phone: string
  region: string[]
  detail: string
  is_default?: boolean
  isDefault?: boolean
}

Page({
  data: {
    addressList: [] as IAddress[],
  },

  onShow() {
    this.loadAddresses()
  },

  loadAddresses() {
    if (!isLoggedIn()) {
      // 未登录 fallback 到 globalData
      this.fallbackToLocal()
      return
    }

    getAddresses().then((list) => {
      if (list && list.length > 0) {
        this.setData({ addressList: list })
      } else {
        this.fallbackToLocal()
      }
    }).catch(() => {
      this.fallbackToLocal()
    })
  },

  /** API 失败时 fallback 到 globalData / localStorage */
  fallbackToLocal() {
    const addressList = (app.globalData as any).addressList || wx.getStorageSync('addressList') || []
    this.setData({ addressList })
  },

  selectAddress(e: WechatMiniprogram.TouchEvent) {
    const index = e.currentTarget.dataset.index
    const address = this.data.addressList[index]
    ;(app.globalData as any).selectedAddress = {
      ...address,
      address: (address.region || []).join('') + (address.detail || ''),
    }
    wx.navigateBack()
  },

  editAddress(e: WechatMiniprogram.TouchEvent) {
    const index = e.currentTarget.dataset.index
    const address = this.data.addressList[index]
    wx.navigateTo({
      url: `/pages/address-edit/address-edit?id=${address.id}`,
    })
  },

  deleteAddress(e: WechatMiniprogram.TouchEvent) {
    const index = e.currentTarget.dataset.index
    const address = this.data.addressList[index]
    wx.showModal({
      title: '提示',
      content: '确定要删除该地址吗？',
      success: (res) => {
        if (!res.confirm) return

        const numId = Number(address.id)
        if (numId && isLoggedIn()) {
          apiDeleteAddress(numId).then(() => {
            wx.showToast({ title: '已删除', icon: 'success' })
            this.loadAddresses()
          }).catch(() => {
            this.localDeleteAddress(index)
          })
        } else {
          this.localDeleteAddress(index)
        }
      },
    })
  },

  /** 本地删除地址 */
  localDeleteAddress(index: number) {
    const list = [...this.data.addressList]
    list.splice(index, 1)
    this.setData({ addressList: list })
    ;(app.globalData as any).addressList = list
    wx.setStorageSync('addressList', list)
    wx.showToast({ title: '已删除', icon: 'success' })
  },

  setDefault(e: WechatMiniprogram.TouchEvent) {
    const index = e.currentTarget.dataset.index
    const address = this.data.addressList[index]

    const numId = Number(address.id)
    if (numId && isLoggedIn()) {
      setDefaultAddress(numId).then(() => {
        wx.showToast({ title: '已设为默认', icon: 'success' })
        this.loadAddresses()
      }).catch(() => {
        this.localSetDefault(index)
      })
    } else {
      this.localSetDefault(index)
    }
  },

  /** 本地设置默认地址 */
  localSetDefault(index: number) {
    const list = this.data.addressList.map((item, i) => ({
      ...item,
      isDefault: i === index,
      is_default: i === index,
    }))
    this.setData({ addressList: list })
    ;(app.globalData as any).addressList = list
    wx.setStorageSync('addressList', list)
    wx.showToast({ title: '已设为默认', icon: 'success' })
  },

  addAddress() {
    wx.navigateTo({
      url: '/pages/address-edit/address-edit',
    })
  },
})
