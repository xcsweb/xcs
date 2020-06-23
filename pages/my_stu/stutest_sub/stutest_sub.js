let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')

// pages/my_stu/stutest_sub/stutest_sub.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: true,
    index: 0,
    campusId: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      studentId: options.id
    })
    network.request(
      "/manage/stufit_edit", {
        "studentId": "1"
      },
      res => {
        if (res.status == "1") {
          console.log(res.data)
          if (res.data.stuFitness.length != undefined) {
            this.setData({
              type: false
            })
            wx.setNavigationBarTitle({
              title: '编辑测试记录',
            })
          }
          this.setData({
            campuses: res.data.campuses,
            fitnessType: res.data.fitnessType,
            stuFitness: res.data.stuFitness,
            campusId: res.data.campuses[0].campusId,
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
    var value = "fitnessType[" + event.currentTarget.dataset.index + "].value"
    this.setData({
      [value]: event.detail.value
    })
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value,
      campusId: this.data.campuses[e.detail.value].campusId
    })
  },
  savepsd: function(e) {
    console.log(this.data)
    var studentFitnessRecords = []
    for (var idx in this.data.fitnessType) {
      studentFitnessRecords.push({
        fitnessTypeId: this.data.fitnessType[idx].fitnessTypeId,
        value: this.data.fitnessType[idx].value,
      })
    }
    network.requestLoading(
      "/manage/stufit_edit_sub", {
        "studentId": "1",
        "campusId": this.data.campusId,
        "studentFitnessRecords": studentFitnessRecords
      }, "正在提交",
      res => {
        if (res.status == "1") {
          console.log(res.data)
          this.setData({
            campuses: res.data.campuses,
            fitnessType: res.data.fitnessType,
            stuFitness: res.data.stuFitness
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