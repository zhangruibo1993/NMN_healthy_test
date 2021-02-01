import { from } from "../../../utils/setting"
// pages/mine/moneydetail/moneydetail.js
import { rewardList } from '../../../utils/api'
Page({
  data: {
    memberId: '',
    rewardList: []
  },
  onLoad: function (options) {
    this.getUserInfoFromStorage()
    this.getRewardList()
  },
  onReady: function () {
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
  // 从缓存中获取用户信息
  getUserInfoFromStorage() {
    // 进入页面后，从缓存中拿用户数据，判断是否登录，已登录则显示用户信息，未登录则在点击立即抢购时显示登录按钮
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        memberId: userInfo.id
      })
    }
  },
  // 获取奖励金明细列表
  getRewardList() {
    rewardList({
      page: 1,
      rows: 999,
      memberId: this.data.memberId
    }).then(res => {
      res.data.rows.forEach(item => {
        item.moneyText = (item.source === 1 ? '+' : '-') +this.formatMoney(item.money)
        item.totalText = this.formatMoney(item.balance)
      })
      this.setData({
        rewardList: res.data.rows
      })
    }).catch(err => {
      console.log(err)
    })
  },
  formatMoney(money) {
    return money.toFixed(2)
  }
})