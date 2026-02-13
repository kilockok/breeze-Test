import {
  getOrderDetail,
  payOrder as apiPayOrder,
  cancelOrder as apiCancelOrder,
  deleteOrder as apiDeleteOrder,
} from '../../utils/api'
import { mockOrders } from '../../utils/mock-data'

interface OrderItem {
  name: string
  spec: string
  count: number
  price: number
}

interface Order {
  id: any
  order_no?: string
  orderId?: string
  status: string
  order_type?: string
  orderType?: string
  store_name?: string
  storeName?: string
  storePhone?: string
  address_snapshot?: any
  address?: string
  items: OrderItem[]
  subtotal?: number
  delivery_fee?: number
  deliveryFee?: number
  total_price?: number
  totalPrice?: number
  created_at?: string
  createTime?: string
  remark?: string
}

Page({
  data: {
    order: null as Order | null,
    orderId: '' as any,
  },

  onLoad(options: Record<string, string | undefined>) {
    const id = options.id || ''
    this.setData({ orderId: id })
    this.loadOrder(id)
  },

  loadOrder(id: any) {
    if (!id) return

    const numId = Number(id)

    // 先尝试 API
    if (numId) {
      getOrderDetail(numId).then((order) => {
        if (order) {
          this.setData({ order })
        } else {
          this.fallbackOrder(id)
        }
      }).catch(() => {
        this.fallbackOrder(id)
      })
    } else {
      this.fallbackOrder(id)
    }
  },

  /** API 失败时 fallback 到本地 storage 或 mock */
  fallbackOrder(id: any) {
    // 先查本地 storage
    const orders: any[] = wx.getStorageSync('orders') || []
    let found = orders.find((o) => o.id === id || o.orderId === id || o.order_no === id)

    if (!found) {
      // 再查 mock 数据
      found = mockOrders.find((o) => o.id === id)
    }

    if (found) {
      // 统一字段名
      const order = {
        ...found,
        order_no: found.order_no || found.orderId || found.id,
        store_name: found.store_name || found.storeName || '茶悦时光',
        order_type: found.order_type || found.orderType || 'pickup',
        total_price: found.total_price || found.totalPrice || 0,
        delivery_fee: found.delivery_fee || found.deliveryFee || 0,
        subtotal: found.subtotal || (found.total_price || found.totalPrice || 0) - (found.delivery_fee || found.deliveryFee || 0),
        created_at: found.created_at || found.createTime || '',
      }
      this.setData({ order })
    } else {
      wx.showToast({ title: '订单不存在', icon: 'none' })
    }
  },

  copyOrderId() {
    const order = this.data.order
    if (!order) return

    wx.setClipboardData({
      data: order.order_no || order.orderId || String(order.id),
      success: () => {
        wx.showToast({ title: '已复制', icon: 'success' })
      },
    })
  },

  cancelOrder() {
    wx.showModal({
      title: '提示',
      content: '确定要取消该订单吗？',
      confirmColor: '#F5A623',
      success: (res) => {
        if (!res.confirm) return

        const numId = Number(this.data.orderId)
        if (numId) {
          apiCancelOrder(numId).then((order) => {
            this.setData({ order })
            wx.showToast({ title: '订单已取消', icon: 'success' })
            setTimeout(() => wx.navigateBack(), 1200)
          }).catch(() => {
            // fallback: 本地更新
            this.localUpdateStatus('completed')
            wx.showToast({ title: '订单已取消', icon: 'success' })
            setTimeout(() => wx.navigateBack(), 1200)
          })
        } else {
          this.localUpdateStatus('completed')
          wx.showToast({ title: '订单已取消', icon: 'success' })
          setTimeout(() => wx.navigateBack(), 1200)
        }
      },
    })
  },

  goPay() {
    wx.showLoading({ title: '支付中...' })

    const numId = Number(this.data.orderId)
    if (numId) {
      apiPayOrder(numId).then((order) => {
        wx.hideLoading()
        this.setData({ order })
        wx.showToast({ title: '支付成功', icon: 'success' })
      }).catch(() => {
        wx.hideLoading()
        this.localUpdateStatus('making')
        wx.showToast({ title: '支付成功', icon: 'success' })
      })
    } else {
      wx.hideLoading()
      this.localUpdateStatus('making')
      wx.showToast({ title: '支付成功', icon: 'success' })
    }
  },

  /** 本地更新订单状态 */
  localUpdateStatus(status: string) {
    const order = this.data.order
    if (order) {
      this.setData({ 'order.status': status })
    }
    const orders: any[] = wx.getStorageSync('orders') || []
    const idx = orders.findIndex((o) => o.id === this.data.orderId || o.orderId === this.data.orderId)
    if (idx !== -1) {
      orders[idx].status = status
      wx.setStorageSync('orders', orders)
    }
  },

  reorder() {
    const order = this.data.order
    if (!order) return

    const cart = order.items.map((item) => ({
      name: item.name,
      spec: item.spec,
      count: item.count,
      price: item.price,
    }))
    wx.setStorageSync('cart', cart)

    wx.showToast({ title: '已加入购物车', icon: 'success' })
    setTimeout(() => {
      wx.switchTab({ url: '/pages/menu/menu' })
    }, 1200)
  },

  contactStore() {
    wx.makePhoneCall({
      phoneNumber: '400-888-8888',
      fail: () => {
        wx.showToast({ title: '拨号取消', icon: 'none' })
      },
    })
  },

  deleteOrder() {
    wx.showModal({
      title: '提示',
      content: '确定要删除该订单吗？删除后不可恢复。',
      confirmColor: '#F5A623',
      success: (res) => {
        if (!res.confirm) return

        const numId = Number(this.data.orderId)
        if (numId) {
          apiDeleteOrder(numId).then(() => {
            wx.showToast({ title: '已删除', icon: 'success' })
            setTimeout(() => wx.navigateBack(), 1200)
          }).catch(() => {
            this.localDeleteOrder()
          })
        } else {
          this.localDeleteOrder()
        }
      },
    })
  },

  localDeleteOrder() {
    const orders: any[] = wx.getStorageSync('orders') || []
    const updated = orders.filter((o) => o.id !== this.data.orderId && o.orderId !== this.data.orderId)
    wx.setStorageSync('orders', updated)
    wx.showToast({ title: '已删除', icon: 'success' })
    setTimeout(() => wx.navigateBack(), 1200)
  },
})
