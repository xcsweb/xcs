var network = require('../../../../utils/network.js')
var util = require('../../../../utils/util.js')
// pages/student/my_profile/changeid/changeid.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    network.request(
      "/user/my_information_logininfo", {},
      res => {
        if (res.status == "1") {
          res.data.forEach(item => {
            item.avatar = util.filterImgUrl(item.avatar);
          })
          this.setData({
            list: res.data
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
  addlogin: function() {
    wx.navigateTo({
      url: "/pages/login/login"
    })
  },
  chooselogin: function(e) {
    network.request(
      "/user/my_information_switch_login", {
        "studentId": e.currentTarget.dataset.id
      },
      res => {
        if (res.status==1){
          wx.setStorageSync('sessionId', res.data.sessionId)
          wx.navigateBack({
            delta: 1
          })
        }else{
          util.toast(res.message || "切换失败！");
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