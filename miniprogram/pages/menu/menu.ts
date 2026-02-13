// pages/menu/menu.ts
import { getCategories, getProducts } from '../../utils/api'
import { categories as mockCategories, products as mockProducts } from '../../utils/mock-data'

const app = getApp<IAppOption>()

// mock 分类需要数字 id 以兼容 API 格式
const mockCatsWithId = mockCategories.map((c, i) => ({ ...c, id: c.id || i + 1, sort_order: i }))

Page({
  data: {
    categories: [] as any[],
    products: [] as any[],
    currentCategory: '' as any,
    currentCategoryName: '',
    filteredProducts: [] as any[],
    showSpec: false,
    selectedProduct: null as any,
    cartCount: 0,
    cartTotal: 0,
    storeName: '',
    orderType: 'pickup',
    deliveryAddress: '',
    usingMock: false,
  },

  onLoad() {
    const store = app.globalData.selectedStore as any
    if (store) {
      this.setData({ storeName: store.name })
    }

    const orderType = app.globalData.orderType || 'pickup'
    this.setData({ orderType })

    if (orderType === 'delivery') {
      const addr = app.globalData.selectedAddress as any
      if (addr) {
        this.setData({ deliveryAddress: addr.address || addr.detail || '' })
      }
    }

    this.loadCategories()
  },

  onShow() {
    this.setData({
      cartCount: app.getCartCount(),
      cartTotal: app.getCartTotal(),
    })
  },

  loadCategories() {
    getCategories().then((categories) => {
      if (categories && categories.length > 0) {
        this.setData({ categories, usingMock: false })
        const first = categories[0]
        this.setData({ currentCategory: first.id, currentCategoryName: first.name })
        this.loadProducts(first.id)
      } else {
        this.useMockData()
      }
    }).catch(() => {
      this.useMockData()
    })
  },

  useMockData() {
    const cats = mockCatsWithId
    this.setData({ categories: cats, usingMock: true })
    if (cats.length > 0) {
      const first = cats[0]
      this.setData({
        currentCategory: first.id,
        currentCategoryName: first.name,
        filteredProducts: mockProducts.filter(p => p.categoryId === first.id),
      })
    }
  },

  loadProducts(categoryId: any) {
    if (this.data.usingMock) {
      this.setData({
        filteredProducts: mockProducts.filter(p => p.categoryId === categoryId),
      })
      return
    }
    getProducts(categoryId).then((products) => {
      this.setData({ filteredProducts: products })
    }).catch(() => {
      this.setData({
        filteredProducts: mockProducts.filter(p => p.categoryId === categoryId),
      })
    })
  },

  switchCategory(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id
    const idVal = this.data.usingMock ? id : Number(id)
    if (idVal === this.data.currentCategory) return

    const cat = this.data.categories.find((c: any) => c.id === idVal)
    this.setData({
      currentCategory: idVal,
      currentCategoryName: cat ? cat.name : '',
    })
    this.loadProducts(idVal)
  },

  showSpecPopup(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id
    const product = this.data.filteredProducts.find((p: any) => p.id === id)
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

    this.setData({
      showSpec: false,
      cartCount: app.getCartCount(),
      cartTotal: app.getCartTotal(),
    })

    wx.showToast({ title: '已加入购物车', icon: 'success' })
  },

  onSpecClose() {
    this.setData({ showSpec: false })
  },

  goCart() {
    wx.navigateTo({ url: '/pages/order-confirm/order-confirm' })
  },

  goSelectStore() {},
})
