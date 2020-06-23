let network = require('../../../../utils/network.js')
let util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    adviceinfo: [],
    cord: '0',
    buttontext: '查看专家建议'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var clickcord = 0;
    this.setData({
      id: options.id
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.stu_tps_record_advice()
  },
  stu_tps_record_advice: function() {
    let id = this.data.id
    console.log(id)
    network.request("/user/stu_tps_record_advice?", {
        "studentTpsId": id
      },
      res => {
        if (res.status == 1) {
          res.data.forEach(res => {
            res.buttontext = "查看专家建议"
          })
          console.log(res.data)
          this.setData({
            adviceinfo: res.data
          })
        }
      },
      error => {
        util.toast("获取数据失败")
      });
  },
  lookAdvice: function(event) {
    console.log(event.currentTarget)
    let id = event.currentTarget.dataset.recordid
    // let index = event.currentTarget.dataset.recordid
    var x = "adviceinfo[" + event.currentTarget.dataset.index + "].buttontext"
    this.setData({
      [x]: '查看建议'
    })
    let clickcord = '1'
    this.setData({
      cord: clickcord
    })
    console.log(this.data.cord)
    console.log(id)
    wx.navigateTo({
      url: '../adviceinfo/adviceinfo?recordid=' + id
    })

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