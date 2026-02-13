// pages/pickup/pickup.ts
import { getStores } from '../../utils/api'
import { stores as mockStores } from '../../utils/mock-data'

const app = getApp<IAppOption>()

interface StoreItem {
  id: any
  name: string
  address: string
  distance: number | null
  distanceText: string
  lat: number
  lng: number
  hours: string
  phone: string
}

Page({
  data: {
    stores: [] as StoreItem[],
    latitude: 31.2304,
    longitude: 121.4737,
    markers: [] as any[],
    showMap: true,
    searchValue: ''
  },

  onLoad() {
    this.loadStores()
    this.getUserLocation()
  },

  loadStores(keyword?: string, lat?: number, lng?: number) {
    getStores(keyword, lat, lng).then((list) => {
      const stores = list.map((s: any) => ({
        ...s,
        distanceText: s.distance != null
          ? (s.distance < 1 ? `${(s.distance * 1000).toFixed(0)}m` : `${s.distance.toFixed(1)}km`)
          : ''
      }))
      this.setData({ stores, markers: this.generateMarkers(stores) })
    }).catch(() => {
      // Fallback to mock
      this.useMockStores(keyword)
    })
  },

  useMockStores(keyword?: string) {
    let list = mockStores
    if (keyword) {
      const kw = keyword.toLowerCase()
      list = list.filter(s => s.name.toLowerCase().includes(kw) || s.address.toLowerCase().includes(kw))
    }
    const stores = list.map(s => ({
      ...s,
      distanceText: s.distance < 1 ? `${(s.distance * 1000).toFixed(0)}m` : `${s.distance.toFixed(1)}km`
    }))
    stores.sort((a, b) => a.distance - b.distance)
    this.setData({ stores, markers: this.generateMarkers(stores) })
  },

  getUserLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const { latitude, longitude } = res
        this.setData({ latitude, longitude })
        this.loadStores(undefined, latitude, longitude)
      },
      fail: () => {
        console.log('获取位置失败，使用默认坐标')
      }
    })
  },

  generateMarkers(stores: StoreItem[]) {
    return stores.map((store, index) => ({
      id: index,
      latitude: store.lat,
      longitude: store.lng,
      width: 32,
      height: 32,
      iconPath: '/images/marker.png',
      callout: {
        content: store.name,
        display: 'BYCLICK',
        fontSize: 12,
        borderRadius: 8,
        padding: 6,
        bgColor: '#ffffff',
        color: '#333333'
      }
    }))
  },

  selectStore(e: WechatMiniprogram.TouchEvent) {
    const index = e.currentTarget.dataset.index
    const store = this.data.stores[index]
    if (!store) return

    app.globalData.selectedStore = store
    wx.navigateTo({ url: '/pages/menu/menu' })
  },

  openMap(e: WechatMiniprogram.TouchEvent) {
    const store = e.currentTarget.dataset.store
    if (!store) return

    wx.openLocation({
      latitude: store.lat,
      longitude: store.lng,
      name: store.name,
      address: store.address,
      scale: 16
    })
  },

  onSearch(e: WechatMiniprogram.Input) {
    const keyword = e.detail.value.trim()
    this.setData({ searchValue: e.detail.value })

    const { latitude, longitude } = this.data
    this.loadStores(keyword || undefined, latitude, longitude)
  }
})
