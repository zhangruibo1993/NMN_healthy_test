// components/product/product.js
Component({
  properties: {
    productData: {
      type: Object,
      value: {}
    },
    isEdit: {
      type: Boolean,
      value: false
    }
  },
  data: {
  },
  methods: {
    // 点击数量减1按钮
    handleMinus() {
      if (this.data.productData.count === 1) {
        return
      }
      const productData = this.data.productData
      productData.count--
      this.triggerEvent('UpdateProductCount', productData.count)
    },
    // 点击数量加1按钮
    handlePlus() {
      const productData = this.data.productData
      productData.count++
      this.triggerEvent('UpdateProductCount', productData.count)
    },
    handleCountChange(e) {
      const value = e.detail.value
      const productData = this.data.productData
      // 判断输入的数量是否为正整数，不是则重置为1
      if (!(/(^[1-9]\d*$)/.test(value))) {
        productData.count = 1
      } else {
        productData.count = value
      }
      this.triggerEvent('UpdateProductCount', productData.count)
    },
    handleDetail() {
      wx.navigateTo({
        url: '/pages/vip/productdetail/productdetail',
      })
    }
  }
})
