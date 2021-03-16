// pages/basicInfo/basicInfo.js
const app = getApp()
import { getSign,sign } from '../../utils/api'
import { from } from '../../utils/setting'
Page({
  data: {
    nowDate:'',
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
      isVomit: 0,
      isCancer : 0,
      isLeukemia : 0,
      isRheumatism : 0,
      isSkinDisease : 0,
      isHeartDisease : 0,
      isHypertension : 0,
      isUricAcid : 0,
      isNmn : 1,
      day : '',
      otherDrugList : []
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
     otherDrugsItems: [
      {value: '1', name: '维生素A类'},
      {value: '2', name: '维生素B类'},
      {value: '3', name: '维生素C类'},
      {value: '4', name: '维生素D类'},
      {value: '5', name: '维生素E类'}
    ],
     isNmn : 1,
     otherMedicine : '',
     remark : ''
  },

  //页面加载
  onLoad: function (options) {
    this.setData({
      nowDate : options.nowDate,
      [`formData.day`]: options.nowDate
    })
    var params = {
      day : options.nowDate
    }
    getSign(params).then(res => {
      var memberHealthInfoVO = res.data; 
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

        //其他药物多选框回显
        let otherDrugList = memberHealthInfoVO.otherDrugList;
        for(var index in otherDrugList){
          for(let key in this.data.otherDrugsItems){  
            if(this.data.otherDrugsItems[key].value === otherDrugList[index]){
              this.data.otherDrugsItems[key].checked = true;
            }
          }  
        }

        this.setData({
          items: this.data.items,
          remark: memberHealthInfoVO.remark,
          isNmn: memberHealthInfoVO.isNmn,
          otherDrugsItems : this.data.otherDrugsItems
        })
      }
    })
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
        sign(this.data.formData)
          .then(res => { 
            wx.showToast({
              icon: 'success',
              title: '打卡成功'
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
  //表单多选按钮
  otherDrugListItemsChanges(e) {
    this.setData({ otherDrugList: e.detail.value })
  }
})