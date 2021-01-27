// app.js
import { priceConfig } from './utils/api'
App({
  // 应用第一次启动时候出发的事件
  onLaunch() {
  },
  onShow() {
    this.getSysConfig()
  },
  onHide() {
  },
  onError(err) {
  },
  onPageNotFound() {
    // 应用第一次启动时，找不到第一个入口页面，才会触发
    // wx.navigateTo({
    //   url: 'pages/404',
    // })
  },
  // 获取不同级别的用户的购买价格配置
  getSysConfig() {
    priceConfig()
      .then(res => {
        wx.setStorageSync('priceConfig', res.data)
      })
      .catch(err => {
        console.log(err)
      })
  },
  // 创建websocket，接听后台推送消息
  buildWebsocket() {
    if (this.socketOpen) return
    wx.connectSocket({
      url: this.wsUrl
    })
    // 建立连接后开始发送心跳
    wx.onSocketOpen(() => {
      this.socketOpen = true
      this.sendHeartBeat()
    })
    wx.onSocketError(err => {
      this.socketOpen = false
      console.log('onSocketError', err)
    })
    wx.onSocketClose(err => {
      this.socketOpen = false
      console.log('onSocketClose', err)
      // 重连websocket
      this.reconnectWebsocket()
    })
  },
  wsUrl: '',
  heartBeatTimeOut: null, // 心跳的settimeoutid
  socketOpen: false,
  reconnectCount: 0, // 重连次数
  reconnectSocketTimeOut: null, // 重连的settimeoutid
  // 每25s发送一次心跳
  sendHeartBeat() {
    wx.sendSocketMessage({
      data: '{bussinessType: "heartbeat"}',
      success: () => {
        this.heartBeatTimeOut = setTimeout(() => {
          this.sendHeartBeat()
        }, 5000)
      }
    })
  },
  // 重连websocket，重连5次失败弹出提示，继续重连
  reconnectWebsocket() {
    if (this.reconnectCount === 5) {
      wx.showToast({
        icon: 'none',
        title: '网络异常，请检查',
      })
      this.reconnectCount = 0
    }
    this.reconnectCount++
    this.buildWebsocket()
    clearTimeout(this.reconnectSocketTimeOut)
    this.reconnectSocketTimeOut = setTimeout(() => {
      this.buildWebsocket()
    }, 5000)
  },
  // 主动关闭websocket
  closeWebsocket() {
    if (this.socketOpen) {
      wx.closeSocket({
        success: res => {
          console.log('主动关闭websocket')
          this.socketOpen = false
        }
      })
    }
  }
})
