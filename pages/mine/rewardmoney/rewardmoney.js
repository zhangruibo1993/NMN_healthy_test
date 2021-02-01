// pages/mine/rewardmoney/rewardmoney.js
Page({
  data: {
    userInfo: {},
    money: 0
  },
  onLoad: function (options) {
  },
  onReady: function () {
  },
  onShow: function () {
    this.getUserInfoFromStorage()
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
  // 从缓存中获取用户信息
  getUserInfoFromStorage() {
    // 进入页面后，从缓存中拿用户数据，判断是否登录，已登录则显示用户信息，未登录则在点击立即抢购时显示登录按钮
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        money: this.formatMoney(userInfo.money)
      })
    }
  },
  formatMoney(money) {
    return money.toFixed(2)
  },
  // 点击提现
  handleDraw() {
    wx.navigateTo({
      url: '/pages/mine/draw/draw',
    })
  },
  // 点击明细
  handleDetail() {
    wx.navigateTo({
      url: '/pages/mine/moneydetail/moneydetail',
    })
  }
})