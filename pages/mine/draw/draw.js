// pages/mine/draw/draw.js
import { bankcardList, rewardDrawal, userInfo } from '../../../utils/api'
Page({
  data: {
    cardList: [],
    currentCard: 0, // 当前选择的银行卡
    rewardMoney: 0,
    drawMoney: null,
    isDisable: true, // 提交按钮是否可以点击
  },
  onLoad: function (options) {
  },
  onReady: function () {
  },
  onShow: function () {
    this.getUserInfoFromStorage()
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
    let rawValue
    if (/^(\d?)+(\.\d{0,2})?$/.test(e.detail.value)) { //正则验证，提现金额小数点后不能大于两位数字
      rawValue = e.detail.value;
    } else {
      rawValue = e.detail.value.substring(0, e.detail.value.length - 1);
    }
    this.setData({
      drawMoney: rawValue
    })
    if (this.data.drawMoney * 1 > 0 && this.data.drawMoney <= this.data.rewardMoney) {
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
    rewardDrawal({
      money: this.data.drawMoney
    }).then(res => {
      this.setData({
        drawMoney: null,
        isDisable: true
      })
      this.getUserInfo()
      wx.showToast({
        icon: 'success',
        title: '提现申请成功',
        success: () => {
          wx.redirectTo({
            url: '/pages/mine/moneydetail/moneydetail',
          })
        }
      })
    }).catch(err => {
      console.log(err)
      this.setData({
        drawMoney: null,
        isDisable: true
      })
    })
  },
  getUserInfo() {
    // 从后台获取用户信息，更新缓存中的userInfo
    userInfo()
      .then(res => {
        wx.setStorageSync('userInfo',  res.data)
      }).catch(err => {
        console.log(err)
      })
  },
})