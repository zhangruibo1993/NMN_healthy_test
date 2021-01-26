// components/memberinfo/memberinfo.js
import {
  login, userInfo
} from '../../utils/api'
Component({
  properties: {
    // 是否显示登录按钮
    isShowLogin: {
      type: Boolean,
      value: false
    },
    userInfo: {
      type: Object,
      value: {}
    },
    vipReference: { // 特惠立购分享人ID
      type: String,
      value: ''
    }
  },
  lifetimes: {
    show() {
      console.log(1)
    }
  },
  data: {
  },
  methods: {
    // 点击登录按钮，获取用户信息
    handleLogin(e) {
      if (!e.detail.userInfo) { // 如果open-type中没有userinfo，说明是用户拒绝授权，给出提示
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
    getUserInfo() {
      // 从后台获取用户信息，显示在页面中，更新缓存中的userInfo
      userInfo()
        .then(res => {
          wx.showToast({
            title: '登录成功',
          })
          this.setData({
            isShowLogin: false, // 关闭登录按钮
          })
          const userInfo = res.data
          wx.setStorageSync('userInfo', userInfo)
          this.triggerEvent('UpdateUserInfo', userInfo)
        }).catch(err => {
          console.log(err)
        })
    }
  }
})
