// pages/basicInfo/basicInfo.js
const app = getApp()
import { valiCode } from '../../utils/api'
import { saveBaseInfo, userInfo } from '../../utils/api'
import { from } from '../../utils/setting'
Page({
  data: {
    curUser : null,
    error: '',
    formData: {
      valiType: 'reg',
      workStatus : 0,
      gender : 1,
      marriage : 1
    },
    genderIndex : 1,
    genderObjectArray: [
      {id: 0,name: '女'},
      {id: 1,name: '男'}
    ],
    maritalIndex : 1,
    maritalObjectArray: [
      {id: 0,name: '未婚'},
      {id: 1,name: '已婚'}
    ],
    workIndex : 0,
    workObjectArray: [
      {id: 0,name: '退休'},
      {id: 1,name: '在职'}
    ],
    region: '请选择省市区/县',
    rules: [
      
    ]
  },
  onLoad: function (options) {
    var user = wx.getStorageSync('userInfo');
    this.setData({
      curUser: wx.getStorageSync('userInfo')
    })
    if(user && user.gender !== 'undefined'){
      this.setData({
        genderIndex : user.gender
      })
    }
    if(!user.memberBaseInfoVO){
      return;
    }
    if(user && user.memberBaseInfoVO && user.memberBaseInfoVO.workStatus !== 'undefined'){
      this.setData({
        workIndex : user.memberBaseInfoVO.workStatus
      })
    }
    if(user && user.memberBaseInfoVO && user.memberBaseInfoVO.marriage !== 'undefined'){
      this.setData({
        maritalIndex : user.memberBaseInfoVO.marriage
      })
    }
    if(user && typeof user.memberBaseInfoVO.province !== 'undefined'){
      this.setData({
        region: user.memberBaseInfoVO.province + ',' + user.memberBaseInfoVO.city + ',' + user.memberBaseInfoVO.area
      })  
    }
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
    // 选择工作状况
  pickWorkStatus: function (e) {
    var selectValue = this.data.workObjectArray[e.detail.value].id;
    this.setData({
      workIndex : e.detail.value,
      [`formData.workStatus`]: selectValue
    })
  },
  // 选择性别
  pickGender: function(e) {
    var selectValue = this.data.genderObjectArray[e.detail.value].id;
    this.setData({
      genderIndex : e.detail.value,
      [`formData.gender`]: selectValue
    })
  },
  // 选择婚姻状况
  pickMarital: function(e) {
    var selectValue = this.data.maritalObjectArray[e.detail.value].id;
    this.setData({
      maritalIndex : e.detail.value,
      [`formData.marriage`]: selectValue
    })
  },
  // 选择省市区
  bindRegionChange(e) {
    this.setData({
      region: e.detail.value[0] + ',' + e.detail.value[1] + ',' + e.detail.value[2],
      [`formData.province`]: e.detail.value[0],
      [`formData.city`]: e.detail.value[1],
      [`formData.area`]: e.detail.value[2]
    })
  },
  // 表单内容填写后存储数据到formData中
  formInputChange(e) {
    const {field} = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
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
        saveBaseInfo(this.data.formData)
          .then(res => {
            wx.showToast({
              icon: 'success',
              title: '登记成功！'
            })
            if(res.data.status === 1) {
              setTimeout(() => {
                wx.navigateBack()
              }, 2000)  
            } else if(res.data.status === 3){
              //未登记健康信息
              wx.showModal({
                title: '温馨提示',
                content: '您尚未登记身体健康信息',
                success: res => {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '/pages/initHealthy/initHealthy',
                    })
                  }
                }
              })  
            }
          }).catch(err => {
            console.log(err)
          })
      }
    })
  }
})