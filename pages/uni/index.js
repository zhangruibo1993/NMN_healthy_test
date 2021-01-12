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
    intervalT: null,
    pace: 1.2, //滚动速度
    interval: 20, //时间间隔
    size: 24, //字体大小in px
    length: 0, //字体宽度
    offsetLeft: 0, //
    windowWidth: 0,
  
    text: "公告  测试测试测试测试测试测试测试测试测试测试测试测试测试"
  },
    //根据viewId查询view的宽度
    queryViewWidth: function (viewId) {
      //创建节点选择器
      return new Promise(function (resolve) {
        var query = wx.createSelectorQuery();
        var that = this;
        query.select('.' + viewId).boundingClientRect(function (rect) {
          resolve(rect.width);
        }).exec();
      });
    },
    excuseAnimation: function () {
      var that = this;
      if (that.data.length > that.data.windowWidth) {
        //设置循环
        that.data.intervalT = setInterval(function () {
          if (that.data.offsetLeft <= 0) {
            if (that.data.offsetLeft >= -that.data.length) {
              that.setData({
                offsetLeft: that.data.offsetLeft - that.data.pace,
              })
            } else {
              that.setData({
                offsetLeft: that.data.windowWidth,
              })
            }
          } else {
            that.setData({
              offsetLeft: that.data.offsetLeft - that.data.pace,
            })
          }
        }, that.data.interval);
      }
    },
//停止跑马灯
stopMarquee: function () {
  var that = this;
  //清除旧的定时器
  if (that.data.intervalT) {
    clearInterval(that.data.intervalT);
  }
},
//开始跑马灯
startMarquee: function () {
  var that = this;
  that.stopMarquee();
  //初始化数据
  that.data.windowWidth = wx.getSystemInfoSync().windowWidth;
  that.queryViewWidth('text').then(function (resolve) {
    that.data.length = resolve;
    console.log(that.data.length + "/" + that.data.windowWidth);
    that.excuseAnimation();
  });
},
  
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
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
    this.startMarquee()
},
  onHide(){
    this.stopMarquee();
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
