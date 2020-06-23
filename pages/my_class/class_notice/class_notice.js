var network = require('../../../utils/network.js')
var util = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cls_noticelist: []
  },

  initPageParam: function() {
    this.setData({
      cls_noticelist: [],
      offset: network.offset,
      limit: network.limit
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      classesId: options.classesId || 398
    })
  },
  //删除公告
  deleteNotice: function(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index;
    network.request("/manage/cls_noticedel_sub", {
      "classesNoticeId": this.data.cls_noticelist[index].classesNoticeId
      },
      res => {
        if (res.status == 1) {
          util.toast(res.message || "提交成功");
          this.data.cls_noticelist.splice(index,1);
          this.setData({
            cls_noticelist: this.data.cls_noticelist
          })
        } else {
          util.toast(res.message || '提交失败');
        }
      },
      error => {
        util.toast('获取数据失败');
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
    this.initPageParam();
    this.cls_noticelist();
  },

  cls_noticelist: function(doSearch) {
    let offset = this.data.offset;
    let limit = this.data.limit;
    network.request("/manage/cls_noticelist", {
        offset: offset,
        limit: limit,
        classesId: this.data.classesId
      },
      res => {
        res.data.forEach(msg => {
          msg.createDt = util.formatTime(new Date(msg.createDt * 1000));
        })
        this.setData({
          cls_noticelist: this.data.cls_noticelist.concat(res.data),
          offset: offset + limit
        });
      },
      error => {
        util.toast('获取数据失败');
      });
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
    this.cls_noticelist();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})