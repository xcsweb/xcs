var network = require('../../../utils/network.js')
var util = require('../../../utils/util.js')
// pages/set/telphone/telphone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldPhone: "",
    psd: "",
    newPhone: "",
    yzm: "",
    yzmword: "获取验证码",
    yzmget: false,
    timer: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    network.request(
      "/manage/get_member_tel", {},
      res => {
        if (res.status == "1") {
          this.setData({
            oldPhone: res.data.memberTel
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
  },
  getYzm: function() {
    if (this.data.newPhone != "") {
      network.request(
        "/manage/change_tel_send_msgcode", {
          "tel": this.data.newPhone
        },
        res => {
          if (res.status == "1") {
            wx.showToast({
              title: res.message,
              icon: "none",
              duration: 2000
            })
            let times = 60;
            let timer = setInterval(() => {
              times--;
              if (times == 0) {
                clearInterval(this.data.timer);
                this.setData({
                  yzmword: "获取验证码",
                  yzmget: false
                });
              } else {
                this.setData({
                  yzmword: times + "s后再次获取",
                  yzmget: true
                });
              }
            }, 1000);
            this.setData({
              timer: timer,
              txt: times + "s后再次获取"
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
    } else {
      wx.showToast({
        title: "输入手机号",
        icon: "none",
        duration: 2000
      })
    }
  },
  savepsd: function() {
    network.request(
      "/manage/change_tel", {
       "password": this.data.psd,
        "tel": this.data.newPhone,
        "verifyCode": this.data.yzm
      },
      res => {
        if (res.status == "1") {
          wx.showToast({
            title: res.message,
            icon: "none",
            duration: 2000,
            complete: wx.navigateBack({})
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
  },
  bindKeyInput: function(event) {
    var dataname = event.currentTarget.dataset.dataname;
    this.setData({
      [dataname]: event.detail.value
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