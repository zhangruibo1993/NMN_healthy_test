module.exports = {
  baseUrl:'http://3459006650.eicp.vip/',  //敖工本地
  // baseUrl:'https://www.luckparking.cn/v2.0/',  //服务器
  // baseUrl:'https://ichegang.szzkcg.com/v2.0/',  //临时服务器
  // baseUrl:'http://aofltest.qicp.vip/v2.0/', //花生壳
  //  baseUrl:'http://192.168.1.55:8889/v2.0/',  //周华健本地 
  // baseUrl:'http://192.168.1.111:8889/v2.0/',  //张工本地
  from:"xcx_sale",
  timeout:"1000",
  successCode:0,//请求成功
  invalidCode:402,//登录失效
  errCode:-1,//请求失败
  overtime(res){
      wx.removeStorageSync("token")
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
      wx.switchTab({ url: '../uni/index' });
      return;
  }
}