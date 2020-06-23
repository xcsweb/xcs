let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')
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
    wx.getStorage({
      key: 'studentIds',
      success: res => {
        if (res && res.data) {
          this.setData({
            studentIds: res.data
          });
          this.rec_relsale();
        } else {
          util.toast('出错了', true);
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  //获取销售人员数据
  rec_relsale: function() {
    network.requestLoading('/manage/rec_relsale', {}, "", res => {
      if (res.status == 1) {
        this.setData({
          rec_relsale: res.data
        })
      } else {
        util.toast('获取销售人员数据失败');
      }
    }, error => {
      util.toast('获取销售人员数据失败');
    })
  },
  selectMember: function(e) {
    this.setData({
      selectMember: e.currentTarget.dataset.index
    })
  },
  rec_relsale_sub: function() {
    if (typeof this.data.selectMember == 'undefined') {
      util.toast('请先选择销售人员');
      return
    }
    let params = {
      "memberId": this.data.rec_relsale[this.data.selectMember].memberId,
      "studentIds": this.data.studentIds
    };
    network.requestLoading('/manage/rec_relsale_sub', params, "请稍后...", res => {
      if (res.status == 1) {
        util.toast(res.message || '操作成功',true);
      } else {
        util.toast(res.message || '操作失败');
      }
    }, error => {
      util.toast('操作失败');
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