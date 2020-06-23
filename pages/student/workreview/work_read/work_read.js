let network = require('../../../../utils/network.js')
let util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentTaskCompleteId: 0,
    vodUrl: "",
    vodIndex: 0,
    detailData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      studentTaskCompleteId: options.id
    });
    this.findDetail();
  },

  findDetail: function () {
    network.request("/user/student_task_complete_detail",
      {
        "studentTaskCompleteId": this.data.studentTaskCompleteId
      },
      res => {
        if (res.status == 1) {
          if (res.data.vodfiles.length > 0) {
            this.data.vodUrl = res.data.vodfiles[0];
          }
          let attachments = [];
          res.data.imgfiles.forEach((v) => {
            attachments.push({ img: v });
          })
          res.data.attachments = attachments;

          wx.setNavigationBarTitle({
            title: res.data.title
          });
          this.setData({
            detailData: res.data,
            vodUrl: this.data.vodUrl
          });
        } else {
          util.toast("获取数据失败")
        }
      },
      error => {
        util.toast("获取数据失败")
      }
    );
  },
  changeVod: function (e) {
    this.videoContext = wx.createVideoContext('myVod');
    this.videoContext.pause();
    let dataset = e.currentTarget.dataset;
    this.setData({
      vodUrl: this.data.detailData.vodfiles[dataset.index],
      vodIndex: dataset.index
    });
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