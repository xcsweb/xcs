var network = require('../../../utils/network.js')
var util = require('../../../utils/util.js')
// pages/my_class/class_blog/class_blog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classesId: 1,
    tabid: 0,
    classesNotice: [], //公共
    classesVods: [], //视频
    classesAlbums: [], //照片
    posts: [], //互动
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      classesId: options.classesId
    })
    this.get()
  },
  get: function() {
    network.request(
      "/manage/cls_space", {
        "classesId": this.data.classesId
      },
      res => {
        if (res.status == "1") {
          res.data.classesAlbums.forEach(res => {
            res.imgfiles = res.imgfiles.split(",")
            for (var idx in res.imgfiles) {
              res.imgfiles[idx] = network.img_url + res.imgfiles[idx]
            }
          })
          res.data.classesVods.forEach(res => {
            res.vodfiles = res.vodfiles.split(",")
            for (var idx in res.vodfiles) {
              res.vodfiles[idx] = network.img_url + res.vodfiles[idx];
              res.createDt = util.formatTime(new Date(res.createDt * 1000)).slice(0, 11)
            }
          })
          this.setData({
            classesNotice: res.data.classesNotice,
            classesVods: res.data.classesVods,
            classesAlbums: res.data.classesAlbums,
            posts: res.data.posts,
          })
          console.log(this.data)
        } else {
          wx.showToast({
            title: res.message,
            icon: "none",
            duration: 2000
          })
        }
      },
      err => {
        console.log(err)
      }
    )
  },
  showimg: function(event) {
    wx.previewImage({
      urls: this.data.classesAlbums[event.currentTarget.dataset.id].imgfiles
    })
  },
  deleteimg: function(event) {
    wx.showModal({
      title: '是否确认删除',
      success: res => {
        if (res.confirm) {
          network.requestLoading(
            "/manage/cls_albumdel_sub", {
              "classesAlbumId": this.data.classesAlbums[event.currentTarget.dataset.id].classesAlbumId
            }, "正在提交",
            res => {
              if (res.status == "1") {
                wx.showToast({
                  title: res.message,
                  icon: "none",
                  duration: 2000,
                  complete: this.get()
                })
              } else {
                wx.showToast({
                  title: res.message,
                  icon: "none",
                  duration: 2000
                })
              }
            },
            err => {
              console.log(err)
            }
          )
        }
      },
    })
  },
  showvideo: function(event) {
    this.videoContext = wx.createVideoContext("vod" + event.currentTarget.dataset.id)
  },
  deletevideo: function(event) {
    wx.showModal({
      title: '是否确认删除',
      success: res => {
        if (res.confirm) {
          network.requestLoading(
            "/manage/cls_voddel_sub", {
              "classesVodId": event.currentTarget.dataset.index
            }, "正在提交",
            res => {
              if (res.status == "1") {
                wx.showToast({
                  title: res.message,
                  icon: "none",
                  duration: 2000,
                  complete: this.get()
                })
              } else {
                wx.showToast({
                  title: res.message,
                  icon: "none",
                  duration: 2000
                })
              }
            },
            err => {
              console.log(err)
            }
          )
        }
      },
    })
  },
  changeTab: function(event) {
    this.setData({
      tabid: event.currentTarget.dataset.id
    })
  },
  placardGo: function() {
    wx.navigateTo({
      url: "/pages/my_class/class_notice/class_notice?classesId=" + this.data.classesId
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.get()
  },
})