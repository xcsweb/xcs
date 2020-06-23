var network = require('../../../../utils/network.js')
var util = require('../../../../utils/util.js')
// pages/student/memcard/fee_ren/feee_ren.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    network.request(
      "/user/get_course_detail", {
        "courseId": options.id
      },
      res => {
        if (res.status == "1") {
          this.setData({
            courseId: res.data[0].courseId,
            trainCategoryNames: res.data[0].trainCategoryNames,
            chargeType: res.data[0].chargeType,
            salesAmount: res.data[0].salesAmount,
            courseDiscountDetails: res.data[0].courseDiscountDetails,
            courseDiscountDetailId: res.data[0].courseDiscountDetailId,
            discountVal: res.data[0].discountVal,
            courseDiscountName: res.data[0].courseDiscountName,
            discountType: res.data[0].discountType,
            discountSalesAmount: res.data[0].discountSalesAmount,
          })
          console.log(this.data)
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