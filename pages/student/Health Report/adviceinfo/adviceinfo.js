let network = require('../../../../utils/network.js')
let util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordid: '',
    info: {}
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.recordid)
    this.setData({
      recordid: options.recordid,
    })
    console.log(this.data.recordid)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.stu_tps_record_advice_detail()
  },
  stu_tps_record_advice_detail: function() {
    console.log(this.data.recordid)
    let recordid = this.data.recordid
    network.request("/user/stu_tps_record_advice_detail?", {
        "recordId": recordid
      },
      res => {
        if (res.status == 1) {
          console.log(res.data)
          this.setData({
            info: res.data
          })
        }
      },
      error => {
        util.toast("获取数据失败")
      });

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