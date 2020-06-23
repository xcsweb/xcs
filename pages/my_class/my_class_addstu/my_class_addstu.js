// pages/my_class/my_class_addstu/my_class_addstu.js
let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //假数据
    mockData: [],
    classesTimeIds: ""
  },
  //选中事件
  checkboxChange: function (e) {
    this.setData({
      classesTimeIds: e.detail.value.join(",")
    })
  },
  //添加学员
  addStu:function(){
    if (this.data.classesTimeIds == "") {
      wx.showToast({
        title: '请选择上课时段',
        icon: 'none'
      })
      return
    }
    this.data.studentCourses.forEach(sc => {
      sc.classesTimeIds = this.data.classesTimeIds;
    })
    network.requestLoading("/manage/cls_addstu_sub", this.data.studentCourses, "正在提交",
      res => {
        if (res.status == 1) {
          wx.showToast({
            title: res.message || '添加成功',
            icon: 'none'
          });
          wx.navigateBack({
            delta: 2,
          })
        } else {
          wx.showToast({
            title: res.message || '添加失败',
            icon: 'none'
          })
        }
      },
      error => {
        wx.showToast({
          title: '操作失败',
          icon: 'none'
        })
      }
    );
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      mockData: wx.getStorageSync("classesTimes"),
      studentCourses: wx.getStorageSync("studentCourses")
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