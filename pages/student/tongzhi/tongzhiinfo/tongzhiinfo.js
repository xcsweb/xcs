let network = require('../../../../utils/network.js')
let util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: [],
    day_: '',
    name: '',
    sid: '',
    img_url: network.img_url,
    vod_url: network.vod_url,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)
    this.getTzinfo(options.noticeid);
    let id = options.noticeid;
    let day_ = options.day_;
    let name = options.name;
    this.setData({
      day_: day_,
      name: name,
      sid: id
    })
  },

  getTzinfo: function(id) {
    var sid = id;
    // console.log(sid);
    network.request("/user/get_notice_detail", {
        noticeId: sid
      },
      res => {
        if (res.status == 1) {
          if (res.data.imgfiles) {
            res.data.imgfiles = res.data.imgfiles.split(",").filter(imgfile => {
              return imgfile ? true : false;
            })
          } else {
            res.data.imgfiles = [];
          }
          if (res.data.vodfiles) {
            res.data.vodfiles = res.data.vodfiles.split(",").filter(vodfile => {
              return vodfile ? true : false;
            })
          } else {
            res.data.vodfiles = [];
          }
          res.data.imgfiles.forEach((e, i) => {
            res.data.imgfiles[i] = { img: util.filterImgUrl(e)}
          })
          res.data.vodfiles.forEach((e, i) => {
            res.data.vodfiles[i] = {
              img: util.filterVodUrl(e) + "?vframe/jpg/offset/0/w/640",
              video: util.filterVodUrl(e)
            }
          })
          res.data.attachments = res.data.imgfiles.concat(res.data.vodfiles)
          this.setData({
            info: res.data
          });
          wx.setNavigationBarTitle({
            title: this.data.info.title||"通知详情",
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
          // console.log(res.data.imgfiles)

          // console.log(this.data.info)
          // let imgurl = network.img_url + this.data.info.imgfiles
          // let video = network.vod_url + this.data.info.vodfiles
        } else {
          wx.showToast({
            title: '获取数据失败',
            icon: 'none'
          })
        }
        // this.setData({
        //   imgurl:imgurl,
        //   videourl:video
        // })
      },
      error => {
        util.toast("获取数据失败")
      });
  },

  confirm: function() {
    var sid = this.data.sid
    console.log(sid)
    network.request("/user/confirm_notice", {
        noticeId: sid
      },
      res => {
        if (res.status == 1) {
          util.toast(res.message || "确认成功", true)
        } else {
          util.toast(res.message || "操作失败")
        }
      },
      error => {
        util.toast("获取数据失败")
      });
  },


  viewAttachment: function(e) {
    let dataset = e.currentTarget.dataset;
    console.log(dataset)
    if (dataset.video) {
      this.setData({
        videoSrc: dataset.attachment,
        showVideo: true
      })
    } else {
      wx.previewImage({
        current: dataset.attachment, // 当前显示图片的http链接
        urls: [dataset.attachment] // 需要预览的图片http链接列表
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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