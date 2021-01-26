// pages/partner/partner.js
import { userInfo } from '../../utils/api'
import { websocketUrl, from } from '../../utils/setting'
const app = getApp()
Page({
  data: {
    isShowMemberInfo: false, // 是否显示用户信息组件
    isShowLogin: false, // 用户信息组件显示登录按钮还是用户信息
    partnerNoticeText: '我是合伙人滚动信息',
    userinfo: {},
    taskData: [
      {id: '1', no: 1, content: '购买...'},
      {id: '2', no: 2, content: '购买...'},
      {id: '3', no: 3, content: '购买...'},
      {id: '4', no: 4, content: '购买...'}
    ],
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
        isShowMemberInfo: false,
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
      console.log(data)
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
        isShowMemberInfo: true,
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
      this.setData({
        isShowMemberInfo: true,
        userInfo: userInfo
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
        this.setData({
          userInfo: res.data
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
    // TODO
    const priceConfig = wx.getStorageSync('priceConfig')
    let moneyType = ''
    if (vipLevel === 1) {
      moneyType = 'memberMoney'
    } else if (vipLevel === 2) {
      moneyType = 'vipMoney'
    } else if (vipLevel === 3) {
      moneyType = 'primaryPartnerTaskMoney'
    } else if (vipLevel === 4) {
      moneyType = 'middlePartnerTaskMoney'
    } else if (vipLevel === 5) {
      moneyType = 'seniorPartnerTaskMoney'
    }
    let price = priceConfig[moneyType]
    this.setData({
      productData: {
        price,
        count: 1
      }
    })
  },
  // memberInfo页面登录后，触发父组件更新userInfo信息
  updateUserInfo(e) {
    this.setData({
      userInfo: e.detail
    })
  }
})