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
    genderList: ['女', '男'],
    index: 0,
    objectArray: [
      {
        id: 0,
        name: '女'
      },
      {
        id: 1,
        name: '男'
      },
    ],

    maritalStatusList: ['未婚', '已婚'],
    index: 1,
    objectArray: [
      {
        id: 0,
        name: '未婚'
      },
      {
        id: 1,
        name: '已婚'
      },
    ],
    multiArray: [
            ['出行与交通', '生活服务', '餐饮', '旅游', '商业服务', '快递', '教育', '体育','计算机', '政府部门'], 
            ['代驾', '家政', '摄影', '婚庆服务', '废物回收', '厨师', '餐厅服务员', '餐厅老板', '导游', '律师', '邮政', '装卸搬运', '快递/物流', '在线教育', '特殊人群教育', '教育装备', '教育信息服务', '健康营养师', '体育培训', '职能人员','IT工程师'
           ]
    ],
    objectMultiArray: [
      [
        {
          id: 0,
          name: '出行与交通'
        },
        {
          id: 1,
          name: '生活服务'
        },
        {
          id: 2,
          name: '餐饮'
        },
        {
          id: 3,
          name: '旅游'
        },
        {
          id: 4,
          name: '商业服务'
        },
        {
          id: 5,
          name: '快递'
        },
        {
          id: 6,
          name: '教育'
        },
        {
          id: 7,
          name: '体育快递'
        },
        {
          id: 8,
          name: '计算机'
        },
        {
          id: 9,
          name: '政府部门'
        },
      ], [
        {id: 0,name: '代驾'},{id: 1,name: '家政'},{id: 2,name: '摄影'},{id: 3,name: '婚庆服务'},{id: 4,name: '废物回收'},{id: 5,name: '厨师'}, {id: 6,name: '餐厅服务员'}, {id: 7,name: '餐厅老板'}, {id: 8,name: '导游'}, {id: 9,name: '律师'}, {id: 10,name: '装卸搬运'}, {id: 11,name: '快递/物流'}, {id: 12,name: '在线教育'}, {id: 13,name: '特殊人群教育'}, {id: 14,name: '教育装备'}, {id: 15,name: '教育信息服务'}, {id: 16,name: '健康营养师'}, {id: 17,name: '体育培训'}, {id: 18,name: '职能人员'}, {id: 19,name: 'IT工程师'}, 
      ]
    ],
    multiIndex: [0, 0],
    rules: [
      {
        name: 'trueName',
        rules: {required: true, message: '请填写用户名'},
      },
      {
        name: 'phone',
        rules: [
          {required: true, message: '请填写手机号'},
          // {mobile: true, message: '手机号格式不对'},
        ]
      },
      {
        name: 'valicode',
        rules: [
          {required: true, message: '请填写验证码'},
          {minlength: 4, message: '请填写4位验证码'},
          {maxlength: 4, message: '请填写4位验证码'},
        ]
      },
      {
        name: 'idCardNo',
        rules: [
          {required: true, message: '请填写身份证号'},
          {minlength: 18, message: '请填写18位身份证号'},
          {maxlength: 18, message: '请填写18位身份证号'},
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