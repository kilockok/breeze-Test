import { getSpecOptions } from '../../utils/api'
import { iceOptions as mockIce, sugarOptions as mockSugar, toppingOptions as mockTopping } from '../../utils/mock-data'

Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    product: {
      type: Object,
      value: null,
    },
  },

  data: {
    iceOptions: [] as any[],
    sugarOptions: [] as any[],
    toppingOptions: [] as any[],
    selectedIce: 'normal',
    selectedSugar: 'full',
    selectedToppings: [] as string[],
    count: 1,
    totalPrice: 0,
    optionsLoaded: false,
  },

  lifetimes: {
    attached() {
      this.loadSpecOptions()
    },
  },

  observers: {
    'product': function (product: any) {
      if (product) {
        this.resetSelections()
        this.calcPrice()
      }
    },
    'show': function (show: boolean) {
      if (show) {
        if (!this.data.optionsLoaded) {
          this.loadSpecOptions()
        }
        this.resetSelections()
        this.calcPrice()
      }
    },
  },

  methods: {
    loadSpecOptions() {
      getSpecOptions().then((data) => {
        this.setData({
          iceOptions: data.ice || [],
          sugarOptions: data.sugar || [],
          toppingOptions: data.topping || [],
          optionsLoaded: true,
        })
      }).catch(() => {
        // Fallback to mock data
        this.setData({
          iceOptions: mockIce,
          sugarOptions: mockSugar,
          toppingOptions: mockTopping,
          optionsLoaded: true,
        })
      })
    },

    resetSelections() {
      this.setData({
        selectedIce: 'normal',
        selectedSugar: 'full',
        selectedToppings: [],
        count: 1,
      })
    },

    selectIce(e: WechatMiniprogram.TouchEvent) {
      const value = e.currentTarget.dataset.value as string
      this.setData({ selectedIce: value })
    },

    selectSugar(e: WechatMiniprogram.TouchEvent) {
      const value = e.currentTarget.dataset.value as string
      this.setData({ selectedSugar: value })
    },

    toggleTopping(e: WechatMiniprogram.TouchEvent) {
      const value = e.currentTarget.dataset.value as string
      const toppings = [...this.data.selectedToppings]
      const index = toppings.indexOf(value)

      if (index === -1) {
        toppings.push(value)
      } else {
        toppings.splice(index, 1)
      }

      this.setData({ selectedToppings: toppings })
      this.calcPrice()
    },

    changeCount(e: WechatMiniprogram.TouchEvent) {
      const type = e.currentTarget.dataset.type as string
      let count = this.data.count

      if (type === 'plus') {
        count++
      } else if (type === 'minus' && count > 1) {
        count--
      }

      this.setData({ count })
      this.calcPrice()
    },

    calcPrice() {
      const product = this.properties.product as any
      if (!product) return

      const basePrice = product.price || 0
      const toppingPrice = this.data.selectedToppings.reduce((sum: number, val: string) => {
        const topping = this.data.toppingOptions.find((t: any) => t.value === val)
        return sum + (topping ? topping.price : 0)
      }, 0)

      const totalPrice = (basePrice + toppingPrice) * this.data.count
      this.setData({ totalPrice })
    },

    confirm() {
      const { selectedIce, selectedSugar, selectedToppings, count, totalPrice } = this.data
      const product = this.properties.product as any

      const iceItem = this.data.iceOptions.find((o: any) => o.value === selectedIce)
      const iceLabel = iceItem ? iceItem.label : ''
      const sugarItem = this.data.sugarOptions.find((o: any) => o.value === selectedSugar)
      const sugarLabel = sugarItem ? sugarItem.label : ''
      const toppingLabels = selectedToppings.map((val: string) => {
        const t = this.data.toppingOptions.find((t: any) => t.value === val)
        return t ? t.label : ''
      }).filter(Boolean)

      this.triggerEvent('confirm', {
        product,
        specs: {
          ice: selectedIce,
          iceLabel,
          sugar: selectedSugar,
          sugarLabel,
          toppings: selectedToppings,
          toppingLabels,
        },
        count,
        totalPrice,
      })
    },

    close() {
      this.triggerEvent('close')
    },

    preventScroll() {},
  },
})
