// pages/bankcard/bankcard.js
import { bankcardList, deleteBankcard } from '../../utils/api'
Page({
  data: {
    bankcardInfo: [],
    isShowAdd: false, // 银行卡列表数据返回后再显示添加按钮
  },
  onLoad: function (options) {
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
  // 获取银行卡列表信息
  getBankcardList() {
    bankcardList()
      .then(res => {
        const bankcardInfo = []
        res.data.rows.forEach(item => {
          item.bankCardNoStr = item.bankCardNo.substring(item.bankCardNo.length - 4)
          bankcardInfo.push(item)
        })
        this.setData({
          bankcardInfo: bankcardInfo,
          isShowAdd: true
        })
      })
  },
  // 删除银行卡
  handleDelete(e) {
    const id = e.currentTarget.dataset.id    
    if (!id) return
    wx.showModal({
      title: '温馨提示',
      content: '确定解绑吗？',
      success: res => {
        if (res.confirm) {
          deleteBankcard({
            id
          }).then(res => {
            wx.showToast({
              icon: 'success',
              title: '解绑成功'
            })
            this.getBankcardList()
          }).catch(err => {
            console.log(err)
          })
        }
      }
    })
  },
  // 添加银行卡
  handleAdd() {
    if (this.data.bankcardInfo.length === 5) {
      wx.showToast({
        icon: 'none',
        title: '最多绑定5张银行卡',
      })
      return
    }
    wx.navigateTo({
      url: '/pages/bankcard/add/add',
    })
  }
})