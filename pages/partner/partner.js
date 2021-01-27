// pages/partner/partner.js
import { userInfo } from '../../utils/api'
import { websocketUrl, from } from '../../utils/setting'
const app = getApp()
Page({
  data: {
    isShowLogin: false, // 用户信息组件显示登录按钮还是用户信息
    isShowProduct: false, // 是否显示商品信息，未登录时显示
    partnerNoticeText: '我是合伙人滚动信息',
    userinfo: {},
    productData: { // 根据当前用户等级设置产品价格、数量
      price: 0,
      count: 1
    }
  },
  onLoad: function () {
    this.getUserInfoFromStorage()
    this.buildWebsocket()
  },
  onReady: function () {
  },
  onShow: function () {
    this.getWesocketMessage()
    const session_token = wx.getStorageSync('session_token')
    if (!session_token) {
      this.setData({
        isShowLogin: false
      })
    } else {
      this.getUserInfo()
    }
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
  buildWebsocket() {
    const userInfo = wx.getStorageSync('userInfo')
    // 1、未登录用户，不连接websocket服务
    if (!userInfo.id) return
    // 2、登录用户，memberId传自己的Id
    app.wsUrl = websocketUrl + '/' + from + '/' + userInfo.id
    app.buildWebsocket()
  },
  getWesocketMessage() {
    wx.onSocketMessage(res => {
      const data = JSON.parse(res.data)
      if (data.code !== 0 || !data.data) return
      if (data.data.bussinessType !== 'member') return
      this.setData({
        userInfo: data.data.memberVO
      })
    })
  },
  handleSubmit() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      // 如果已经获取过用户信息，则跳转到产品购买页面
      wx.navigateTo({
        url: '/pages/buy/buy',
        success: res => { // 将商品数据传递到购买页面
          res.eventChannel.emit('buyData', {
            productData: this.data.productData,
            bussinessType: this.getBussinessType(userInfo.vipLevel)
          })
        }
      })
    } else { // 否则显示登录按钮，提示请先登录
      wx.showToast({
        icon: 'none',
        title: '请先登录',
      })
      this.setData({
        isShowLogin: true
      })
    }
  },
  getBussinessType(vipLevel) {
    if (vipLevel === 1) return 'pay'
    if (vipLevel === 2) return 'primary_pay'
    if (vipLevel === 3) return 'middle_pay'
    if (vipLevel === 4) return 'senior_pay'
  },
  // 从缓存中获取用户信息
  getUserInfoFromStorage() {
    // 进入页面后，从缓存中拿用户数据，判断是否登录，已登录则显示用户信息，未登录则在点击立即抢购时显示登录按钮
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      userInfo.referenceTotalMoneyText = this.formatMoney(userInfo.referenceTotalMoney)
      userInfo.teamTotalMoneyText = this.formatMoney(userInfo.teamTotalMoney)
      this.setData({
        userInfo: userInfo
      })
    } else {
      this.setData({
        isShowProduct: true
      })
    }
  },
  // 从后台获取用户信息进行更新
  getUserInfo() {
    userInfo({
      is_task: 1
    })
      .then(res => {
        this.setProductPrice(res.data.vipLevel)
        res.data.referenceTotalMoneyText = this.formatMoney(res.data.referenceTotalMoney)
        res.data.teamTotalMoneyText = this.formatMoney(res.data.teamTotalMoney)
        this.setData({
          userInfo: res.data,
          isShowLogin: false,
          isShowProduct: false
        })
        wx.setStorageSync('userInfo', res.data)
      })
      .catch(err => {
        console.log(err)
      })
  },
  // 根据用户等级设置特惠立购价格
  setProductPrice(vipLevel) {
    // 从缓存中获取产品价格配置
    const priceConfig = wx.getStorageSync('priceConfig')
    let moneyType = ''
    if (vipLevel === 1) {
      moneyType = 'memberMoney'
    } else if (vipLevel === 2) {
      moneyType = 'primaryPartnerTaskMoney'
    } else if (vipLevel === 3) {
      moneyType = 'middlePartnerTaskMoney'
    } else if (vipLevel === 4) {
      moneyType = 'seniorPartnerTaskMoney'
    } // 如果vipLevel达到5级，说明是高级合伙人，不再需要购买
    let price = priceConfig[moneyType]
    this.setData({
      productData: {
        price,
        count: 1
      }
    })
  },
  formatMoney(money) {
    return money.toFixed(2)
  }
})