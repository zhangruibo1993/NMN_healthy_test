module.exports = {
  // baseUrl:'http://3459006650.eicp.vip/sale',  //敖工本地
  // baseUrl:'https://www.luckparking.cn/v2.0/',  //服务器
  // baseUrl:'https://ichegang.szzkcg.com/v2.0/',  //临时服务器
  // baseUrl:'http://127.0.0.1:8889/', //花生壳
  //  baseUrl:'http://192.168.1.55:8889/v2.0/',  //周华健本地 
  baseUrl:'http://127.0.0.1:8889/sale',  //张工本地
  // websocketUrl: 'ws://192.168.1.189:8889/sale/websocket/xcx',
  from:"xcx_health",
  timeout:"5000",
  successCode:0,//请求成功
  invalidCode:402,//登录失效
  errCode:-1,//请求失败
  overtime(res){
      wx.removeStorageSync("session_token")
      wx.removeStorageSync("phoneNumber")
      wx.removeStorageSync("session_key")
      wx.removeStorageSync("code")
      wx.showToast({
      title:"超时", //提示的内容,
      icon: 'none', //图标,
      duration: 3000, //延迟时间,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {},
      complete: () => {}
      });
      // wx.switchTab({ url: '../uni/index' });
      return;
  }
}