let network = require('../../../../utils/network.js')
let util = require('../../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  toDetail: function(e) {
    wx.navigateTo({
      url: '/pages/kechengbiao/course_detail/clshour_list_detail/clshour_list_detail?id='+e.currentTarget.dataset.id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData(options)
  },

  clshour_studenttask_list: function() {
    network.request("/manage/clshour_studenttask_list", {
        "studentTaskId": this.data.id||"57"
      }, res => {
        if (res.status == 1) {
          res.data.forEach(e=>{
            e.createDt_ = util.formatTime(new Date(e.createDt * 1000)).substr(0, 10);
          })
          this.setData({ clshour_studenttask_list:res.data});
          if(res.data.length==0){
            util.toast("暂无作业")
          }
        } else {
          util.toast(res.message || "获取数据失败")
        }
      },
      error => {
        util.toast("获取数据失败")
      });
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
    this.clshour_studenttask_list();
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