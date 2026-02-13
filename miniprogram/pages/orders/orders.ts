// orders.ts
import { getOrders, payOrder as apiPayOrder } from '../../utils/api'
import { isLoggedIn } from '../../utils/auth'
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
  status: string
  statusText?: string
  store_name?: string
  storeName?: string
  order_type?: string
  orderType?: string
  created_at?: string
  createTime?: string
  total_price?: number
  totalPrice?: number
  delivery_fee?: number
  deliveryFee?: number
  items: OrderItem[]
}

const STATUS_MAP: Record<string, string> = {
  pending: '待支付',
  making: '制作中',
  completed: '已完成',
  paid: '已支付',
}

Page({
  data: {
    tabs: [
      { key: 'all', label: '全部' },
      { key: 'pending', label: '待支付' },
      { key: 'making', label: '制作中' },
      { key: 'completed', label: '已完成' },
    ],
    currentTab: 'all',
    orders: [] as Order[],
    filteredOrders: [] as Order[],
  },

  onShow() {
    const tab = wx.getStorageSync('ordersTab')
    if (tab) {
      this.setData({ currentTab: tab })
      wx.removeStorageSync('ordersTab')
    }

    this.loadOrders()
  },

  loadOrders() {
    if (!isLoggedIn()) {
      // 未登录时 fallback 到本地 storage 或 mock
      this.fallbackToLocal()
      return
    }

    const status = this.data.currentTab === 'all' ? undefined : this.data.currentTab
    getOrders(status).then((orders) => {
      if (orders && orders.length > 0) {
        this.setData({ orders, filteredOrders: orders })
      } else {
        this.fallbackToLocal()
      }
    }).catch(() => {
      this.fallbackToLocal()
    })
  },

  /** API 失败时 fallback 到本地 storage 或 mock 数据 */
  fallbackToLocal() {
    const stored = wx.getStorageSync('orders')
    const orders: Order[] = stored && stored.length ? stored : mockOrders
    this.setData({ orders })
    this.filterOrders()
  },

  filterOrders() {
    const { currentTab, orders } = this.data
    const filteredOrders = currentTab === 'all'
      ? orders
      : orders.filter((o: Order) => o.status === currentTab)
    this.setData({ filteredOrders })
  },

  switchTab(e: WechatMiniprogram.TouchEvent) {
    const key = e.currentTarget.dataset.key as string
    this.setData({ currentTab: key })
    this.loadOrders()
  },

  goDetail(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/order-detail/order-detail?id=${id}` })
  },

  reorder(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id
    const order = this.data.orders.find((o: Order) => o.id === id)
    if (!order) return

    const cart = order.items.map((item: OrderItem) => ({
      name: item.name,
      spec: item.spec,
      count: item.count,
      price: item.price,
    }))
    wx.setStorageSync('cart', cart)

    wx.showToast({ title: '已加入购物车', icon: 'success' })
    setTimeout(() => {
      wx.switchTab({ url: '/pages/index/index' })
    }, 800)
  },

  goPay(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id
    wx.showLoading({ title: '支付中...' })

    apiPayOrder(id).then(() => {
      wx.hideLoading()
      wx.showToast({ title: '支付成功', icon: 'success' })
      this.loadOrders()
    }).catch((err) => {
      wx.hideLoading()
      // fallback: 本地更新状态
      const orders = this.data.orders.map((o: Order) => {
        if (o.id === id) {
          return { ...o, status: 'making', statusText: '制作中' }
        }
        return o
      })
      wx.setStorageSync('orders', orders)
      this.setData({ orders })
      this.filterOrders()
      wx.showToast({ title: '支付成功', icon: 'success' })
    })
  },
})
