// pages/bankcar/bankcar.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color:['brown','grey','red','cyan','orange'],
    elements: [
    {
      title: '中国银行',
      name: '653324115878669',
      color: 'brown',
      icon: 'tagfill'
    },
    {
      title: '中国银行',
      name: '653324115878669',
      color: 'red',
      icon: 'tagfill'
    },
    {
      title: '中国银行',
      name: '653324115878669',
      color: 'red',
      icon: 'tagfill'
    },
    {
      title: '中国银行',
      name: '653324115878669',
      color: 'red',
      icon: 'tagfill'
    },
    {
      title: '中国银行',
      name: '653324115878669',
      color: 'red',
      icon: 'tagfill'
    },
    
  ],
  },
  // 解绑银行卡
  clearBankCar(e){
    wx.showModal({
      title: '温馨提示', //提示的标题,
      content: '你确定要解绑该银行卡吗', //提示的内容,
      showCancel: true, //是否显示取消按钮,
      cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
      cancelColor: '#000000', //取消按钮的文字颜色,
      confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
      confirmColor: '#3CC51F', //确定按钮的文字颜色,
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定')
          console.log("解绑银行卡",this.data.elements[e.currentTarget.dataset.bankcar])
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})