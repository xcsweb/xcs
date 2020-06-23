var network = require('../../../../utils/network.js')
var util = require('../../../../utils/util.js')
// pages/student/memcard/fee_up/fee_up.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chargeType: "",
    courseDiscountDetails: "",
    courseId: "",
    salesAmount: "",
    trainCategoryNames:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    network.request(
      "/user/get_course_detail", {
        "courseId": options.id
      },
      res => {
        if (res.status == "1") {
          this.setData({
            chargeType: res.data[0].chargeType,
            courseDiscountDetails: res.data[0].courseDiscountDetails,
            courseId: res.data[0].courseId,
            salesAmount: res.data[0].salesAmount,
            trainCategoryNames: res.data[0].trainCategoryNames,
          })
          console.log(res.data)
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