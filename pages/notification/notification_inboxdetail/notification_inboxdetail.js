let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')

Page({
  onLoad: function(option) {
    this.data.noticerecordid = option.noticerecordid
    this.notice_detail(option.noticerecordid)
  },
  closeVideo: function () {
    this.setData({
      showVideo: false
    })
  },
  data: {
    noticerecordid: 0,
    notice_detail: {},
    videoSrc: "",
    showVideo: false,
    btnConfirmShow: false,
    img_url: network.img_url,
    vod_url: network.vod_url,
  },
  notice_detail: function(noticerecordid) {
    network.request("/manage/notice_detail", {
        noticeRecordId: noticerecordid
      },
      res => {
        if (res.status == 1) {
          res.data.sendDt = util.formatDate(new Date(res.data.sendDt * 1000));
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
          if (res.data.isUseConfirm == 1 && res.data.isConfirm == 0){
            this.data.btnConfirmShow = true;
          }
          this.setData({
            notice_detail: res.data,
            btnConfirmShow: this.data.btnConfirmShow
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
  subConfirm: function(){
    network.requestLoading('/manage/notice_confirm_sub', { noticeRecordId: this.data.noticerecordid}, "正在提交", res => {
      
      if (res.status == 1) {
        wx.showToast({
          title: '确定成功！',
        })
        this.setData({
          btnConfirmShow: false
        });
      } else {
        wx.showToast({
          title: '获取消息类型失败',
          icon: "none"
        })
      }
    }, error => {
      wx.showToast({
        title: '获取消息类型失败',
        icon: "none"
      })
    })
  },
});