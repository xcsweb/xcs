let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRead: [],
    isConfirm: [],
    unread: [],
    isNotConfirm: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let person = JSON.parse(options.person);
    person.forEach(p=>{
      p.avatar = util.filterImgUrl(p.avatar) ||"/imgs/common/80_80.png";
      if (p.isRead){
        this.data.isRead.push(p)
      } else {
        this.data.unread.push(p)
      }

      if (p.isConfirm) {
        this.data.isConfirm.push(p)
      } else {
        this.data.isNotConfirm.push(p)
      }
    })
    this.setData({
      isRead: this.data.isRead,
      unread: this.data.unread,
      isConfirm: this.data.isConfirm,
      isNotConfirm: this.data.isNotConfirm,
      img_url: network.img_url,
      vod_url: network.vod_url,
      isUseConfirm: options.isUseConfirm
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