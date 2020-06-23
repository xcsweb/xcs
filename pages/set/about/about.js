var network = require('../../../utils/network.js')
var util = require('../../../utils/util.js')
// pages/set/about/about.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    network.request(
      "/user/about_us", {
      },
      res => {
        if (res.status == "1") {
          this.setData({
            text: res.data.content
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
})