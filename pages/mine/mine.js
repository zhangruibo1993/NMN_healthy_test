import { from } from "../../utils/setting"
// pages/mine/mine.js
import { login, userInfo, orderCount } from '../../utils/api'
Page({
  data: {
    userInfo: null,
    orderCount: { // 订单各状态数量
      notDeliveryCount: 0, // 未发货
      deliveryCount: 0, // 已发货
      finishCount: 0 // 已完成
    }
  },
  onLoad: function (options) {
    this.getUserInfoFromStorage()
  },
  onReady: function () {
  },
  onShow: function () {
    const session_token = wx.getStorageSync('session_token')
    if (!session_token) return
    this.getUserInfo(false)
    this.getOrderCount()
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  onPullDownRefresh: function () {
    const session_token = wx.getStorageSync('session_token')
    if (!session_token) return
    this.getUserInfo(false)
    this.getOrderCount()
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
      userInfo.moneyText = userInfo.money.toFixed(2)
      this.setData({
        userInfo: userInfo
      })
    }
  },
  // 点击登录按钮，获取用户信息
  handleLogin(e) {debugger
    if (!e.detail.userInfo) { // 如果open-type中没有userInfo，说明是用户拒绝授权，给出提示
      wx.showToast({
        icon: 'none',
        title: '请允许获取您的公开信息'
      })
    } else {
      // 请求后台登录接口，判断用户是否已注册
      wx.login({
        success: res => {
          wx.getUserInfo({
            success: info => {
              this.doLogin(res.code, info)
            }
          })
        }
      })
    }
  },
  // 向后台发送登录请求
  doLogin(code, info) {
    const params = {
      code: code,
      iv: info.iv,
      rawData: info.rawData,
      signature: info.signature,
      encryptedData: info.encryptedData
    }
    if (this.data.vipReference) {
      params.vipReference = this.data.vipReference
    }
    login(params).then(res => {
      // 后台登录接口请求成功后将session_token缓存起来
      wx.setStorage({
        key: 'session_token',
        data: res.data.session_token,
        success: () => {
          if (res.data.status === 0) { // 说明该用户尚未注册，跳转到注册页面
            wx.showModal({
              title: '温馨提示',
              content: '您尚未注册，请先注册',
              success: res => {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '/pages/regist/regist',
                  })
                }
              }
            })
          } else if (res.data.status === 1) { // 说明该用户已经注册，获取用户信息并显示
            this.getUserInfo()
          }
        }
      })
    }).catch(err => {
      console.log(err)
    })
  },
  getUserInfo(isShowToast = true) {
    // 从后台获取用户信息，显示在页面中，更新缓存中的userInfo
    userInfo()
      .then(res => {
        if (isShowToast) {
          wx.showToast({
            title: '登录成功',
          })
        }
        const userInfo = res.data
        userInfo.moneyText = userInfo.money.toFixed(2)
        this.setData({
          userInfo
        })
        wx.setStorageSync('userInfo', userInfo)
      }).catch(err => {
        console.log(err)
      })
  },
  // 获取订单各状态数量
  getOrderCount() {
    orderCount()
      .then(res => {
        this.setData({
          orderCount: res.data
        })
      })
      .catch(err => {
        console.log(err)
      })
  },
  // 点击提现
  handleRewardMoney() {
    wx.navigateTo({
      url: '/pages/mine/rewardmoney/rewardmoney',
    })
  },
  // 点击查看订单
  handleOrder(e) {
    wx.navigateTo({
      url: '/pages/order/order?status=' + (e.currentTarget.dataset.status || ''),
    })
  },
  // 点击查看银行卡列表
  handleBankCard() {
    wx.navigateTo({
      url: '/pages/bankcard/bankcard',
    })
  },
  // 选择收获地址
  handleChooseAddress() {
    wx.chooseAddress({
      success: res => {
        // // 将用户选择收货地址缓存起来，下次直接用
        // wx.setStorageSync('address', res)
        // this.setData({
        //   addressData: res,
        //   isShowAddressBtn: false
        // })
      },
      fail: res => {
        console.log('地址获取失败', res)
      }
    })
  },
  // 点击查看用户详情页面
  handleUserDetail() {
    wx.navigateTo({
      url: '/pages/mine/userdetail/userdetail',
    })
  },
  // 点击细胞检测结果
  basicInfo() {
    wx.navigateTo({
      url: '/pages/basicInfo/basicInfo',
    })
  },
  // 打卡页面
  clock() {
    wx.navigateTo({
      url: '/pages/clock/clock',
    })
  },
  // 初始健康状况
  original_healthy() {
    wx.navigateTo({
      url: '/pages/initHealthy/initHealthy',
    })
  }
})