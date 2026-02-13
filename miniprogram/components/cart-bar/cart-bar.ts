Component({
  properties: {
    count: {
      type: Number,
      value: 0,
    },
    total: {
      type: Number,
      value: 0,
    },
  },

  observers: {
    total(val: number) {
      this.setData({
        totalText: val.toFixed(2),
      });
    },
  },

  data: {
    totalText: '0.00',
  },

  methods: {
    goCheckout() {
      if (this.data.count > 0) {
        this.triggerEvent('checkout');
      }
    },
  },
});
