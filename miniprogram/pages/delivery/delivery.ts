import { getAddresses } from '../../utils/api'
import { isLoggedIn } from '../../utils/auth'

const app = getApp<IAppOption>()

interface IAddress {
  id: any
  name: string
  phone: string
  region?: string[]
  detail?: string
  address?: string
  is_default?: boolean
  isDefault?: boolean
}

Page({
  data: {
    selectedAddress: null as any,
    deliveryFee: 5,
    freeDeliveryThreshold: 30,
  },

  onLoad() {
    app.globalData.orderType = 'delivery'
  },

  onShow() {
    // Check if address was selected via globalData
    const address = app.globalData.selectedAddress as any
    if (address) {
      this.setData({ selectedAddress: address })
      return
    }

    // Otherwise try to load default address
    this.loadDefaultAddress()
  },

  loadDefaultAddress() {
    if (isLoggedIn()) {
      getAddresses().then((list) => {
        if (list && list.length > 0) {
          this.pickDefault(list)
        } else {
          this.fallbackAddress()
        }
      }).catch(() => {
        this.fallbackAddress()
      })
    } else {
      this.fallbackAddress()
    }
  },

  /** 从列表中选出默认地址 */
  pickDefault(list: IAddress[]) {
    const defaultAddr = list.find((a) => a.is_default || a.isDefault) || list[0]
    const addr = {
      ...defaultAddr,
      address: (defaultAddr.region || []).join('') + (defaultAddr.detail || ''),
    }
    this.setData({ selectedAddress: addr })
    app.globalData.selectedAddress = addr
  },

  /** fallback 到 globalData / localStorage */
  fallbackAddress() {
    const addressList: any[] = (app.globalData as any).addressList || wx.getStorageSync('addressList') || []
    if (addressList.length > 0) {
      this.pickDefault(addressList)
    }
  },

  chooseAddress() {
    wx.navigateTo({ url: '/pages/address/address' })
  },

  startOrder() {
    if (!this.data.selectedAddress) return
    app.globalData.orderType = 'delivery'
    wx.navigateTo({ url: '/pages/menu/menu' })
  },
})
