var network = require('../../../../utils/network.js')
var util = require('../../../../utils/util.js')
// pages/student/workreview/sumupmore/sumupmore.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_url: network.img_url,
    vod_url: network.vod_url,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    network.request(
      "/user/student_follow_detail", {
        "followId": options.id
      },
      res => {
        if (res.status == "1") {
          console.log(res.data)
          this.setData({
            followId: res.data.followId,
            title: res.data.title,
            teacherName: res.data.teacherName,
            des: res.data.des,
            followDt: util.formatTime(new Date(res.data.followDt * 1000)).slice(0, 11),
            imgfiles: res.data.imgfiles.split(",").filter(imgfile => { return imgfile ? true : false; }),
            vodfiles: res.data.vodfiles.split(",").filter(vodfile => { return vodfile ? true : false; }),
            performance: res.data.performance,
            evaluate: res.data.evaluate,
          })
          if (res.data.performance == 0){
            this.setData({
              startype:false
            })
          }else{
            this.setData({
              startype: true
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
  evaluate: function(e) {
    this.setData({
      evaluate: e.detail.value
    })
  },
  rating: function(e) {
    this.setData({
      performance: e.detail.value
    })
  },
  sub_pinglun: function() {
    network.request(
      "/user/student_follow_evaluate", {
        "followId": this.data.followId,
        "evaluate": this.data.evaluate,
        "performance": this.data.performance
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
  //查看已上传的附件 图片或视频
  viewAttachment: function (e) {
    let dataset = e.currentTarget.dataset;
    if (dataset.video) {
      this.setData({
        videoSrc: this.data.vod_url + dataset.attachment,
        showVideo: true
      })
    } else {
      wx.previewImage({
        current: this.data.img_url + dataset.attachment, // 当前显示图片的http链接
        urls: [this.data.img_url + dataset.attachment] // 需要预览的图片http链接列表
      })
    }
  },
  closeVideo: function () {
    this.setData({
      showVideo: false
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