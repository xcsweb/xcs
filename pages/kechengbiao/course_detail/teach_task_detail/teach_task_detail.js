let network = require('../../../../utils/network.js')
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
      dataset: wx.getStorageSync("dataset"),
      img_url: network.img_url,
      vod_url: network.vod_url
    });
  },
  //获取原数据 并恢复
  clshour_teach_detail: function (classesHourTeachId) {
    network.requestLoading('/manage/clshour_teach_detail', {
      classesHourTeachId: classesHourTeachId
    }, "", res => {
      if (res.status == 1) {
        this.translateData(res.data);
      } else {
        wx.showToast({
          title: res.message || '恢复数据失败',
          icon: 'none'
        })
      }
    }, error => { })
  },
  translateData: function (data) {
    console.log(data)
    let imgfiles = [],
      vodfiles = [];
    if (data.imgfiles) {
      imgfiles = data.imgfiles.split(",");
      imgfiles = imgfiles.filter(imgfile => {
        if (imgfile) {
          return true;
        } else {
          return false;
        }
      })
    }
    if (data.vodfiles) {
      vodfiles = data.vodfiles.split(",");
      vodfiles = vodfiles.filter(vodfile => {
        if (vodfile) {
          return true;
        } else {
          return false;
        }
      });
    }
    data.imgfiles = imgfiles;
    data.vodfiles = vodfiles;
    console.log(data)
    this.setData({
      data: data
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  closeVideo: function () {
    this.setData({
      showVideo: false
    })
  },
  //查看已上传的附件 图片或视频
  viewAttachment: function (e) {
    let dataset = e.currentTarget.dataset;
    console.log(dataset)
    if (dataset.video) {
      this.setData({
        videoSrc: this.data.vod_url + encodeURI(dataset.attachment),
        showVideo: true
      })
    } else {
      wx.previewImage({
        current: this.data.img_url + dataset.attachment, // 当前显示图片的http链接
        urls: [this.data.img_url + dataset.attachment] // 需要预览的图片http链接列表
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    if (this.data.dataset.d.classesHour.theWay == '1' && this.data.dataset.d.students[this.data.dataset.index].classesHourTeachId) {
      //按学员
      this.clshour_teach_detail(this.data.dataset.d.students[this.data.dataset.index].classesHourTeachId);
    } else if (this.data.dataset.d.classesHour.theWay == '0' && this.data.dataset.d.classesHour.classesHourTeachId) {
      //按班
      this.clshour_teach_detail(this.data.dataset.d.classesHour.classesHourTeachId);
    }
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