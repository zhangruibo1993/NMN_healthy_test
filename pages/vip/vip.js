// pages/vip/vip.js
import { userInfo } from '../../utils/api'
import { websocketUrl, from } from '../../utils/setting'
const app = getApp()
Page({
  data: {
    isShowLogin: false, // 用户信息组件显示登录按钮还是用户信息
    vipNoticeText: '我是vip页面滚动信息',
    userInfo: {},
    vipReference: '', // 特惠立购推荐人id
    productData: { // 根据当前用户等级设置产品价格、数量
      price: 0,
      count: 1
    }
  },
  onLoad: function (options) {
    this.buildWebsocket()
    if (options.vipReference) { // 从分享链接中获取分享人的groupId
      this.setData({
        vipReference: options.vipReference
      })
    }
  },
  onReady: function () {
  },
  onShow: function () {
    this.getWesocketMessage()
    const session_token = wx.getStorageSync('session_token')
    if (!session_token) { // 如果session_token为空，说明未登录过，则
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
  // 在特惠立购页面分享出去，携带当前用户的id
  onShareAppMessage: function () {
    return {
      title: '特惠立购',
      path: '/pages/group/group?vipReference=' + this.data.userInfo.id // 自己的id
    }
  },
  buildWebsocket() {
    const userInfo = wx.getStorageSync('userInfo')
    // 1、未登录用户，不连接websocket服务
    if (!userInfo.id) return
    // 2、登录用户，memberId传自己的Id
    app.wsUrl = websocketUrl + '/' + from + '/' + userInfo.id
    app.buildWebsocket()
  },
  // 监听websocket中推送的消息
  getWesocketMessage() {
    wx.onSocketMessage(res => {
      const data = JSON.parse(res.data)
      if (data.code !== 0 || !data.data) return
      if (data.data.bussinessType === 'member') { // 更新用户信息
        this.setData({
          userInfo: data.data.memberVO
        })
      }
    })
  },
  handleSubmit() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      // 如果已经获取过用户信息，则跳转到产品购买页面
      wx.navigateTo({
        url: '/pages/buy/buy',
        success: res => { // 将购买数据(商品价格、交易类型)传递到购买页面
          res.eventChannel.emit('buyData', {
            productData: this.data.productData,
            bussinessType: 'pay'
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
  // 从后台获取用户信息进行更新
  getUserInfo() {
    userInfo({
      is_task: 2
    }).then(res => {
        // 获取当前用户的等级，设置相应的购买价格
        this.setProductPrice(res.data.vipLevel)
        this.setData({
          userInfo: res.data,
          isShowLogin: false
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
      moneyType = 'vipMoney'
    } else if (vipLevel === 3) {
      moneyType = 'primaryPartnerMoney'
    } else if (vipLevel === 4) {
      moneyType = 'middlePartnerMoney'
    } else if (vipLevel === 5) {
      moneyType = 'seniorPartnerMoney'
    }
    let price = priceConfig[moneyType]
    this.setData({
      productData: {
        price,
        count: 1
      }
    })
  },
  // 监听product组件修改购买数量，更新产品数量
  updateProductCount(e) {
    this.setData({
      ['productData.count']: e.detail
    })
  }
})