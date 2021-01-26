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
      console.log(res)
      res.data.rows = [
        {id: 1, source: 1, date: '2020年1月26日 05:11', total: 10000, sourceName: '奖励', money: 2000, rewardFromName: '郭豪', typeName: '拼团分享'},
        {id: 2, source: 1, date: '2020年1月26日 05:11', total: 10000, sourceName: '奖励', money: 850, rewardFromName: '敖冯亮', typeName: '拼团团长成团'},
        {id: 3, source: 1, date: '2020年1月26日 05:11', total: 10000, sourceName: '奖励', money: 111, rewardFromName: '郭豪', typeName: '拼团团长推荐人奖励'},
        {id: 4, source: 1, date: '2020年1月26日 05:11', total: 10000, sourceName: '奖励', money: 236, rewardFromName: '郭豪', typeName: '直推购买奖励'},
        {id: 5, source: 2, date: '2020年1月26日 05:11', total: 10000, sourceName: '消费', money: 236, rewardFromName: '', typeName: ''},
        {id: 6, source: 3, date: '2020年1月26日 05:11', total: 10000, sourceName: '提现', money: 236, rewardFromName: '', typeName: ''},
      ]
      res.data.rows.forEach(item => {
        item.moneyText = (item.source === 1 ? '+' : '-') +this.formatMoney(item.money)
        item.totalText = this.formatMoney(item.total)
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