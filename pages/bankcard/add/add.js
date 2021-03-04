import { from } from "../../../utils/setting"
// pages/bankcard/add/add.js
import { addBankcard } from '../../../utils/api'
Page({
  data: {
    error: '',
    valiCodeText: '发送验证码',
    valiCodeCount: 60,
    formData: {
      valiType: 'bank'
    },
    rules: [
      {
        name: 'bank',
        rules: {required: true, message: '请填写银行名称'},
      },
      {
        name: 'bankCardNo',
        rules: {required: true, message: '请填写卡号'},
      },
      {
        name: 'phone',
        rules: [
          {required: true, message: '请填写手机号'},
          {mobile: true, message: '手机号格式不对'},
        ]
      },
      {
        name: 'valicode',
        rules: [
          {required: true, message: '请填写验证码'},
          {minlength: 4, message: '请填写4位验证码'},
          {maxlength: 4, message: '请填写4位验证码'},
        ]
      }
    ]
  },
  onLoad: function (options) {
  },
  onReady: function () {
  },
  onShow: function () {
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  onPullDownRefresh: function () {
  },
  onReachBottom: function () {
  },
  onShareAppMessage: function () {
  },
  // 表单验证及提交
  handleSubmit() {
    this.selectComponent('#form').validate((valid, errors) => {
      if (!valid) {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message
          })
        }
      } else {
        addBankcardi(ths.data.formData)
          .then(res => {
            wx.showToast({
              icon: 'success',
              title: '添加成功'
            })
            setTimeout(() => {
              wx.navigateBack()
            }, 2000)
          }).catch(err => {
            console.log(err)
          })
      }
    })
  },
  // 表单内容填写后存储数据到formData中
  formInputChange(e) {
    const {field} = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },
  timerun() {
    this.setData({
      valiCodeText: '重新获取' + this.data.valiCodeCount
    })
    let timer = setTimeout(() => {
      let valiCodeCount = this.data.valiCodeCount
      this.setData({
        valiCodeCount: valiCodeCount - 1
      })
      this.setData({
        valiCodeText: '重新获取' + this.data.valiCodeCount
      })
      if (this.data.valiCodeCount > 0) {
        this.timerun()
      } else {
        this.setData({
          valiCodeText: '发送验证码',
          valiCodeCount: 60
        })
      }
      clearTimeout(timer)
    }, 1000)
  },
  // 发送验证码给用户填写的手机号
  handleSendValiCode() {
    if (this.data.valiCodeText === '发送验证码') {
      this.sendValiCode()
    }
  },
  sendValiCode() {
    this.selectComponent('#form').validate((valid, errors) => {
      if (!valid) { // 如果有错误项
        let flag = true
        for (let i = 0; i < errors.length; i++) {
          if (errors[i].name === 'phone') { // 遍历错误项，判断是否有手机号相关错误（未填或格式错误）
            this.setData({
              error: errors[i].message
            })
            flag = false
            break
          }
        }
        if (flag) {
          this.timerun()
          valiCode({
            phone: this.data.formData.phone,
            type: 'reg'
          }).then(res => {
          }).catch(err => {
            console.log(err)
          })
        }
      }
    })
  }
})