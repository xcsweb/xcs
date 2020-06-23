let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fbdisabled: false
  },
  post_score_index_change: function(e) {
    this.setData({
      score: this.data.post_score[e.detail.index].val
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData(options)
    this.get_post_score_list();
  },


  //积分列表
  get_post_score_list: function (e) {
    network.requestLoading('/manage/get_post_score_list', {}, "", res => {
      if (res.status == 1) {
        this.setData({
          post_score: res.data
        })
      }
    }, error => {

    })
  },
  score_sub: function(e) {
    if (!this.data.score){
      util.toast("请选择或输入积分")
      return
    }
    if (!this.data.remark) {
      util.toast("请输入说明")
      return
    }
    this.setData({
      fbdisabled: true
    });
    let params = {
      "studentId": this.data.studentId||204,
      "optype": "0",
      "score": this.data.score,
      "remark": this.data.remark||""
    }
    if (this.data.post_score_index!=undefined){
      params.scoreConfigId = this.data.post_score[this.data.post_score_index].id
    }
    network.requestLoading('/manage/score_sub', params, "正在提交", res => {
      if (res.status == 1) {
        util.toast(res.message || '操作成功',true);
      } else {
        this.setData({ 
          fbdisabled: false
        });
        util.toast(res.message || '操作失败');
      }
    }, error => {
      this.setData({
        fbdisabled: false
      });
      util.toast('网络错误');
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