// index.js
// 获取应用实例
const app = getApp()
import {getGroup} from '../../utils/api';
import {baseUrl,from} from '../../utils/setting.js';

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
    groupShow : true,
    invitation : true,
    purchase : true
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
    const session_token =wx.getStorageSync('session_token')||"";
    const phone =wx.getStorageSync('phone')||"";
    if(!session_token){
      this.uploginModal();
      return;
    }else if(!phone){
      this.upgetphoneModal();
      return
    }
    const money = 6000;
    const groupId = "";
    const groupReference = "";
    wx.request({
      url: baseUrl+'/sale/wx/pay', //开发者服务器接口地址",
      data: {money,groupId,groupReference,bussinessType:'group_pay'}, //请求的参数",
      method: 'post',
      header:{ session_token: session_token ,from},
      dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
      success: res => {
        if (res.data.code == 0) {
          console.log(res.data.data)
          wx.requestPayment({
              timeStamp: res.data.data.timeStamp, //时间戳从1970年1月1日00:00:00至今的秒数,即当前的时间,
              nonceStr: res.data.data.nonceStr, //随机字符串，长度为32个字符以下,
              package: res.data.data.package_id, //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*,
              signType: 'MD5', //签名算法，暂支持 MD5,
              paySign: res.data.data.paySign, //签名,具体签名方案参见小程序支付接口文档,
              success: res => {
                  console.log(res)
                  wx.navigateTo({ url: '../timer/timer' });
                  wx.showToast({
                      title: '充值成功',
                      icon: 'success',
                      duration: 1500,
                      mask: true
                  });
                  this.setData({
                    modalName: null
                  })
                  return;
              },
              fail: (err) => {
                  console.log(err)
              },
              complete: () => {
                
              }
          });
          return;
        }
        if(res.data.code == 402){
          //登录失效
        } else {
            wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 3000,
                mask: true
            });
            return;
        }
      },
      fail: () => {},
      complete: () => {}
    });
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
    this.getGroupInfo();
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
  },
  async getGroupInfo() {
    var groupData = await getGroup();
    var show = true;
    if(groupData.data){
      show = true;
    }
    this.setData({
      groupInfo: groupData,
      groupShow: show
    })
  }
})