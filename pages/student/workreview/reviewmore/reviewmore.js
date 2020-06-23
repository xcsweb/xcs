var network = require('../../../../utils/network.js')
var util = require('../../../../utils/util.js')
// pages/student/workreview/reviewmore/reviewmore.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classHourStudentId: 0,
    className: "",
    teacherName: "",
    teachingEvaluate: "",
    teachingEvaluateDt: "",
    teachingPerformance: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    network.request(
      "/user/class_evaluate_detail", {
        "classesHourStudentId": options.id
      },
      res => {
        if (res.status == "1") {
          this.setData({
            classHourStudentId: res.data[0].classHourStudentId,
            className: res.data[0].className,
            teacherName: res.data[0].teacherName,
            teachingEvaluate: res.data[0].teachingEvaluate,
            teachingEvaluateDt: util.formatTime(new Date(res.data[0].teachingEvaluateDt * 1000)).slice(0, 11),
            dayStr: util.formatTime(new Date(res.data[0].day * 1000)).slice(0, 11),
            teachingPerformance: res.data[0].teachingPerformance,
          })
          if (res.data[0].teachingImg) {
            let attachments = res.data[0].teachingImg.split(",").filter(e => {
              return e;
            })
            attachments.forEach((e, i) => {
              attachments[i] = {
                img: util.filterImgUrl(e)
              }
            })
            this.setData({
              attachments: attachments
            })
          }
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