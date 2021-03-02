// pages/basicInfo/basicInfo.js
const app = getApp()
import { valiCode } from '../../utils/api'
import { regist } from '../../utils/api'
import { from } from '../../utils/setting'
Page({
  data: {
    error: '',
    valiCodeText: '发送验证码',
    valiCodeCount: 60,
    formData: {
      valiType: 'reg'
    },
    items : [
      {prop:'isSmoke',title:'1.是否抽烟'},
      {prop:'isDrink',title:'2.是否喝酒'},
      {prop:'isFearCold',title:'3.是否畏寒'},
      {prop:'isFearHeat',title:'4.是否怕热'},
      {prop:'isMemoryLoss',title:'5.是否记忆力下降'},
      {prop:'isHairLoss',title:'6.是否有脱发情况'},
      {prop:'isCough',title:'7.是否咳嗽、咳痰'},
      {prop:'isChest',title:'8.是否胸闷、呼吸困难'},
      {prop:'isDizzy',title:'9.是否头晕、头疼'},
      {prop:'isAbdominal',title:'10.是否腹胀、腹痛、腹泄'},
      {prop:'isConstipation',title:'11.是否便秘、便血'},
      {prop:'isVomit',title:'12.是否呕吐反胃'},
      {prop:'isCancer',title:'13.是否有癌症'},
      {prop:'isLeukemia',title:'14.是否有白血病'},
      {prop:'isRheumatism',title:'15.是否有风湿类疾病'},
      {prop:'isSkinDisease',title:'16.是否有皮肤类疾病'},
      {prop:'isHeartDisease',title:'17.是否有心脏类疾病'},
      {prop:'isHypertension',title:'18.是否有高血压'},
      {prop:'isUricAcid',title:'19.是否尿酸指数超高'}
     ],
     choose_items : [
      {name:'1',value:'是'},
      {name:'0',value:'否',checked:true}
     ]
  },

  //页面加载
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
    // 选择职业
  pickProfessional: function (e) {
    this.setData({
      multiIndex: e.detail.value
    })
  },
  pickProfessionalChange: function (e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['代驾'];
            break;
          case 1:
            data.multiArray[1] = ['家政', '摄影', '婚庆服务', '废物回收'];
            break;
          case 2:
            data.multiArray[1] = ['厨师', '服务员', '老板'];
            break;
          case 3:
            data.multiArray[1] = ['导游'];
            break;
          case 4:
            data.multiArray[1] = ['律师', '设计师','健康营养师'];
            break;
          case 5:
            data.multiArray[1] = ['邮政', '装卸搬运', '快递/物流'];
            break;
          case 6:
            data.multiArray[1] = ['在线教育', '特殊人群教育', '教育装备', '教育信息服务'];
            break;
          case 7:
            data.multiArray[1] = ['体育培训'];
            break;
          case 8:
            data.multiArray[1] = ['IT工程师'];
            break;
          case 9:
            data.multiArray[1] = ['职能人员'];
            break;
        }
        data.multiIndex[1] = 0;
        break;
     
        
    }
    console.log(data.multiIndex);
    this.setData(data);
  },
  // 选择性别
  pickGender: function(e) {
    this.setData({
      index: e.detail.value
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
        regist(this.data.formData)
          .then(res => {
            wx.showToast({
              icon: 'success',
              title: '注册成功'
            })
            this.getUserInfo()
            setTimeout(() => {
              wx.navigateBack()
            }, 2000)
          }).catch(err => {
            console.log(err)
          })
      }
    })
  },
  getUserInfo() {
    // 从后台获取用户信息，显示在页面中，更新缓存中的userInfo
    userInfo()
      .then(res => {
        wx.setStorageSync('userInfo', res.data)
      }).catch(err => {
        console.log(err)
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
  // // 地区组件切换
  // bindRegionChange(e) {
  //   this.setData({
  //     region: e.detail.value,
  //     [`formData.address`]: e.detail.value.join('')
  //   })
  // }
})