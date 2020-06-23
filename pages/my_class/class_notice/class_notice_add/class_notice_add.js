var network = require('../../../../utils/network.js')
var util = require('../../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      classesId: options.classesId || 398
    })
  },
  cls_noticeadd_sub: function() {
    if (!this.data.title) {
      util.toast('请输入标题');
      return
    }
    if (!this.data.content) {
      util.toast('请输入内容');
      return
    }
    network.request("/manage/cls_noticeadd_sub", {
        "classesId":this.data.classesId,
        "title": this.data.title,
        "content": this.data.content
      },
      res => {
        if (res.status == 1) {
          util.toast(res.message||"提交成功",true);
        } else {
          util.toast(res.message ||'提交失败');
        }
      },
      error => {
        util.toast('提交失败');
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