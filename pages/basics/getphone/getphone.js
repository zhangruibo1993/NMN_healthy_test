import {baseUrl,from} from '../../../utils/setting.js';
Component({

  /**
   * 页面的初始数据
   */
  data: {

  },

  properties:{
    getphone:{
      type:Boolean,
      value:false
    }
  },
  methods:{
    getPhoneNumber: function(e) {
      wx.showLoading({
          title: '加载中',
      })
      console.log(e)
      const session_key = wx.getStorageSync('session_key');
      const token = wx.getStorageSync('token');
      // ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
      // 检查session_key
      wx.checkSession({
          success: () => {
              console.log("下面的三个值=====")
              console.log("下面的三个值=====" + e.detail.errMsg)
              console.log("下面的三个值=====" + e.detail.iv)
              console.log("下面的三个值=====" + e.detail.encryptedData)
                  // const encrypdata = e.detail.encryptedData
                  // console.log(encrypdata)
              const { encryptedData, iv } = e.detail
              console.log(iv)
              wx.request({
                  url: baseUrl+'/xcx/phone', //开发者服务器接口地址",
                  data: { encryptedData, iv, session_key }, //请求的参数携带上传",
                  method: 'post',
                  header:{ session_token: token ,from,'content-Type': 'application/json;charset=UTF-8'},
                  dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
                  success: (res) => {
                      if (res.data.code == 0) {
                          console.log(res.data.data+"11")
                          const {phone} = res.data.data
                          wx.setStorageSync('phoneNumber', phone);
                          wx.navigateBack({
                              delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
                          });
                          return;
                      }
                      if (res.data.code ==402) {
                          overtime();
                          wx.showToast({
                              title: res.data.msg,
                              icon: 'none',
                              duration: 3000,
                              mask: true
                          });
                       
                      } else {
                          wx.showToast({
                              title: res.data.msg,
                              icon: 'none',
                              duration: 1500,
                              mask: true
                          });
                          return;
                      }

                  },
                  fail: (err) => {
                      wx.showToast({
                          title: '登录信息过期',
                          icon: 'none',
                          image: '',
                          duration: 1000,
                          mask: false,
                          success: (result) => {

                          },
                          fail: () => {},
                          complete: () => {
                              this.getUserinfo();
                          }
                      });
                      console.log(err)
                  },
              });
          },
          fail: () => {
              wx.showToast({
                title: '密匙已过期', //提示的内容,
                icon: 'none', //图标,
                duration: 2000, //延迟时间,
                mask: true, //显示透明蒙层，防止触摸穿透,
                success: res => {}
              });
              overtime();
              
          },
          complete: () => {}
      });


  },

  }
})