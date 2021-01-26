// pages/mine/draw/draw.js
import { bankcardList } from '../../../utils/api'
Page({
  data: {
    cardList: [],
    currentCard: 0, // 当前选择的银行卡
    rewardMoney: 0,
    drawMoney: null,
    isDisable: true, // 提交按钮是否可以点击
  },
  onLoad: function (options) {
    this.getUserInfoFromStorage()
  },
  onReady: function () {
  },
  onShow: function () {
    this.getBankcardList()
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
        rewardMoney: this.formatMoney(userInfo.money)
      })
    }
  },
  formatMoney(money) {
    return money.toFixed(2)
  },
  getBankcardList() {
    bankcardList()
      .then(res => {
        this.formattCardList(res.data.rows)
        this.setData({
          cardList: res.data.rows
        })
      })
  },
  // 对银行卡列表进行格式转换
  formattCardList(rows) {
    rows.forEach(item => {
      item.showStr = item.bank + '(' + item.bankCardNo.substring(item.bankCardNo.length - 4) + ')'
    })
  },
  // 监听修改银行卡
  handleChangeCard(e) {
    this.setData({
      currentCard: e.detail.value
    })
  },
  // 点击全部提现
  handleDrawAll() {
    if (this.data.rewardMoney * 1 === 0) return
    this.setData({
      drawMoney: this.data.rewardMoney
    })
  },
  // 监听输入金额
  handleInput(e) {
    console.log(e)
    this.setData({
      drawMoney: e.detail.value
    })
    if (this.data.drawMoney * 1 > 0) {
      this.setData({
        isDisable: false
      })
    } else {
      this.setData({
        isDisable: true
      })
    }
  },
  // 点击提现
  handleSubmit() {
    console.log('开始提现了')
  }
})