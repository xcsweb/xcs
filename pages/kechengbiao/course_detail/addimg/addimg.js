let network = require('../../../../utils/network.js')
let util = require('../../../../utils/util.js')
const qiniuUploader = require("../../../../qiniuUploader");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    attachments:[]
  },
  closeVideo: function () {
    this.setData({
      showVideo: false
    })
  },
  //查看已上传的附件 图片或视频
  viewAttachment: function (e) {
    let attachment = e.currentTarget.dataset.attachment;
    console.log(attachment)
    if (attachment.video) {
      this.setData({
        videoSrc: this.data.vod_url + attachment.key,
        showVideo: true
      })
    } else {
      wx.previewImage({
        current: this.data.img_url + attachment.key, // 当前显示图片的http链接
        urls: [this.data.img_url + attachment.key] // 需要预览的图片http链接列表
      })
    }
  },
  findimguptoken: function () {
    network.requestLoading('/common/find_uptoken', {}, "", res => {
      console.log(res)
      if (res.status == 1) {
        this.setData({
          imgUptoken: res.data.imgUptoken,
          vodUptoken: res.data.vodUptoken
        })
      }
    }, error => { })
  },
  addImage: function () {
    var that = this;
    // 选择图片
    wx.chooseImage({
      count: 1,
      success: function (res) {
        console.log(res)
        var filePath = res.tempFilePaths[0];
        // 交给七牛上传
        qiniuUploader.upload(filePath, (res) => {
          that.data.attachments.push({ key: res.key, img: filePath, localfile: filePath })
          that.setData({
            'attachments': that.data.attachments
          });
        }, (error) => {
          wx.showModal({
            title: 'error',
            content: JSON.stringify(error),
          })
        }, {
            region: 'ECN',
            domain: network.img_url ,
            uptoken: that.data.imgUptoken
          }, (res) => {
            // console.log('上传进度', res.progress)
            // console.log('已经上传的数据长度', res.totalBytesSent)
            // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
          });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      img_url: network.img_url,
      vod_url: network.vod_url
    });
    this.findimguptoken();
  },

  delete: function (e) {
    let index = e.currentTarget.dataset.index;
    this.data.attachments.splice(index, 1);
    this.setData({
      attachments: this.data.attachments
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.getStorage({
      key: 'course_addImg',
      success: res=> {
        if (res.data){
          this.setData({
            attachments: res.data
          })

        }
      },
    })
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
    wx.setStorageSync("course_addImg", this.data.attachments)
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