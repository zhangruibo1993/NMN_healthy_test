import {baseUrl,overtime,from} from '../../utils/setting.js';
// import {login} from "../../utils/api.js";

Page({
    /**s
     * 页面的初始数据
     */
    data: {
       
        code:"",
    },
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

    // 获取余额(用户信息)
    getUserinfo: function() {
        const token = wx.getStorageSync('token') || ""
        // const phone = wx.getStorageSync("phoneNumber");
        console.log(token)
        wx.request({
            url: baseUrl+'/xcx/info', //获取余额,
            data: {  }, //请求的参数",
            method: 'get',
            header:{ session_token: token ,from},
            dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
            success: res => {
                if (res.data.code == 0) {
                    const userinfo=res.data.data
                    wx.setStorageSync('userinfo',userinfo)
                    wx.navigateBack({
                        delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
                    });
                    return;
                }
                if (res.data.code ==402) {
                    overtime();
                }
            },
            fail: () => {},
            complete: () => {}
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        
        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})