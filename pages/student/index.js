var network = require('../../utils/network.js')
var util = require('../../utils/util.js')
var QRCode = require('../../utils/weapp-qrcode.js');
var qrcode;
var app = getApp()
// pages/student/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grids: [{
        name: "我的课表",
        img: "/imgs/student/index/shouye_06.png",
        url: "/pages/student/kechengbiao/kechengbiao"
      },
      {
        name: "作业点评",
        img: "/imgs/student/index/shouye_03.png",
        url: "/pages/student/workreview/workreview"
      },
      {
        name: "通知提醒",
        img: "/imgs/student/index/shouye_11.png",
        url: "/pages/student/tongzhi/tongzhiremind/tongzhiremind"
      },
      {
        name: "会员卡",
        img: "/imgs/student/index/shouye_30.png",
        url: "/pages/student/memcard/memcard"
      },
      {
        name: "互动",
        img: "/imgs/student/index/shouye_19.png",
        url: "/pages/student/interaction/interaction"
      },
      {
        name: "积分商城",
        img: "/imgs/student/index/shouye_14.png",
        url: "/pages/student/mall/mall"
      },
      /*{
        name: "我的相册",
        img: "/imgs/student/index/shouye_02.png",
        url: "/pages/student/photo/photo"
      },*/
      {
        name: "健康报告",
        img: "/imgs/student/index/shouye_25.png",
        url: "/pages/student/Health Report/Health Report"
      },
      {
        name: "微课堂",
        img: "/imgs/student/index/shouye_22.png",
        url: "/pages/student/weike/weike"
      },
      {
        name: "微官网",
        img: "/imgs/student/index/shouye_34.png",
        url: "/pages/micro_website/micro_website"
      },
      {
        name: "家庭教练",
        img: "/imgs/student/index/shouye_34.png",
        url: "/pages/student/home_coach/home_coach"
      }
    ],
    body_bg: util.filterLocalImgUrl("student/index/index_body.png"),
    imgUrls:{
        msg: '动宝云，专为体育和艺术培训设计！',
        img: util.filterLocalImgUrl('dongbaolog.png')
    },
    institutionName: "",
    studentName: "",
    avatar: "",
    qrCode: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.navigateTo) {
      let param = "";
      for (let key in options) {
        if (key != "navigateTo") {
          if (param == "") {
            param += "?" + key + "=" + options[key]
          } else {
            param += "&" + key + "=" + options[key]
          }
        }
      }
      wx.navigateTo({
        url: options.navigateTo + param
      })
    }
  },
  //获取用户二维码
  info: function(e) {
    var url = "/user/info"
    network.request(
      url, {},
      res => {
        if (res.status == "1") {
          let oauth2url = res && res.data && res.data.student && res.data.student.oauth2url;
          if (oauth2url) {
            qrcode = new QRCode('canvas', {
              text: oauth2url,
              width: 50,
              height: 50,
              colorDark: "#0094FF",
              colorLight: "#ffffff",
              correctLevel: QRCode.CorrectLevel.H,
            });
            qrcode = new QRCode('canvas2', {
              text: oauth2url,
              width: this.data.qrCodeWidth,
              height: this.data.qrCodeWidth,
              colorDark: "#0094FF",
              colorLight: "#ffffff",
              correctLevel: QRCode.CorrectLevel.H,
            });
          }
          wx.setStorage({
            key: 'studentId',
            data: res.data.student.studentId,
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        }
      },
      function(err) {
        console.log(err)
      }
    )
  },
  showerweima: function(e) {
    this.setData({
      showerweima: true
    })
  },
  hideerweima: function(e) {
    this.setData({
      showerweima: false
    })
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
    network.request(
      "/user/index", {},
      res => {
        if (res.status == "1") {
          console.log(res.data)
          wx.setStorageSync('username', res.data.studentName)

          let body_bg = this.data.body_bg;
          let imgUrls = this.data.imgUrls;
          if (res.data.miniMap.isMiniprogram > 0) {
            imgUrls = {
              msg: res.data.miniMap.miniText,
              img: res.data.miniMap.miniLogo
            }
            if (res.data.miniMap.miniBanner) {
              body_bg = res.data.miniMap.miniBanner;
              wx.setNavigationBarColor({
                frontColor: '#ffffff',
                backgroundColor: '#000000'
              })
            }
          }
          this.setData({
            institutionName: res.data.institutionName,
            studentName: res.data.studentName,
            avatar: util.filterImgUrl(res.data.avatar) || "/imgs/common/140-140@2x.png",
            qrCode: res.data.qrCode,
            body_bg: body_bg,
            imgUrls: imgUrls
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: "none",
            duration: 2000
          })
        }
      },
      err => {
        console.log(err)
      }
    )
    wx.getSystemInfo({
      success: res => {
        this.setData({
          qrCodeWidth: res.windowWidth * 0.8
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    this.info();
  },

  errorImg: function(e) {
    this.setData({
      "avatar": "/imgs/common/140-140@2x.png"
    })
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