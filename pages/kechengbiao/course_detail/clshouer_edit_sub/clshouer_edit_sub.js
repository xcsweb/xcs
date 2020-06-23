let network = require('../../../../utils/network.js')
let util = require('../../../../utils/util.js')
const qiniuUploader = require("../../../../qiniuUploader");
Page({

  /**
   * 教案、作业共用的页面  一些方法做了判断 包括页面
   */
  data: {
    attachments: [],
    isModify:1,
    imgUptoken: "",
    vodUptoken: "",
    teach_term_select: [],
    teach_term_select_old: [],
    teach_term_select_data: [{
      index: 0
    }],
    teachModelsIndex: 0,
    teachLabelsIndex: 0,
    teachTasksIndex: 0,
    teachCoursesIndex: 0,
    "teachModels": [],
    "teachLabels": [],
    "teachTasks": [],
    "teachCourses": [],
    teach_task_select_show: false, //显示作业模板选择框
    title: "",
    content: "",
    supply: "",
    teachFromId: "0"
  },
  bindPickerChange2: function(e) {
    let teach_term_select_data = this.data.teach_term_select_data;
    teach_term_select_data[e.currentTarget.dataset.index].index = Number.parseInt(e.detail.value);
    this.setData({
      teach_term_select_data: teach_term_select_data
    })
  },
  //添加一个运动项
  addTeach_term_select: function() {
    let teach_term_select_data = this.data.teach_term_select_data;
    teach_term_select_data.push({
      index: 0
    });
    this.setData({
      teach_term_select_data: teach_term_select_data
    })
  },
  //移除一个运动项
  removeTeach_term_select: function(e){
    let index = e.currentTarget.dataset.teach_term_select_data;
    this.data.teach_term_select_data.splice(index,1);
    this.setData({
      teach_term_select_data: this.data.teach_term_select_data
    })
  },
  //监听输入框并保存值
  bindinput: function(e) {
    //如果是运动项目的输入次数 那么特殊处理
    if (e.currentTarget.dataset.teach_term_select_data != undefined) {
      let teach_term_select_data = this.data.teach_term_select_data;
      teach_term_select_data[e.currentTarget.dataset.teach_term_select_data].val = e.detail.value;
      this.setData({
        teach_term_select_data: teach_term_select_data
      })
    } else {
      //普通输入框  赋值
      let data = {};
      data[e.currentTarget.dataset.name] = e.detail.value;
      this.setData(data);
    }
  },
  //获取运动列表
  teach_term_select: function() {
    network.request("/common/teach_term_select", {
        "trainCategoryId": this.data.dataset.d.classesHour.trainCategoryId
      },
      res => {
        if (res.status == 1) {
          this.setData({
            teach_term_select: res.data,
            teach_term_select_old: res.data
          })
          if (this.data.dataset.d.classesHour.theWay == '1' && this.data.dataset.index != undefined && this.data.dataset.d.students[this.data.dataset.index].classesHourTeachId) {
            //按学员
            this.clshour_teach_detail(this.data.dataset.d.students[this.data.dataset.index].classesHourTeachId);
          } else if (this.data.dataset.d.classesHour.theWay == '0' && this.data.dataset.d.classesHour.classesHourTeachId) {
            //按班
            this.clshour_teach_detail(this.data.dataset.d.classesHour.classesHourTeachId);
          }
        } else {
          wx.showToast({
            title: res.message || '获取数据失败',
            icon: 'none'
          })
        }
      },
      error => {
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        })
      });
  },
  //重置表单
  reset: function() {
    this.setData({
      title: "",
      content: "",
      supply: "",
      isModify: 1,
      attachments: [],
      teach_term_select_data: [{
        index: 0
      }],
      teachFromId: "0"
    })
  },
  //提交或者修改课程
  clshour_teach_edit_sub: function() {
    if (!this.data.title) {
      wx.showToast({
        title: '请输入标题',
        icon: 'none'
      });
      return;
    }
    if (!this.data.content) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      });
      return;
    }
    let hasEmpty = false;
    let teachTerms = [];
    this.data.teach_term_select_data.forEach(d => {
      if (d.val == undefined || d.index == undefined) {
        hasEmpty = true;
      }
      if (this.data.teach_term_select[d.index])
        teachTerms.push({
          "teachLabelId": this.data.teach_term_select[d.index].teachLabelId,
          "labelName": this.data.teach_term_select[d.index].name,
          "val": d.val
        })
    })
    if (this.data.teach_term_select.length == 0) {
      hasEmpty = false;
    }
    if (hasEmpty) {
      wx.showToast({
        title: '请选择并填写运动项目',
        icon: 'none'
      });
      return;
    }
    let imgfiles = "";
    let vodfiles = "";
    this.data.attachments.forEach(attachment => {
      if (attachment.video) {
        vodfiles += attachment.key;
        vodfiles += ",";
      } else {
        imgfiles += attachment.key;
        imgfiles += ",";
      }
    })
    if (imgfiles) {
      imgfiles = imgfiles.substr(0, imgfiles.length - 1);
    }
    if (vodfiles) {
      vodfiles = vodfiles.substr(0, vodfiles.length - 1);
    }
    let params = {
      "classesHourId": this.data.dataset.d.classesHour.classesHourId,
      "classesHourStudentId": this.data.dataset.d.classesHour.theWay == '0' ? "0" : this.data.dataset.d.students[this.data.dataset.index].classesHourStudentId,
      "teachFromType": this.data.dataset.teachfromtype,
      "title": this.data.title,
      "content": this.data.content,
      "imgfiles": imgfiles,
      "vodfiles": vodfiles,
      "teachTerms": teachTerms,
      "supply": this.data.supply,
      "teachFromId": this.data.teachFromId
    };
    if (this.data.dataset.d.classesHour.classesHourTeachId) {
      params.classesHourTeachId = this.data.dataset.d.classesHour.classesHourTeachId;
    }
    if (this.data.dataset.index != undefined && this.data.dataset.d.students[this.data.dataset.index].classesHourTeachId) {
      params.classesHourTeachId = this.data.dataset.d.students[this.data.dataset.index].classesHourTeachId;
    }
    network.requestLoading("/manage/clshour_teach_edit_sub", params, "请稍后...",
      res => {
        if (res.status == 1) {
          let duration = 500;
          wx.showToast({
            title: res.message || '成功',
            icon: 'none',
            duration: duration
          });
          setTimeout(() => {
            wx.navigateBack({
              delta: 1,
            })
          }, duration)
        } else {
          wx.showToast({
            title: res.message || '获取数据失败',
            icon: 'none'
          })
        }
      },
      error => {
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        })
      });
  },
  closeVideo: function() {
    this.setData({
      showVideo: false
    })
  },
  //查看已上传的附件 图片或视频
  viewAttachment: function(e) {
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
  delete: function(e) {
    let index = e.currentTarget.dataset.index;
    this.data.attachments.splice(index, 1);
    this.setData({
      attachments: this.data.attachments
    })
  },
  //获取作业模板详情  并恢复到页面中  教案和作业此方法共用
  teach_task_detail: function(teachTaskId) {
    let url = "";
    let params = {};
    if (this.data.dataset.teachfromtype == 0) {
      url = "/common/teach_course_detail";
      params.teachCourseId = teachTaskId;
    } else {
      url = "/common/teach_task_detail";
      params.teachTaskId = teachTaskId;
    }
    network.requestLoading(url, params, "", res => {
      if (res.status == 1) {
        if (res.data.teachTask || res.data.teachCourse) {
          if (!res.data.teachTask) {
            res.data.teachTask = res.data.teachCourse;
          }
          let imgFiles = [];
          let vodFiles = [];
          let attachments = [];
          if (res.data.teachTask.imgfiles) {
            imgFiles = res.data.teachTask.imgfiles.split(",");
          }
          if (res.data.teachTask.vodfiles) {
            vodFiles = res.data.teachTask.vodfiles.split(",");
          }
          imgFiles.forEach(imgFile => {
            if (imgFile)
              attachments.push({
                img: this.data.img_url + imgFile,
                key: imgFile,
                video: false,
                disable: true
              })
          })
          vodFiles.forEach(vodFile => {
            if (vodFile)
              attachments.push({
                img: this.data.vod_url + vodFile + "?vframe/jpg/offset/0/w/640/h/360",
                key: vodFile,
                video: true,
                disable: true
              })
          });

          if (res.data.teachTerms) {
            res.data.teachTerms.forEach((teachTerm, index) => {
              this.data.teach_term_select.forEach((teach_term_select_, index2) => {
                if (teachTerm.teachLabelId == teach_term_select_.teachLabelId) {
                  teachTerm.index = index2;
                }
              })
            })
          }
          let teach_term_select_data = res.data.teachTerms || [];

          // if (teach_term_select_data.length == 0) {
          //   teach_term_select_data.push({
          //     index: 0
          //   })
          // }
          let teachFromId = 0;
          if (this.data.dataset.teachfromtype == 0) {
            teachFromId = res.data.teachTask.teachCourseId;
          } else {
            teachFromId = res.data.teachTask.teachTaskId;
          }
          this.setData({
            title: res.data.teachTask.title,
            content: res.data.teachTask.content,
            attachments: attachments,
            teach_term_select_data: teach_term_select_data,
            teachFromId: teachFromId,
            isModify: res.data.teachTask.institutionId==0?0:1
          });
        } else {
          wx.showToast({
            title: res.message || '设置模板失败',
            icon: 'none'
          })
        }
      } else {
        wx.showToast({
          title: res.message || '设置模板失败',
          icon: 'none'
        })
      }
    }, error => {})
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
    this.findimguptoken();
    let title = "";
    if (this.data.dataset.d.classesHour.theWay == '1' && this.data.dataset.index != undefined && this.data.dataset.d.students[this.data.dataset.index].classesHourTeachId) {
      title += "编辑";
    } else if (this.data.dataset.d.classesHour.theWay == '0' && this.data.dataset.d.classesHour.classesHourTeachId) {
      title += "编辑";
    } else {
      title += "增加";
    }
    if (this.data.dataset.teachfromtype == 0) {
      title += "教案";
    } else {
      title += "作业";
    }
    wx.setNavigationBarTitle({
      title: title,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    this.teach_term_select();
  },
  //获取原数据 并恢复到表单
  clshour_teach_detail: function(classesHourTeachId) {
    network.requestLoading('/manage/clshour_teach_detail', {
      classesHourTeachId: classesHourTeachId
    }, "", res => {
      if (res.status == 1) {
        let imgfiles = [];
        let vodfiles = [];
        let attachments = [];
        if (res.data.imgfiles) {
          imgfiles = res.data.imgfiles.split(",");
        }
        if (res.data.vodfiles) {
          vodfiles = res.data.vodfiles.split(",");
        }
        imgfiles.forEach(imgfile => {
          if (imgfile)
            attachments.push({
              img: this.data.img_url + imgfile,
              key: imgfile,
              video: false
            })
        })
        vodfiles.forEach(vodfile => {
          if (vodfile)
            attachments.push({
              img: this.data.vod_url + vodfile + "?vframe/jpg/offset/0/w/640/h/360",
              key: vodfile,
              video: true
            })
        });
        if (res.data.teachTerms){
          res.data.teachTerms.forEach((teachTerm, index) => {
            this.data.teach_term_select.forEach((teach_term_select_, index2) => {
              if (teachTerm.teachLabelId == teach_term_select_.teachLabelId) {
                teachTerm.index = index2;
              }
            })
          })
        }
        let teach_term_select_data = res.data.teachTerms || [];
        // let teach_term_select = JSON.parse(JSON.stringify(this.data.teach_term_select_old));
        // let teach_term_select = [];
        // if (res.data.teachTerms) {
        //   res.data.teachTerms.forEach((teachTerm, index) => {
        //     teach_term_select.push({
        //       teachLabelId: teachTerm.teachLabelId,
        //       name: teachTerm.labelName,
        //       val: teachTerm.val,
        //     })
        //   });
        //   res.data.teachTerms.forEach((teachTerm, index) => {
        //     teach_term_select.forEach((teach_term_select_, index2) => {
        //       if (teachTerm.teachLabelId == teach_term_select_.teachLabelId) {
        //         teach_term_select_data.push({
        //           index: index2,
        //           value: Number.parseInt(teachTerm.val)
        //         })
        //       }
        //     })
        //   })
        // }
        if (teach_term_select_data.length == 0) {
          teach_term_select_data.push({
            index: 0
          })
        }
        this.setData({
          title: res.data.title,
          content: res.data.content,
          attachments: attachments,
          teach_term_select_data: teach_term_select_data,
          teachFromId: res.data.teachFromId || "0",
          supply: res.data.supply,
          isModify: res.data.isModify
        });
      } else {
        wx.showToast({
          title: res.message || '恢复数据失败',
          icon: 'none'
        })
      }
    }, error => {})
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
  teach_term_select_taped: function(e) {
    let btnIndex = e.currentTarget.dataset.index;
    if (btnIndex == 0) {
      //取消按钮
    } else if (btnIndex == 1) {
      //确定
      if (this.data.dataset.teachfromtype == 1)
        this.teach_task_detail(this.data.teachTasks[this.data.teachTasksIndex].teachTaskId)
      else
        this.teach_task_detail(this.data.teachCourses[this.data.teachCoursesIndex].teachCourseId)
    }
    this.setData({
      teach_task_select_show: false
    })
  },
  //显示更改作业选择框
  teach_task_select_show: function() {
    if (this.data.teachModels.length == 0) {
      this.teach_task_select({
        teachFromId: this.data.teachFromId
      });
    }
    this.setData({
      teach_task_select_show: true
    })
  },
  teach_task_select: function(params) {
    let url = "";
    if (this.data.dataset.teachfromtype == 0) {
      url = "/common/teach_course_select";
      if (params.teachFromId > 0) {
        params.teachCourseId = params.teachFromId;
      }
    } else {
      url = "/common/teach_task_select";
      if (params.teachFromId > 0) {
        params.teachTaskId = params.teachFromId;
      }
    }
    params.trainCategoryId = this.data.dataset.d.classesHour.trainCategoryId
    network.requestLoading(url, params, "", res => {
      if (res.status == 1) {
        let setdata = {};
        let modelId = 0;
        let labelId = 0;
        let teachId = 0;
        if (res.data.thisCourse) {
          setdata.thisCourse = res.data.thisCourse || [];
          modelId = setdata.thisCourse.teachModelId;
          labelId = setdata.thisCourse.teachLabelId;
          teachId = setdata.thisCourse.teachCourseId;
        }
        if (res.data.thisTask) {
          setdata.thisTask = res.data.thisTask || [];
          modelId = setdata.thisTask.teachModelId;
          labelId = setdata.thisTask.teachLabelId;
          teachId = setdata.thisTask.teachTaskId;
        }
        if (res.data.teachModels) {
          setdata.teachModelsIndex = 0;
          setdata.teachLabelsIndex = 0;
          setdata.teachTasksIndex = 0;
          setdata.teachCoursesIndex = 0;
          setdata.teachLabels = [];
          setdata.teachTasks = [];
          setdata.teachCourses = [];
          setdata.teachModels = res.data.teachModels || [];
          if (modelId > 0) {
            for (var i = 0; i < setdata.teachModels.length; i++) {
              if (setdata.teachModels[i].teachModelId == modelId || setdata.teachModels[i].parentId == modelId) {
                setdata.teachModelsIndex = i;
                break;
              }
            }
          } else if (res.data.teachModels.length > 0) {
            this.teach_task_select({
              teachModelId: res.data.teachModels[0].teachModelId
            })
          }
        }
        if (res.data.teachLabels) {
          setdata.teachLabelsIndex = 0;
          setdata.teachTasksIndex = 0;
          setdata.teachCoursesIndex = 0;
          setdata.teachTasks = [];
          setdata.teachCourses = [];
          setdata.teachLabels = res.data.teachLabels || [];
          if (labelId > 0) {
            for (var i = 0; i < setdata.teachLabels.length; i++) {
              if (setdata.teachLabels[i].teachLabelId == labelId) {
                setdata.teachLabelsIndex = i;
                break;
              }
            }
          } else if (res.data.teachLabels.length > 0) {
            this.teach_task_select({
              teachLabelId: res.data.teachLabels[0].teachLabelId
            })
          }
        }
        if (res.data.teachTasks) {
          setdata.teachTasksIndex = 0;
          setdata.teachTasks = res.data.teachTasks || [];
          if (teachId > 0) {
            for (var i = 0; i < setdata.teachTasks.length; i++) {
              if (setdata.teachTasks[i].teachTaskId == teachId) {
                setdata.teachTasksIndex = i;
                break;
              }
            }
          }
        }
        if (res.data.teachCourses) {
          setdata.teachCoursesIndex = 0;
          setdata.teachCourses = res.data.teachCourses || [];
          if (teachId > 0) {
            for (var i = 0; i < setdata.teachCourses.length; i++) {
              if (setdata.teachCourses[i].teachCourseId == teachId) {
                setdata.teachCoursesIndex = i;
                break;
              }
            }
          }
        }
        this.setData(setdata);
      }
    }, error => {})
  },
  bindPickerChange: function(e) {
    console.log(e)
    let params = {};
    let isSelTeach = 0;
    if (e.currentTarget.dataset.name == 'teachModelId') {
      params[e.currentTarget.dataset.name] = this.data.teachModels[Number.parseInt(e.detail.value)].teachModelId;
      isSelTeach = 1;
    } else if (e.currentTarget.dataset.name == 'teachLabelId') {
      params[e.currentTarget.dataset.name] = this.data.teachLabels[Number.parseInt(e.detail.value)].teachLabelId;
      isSelTeach = 1;
    }
    if (isSelTeach == 1) {
      this.teach_task_select(params)
    }
    let data = {};
    data[e.currentTarget.dataset.name_] = e.detail.value;
    this.setData(data)
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
  }
})