// // socket已经连接成功
// let socketOpen = false
// // socket已经调用关闭function
// let socketClose = false
// // 判断心跳变量
// let heart = ''
// // 心跳失败次数
// let heartBeatFailCount = 0
// // 终止心跳
// let heartBeatTimeOut = null;
// // 终止重新连接
// let connectSocketTimeOut = null;
// const websocket = {
//   connectSocket: (options = {}) => {
//     if (!options.url) {
//       return
//     }
//     socketOpen = false
//     socketClose = false
//     wx.connectSocket({
//       url: options.url,
//       success: (res) => {
//         console.log('websocket连接成功')
//       },
//       fail: (res) => {
//         console.log('websocket连接失败')
//       }
//     })
//   },
//   sendSocketMessage: (options = {}) => {
//     if (!socketOpen) return
//     wx.sendSocketMessage({
//       data: options.data,
//       success: res => {
//         console.log('发送websocket消息成功')
//         options.success && options.success(res);
//       },
//       fail: res => {
//         console.log('发送websocket消息失败')
//         options.fail && options.fail(res);
//       }
//     })
//   }
// }