let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  post_score_index_change: function (e) {
    this.setData({
      score: this.data.post_score[e.detail.index].val
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData(options)
    this.stu_score_history();
  },

  stu_score_history: function (e) {
    let params = {
      "studentId": this.data.studentId || 204,
    }
    network.requestLoading('/manage/stu_score_history', params, "", res => {
      if (res.status == 1) {
        res.data.studentscoreList.forEach(e => {
          e.createDt_ = util.formatTime(new Date(e.createDt * 1000)).substr(0, 16);
        })
        this.setData({
          score_history: res.data.studentscoreList,
          total: res.data.allScore
        })
      } else {
        util.toast(res.message || '获取数据失败');
      }
    }, error => {
      util.toast('网络错误');
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