// pages/order-confirm/order-confirm.ts
import { createOrder } from '../../utils/api'
import { isLoggedIn } from '../../utils/auth'

const app = getApp<IAppOption>()

interface ICartItem {
  id: string
  name: string
  price: number
  count: number
  ice?: string
  iceLabel?: string
  sugar?: string
  sugarLabel?: string
  toppings?: string[]
  toppingLabels?: string[]
  priceText?: string
}

interface IStore {
  id?: number
  name: string
  address: string
}

interface IAddress {
  name: string
  phone: string
  address?: string
  region?: string[]
  detail?: string
}

Page({
  data: {
    orderType: 'pickup' as 'pickup' | 'delivery',
    store: null as IStore | null,
    address: null as IAddress | null,
    cartItems: [] as ICartItem[],
    remark: '',
    subtotal: 0,
    subtotalText: '0.00',
    deliveryFee: 0,
    deliveryFeeText: '0.00',
    totalPrice: 0,
    totalPriceText: '0.00'
  },

  onLoad() {
    const globalData = app.globalData
    const orderType = globalData.orderType || 'pickup'
    const store = globalData.selectedStore as IStore | null
    const address = globalData.selectedAddress as IAddress | null
    const cart = (globalData.cart || []) as ICartItem[]

    const cartItems = cart.map(item => ({
      ...item,
      priceText: (item.price * item.count).toFixed(2)
    }))

    this.setData({
      orderType,
      store,
      address,
      cartItems
    })

    this.calcTotal()
  },

  onShow() {
    const address = app.globalData.selectedAddress as IAddress | null
    if (address) {
      this.setData({ address })
    }
  },

  calcTotal() {
    const { cartItems, orderType } = this.data
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.count, 0)
    let deliveryFee = 0
    if (orderType === 'delivery') {
      deliveryFee = subtotal >= 30 ? 0 : 5
    }
    const totalPrice = subtotal + deliveryFee

    this.setData({
      subtotal,
      subtotalText: subtotal.toFixed(2),
      deliveryFee,
      deliveryFeeText: deliveryFee.toFixed(2),
      totalPrice,
      totalPriceText: totalPrice.toFixed(2)
    })
  },

  onRemarkInput(e: WechatMiniprogram.Input) {
    this.setData({ remark: e.detail.value })
  },

  changeAddress() {
    wx.navigateTo({ url: '/pages/address/address' })
  },

  submitOrder() {
    const { orderType, store, address, cartItems, totalPriceText } = this.data

    if (!cartItems.length) {
      wx.showToast({ title: '购物车为空', icon: 'none' })
      return
    }
    if (orderType === 'pickup' && !store) {
      wx.showToast({ title: '请选择取餐门店', icon: 'none' })
      return
    }
    if (orderType === 'delivery' && !address) {
      wx.showToast({ title: '请选择配送地址', icon: 'none' })
      return
    }

    if (!isLoggedIn()) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      return
    }

    wx.showModal({
      title: '确认支付',
      content: `支付金额 ¥${totalPriceText}`,
      confirmText: '立即支付',
      confirmColor: '#F5A623',
      success: (res) => {
        if (!res.confirm) return

        wx.showLoading({ title: '提交中...', mask: true })

        // Build spec string for each item
        const items = cartItems.map(item => {
          const specParts: string[] = []
          if (item.iceLabel) specParts.push(item.iceLabel)
          if (item.sugarLabel) specParts.push(item.sugarLabel)
          if (item.toppingLabels && item.toppingLabels.length) {
            specParts.push(...item.toppingLabels)
          }
          return {
            product_id: typeof item.id === 'number' ? item.id : null,
            name: item.name,
            spec: specParts.join('/'),
            count: item.count,
            price: item.price,
          }
        })

        let addressSnapshot = null
        if (address) {
          addressSnapshot = {
            name: address.name,
            phone: address.phone,
            address: address.address || (address.region ? address.region.join('') + address.detail : address.detail || ''),
          }
        }

        createOrder({
          order_type: orderType,
          store_id: store && (store as any).id ? (store as any).id : null,
          store_name: store ? store.name : '',
          address_snapshot: addressSnapshot,
          remark: this.data.remark,
          items,
        }).then((order) => {
          wx.hideLoading()
          app.clearCart()

          wx.showToast({ title: '下单成功', icon: 'success', duration: 1500 })

          setTimeout(() => {
            wx.redirectTo({
              url: `/pages/order-detail/order-detail?id=${order.id}`,
              fail: () => {
                wx.switchTab({ url: '/pages/orders/orders' })
              }
            })
          }, 1500)
        }).catch((err) => {
          wx.hideLoading()
          wx.showToast({ title: err.message || '下单失败', icon: 'none' })
        })
      }
    })
  }
})
