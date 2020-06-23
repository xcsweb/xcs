let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')

Page({
  onLoad: function(option) {
    this.data.noticeid = option.noticeid
    this.setData({
      img_url: wx.getStorageSync("img_url"),
      vod_url: wx.getStorageSync("vod_url")
    })
    this.notice_detail(option.noticeid)
  },
  closeVideo: function () {
    this.setData({
      showVideo: false
    })
  },
  data: {
    noticeid:0,
    confirmNum: -1,
    readNum: -1,
    num: -1,
    noticeType: '',
    notice_detail: {},
    videoSrc: "",
    showVideo: false
  },
  todetail2: function() {
    wx.navigateTo({
      url: '../notification_detail2/notification_detail2?person=' + JSON.stringify(this.data.notice_detail.person) + '&isUseConfirm=' + this.data.notice_detail.isUseConfirm, 
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  notice_detail: function (noticeId) {
    network.request("/manage/notice_detail", {
      noticeId: noticeId
      },
      res => {
        if (res.status == 1) {
          res.data.sendDt = util.formatTime(new Date(res.data.sendDt * 1000));
          if (res.data.imgfiles) {
            res.data.imgfiles = res.data.imgfiles.split(",").filter(imgfile => {
              return imgfile ? true : false;
            })
          }
          if (res.data.vodfiles) {
            res.data.vodfiles = res.data.vodfiles.split(",").filter(vodfile => {
              return vodfile ? true : false;
            })
          }
          this.setData({
            notice_detail: res.data
          });
        } else {
          wx.showToast({
            title: '获取数据失败',
            icon: 'none'
          })
        }
        console.log(res)
      },
      error => {
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        })
      });
  },
  //查看已上传的附件 图片或视频
  viewAttachment: function(e) {
    let dataset = e.currentTarget.dataset;
    console.log(dataset)
    if (dataset.video) {
      this.setData({
        videoSrc: this.data.vod_url +dataset.attachment,
        showVideo: true
      })
    } else {
      wx.previewImage({
        current: this.data.img_url +dataset.attachment, // 当前显示图片的http链接
        urls: [this.data.img_url+dataset.attachment] // 需要预览的图片http链接列表
      })
    }
  },
});