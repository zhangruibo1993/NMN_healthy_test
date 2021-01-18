import {baseUrl,overtime,from,timeout,successCode,invalidCode,errCode} from './setting'
module.exports = {
    
    http(url, method, params,switchLoading) {
        const session_token = wx.getStorageSync('session_token') || ""
        return new Promise(function(resolve, reject) {
            let header = {}
            if (method == 'post') {
                if(!session_token){
                  header = {
                      'content-type': 'application/json;charset=UTF-8',
                        from,
                  }
                }else{
                  header = {
                      'content-type': 'application/json;charset=UTF-8',
                      from,
                      session_token:session_token,
                  }
                }
            } else if (method == 'get') {
                console.log(session_token);
                console.log(wx.getStorageSync('session_token'));
              header = {
              //   'content-Type': 'application/json',
                from,
                session_token:session_token,
              }
            }
            if(!switchLoading){
                wx.showLoading({ //可以不加
                    title: '加载中'
                })
            }
           
            wx.request({
                url: baseUrl + url, 
                method: method == 'post' ? 'post' : 'get', 
                data: params,
                header: header,
                timeout:timeout,
                success:(res)=>{
                    wx.hideLoading();
                    const { code } = res.data;
                    console.log(code)
                    if (code !== successCode) {
                        switch (code) {
                            case invalidCode:
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
                    }else if((code == successCode)) {
                        console.log("success",res.data)
                        resolve( res.data)
                    }
                    
                    // params.success && params.success(res.data)
                },
                fail:(err) =>{
                    wx.hideLoading();
                    console.log(err)
                    wx.showToast({
                        title: '服务器繁忙请稍后重试',
                        icon: 'none',
                        duration: 1500,
                        mask: false,
                    });
                    // params.fail && params.fail(err)
                },
                complete:()=>{
                    wx.hideLoading();
                }
            })





           })
     
    //   if (params.data) { 
    //     for (let key in params.data) { 
    //       if (params.data[key] == null || params.data[key] == 'null') {
    //         delete params.data[key]
    //       }
    //     }
    //     data = {
    //       ...data,
    //       ...params.data
    //     }
    //   }
    
        
      
    }
  }