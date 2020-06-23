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
    wx.setNavigationBarTitle({
      title: options.title || "预约学员",
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    });
    this.setData({
      title: options.title || "预约学员",
      classesHourId: options.classesHourId
    });
    if (this.data.title=="预约学员"){
      this.get_clshourStudent(this.data.classesHourId,10)
    }else{
      this.get_clshourStudent(this.data.classesHourId,11)
    }
  },
  get_clshourStudent: function (classesHourId, layOutType) {
    network.requestLoading('/manage/get_clshourStudent', {
      classesHourId: classesHourId,
      layOutType: layOutType
    }, "", res => {
      if (res.status == 1) {
        this.setData({
          clshourStudent:res.data
        });
        if (res.data.length==0){
          util.toast("当前没有" + this.data.title);
        }
      } else {
        util.toast(res.message||"获取数据失败")
      }
      }, error => {
        debugger
      util.toast(res.message || "获取数据失败")
    })
  },
  //转为预约
  change_regular_clshour: function (e) {
    network.requestLoading('/manage/change_regular_clshour', {
      classesHourStudentId: e.currentTarget.dataset.id
    }, "", res => {
      if (res.status == 1) {
        util.toast(res.message || "操作成功");
        if (this.data.title == "预约学员") {
          this.get_clshourStudent(this.data.classesHourId, 10)
        } else {
          this.get_clshourStudent(this.data.classesHourId, 11)
        }
      } else {
        util.toast(res.message || "操作失败")
      }
    }, error => {
      util.toast(res.message || "操作失败")
    })
  },
  //取消预约
  undo_clshour: function (e) {
    network.requestLoading('/manage/undo_clshour', {
      classesHourStudentId: e.currentTarget.dataset.id
    }, "", res => {
      if (res.status == 1) {
        util.toast(res.message || "操作成功");
        if (this.data.title == "预约学员") {
          this.get_clshourStudent(this.data.classesHourId, 10)
        } else {
          this.get_clshourStudent(this.data.classesHourId, 11)
        }
      } else {
        util.toast(res.message || "操作失败")
      }
    }, error => {
      util.toast(res.message || "操作失败")
    })
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