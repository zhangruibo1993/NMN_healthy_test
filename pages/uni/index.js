// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    cc:app.globalData.cc,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    hidden: true,
		current: 0,lines: 0,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    animation:false,
    text: "NMN大麦抗细胞衰老因子让你长生不老测试测试测试测试测试测试测试",
    getphone:false,//获取电话号码
    login:false,//登录框
    join:false,//是否成团

  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 授权弹框升起
  uploginModal(){
    this.setData({
      login:true
    })
  },
  // 授权弹框关闭
  downloginModal(){
    this.setData({
      login:false
    })
  },
  // 电话号码授权弹起
  upgetphoneModal(){
    this.setData({
      getphone:true
    })
  },
  //电话号码授权关闭
  downgetphoneModal(){
    this.setData({
      getphone:false
    })
  },
  listenLogin(e){
    const phone =wx.getStorageSync('phone')||"";
    this.downloginModal()
    if(!phone){
      this.upgetphoneModal();
    }
    console.log(e)
  },
  listengetphone(e){
    this.downgetphoneModal();
    console.log(e)
  },
  cancelLogin(){
    this.downloginModal();
  },
  cancelgetphone(){
    this.downgetphoneModal();
  },
  // 立即加入
  fastjoin(){
    const token =wx.getStorageSync('token')||"";
    const phone =wx.getStorageSync('phone')||"";
    
    if(!token){
      this.uploginModal();
      return;
    }else if(!phone){
      this.upgetphoneModal();
      return
    }
    wx.showToast({
      title: '已经完成所有登录',
    })
  },


    //邀请好友
  onShareAppMessage(res){
  
    if(res.from=="button"){
      // 加入团邀请
      if(res.target.dataset.type=="sharefriend"){
        console.log(res,"你想给谁就给谁！")
        return {
          title: '邀请好友成功拼团享2000元奖励！',
          path: '/page/uni/index?id=123',
          imageUrl:'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2279076101,2954780885&fm=26&gp=0.jpg'

        }
      }
      
    }
   
  },
  onLoad() {
    setTimeout(()=>{
      this.setData({
        animation:true
      })
    },600)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow() {
   
},
  onHide(){
 
  },
  getUserInfo(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
