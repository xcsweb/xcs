let network = require('../../../../utils/network.js')
let util = require('../../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.getStorage({
      key: 'course_detail',
      success: res => {
        this.setData({
          course: res.data
        });
      },
    })
  },

  //监听输入框并保存值
  bindinput: function (e) {
    let data = {};
    data[e.currentTarget.dataset.name] = e.detail.value;
    this.setData(data);
  },

  //老师请假
  teacher_ask_for_leave_teacher: function (e) {
    if (!this.data.content){
      util.toast("请输入事由");
      return
    }
    network.request("/manage/teacher_ask_for_leave_teacher", { "classHourId": this.data.course.classesHourId, "content": this.data.content },
      res => {
        if (res.status == 1) {
          util.toast(res.message || "操作成功",true)
        } else {
          let msg = res.message || "操作失败，请重试";
          if (res.data) {
            for (let key in res.data) {
              msg += ";"
              msg += key;
              msg += ":";
              msg += res.data[key];
            }
          }
          util.toast(msg, false, 4000)
        }
      },
      error => {
        util.toast("操作失败，请重试")
      });
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