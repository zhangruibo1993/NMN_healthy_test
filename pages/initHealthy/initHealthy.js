// pages/basicInfo/basicInfo.js
const app = getApp()
import { valiCode } from '../../utils/api'
import { saveHealthInfo } from '../../utils/api'
import { from } from '../../utils/setting'
Page({
  data: {
    error: '',
    formData: {
      valiType: 'reg',
      isSmoke : 0,
      isDrink : 0,
      isFearCold : 0,
      isFearHeat : 0,
      isMemoryLoss : 0,
      isHairLoss : 0,
      isCough : 0,
      isChest : 0,
      isDizzy : 0,
      isAbdominal : 0,
      isConstipation : 0,
      isVomit : 0,
      isCancer : 0,
      isLeukemia : 0,
      isRheumatism : 0,
      isSkinDisease : 0,
      isHeartDisease : 0,
      isHypertension : 0,
      isUricAcid : 0
    },
    items : [
      {prop:'isSmoke',title:'1.是否抽烟', checkValue:0},
      {prop:'isDrink',title:'2.是否喝酒', checkValue:0},
      {prop:'isFearCold',title:'3.是否畏寒', checkValue:0},
      {prop:'isFearHeat',title:'4.是否怕热', checkValue:0},
      {prop:'isMemoryLoss',title:'5.是否记忆力下降', checkValue:0},
      {prop:'isHairLoss',title:'6.是否有脱发情况', checkValue:0},
      {prop:'isCough',title:'7.是否咳嗽、咳痰', checkValue:0},
      {prop:'isChest',title:'8.是否胸闷、呼吸困难', checkValue:0},
      {prop:'isDizzy',title:'9.是否头晕、头疼', checkValue:0},
      {prop:'isAbdominal',title:'10.是否腹胀、腹痛、腹泄', checkValue:0},
      {prop:'isConstipation',title:'11.是否便秘、便血', checkValue:0},
      {prop:'isVomit',title:'12.是否呕吐反胃', checkValue:0},
      {prop:'isCancer',title:'13.是否有癌症', checkValue:0},
      {prop:'isLeukemia',title:'14.是否有白血病', checkValue:0},
      {prop:'isRheumatism',title:'15.是否有风湿类疾病', checkValue:0},
      {prop:'isSkinDisease',title:'16.是否有皮肤类疾病', checkValue:0},
      {prop:'isHeartDisease',title:'17.是否有心脏类疾病', checkValue:0},
      {prop:'isHypertension',title:'18.是否有高血压', checkValue:0},
      {prop:'isUricAcid',title:'19.是否尿酸指数超高', checkValue:0}
     ],
     choose_items : [
      {name:'是',value:1},
      {name:'否',value:0}
     ],
     remark : ''
  },

  //页面加载
  onLoad: function (options) {
    var user = wx.getStorageSync('userInfo');
    var memberHealthInfoVO = user.memberHealthInfoVO;
    if(memberHealthInfoVO){
      var data = [];
      // 通过属性名来获取属性值
      for(let element in memberHealthInfoVO){
        for(let key in this.data.items){
          if(this.data.items[key].prop === `${ element }`){
            this.data.items[key].checkValue = `${ memberHealthInfoVO[element]}`;
            this.setData({
              [`formData.${element}`]: `${ memberHealthInfoVO[element]}`
            })
          }
        }  
      }
      this.setData({
        items: this.data.items,
        remark: memberHealthInfoVO.remark
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
        saveHealthInfo(this.data.formData)
          .then(res => {
            wx.showToast({
              icon: 'success',
              title: '登记成功！'
            })
            if(res.data.status === 1) {
              //会员所有信息补录完成
              setTimeout(() => {
                wx.switchTab({
                  url: '/pages/mine/mine',
                })
              }, 2000)  
            } else if(res.data.status === 2){
              //未登记基本信息
              wx.showModal({
                title: '温馨提示',
                content: '您尚未登记基本信息',
                success: res => {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '/pages/basicInfo/basicInfo',
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
  },
  // 表单内容填写后存储数据到formData中
  formInputChange(e) {
    const {field} = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  }
})