var network = require('../../../utils/network.js')
var util = require('../../../utils/util.js')
// pages/set/changepwd/changepwd.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldPhone: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  bindKeyInput: function (event) {
    var dataname = event.currentTarget.dataset.dataname;
    this.setData({
      [dataname]: event.detail.value
    })
  },
  savepsd: function () {
    network.request(
      "/manage/change_student_password", {
        "oldpassword": this.data.oldpsd,
        "newpassword": this.data.newpsd,
        "newpasswordconfirm": this.data.againpsd
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