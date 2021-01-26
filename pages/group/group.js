// pages/group/group.js
import { userInfo, memberGroup } from '../../utils/api'
import { websocketUrl, from } from '../../utils/setting'
const app = getApp()
Page({
  data: {
    isShowLogin: false, // 用户信息组件显示登录按钮还是用户信息
    groupNoticeText: '我是拼团页面滚动信息',
    userInfo: {},
    isShowGroupInfo: false,
    myGroupId: '', // 登录用户的groupId
    shareGroupId: '', // 分享人的groupId
    groupName: '',
    groupInfo: [],
    isShowOrderBtn: false, // 是否显示下单入团按钮
    productData: { // 根据当前用户等级设置产品价格、数量
      price: 2000,
      count: 3
    }
  },
  onLoad: function (options) {
    if (options.myGroupId) { // 从分享链接中获取分享人的groupId
      this.setData({
        shareGroupId: options.myGroupId
      })
    }
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
      this.getMemberGroup()
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
    console.log('111', this.data.myGroupId)
    return {
      title: '拼团',
      path: '/pages/group/group?myGroupId=' + this.data.myGroupId // 自己的groupId
    }
  },
  buildWebsocket() {
    const userInfo = wx.getStorageSync('userInfo')
    let wsUrl = ''
    // 1、未登录用户，不连接websocket服务
    if (!userInfo.id) {
      if (this.data.shareGroupId) {
        wsUrl = websocketUrl + '/' + from + '/' + this.data.shareGroupId
      }
    } else { // 2、登录用户，memberId传自己的Id
      wsUrl = websocketUrl + '/' + from + '/' + userInfo.id
    }
    if (!wsUrl) return
    app.wsUrl = wsUrl
    app.buildWebsocket()
  },
  getWesocketMessage() {
    wx.onSocketMessage(res => {
      const data = JSON.parse(res.data)
      if (data.code !== 0 || !data.data) return
      if (data.data.bussinessType !== 'group') return
      this.setData({
        userInfo: data.data.groupVO
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
            bussinessType: 'group_pay',
            group_id: userInfo.groupId || '',
            groupReference: this.data.shareGroupId || ''
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
  // 从缓存中获取用户信息
  getUserInfoFromStorage() {
    // 进入页面后，从缓存中拿用户数据，判断是否登录，已登录则显示用户信息，未登录则在点击立即抢购时显示登录按钮
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      userInfo.groupTotalMoneyText = this.formatMoney(userInfo.groupTotalMoney)
      this.setData({
        isShowLogin: false,
        isShowUserInfo: true,
        userInfo: userInfo
      })
    } else {
      this.setData({
        isShowOrderBtn: true,
        isShowUserInfo: false
      })
    }
  },
  // 从后台获取用户信息进行更新
  getUserInfo() {
    userInfo({
      is_task: 2
    })
      .then(res => {
        this.setProductPrice(res.data.vipLevel)
        res.data.groupTotalMoneyText = this.formatMoney(res.data.groupTotalMoney)
        this.setData({
          userInfo: res.data,
          isShowLogin: false,
          isShowUserInfo: true
        })
        wx.setStorageSync('userInfo', res.data)
      })
      .catch(err => {
        console.log(err)
      })
  },
  // 获取当前用户的拼团信息
  getMemberGroup() {
    // 从缓存的userInfo中获取自己的groupId
    const userInfo = wx.getStorageSync('userInfo')
    // 如果用户已成团，则使用自己的groupId，如果未成团，则使用分享人的groupId，如果没有分享人，则不显示拼团信息
    let groupId = userInfo.groupId || this.data.shareGroupId || ''
    if (userInfo.groupId) {
      this.setData({
        groupName: '当前所在团'
      })
    } else if (this.data.shareGroupId) {
      this.setData({
        groupName: '好友所在团'
      })
    }
    const params = {}
    if (groupId) {
      params.groupId = groupId
    }
    memberGroup(params)
      .then(res => {
        console.log('拼团信息', res)
        // 1 如果获取到了拼团信息，则isShowGroupInfo设为true，否则设为false，isShowOrderBtn设为false
        // 2 设置groupInfo
        if (res.data) {
          res.data.chiefMoneyText = res.data.chief ? this.formatMoney(res.data.chiefMoney) : '0.00'
          res.data.viceChiefOneMoneyText = res.data.viceChiefOne ? this.formatMoney(res.data.viceChiefOneMoney) : '0.00'
          res.data.viceChiefTwoMoneyText = res.data.viceChiefTwo ? this.formatMoney(res.data.viceChiefTwoMoney) : '0.00'
          res.data.leagueOneMoneyText = res.data.leagueOne ? this.formatMoney(res.data.leagueOneMoney) : '0.00'
          res.data.leagueTwoMoneyText = res.data.leagueTwo ? this.formatMoney(res.data.leagueTwoMoney) : '0.00'
          res.data.leagueThreeMoneyText = res.data.leagueThree ? this.formatMoney(res.data.leagueThreeMoney) : '0.00'
          res.data.leagueFourMoneyText = res.data.leagueFour ? this.formatMoney(res.data.leagueFourMoney) : '0.00'
          this.setData({
            groupInfo: res.data,
            isShowGroupInfo: true
          })
        } else {
          this.setData({
            isShowOrderBtn: true
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  // 根据用户等级设置特惠立购价格
  setProductPrice(vipLevel) {
    // 从缓存中获取产品价格配置
    const priceConfig = wx.getStorageSync('priceConfig')
    this.setData({
      ['productData.price']: priceConfig.groupPayMoney / 3 // 固定买3瓶
    })
  },
  formatMoney(money) {
    return money.toFixed(2)
  }
})