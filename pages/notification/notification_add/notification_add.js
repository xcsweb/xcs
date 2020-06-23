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
    isSms: "0",
    isUseConfirm: "0",
    sendDt: util.formatDate(new Date()),
    sendDtTo: util.formatDate(new Date()),
    isSendDt: false,
    imgUptoken: "",
    vodUptoken: "",
    noticeRecords: [],
    selectedTeacherIds: [],
    selectedStudentIds: [],
    selectedInfo: "",
    contentLength: 0,
    videoSrc: "",
    showVideo: false
  },
  closeVideo: function() {
    this.setData({
      showVideo: false
    })
  },
  onLoad: function (options) {
    wx.removeStorage({
      key: 'selectedTeacherIds',
      success: function(res) {},
    });
    wx.removeStorage({
      key: 'selectedStudentIds',
      success: function(res) {},
    });
    wx.removeStorage({
      key: 'selectedInfo',
      success: function(res) {},
    });
    this.getNoticeType();
    this.findimguptoken();
    if (options.selectedStudentIds){
      this.setData({
        selectedStudentIds: JSON.parse(options.selectedStudentIds)
      })
    }

    if (options.selectedTeacherIds) {
      this.setData({
        selectedTeacherIds: JSON.parse(options.selectedTeacherIds)
      })
    }

    if (options.selectedInfo) {
      this.setData({
        selectedInfo: options.selectedInfo
      })
    }
  },
  onShow: function() {
    wx.getStorage({
      key: 'selectedTeacherIds',
      success: selectedTeacherIds => {
        this.setData({
          selectedTeacherIds: selectedTeacherIds.data
        })
      },
    });
    wx.getStorage({
      key: 'selectedStudentIds',
      success: selectedStudentIds => {
        this.setData({
          selectedStudentIds: selectedStudentIds.data
        })
      },
    });
    wx.getStorage({
      key: 'selectedInfo',
      success: selectedInfo => {
        this.setData({
          selectedInfo: selectedInfo.data
        })
      },
    });
  },
  attachmentsChange:function(e){
    this.setData({
      attachments: e.detail.attachments
    })
  },
  //提交  发送通知
  notice_add_sub: function(e) {
    let formData = e.detail.value;
    if (this.data.selectedTeacherIds.length == 0 && this.data.selectedStudentIds.length == 0) {
      wx.showToast({
        title: '请选择接收人',
        icon: 'none'
      })
      return
    }
    if (formData.title=="") {
      wx.showToast({
        title: '请输入标题',
        icon: 'none'
      })
      return
    }
    if (formData.content == "") {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      })
      return
    }

    
    if (formData.sendDt) {
      formData.sendDt = util.dateToDayStamp(new Date(formData.sendDt))
    }
    if (formData.isSendDt==0) {
      delete formData.sendDt;
    }
    delete formData.isSendDt;
    formData.noticeType = this.data.noticeType[formData.noticeType].codeValue;
    formData.imgfiles = "";
    formData.vodfiles = "";
    this.data.attachments.forEach(attachment => {
      if (attachment.video) {
        formData.vodfiles = (formData.vodfiles == "" ? "" : formData.vodfiles + ",") + attachment.key;
      } else {
        formData.imgfiles = (formData.imgfiles == "" ? "" : formData.imgfiles + ",") + attachment.key;
      }
    });
    formData.noticeRecords = [];
    this.data.selectedTeacherIds.forEach(teacher => {
      formData.noticeRecords.push({
        "memberId": teacher.teacherId,
        "userId": teacher.userId,
        "tel": teacher.tel
      })
    })

    this.data.selectedStudentIds.forEach(stu => {
      formData.noticeRecords.push({
        "studentId": stu.studentId,
        "userId": stu.userId,
        "tel": stu.tel
      })
    })
    formData.isUseConfirm = this.data.isUseConfirm;
    network.requestLoading('/manage/notice_add_sub', formData, "正在提交", res => {
      console.log(res)
      if (res.status == 1) {
        util.alert("发送成功", `共发通知学员${this.data.selectedStudentIds.length}人,员工${this.data.selectedTeacherIds.length}人`,()=>{
          wx.navigateBack({
            delta:1
          })
        });
      } else {
        util.toast(res.message || "发送失败！");
      }
    }, error => {
      util.toast("发送失败！");
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
  //获取消息类型
  getNoticeType: function() {
    network.requestLoading('/manage/notice_add', {
      "type": "0"
    }, "", res => {
      if (res.status == 1) {
        this.setData({
          noticeType: res.data.noticeType
        })
      } else {
        wx.showToast({
          title: '获取消息类型失败',
        })
      }
    }, error => {
      wx.showToast({
        title: '获取消息类型失败',
      })
    })
  },
  oninput: function(e) {
    let value = e.detail.value;
    if (value) {
      this.setData({
        contentLength: value.length > 144 ? 144 : value.length
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
  bindIsUseConfirm: function (e) {
    let val = 1;
    if (e.detail.value.length==0){
      val = 0;
    }
    this.setData({
      isUseConfirm: val
    });
    if (val) {
      this.setData({
        isSms: "0"
      });
    }
  },
  radioChange: function(e) {
    this.setData({
      isSms: e.detail.value
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
  bindIsSend: function(e) {
    this.setData({
      isSendDt: e.detail.value
    })
  },
  bindDateChange: function (e) {
    this.setData({
      sendDt: e.detail.value
    })
  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
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