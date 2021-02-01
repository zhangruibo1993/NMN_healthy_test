// pages/buy/buy.js
import { pay, rewardPay } from '../../utils/api'
Page({
  data: {
    isShowAddressBtn: false, // 是否显示选择收获地址按钮
    userInfo: {},
    rewardMoney: 0, // 奖励金抵扣金额
    rewardMoneyText: '0.00', // 奖励金抵扣金额显示
    money: 0, // 奖励金抵扣后仍需支付金额
    moneyText: '0.00', // 奖励金抵扣后仍需支付金额显示
    addressData: {},
    productData: {},
    bussinessType: '', // 支付时的交易类型
    group_id: '', // 拼团支付时-拼团Id
    groupReference: '', // 拼团支付时-拼团推荐人Id
    isDisabled: false // 购买按钮是否可点击
  },
  onLoad: function (options) {
  },
  onReady: function () {
    this.getProductData()
    this.getUserInfo()
    this.getAddress()
  },
  onShow: function () {
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  onPullDownRefresh: function () {
  },
  onReachBottom: function () {
  },
  onShareAppMessage: function () {
  },
  // 从跳转来的页面获取产品价格信息
  getProductData() {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('buyData', data => {
      this.setData({
        productData: data.productData,
        bussinessType: data.bussinessType
      })
      if (data.group_id) {
        this.setData({
          group_id: data.group_id
        })
      }
      if (data.group_id) {
        this.setData({
          groupReference: data.groupReference
        })
      }
    })
  },
  // 从缓存中获取用户信息
  getUserInfo() {
    const userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo
    })
    // 如果用户的奖励金小于商品总价，则全部抵扣，剩余的用现金支付
    const productData = this.data.productData
    const total = productData.price * productData.count
    if (userInfo.money <= total) {
      this.setData({
        rewardMoney: userInfo.money,
        rewardMoneyText: this.formatMoney(userInfo.money),
        money: total - userInfo.money,
        moneyText: this.formatMoney(total - userInfo.money),
      })
    } else { // 如果用户的奖励金大于商品总价，则用奖励金抵扣即可，现金为0
      this.setData({
        rewardMoney: total,
        rewardMoneyText: this.formatMoney(total)
      })
    }
  },
  // 获取收货地址
  getAddress() {
    const address = wx.getStorageSync('address')
    // 查看缓存的用户信息中是否保存了收货地址，如果有，则直接显示，否则显示获取地址按钮
    if (address) {
      this.setData({
        addressData: address
      })
    } else {
      this.setData({
        isShowAddressBtn: true
      })
    }
  },
  // 选择收获地址
  handleChooseAddress() {
    wx.chooseAddress({
      success: res => {
        // 将用户选择收货地址缓存起来，下次直接用
        wx.setStorageSync('address', res)
        this.setData({
          addressData: res,
          isShowAddressBtn: false
        })
      },
      fail: res => {
        console.log('地址获取失败', res)
      }
    })
  },
  handleBuy() {
    // 未选择地址则提示先选择地址
    if (this.data.isShowAddressBtn) {
      wx.showToast({
        icon: 'none',
        title: '请选择收货地址',
      })
    } else { // 已选择地址则开始支付逻辑
      this.setData({
        isDisabled: true
      })
      const params = this.getPayParams()
      if (this.data.money === 0) {
        this.handleRewardPay(params)
      } else {
        this.handlePay(params)
      }
    }
  },
  // 奖励金全额抵扣
  handleRewardPay(params) {
    rewardPay(params)
      .then(res => {
        this.handleSuccess()
      })
      .catch(err => {
        this.handleError(err)
      })
  },
  // 需要微信支付
  handlePay(params) {
    pay(params)
      .then(res => {
        this.wxPay(res.data)
      })
      .catch(err => {
        this.handleError(err)
      })
  },
  // 获取后台支付接口参数
  getPayParams() {
    const bussinessType = this.data.bussinessType
    const addressData = this.data.addressData
    const params = {
      money: this.data.money, // 支付金额
      rewardMoney: this.data.rewardMoney, // 奖励金抵扣
      bussinessType, // 交易类型
      userName: addressData.userName,
      postalCode: addressData.postalCode,
      provinceName: addressData.provinceName,
      cityName: addressData.cityName,
      countyName: addressData.countyName,
      detailInfo: addressData.detailInfo,
      nationalCode: addressData.nationalCode,
      telNumber: addressData.telNumber,
      productCount: this.data.productData.count // 商品数量
    }
    if (bussinessType === 'group_pay') { // 如果是拼团支付，需要拼团id和推荐人Id
      params.group_id = this.data.group_id
      params.groupReference = this.data.groupReference
    }
    return params
  },
  // 调起微信支付
  wxPay(data) {
    wx.requestPayment({
      nonceStr: data.nonceStr,
      paySign: data.paySign,
      timeStamp: data.timeStamp,
      signType: 'MD5',
      package: data.package_id,
      success: res => {
        this.handleSuccess()
      },
      fail: err => {
        this.handleError(err)
      }
    })
  },
  // 奖励金抵扣或支付成功后的回调处理
  handleSuccess() {
    this.triggerUpdateWebpsocket()
    wx.redirectTo({
      url: '../../pages/buy/success/success',
    })
  },
  // 奖励金抵扣或支付失败后的回调处理
  handleError(err) {
    console.log(err)
    this.setData({
      isDisabled: false
    })
    wx.showToast({
      icon: 'none',
      title: '支付失败，请重试',
    })
  },
  // 奖励金或现金支付完成后，如果是拼团支付，更新拼团页面的websocket获取，改为获取自己团的信息
  triggerUpdateWebpsocket() {
    if (this.data.bussinessType !== 'group_pay') return
    this.triggerEvent('updatewebsocket')
  },
  formatMoney(money) {
    return money.toFixed(2)
  }
})