var network = require('../../../utils/network.js')
var util = require('../../../utils/util.js')
// pages/my_class/class_detail/class_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classesId: 0,
    classesTimeIndex: 0,
    img_url: network.img_url,
    modalHidden: true,
    clsTimeHidden: true,
    stuCheckboxHidden1: true,
    stuCheckAll1: false,
    stuCheckboxHidden2: true,
    stuCheckAll2: false,
    checkValue1: "",
    checkValue2: "",
    edittime: "",
    editnums: "",
    editcard: "",
    editremark: "",
    tabIndex: 0,
    weeks: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
  },
  onLoad: function(options) {
    this.setData({
      classesId: options.id
    })
  },
  //修改头像
  changeAvatar: function() {
    util.chooseImgUpload(res => {
      network.requestLoading('/manage/modify_classes_headimg', {
        "classesId": this.data.classesId,
        "headImg": res.imageURL.slice(this.data.img_url.length)
      }, "", res2 => {
        if (res2.status == 0) {
          this.setData({
            ["classesInfo.logPic"]: res.imageURL
          })
        } else {
          util.toast("设置班级logo失败");
        }
      }, error => {
        util.toast("设置班级logo失败" + JSON.stringify(error));
      })
    }, error => {
      util.toast("上传图片失败：" + JSON.stringify(error));
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.classes_info_detail()
  },
  tabchange: function(e) {
    this.setData({
      tabIndex: e.detail.value
    })
  },
  //查看学生详情
  stuDetail: function(e) {
    let studentId = e.currentTarget.dataset.id;
    let studentName = e.currentTarget.dataset.name;
    wx.setStorage({
      key: 'my_stu_student',
      data: {
        studentId: studentId,
        studentName: studentName
      },
      success: function() {
        wx.navigateTo({
          url: '/pages/my_stu/stu_detail/stu_detail',
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      }
    })
  },
  classes_member_detail: function(classTimeId) {
    network.request("/manage/classes_member_detail", {
        "classTimeId": classTimeId,
        "classesId": this.data.classesId
      },
      res => {
        if (res.status == "1") {
          res.data.teacherInfo.forEach(teacherInfo => {
            if (teacherInfo.startTime)
              teacherInfo.startTime = teacherInfo.startTime.substr(0, 5);
            if (teacherInfo.endTime)
              teacherInfo.endTime = teacherInfo.endTime.substr(0, 5);
            teacherInfo.headpic = util.filterImgUrl(teacherInfo.headpic) || "/imgs/common/104-104@2x.png";
          })

          res.data.studentInfo.forEach(studentInfo => {
            if (studentInfo.startTime)
              studentInfo.startTime = studentInfo.startTime.substr(0, 5);
            if (studentInfo.endTime)
              studentInfo.endTime = studentInfo.endTime.substr(0, 5);
            studentInfo.headpic = util.filterImgUrl(studentInfo.headpic) || "/imgs/common/104-104@2x.png";
            if (studentInfo.endDt==0){
              studentInfo.endDt="无期限"
            } else {
              studentInfo.endDt = util.formatTime(studentInfo.endDt).substring(0, 11);
            }
            //获取当前使用的卡是第几个
            studentInfo.studentCourseIndex=0;
            studentInfo.stuCourseVos.forEach((stuCourseVos,index)=>{
              if (stuCourseVos.studentCourseId == studentInfo.studentCourseId){
                studentInfo.studentCourseIndex=index;
              }
            })
          })
          this.setData(res.data)
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
  //切换学生的卡
  change_classes_student_course: function(e) {
    let index = e.currentTarget.dataset.index;
    let courseIndex = Number.parseInt(e.detail.value);
    let params = {
      "studentCourseId": this.data.studentInfo[index].stuCourseVos[courseIndex].studentCourseId,
      "classesStudentId": this.data.studentInfo[index].classesStudentId
    }
    if (this.data.studentInfo[index].stuCourseVos[courseIndex].isOpen == 0) {
      wx.showModal({
        title: "提示",
        content: "学员卡未激活是否激活添加？",
        success: sm => {
          let allselected = true;
          if (sm.confirm) {
            network.request("/manage/change_classes_student_course", params,
              res => {
                if (res.status == "1") {
                  this.classes_member_detail();
                } else { }
              },
              err => {
                console.log(err)
              }
            )
          }else{

          }
        }
      })
    }else{
      network.request("/manage/change_classes_student_course", params,
        res => {
          if (res.status == "1") {
            this.classes_member_detail();
          } else { }
        },
        err => {
          console.log(err)
        }
      )
    }
   
  },
  classes_info_detail: function() {
    network.request("/manage/classes_info_detail", {
        "classesId": this.data.classesId
      },
      res => {
        if (res.status == "1") {
          if (res.data.classesInfo) {
            if (res.data.classesInfo.classState == 0) {
              res.data.classesInfo.classStateStr = '正常'
            } else if (res.data.classesInfo.classState == 1) {
              res.data.classesInfo.classStateStr = '已停课'
            }
          }
          wx.setNavigationBarTitle({
            title: res.data.classesInfo.name + "班级详情"
          })
          res.data.classesTimeInfo.forEach(e => {
            if (e.startTime)
              e.startTime = e.startTime.substr(0, 5);
            if (e.endTime)
              e.endTime = e.endTime.substr(0, 5);
            e.weekStr = this.data.weeks[e.week - 1] + ' ' + e.startTime + '-' + e.endTime;
          })
          res.data.classesInfo.logPic = util.filterImgUrl(res.data.classesInfo.logPic) || "/imgs/common/190_190.png";
          this.setData(res.data)
          if (res.data.classesTimeInfo[0])
            this.classes_member_detail(res.data.classesTimeInfo[0].classesTimeId);
          else {
            util.toast("近期无课程")
          }
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
  classesTimeChange: function(e) {
    this.setData({
      classesTimeIndex: Number.parseInt(e.detail.value)
    });
    this.classes_member_detail(this.data.classesTimeInfo[Number.parseInt(e.detail.value)].classesTimeId);
  },
  moreTime: function() {
    this.setData({
      clsTimeHidden: !this.data.clsTimeHidden
    })
  },

  //delete
  handleDelete: function(e) {
    wx.showModal({
      title: '是否确认删除',
      success: res => {
        if (res.confirm) {
          network.requestLoading(
            "/manage/cls_delstu_sub", {
              "classesId": this.data.classesId,
              "studentIds": e.currentTarget.dataset.index
            }, "正在提交",
            res => {
              if (res.status == "1") {
                wx.showToast({
                  title: res.message,
                  icon: "none",
                  duration: 2000,
                  complete: this.classes_member_detail(this.data.classesTimeInfo[this.data.classesTimeIndex].classesTimeId)
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
  checkboxclick1: function(event) {
    this.setData({
      stuCheckboxHidden1: !this.data.stuCheckboxHidden1,
      stuCheckAll1: false,
    })
  },
  checkboxclick2: function(event) {
    this.setData({
      stuCheckboxHidden2: !this.data.stuCheckboxHidden2,
      stuCheckAll2: false,
    })
  },
  checkchange1: function(event) {
    this.setData({
      checkValue1: event.detail.value.toString()
    })
    console.log(event.detail.value.toString())
  },
  checkchange2: function(event) {
    this.setData({
      checkValue2: event.detail.value.toString()
    })
    console.log(event.detail.value.toString())
  },
  checkall1: function() {
    this.setData({
      stuCheckAll1: !this.data.stuCheckAll1
    })
    if (this.data.stuCheckAll1) {
      var checkValue1 = []
      this.data.teacherInfo.forEach(e => {
        checkValue1.push(e.memberId)
      })
      this.setData({
        checkValue1: checkValue1.toString()
      })
    } else {
      this.setData({
        checkValue1: ""
      })
    }
    console.log(this.data.checkValue1)
  },

  checkall2: function() {
    this.setData({
      stuCheckAll2: !this.data.stuCheckAll2
    })
    if (this.data.stuCheckAll2) {
      var checkValue2 = []
      this.data.studentInfo.forEach(e => {
        checkValue2.push(e.classesStudentId)
      })
      this.setData({
        checkValue2: checkValue2.toString()
      })
    } else {
      this.setData({
        checkValue2: ""
      })
    }
    console.log(this.data.checkValue2)
  },
  editClass: function(event) {
    if (this.data.checkValue2 == "") {
      wx.showToast({
        title: "未选择学员",
        icon: "none",
        duration: 2000
      })
    } else {
      this.setData({
        modalHidden: false,
      })
    }
  },
  addStu: function(event) {
    wx.setStorageSync('classesTimes', this.data.classesTimeInfo)
    wx.navigateTo({
      url: "/pages/common/addstu/addstu?ptype=0&classesId=" + this.data.classesId
    })
  },
  bindKeyInput: function(event) {
    var dataname = event.currentTarget.dataset.dataname;
    this.setData({
      [dataname]: event.detail.value
    })
  },
  onmodalConfirm: function() {
    if (!this.data.editcard || !this.data.editnums || !this.data.edittime) {
      util.toast("请填写完整");
      return
    }
    this.setData({
      modalHidden: true,
    })
    network.requestLoading(
      "/manage/cls_ddkles_sub", {
        "classesId": this.data.classesId,
        "classesStudentIds": this.data.checkValue2,
        "classHour": this.data.edittime,
        "classTimes": this.data.editnums,
        "storedValueCard": this.data.editcard,
        "remark": this.data.editremark
      }, "正在提交",
      res => {
        if (res.status == "1") {
          wx.showToast({
            title: res.message,
            icon: "none",
            duration: 2000
          })
          this.setData({
            checkValue2: "",
            edittime: "",
            editnums: "",
            editcard: "",
            editremark: "",
            stuCheckAll2: false,
            stuCheckboxHidden2: true,
          })
          this.classes_info_detail()
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
  onmodalCancel: function() {
    this.setData({
      modalHidden: true,
    })
  },
  navigateTo: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  blogClass: function() {
    wx.navigateTo({
      url: "/pages/my_class/class_blog/class_blog" + "?classesId=" + this.data.classesId
    })
  },
  messClass: function() {
    wx.navigateTo({
      url: "/pages/my_class/class_mess/class_mess" + "?classesId=" + this.data.classesId
    })
  },
  stopClass: function(event) {
    wx.navigateTo({
      url: "/pages/my_class/class_stop/class_stop?classesId=" + this.data.classesId
    })
  }
})