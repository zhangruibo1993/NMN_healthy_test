// pages/order/order.js
import { orderList } from '../../utils/api'
Page({
  data: {
    tabMenu: [
      { id: 3, name: '全部'},
      { id: 0, name: '未发货'},
      { id: 1, name: '已发货'},
      { id: 2, name: '已完成'},
    ],
    currentTab: 3, // 初始在全部页签
    orderInfo: [],
    page: 1,
    rows: 999,
  },
  onLoad: function (options) {
    this.setCurrentTab(options.status)
    this.getOrderList(options.status)
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
  // 根据传进来的订单状态设置当前tab
  setCurrentTab(status) {
    if (!status) status = 3
    this.setData({
      currentTab: status
    })
  },
  // 获取订单列表
  getOrderList(status) {
    const params = {
      page: this.data.page,
      rows: this.data.rows
    }
    if (status || status === 0) {
      params.status = status
    }
    orderList(params)
      .then(res => {
        res.data.rows.forEach(item => {
          item.sourceText = this.formatSource(item.source)
          item.statusText = this.formatStatus(item.status)
        })
        this.setData({
          orderInfo: res.data.rows
        })
      })
      .catch(err => {
        console.log(err)
      })
  },
  formatSource(source) {
    if (source === 1) return '拼团'
    if (source === 2) return '特惠立购'
    if (source === 3) return '初级合伙人任务'
    if (source === 4) return '中级合伙人任务'
    if (source === 5) return '高级合伙人任务'
  },
  formatStatus(staus) {
    if (staus === 0) return '未发货'
    if (staus === 1) return '已发货'
    if (staus === 2) return '已完成'
  },
  // 切换页签
  handleTabSelect(e) {
    const currentTab = e.currentTarget.dataset.id
    this.setData({
      currentTab
    })
    this.getOrderList(currentTab === 3 ? '' : currentTab)
  }
})