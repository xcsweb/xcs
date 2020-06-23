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
    this.setData({
      img_url: wx.getStorageSync("img_url"),
      vod_url: wx.getStorageSync("vod_url")
    })
    this.setData(options)
    wx.setNavigationBarTitle({
      title: options.title || "详情",
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    if (options.title == '教学教案详情') {
      this.get_teache_course_detail(options.id)
    } else {
      this.get_teache_task_detail(options.id)
    }
  },
  get_teache_course_detail: function(id) {
    network.requestLoading('/manage/get_teache_course_detail', {
      "teachCourseId": id
    }, "", res => {
      if (res.status == 1) {
        console.log(res.data)
        let attachments = [];
        if (res.data.imgfiles) {
          res.data.imgfiles.split(",").filter(imgfile => {
            if (imgfile) {
              let attachment = {
                key: imgfile,
                img: this.data.img_url + imgfile
              }
              attachments.push(attachment);
            }
          })
        }
        if (res.data.vodfiles) {
          res.data.vodfiles.split(",").filter(vodfile => {
            if (vodfile) {
              let attachment = {
                key: vodfile,
                img: this.data.vod_url + vodfile + "?vframe/jpg/offset/0/w/640/h/360",
                video: this.data.vod_url + vodfile
              }
              attachments.push(attachment);
            }
          })
        }
        this.setData({
          data: res.data,
          attachments: attachments
        });
      } else {
        util.toast("获取数据失败")
      }
    }, error => {
      util.toast("获取数据失败")
    })
  },
  get_teache_task_detail: function(id) {
    network.requestLoading('/manage/get_teache_task_detail', {
      "teachTaskId": id || "8"
    }, "", res => {
      if (res.status == 1) {
        console.log(res.data)
        let attachments = [];

        if (res.data.imgfiles) {
          res.data.imgfiles.split(",").filter(imgfile => {
            if (imgfile) {
              let attachment = {
                key: imgfile,
                img: this.data.img_url + imgfile
              }
              attachments.push(attachment);
            }
          })
        }
        if (res.data.vodfiles) {
          res.data.vodfiles.split(",").filter(vodfile => {
            if (vodfile) {
              let attachment = {
                key: vodfile,
                img: this.data.vod_url + vodfile + "?vframe/jpg/offset/0/w/640/h/360",
                video: this.data.vod_url + vodfile
              }
              attachments.push(attachment);
            }
          })
        }
        this.setData({
          data: res.data,
          attachments: attachments
        });
      } else {
        util.toast("获取数据失败")
      }
    }, error => {
      util.toast("获取数据失败")
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