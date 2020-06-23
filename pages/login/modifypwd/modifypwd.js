let network = require('../../../utils/network.js')
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    txt: "获取验证码",
    timer: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "忘记密码"
    })
  },
  //监听输入框并保存值
  bindinput: function(e) {
    let data = {};
    data[e.currentTarget.dataset.name] = e.detail.value;
    this.setData(data);
  },
  send_tel_code: function() {
    if (this.data.txt != "获取验证码") {
      return
    }
    if (!this.data.tel) {
      wx.showToast({
        title: '请输入手机号',
        icon: "none"
      })
      return
    }
    network.request("/common/send_tel_code", {
        "institutionId": wx.getStorageSync("institutionId")||0,
        "tel": this.data.tel
      },
      res => {
        console.log(res)
        if (res.status == 1) {
          this.startTimer();
        } else {
          wx.showToast({
            title: res.message || '操作失败，请重试',
            icon: 'none'
          })
        }
      },
      error => {
        wx.showToast({
          title: '操作失败，请重试',
          icon: 'none'
        })
      });
  },
  forget_pwd_sub: function() {
    if (!this.data.tel) {
      wx.showToast({
        title: '请输入手机号',
        icon: "none"
      })
      return
    }
    if (!this.data.verifyCode) {
      wx.showToast({
        title: '请输入验证码',
        icon: "none"
      })
      return
    }
    if (!this.data.password || !this.data.password.trim()) {
      wx.showToast({
        title: '请输入密码',
        icon: "none"
      })
      return
    }
    network.requestLoading("/common/forget_pwd_sub", {
        "institutionId": wx.getStorageSync("institutionId"),
        "tel": this.data.tel,
        "password": this.data.password,
        "verifyCode": this.data.verifyCode
      }, "正在提交",
      res => {
        console.log(res)
        if (res.status == 1) {
          util.toast(res.message || '修改成功',true)
        } else {
          wx.showToast({
            title: res.message || '操作失败，请重试',
            icon: 'none'
          })
        }
      },
      error => {
        wx.showToast({
          title: '操作失败，请重试',
          icon: 'none'
        })
      });
  },
  startTimer: function() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
      delete this.data.timer;
    }
    let times = 60;
    let timer = setInterval(() => {
      times--;
      if (times == 0) {
        clearInterval(this.data.timer);
        delete this.data.timer;
        this.setData({
          txt: "获取验证码"
        });
      } else {
        this.setData({
          txt: times + "s后再次获取"
        });
      }
    }, 1000);
    this.setData({
      timer: timer,
      txt: times + "s后再次获取"
    })
  },
  back: function() {
    wx.navigateBack()
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
    clearInterval(this.data.timer);
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