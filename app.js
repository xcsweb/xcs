//app.js
App({
  onLaunch: function () {
    let me = this
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    
    //获取当前帐号信息(AppID)
    let appId = wx.getAccountInfoSync().miniProgram.appId;
    //默认 wx1c38a2164afdb9e3
    if (appId =='wx06f52321958b3e65'){  //国跆文江
      me.globalData.miniInsId = 1;
    }

    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.model)
        if (res.model.indexOf("iPhone X")>-1){
          me.globalData.isIpx = true
        }
        
        // console.log(res.pixelRatio)
        // console.log(res.windowWidth)
        // console.log(res.windowHeight)
        // console.log(res.language)
        // console.log(res.version)
        // console.log(res.platform)
      }
    })
  },
  globalData: {
    userInfo: null,
    info: null,
    isIpx: false,
    miniInsId: 0
  }
})