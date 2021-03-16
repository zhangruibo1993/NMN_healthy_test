import {
  baseUrl,
  overtime,
  from,
  timeout,
  successCode,
  invalidCode,
  errCode
} from './setting'
module.exports = {
  http(url, method, params, switchLoading) {
    const session_token = wx.getStorageSync('session_token') || ""
    return new Promise(function (resolve, reject) {
      let header = {
        from,
        session_token
      }
      if (method !== 'get') {
        header['content-type'] = 'application/json;charset=UTF-8'
      }
      if (!switchLoading) {
        wx.showLoading({
          title: '请求中，请稍后...'
        })
      }

      wx.request({
        url: baseUrl + url,
        method: method || 'get',
        data: params,
        header: header,
        timeout: timeout,
        success: (res) => {
          const { code } = res.data;
          if (code !== successCode) {
            switch (code) {
              case invalidCode:
                wx.removeStorageSync('session_token')
                wx.removeStorageSync('userInfo')
                reject(res)
                overtime();
              case errCode:
                reject(res)
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 1500,
                  mask: true
                });
            }
          } else if ((code == successCode)) {
            resolve(res.data)
          }
        },
        fail: (err) => {
          console.log(err)
          wx.showToast({
            title: '服务器繁忙请稍后重试',
            icon: 'none',
            duration: 1500,
            mask: false,
          });
        },
        complete: () => {
          wx.hideLoading();
        }
      })
    })
  }
}