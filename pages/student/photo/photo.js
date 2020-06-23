// pages/student/photo/photo.js
let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photo_data: [],
    offset: 0,
    limit: 10,
    img_data: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

    this.setData({
      photo_data: [],
      offset: network.offset,
      limit: network.limit,
    })
    this.photo_dataLi();
  },
  photo_dataLi: function() {
    let url = '/user/classes_album';
    let params = {
      offset: this.data.offset,
      limit: this.data.limit
    };
    network.requestLoading(url, params, "", res => {
      if (res.status == 1) {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].imgfiles = res.data[i].imgfiles.split(",");
          res.data[i].day = util.formatTime(new Date(res.data[i].day * 1000)).split(" ")[0]
        }
        this.setData({
          photo_data: this.data.photo_data.concat(res.data),
          offset: this.data.offset + this.data.limit
        })
      } else {
        util.toast(res.message || '查询失败');
      }
    }, error => {
      util.toast('查询失败');
    })
  },
  imgYu: function(event) {
    console.log(event)

    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = event.currentTarget.dataset.list; //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })

  },
  photoClick: function(event) {
    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = event.currentTarget.dataset.list; //获取data-list
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
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
   * 下拉重置刷新
   */
  onPullDownRefresh: function() {
    this.photo_dataLi();
    this.setData({
      photo_data: [],
      offset: network.offset,
      limit: network.limit,
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.photo_dataLi();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})