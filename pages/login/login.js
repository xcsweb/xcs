var network = require('../../utils/network.js')
var util = require('../../utils/util.js')
var app = getApp()

// pages/login/login.js
Page({
  data: {
    logo: '',
    slogan: '',
    phone_bg: util.filterLocalImgUrl("login/login_phone.png"),
    pwd_bg: util.filterLocalImgUrl("login/login_pwd.png"),
    insId: 0,
    userName: "",
    password: "",
  },
  onLoad: function(options) {
    let insId = this.data.insId;
    if (options.insId) {
      insId = options.insId;
      wx.setStorageSync("insId", insId)
    }
    this.setData({
      insId: insId
    });
  },
  onShow: function() {
    let sessionId = wx.getStorageSync("sessionId")
    if (!sessionId) {
      let params = {};
      if (app.globalData.miniInsId > 0) {
        params.institutionId = app.globalData.miniInsId;
      }
      console.log(params)
      wx.request({
        url: network.SERVER + "/common/wxxinfo",
        header: {
          Lt: 2
        },
        method: 'post',
        data: params,
        success: res => {
          res = res.data;
          if (res.status == 1) {
            console.log(res.data)
            let logo = util.filterLocalImgUrl("login/login_logo.png");
            let slogan = '动宝-倡导运动健康新生活！';
            if (res.data.logo) {
              logo = res.data.logo;
              slogan = res.data.slogan;
            }
            wx.setStorageSync('logo', res.data.logo);
            wx.setStorageSync('slogan', res.data.slogan);
            wx.setStorageSync('sessionId', res.data.sessionId);
            this.setData({
              logo: logo,
              slogan: slogan,
            });
            //判断是否登录
            this.loginRedirect();
          }
        }
      })
    } else {
      this.setData({
        logo: wx.getStorageSync('logo') ? wx.getStorageSync('logo') : util.filterLocalImgUrl("login/login_logo.png"),
        slogan: wx.getStorageSync('slogan') ? wx.getStorageSync('slogan') : '动宝-倡导运动健康新生活！',
      });
      //判断是否登录
      this.loginRedirect();
    }
  },
  inputData: function(e) {
    let data = {};
    data[e.target.dataset.name] = e.detail.value;
    this.setData(data);
  },
  formSubmit: function() {
    let param = {};
    param.userName = this.data.userName;
    param.password = this.data.password;
    if (!param.userName) {
      util.toast("请输入帐号或手机号")
      return
    }
    if (!param.password) {
      util.toast("请输入密码")
      return
    }
    /*if (this.data.insId>0){
      param.institutionId = this.data.insId;
    }*/
    console.log(param);
    util.toast("登录中...")
    wx.request({
      url: network.SERVER + "/common/login",
      data: JSON.stringify(param),
      header: {
        Lt: 2
      },
      method: 'post',
      success: res => {
        res = res.data;
        if (res.status == "1") {
          wx.setStorageSync('token', res.data.token)
          wx.setStorageSync('institutionId', res.data.institutionId)
          wx.setStorageSync('isMember', res.data.isMember)
          wx.setStorageSync('isStudent', res.data.isStudent);
          let goType = -1; //0管理  1学员 2管理+学员
          if (res.data.isMember && res.data.isStudent) {
            goType = 2;
          } else if (res.data.isMember) {
            goType = 0;
          } else if (res.data.isStudent) {
            goType = 1;
          }
          if (!res.data.openId && res.data.isCheckAuth==1){
            wx.redirectTo({
              url: "/pages/login/auth/auth?insId=" + res.data.institutionId + "&userId=" + res.data.userId + "&goType=" + goType
            })
            return;
          }
          this.goto(goType);
          util.toast(res.message || "登录失败.");
        } else {
          util.toast(res.message || "登录失败。")
        }
      },
      fail: function(res) {
        util.toast("登录失败！")
      },
      complete: function(res) {

      },
    })
  },
  //判断是否登录
  loginRedirect: function() {
    let token = wx.getStorageSync("token")
    let institutionId = wx.getStorageSync("institutionId")
    let sessionId = wx.getStorageSync("sessionId")
    if (!token || !institutionId || !sessionId) {
      wx.removeStorageSync('token')
      return;
    } else {
      let param = {
        token: token,
        institutionId: institutionId
      }
      wx.request({
        url: network.SERVER + "/common/islogin",
        data: JSON.stringify(param),
        header: {
          Lt: 2
        },
        method: 'post',
        success: res => {
          res = res.data;
          if (res.status == "1") {
            wx.setStorageSync('token', res.data.token)
            wx.setStorageSync('institutionId', res.data.institutionId)
            wx.setStorageSync('isMember', res.data.isMember)
            wx.setStorageSync('isStudent', res.data.isStudent);
            let goType = -1; //0管理  1学员 2管理+学员
            if (res.data.isMember && res.data.isStudent) {
              goType = 2;
            } else if (res.data.isMember) {
              goType = 0;
            } else if (res.data.isStudent) {
              goType = 1;
            }
            this.goto(goType);
          }
        },
        fail: function(res) {

        },
        complete: function(res) {

        },
      })
    }
  },
  //跳转页面
  goto: function(goType) {
    var url = ""
    if (wx.getStorageSync("isMember")) {
      url = "/manage/info"
    } else if (wx.getStorageSync("isStudent")) {
      url = "/user/info"
    }
    //获取上传图片视频token
    util._find_uptoken();

    network.request(
      url, {},
      res => {
        if (res.status == "1") {
          network.img_url = res.data.img_url;
          network.vod_url = res.data.vod_url;
          wx.setStorage({
            key: 'img_url',
            data: res.data.img_url,
          })
          wx.setStorage({
            key: 'vod_url',
            data: res.data.vod_url,
          })
          wx.setStorage({
            key: 'suffix',
            data: res.data.suffix,
          })
          // wx.setStorage({
          //   key: 'memberId',
          //   data: res.data.member.memberId,
          // })
          wx.setStorage({
            key: 'avatar',
            data: util.filterImgUrl(res.data.avatar),
          })
          if (res.data.student){
            wx.setStorage({
              key: 'avatar',
              data: util.filterImgUrl(res.data.student.avatar)
            })
          }
          let oauth2url = res && res.data && res.data.student && res.data.student.oauth2url;
          if (oauth2url) {
            wx.setStorage({
              key: 'oauth2url',
              data: oauth2url,
            })
          }
          //显示操作菜单
          if (goType == 2) {
            wx.showActionSheet({
              itemList: [`管理端`, `学员端`],
              success: res => {
                if (res.tapIndex == 0) {
                  wx.redirectTo({
                    url: "/pages/index/index"
                  })
                } else if (res.tapIndex == 1) {
                  wx.redirectTo({
                    url: "/pages/student/index"
                  })
                }
              }
            })
          } else if (goType == 0) {
            wx.redirectTo({
              url: "/pages/index/index"
            })
          } else if (goType == 1) {
            wx.redirectTo({
              url: "/pages/student/index"
            })
          }
        }
      },
      function(err) {
        console.log(err)
      }
    )
  },
//忘记密码
  forgetpwd: function(event) {
    wx.navigateTo({
      url: "/pages/login/modifypwd/modifypwd"
    })
  },
  onShareAppMessage: function() {//转发
    return {
      title: this.data.slogan,
      path: '/pages/login/login'
    }
  }
})