var network = require('../../../../utils/network.js')
var util = require('../../../../utils/util.js')
// pages/my_class/class_blog/class_add/class_add.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    choosetype: 1, //1图片2视频
    content: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      choosetype: options.type,
      classesId: options.id
    })
    if (options.type == 1) {
      wx.setNavigationBarTitle({
        title: '添加照片',
      })
    }
    if (options.type == 2) {
      wx.setNavigationBarTitle({
        title: '添加视频',
      })
    }
  },
  savetype: function() {
    var file = []
    for (var idx in this.data.attachments) {
      file.push(this.data.attachments[idx].key)
    }
    var filestr = file.join()
    if (this.data.choosetype == 1) {
      network.requestLoading(
        "/manage/cls_albumadd_sub", {
          "classesId": this.data.classesId,
          "content": this.data.content,
          "imgfiles": filestr
        }, "正在提交",
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
    }
    if (this.data.choosetype == 2) {
      network.requestLoading(
        "/manage/cls_vodadd_sub", {
          "classesId": this.data.classesId,
          "content": this.data.content,
          "vodfiles": filestr
        }, "正在提交",
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
    }
  },
  attachmentsChange: function(e) {
    this.setData({
      attachments: e.detail.attachments
    })
    console.log(this.data.attachments)
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