let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')
const qiniuUploader = require("../../../qiniuUploader");
Page({
  data: {
    noticeType: [],
    noticeTypeIndex: 0,
    sendtypeIndex: 0,
    start: "",
    title: "",
    content: "",
    attachments: [], //附件
    num: 0,
    isSms: "1",
    isUseConfirm: "1",
    sendDt: "",
    isSendDt: false,
    imgUptoken: "",
    vodUptoken: "",
    noticeRecords: [],
    selectedTeacherIds: [],
    selectedTeacherIds: [],
    selectedInfo: "",
    contentLength: 0,
    videoSrc: "",
    showVideo: false,
    my_stu_student: {}
  },
  closeVideo: function() {
    this.setData({
      showVideo: false
    })
  },
  onLoad: function() {
    this.findimguptoken();
    wx.getStorage({
      key: 'my_stu_student',
      success: res => {
        this.setData({
          my_stu_student: res.data
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  onShow: function() {},
  //提交  发送通知
  stufollow_sub: function(e) {
    if (!this.data.my_stu_student.studentId) {
      return
    }
    let formData = e.detail.value;
    if (!formData.des) {
      wx.showToast({
        title: '请输入跟进内容',
        icon: 'none'
      })
      return
    }

    if (formData.followDt)
      formData.followDt = util.dateToDayStamp(new Date(formData.followDt));
    else{
      formData.followDt="";
    }
    if (formData.followDt&&formData.sendTime) {
      let date = new Date(this.data.sendDt + " " + this.data.sendTime)
      formData.followDt = Math.round(date.getTime() / 1000)
    }
    delete formData.sendTime;
    formData.imgfiles = "";
    formData.vodfiles = "";
    this.data.attachments.forEach(attachment => {
      if (attachment.video) {
        formData.vodfiles += attachment.key;
        formData.vodfiles += ",";
      } else {
        formData.imgfiles += attachment.key;
        formData.imgfiles += ",";
      }
    });
    formData.studentId = this.data.my_stu_student.studentId;
    console.log(formData)
    network.requestLoading('/manage/stufollow_sub', formData, "正在提交", res => {
      console.log(res)
      if (res.status == 1) {
        let duration = 500;
        wx.showToast({
          title: '发送成功！',
          duration: duration
        });
        setTimeout(() => {
          wx.navigateBack({
            delta: 1,
          })
        }, duration);
      } else {
        wx.showToast({
          title: '提交失败',
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
  //查看已上传的附件 图片或视频
  viewAttachment: function(e) {
    let attachment = e.currentTarget.dataset.attachment;
    console.log(attachment)
    if (attachment.video) {
      this.setData({
        videoSrc: attachment.localfile,
        showVideo: true
      })
    } else {
      wx.previewImage({
        current: attachment.localfile, // 当前显示图片的http链接
        urls: [attachment.localfile] // 需要预览的图片http链接列表
      })
    }
  },
  oninput: function(e) {
    let value = e.detail.value;
    if (value) {
      this.setData({
        contentLength: value.length > 1000 ? 1000 : value.length
      })
    } else {
      this.setData({
        contentLength: 0
      })
    }
  },
  delete: function(e) {
    let index = e.currentTarget.dataset.index;
    this.data.attachments.splice(index, 1);
    this.setData({
      attachments: this.data.attachments
    })
  },
  addImage: function() {
    var that = this;
    // 选择图片
    wx.chooseImage({
      count: 1,
      success: function(res) {
        console.log(res)
        var filePath = res.tempFilePaths[0];
        // 交给七牛上传
        qiniuUploader.upload(filePath, (res) => {
          that.data.attachments.push({
            key: res.key,
            img: filePath,
            localfile: filePath
          })
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
          domain: network.img_url,
          uptoken: that.data.imgUptoken
        }, (res) => {
          // console.log('上传进度', res.progress)
          // console.log('已经上传的数据长度', res.totalBytesSent)
          // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
        });
      }
    })
  },
  //添加视频
  addVideo: function() {
    var that = this;
    // 选择视频
    wx.chooseVideo({
      success: function(res) {
        console.log(res)
        //缩略图真机不返回 采用七牛云的视频截图
        var filePath = res.tempFilePath;
        // 交给七牛上传
        qiniuUploader.upload(filePath, (res) => {
          that.data.attachments.push({
            img: res.imageURL + "?vframe/jpg/offset/0/w/640/h/360",
            key: res.key,
            video: true,
            localfile: filePath
          })
          that.setData({
            'attachments': that.data.attachments
          });
        }, (error) => {
          console.log('error: ' + error);
        }, {
          region: 'ECN',
          domain: network.img_url,
          uptoken: that.data.vodUptoken
        }, (res) => {
          // console.log('上传进度', res.progress)
          // console.log('已经上传的数据长度', res.totalBytesSent)
          // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
        });
      },
      fail: error => {
        console.log(error)
      }
    })
  },
  showActionSheet: function() {
    wx.showActionSheet({
      itemList: ['图片', '视频'],
      success: res => {
        if (res.tapIndex == 0) {
          this.addImage()
        } else {
          this.addVideo()
        }
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  },
  findimguptoken: function() {
    network.requestLoading('/common/find_uptoken', {}, "", res => {
      console.log(res)
      if (res.status == 1) {
        this.setData({
          imgUptoken: res.data.imgUptoken,
          vodUptoken: res.data.vodUptoken
        })
      }
    }, error => {})
  },
  showTopTips: function() {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function() {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  radioChange1: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems
    });
  },
  checkboxChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);

    var checkboxItems = this.data.checkboxItems,
      values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      checkboxItems: checkboxItems
    });
  },
  bindDateChange: function(e) {
    this.setData({
      sendDt: e.detail.value.replace(/-/g,'/')
    })
  },
  bindTimeChange: function(e) {
    this.setData({
      sendTime: e.detail.value
    })
  },
  bindCountryCodeChange: function(e) {
    console.log('picker country code 发生选择改变，携带值为', e.detail.value);

    this.setData({
      countryCodeIndex: e.detail.value
    })
  },
  bindNoticeTypeChange: function(e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);

    this.setData({
      noticeTypeIndex: e.detail.value
    })
  },
  bindAccountChange: function(e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value);

    this.setData({
      accountIndex: e.detail.value
    })
  },
  bindAgreeChange: function(e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },
  openMsgType: function() {
    var msgTypes = ['会议消息', '补课通知', '调休通知'];
    let that = this;
    wx.showActionSheet({
      itemList: msgTypes,
      success: function(res) {
        if (!res.cancel) {
          console.log(msgTypes[res.tapIndex])
          that.setData({
            msgType: msgTypes[res.tapIndex]
          })
        }
      }
    });
  },
  toAddpersonPage: function() {
    wx.navigateTo({
      url: '../notification_addperson/notification_addperson',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
});