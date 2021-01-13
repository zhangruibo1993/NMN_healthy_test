import {baseUrl,from} from '../../../utils/setting.js';
Component({
  data:{

  },
  properties:{
    login:{
      type:Boolean,
      value:false
    }
  },
  methods:{
    handleGetUserInfo(e) {
      //获取code
      wx.login({
          timeout: 10000,
          success: (result) => {
              wx.getUserInfo({
                  success: function(res) {
                      const { code } = result;
                      wx.setStorageSync('code', code)
                      // 解构数据
                      const { encryptedData, iv, rawData, signature } = res;
                      wx.request({
                          url: baseUrl+'/sale/xcx/login', //开发者服务器接口地址",
                          data: { code, encryptedData, iv, rawData, signature }, //请求的参数携带上传",
                          method: 'post',
                          header:{ from, 'content-Type': 'application/json;charset=UTF-8'},
                          contentType: 'application/json;charset=UTF-8',
                          dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
                          success: (res) => {
                              if (res.data.code == 0) {
                                  const {session_key}=res.data.data
                                  const {token} = res.data.data
                                  wx.setStorageSync('session_key', session_key)
                                  wx.setStorageSync('token', token)
                                  console.log(token)
                                  wx.navigateBack({
                                      delta:1,
                                  })
                              } 
                              if(res.data.code == -1){
                                  wx.hideLoading()
                                  wx.showToast({
                                      title: res.data.msg, //提示的内容,
                                      icon: 'none', //图标,
                                      duration: 3000, //延迟时间,
                                      mask: true, //显示透明蒙层，防止触摸穿透,
                                      success: res => {}
                                  });
                              }
                          },
                          fail: (err) => {
                              wx.hideLoading()
                              wx.showToast({
                                  title: '当前无网络',
                                  icon: 'none',
                                  image: '',
                                  duration: 3000,
                                  mask: false,
                                  success: (result) => {
      
                                  },
                                  fail: () => {},
                                  complete: () => {
      
                                  }
                              });
                              console.log(err)
                          },
                          complete: () => {  }
                      });
                  }
              })
          }
      });
  },
  }
})