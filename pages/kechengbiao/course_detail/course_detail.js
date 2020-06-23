let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classesHourId: 0,
    tabs: ['课程信息', '点名签到', '学员点评', '作业/点评', '调班串课', '调/停/复课', '请假', '上课教案'],
    selectedTabIndex: 0,
    classesHour: {},
    dianpingTeacherIndex: 0,
    tab1Data: {},
    tab2Data: {},
    tab3Data: {},
    tab4Data: {},
    tab5Data: {},
    tab6Data: {},
    tab7Data: {},
    tab8Data: {},
    tab3ShowEvalInput: false,
    tab3selectAll: false,
    tab3selectBtnTxt:"勾选",
    tab3selectMode: false,
    tab3EvalData: [],
    tab3RatingValue: 0,
    tab6topBtnIndex: 0,
    tab7topBtnIndex: 0
  },
  //tab3点评全选操作
  tab3selectAll: function () {
    this.setData({
      tab3selectAll: !this.data.tab3selectAll
    })
    for (let i = 0; i < this.data.tab3Data.students.length; i++) {
      this.setData({
        [`tab3Data.students[${i}].checked`]: this.data.tab3selectAll
      })
    }
    if (this.data.tab3selectAll) {
      this.setData({
        tab3selectBtnTxt: "全选"
      })
    } else {
      this.setData({
        tab3selectBtnTxt: "勾选"
      })
    }
  },
  dianpingTeacherChange: function(e) {
    this.setData({
      dianpingTeacherIndex: e.detail.value
    })
  },
  tab6TeacherIndexChange: function(e) {
    this.setData({
      tab6TeacherIndex: e.detail.value
    })
  },
  //改变tab
  changeTab: function(event) {
    let tabIndex = event.currentTarget.dataset.tabindex;
    this.setData({
      selectedTabIndex: tabIndex
    });
    if(tabIndex==1){
      this.queryTab2Node();
    }
    this.clshour_detail()
  },

  //查询点名签到节点信息
  queryTab2Node: function () {
    var query = wx.createSelectorQuery()
    query.selectAll('.studentsStatusTable').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(res => {
      console.log(res)
      if(res&&res[0]&&res[0].length>0){
        this.setData({
          studentsStatusTableTop: res[0][0].top
        })
      }
    })
  },
  //头像加载失败时
  errorImg: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      [`tab1Data.teacherPerformances[${index}].avatar`]: "/imgs/common/80_80.png"
    })
  },
  //头像加载失败时
  errorImg2: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      [`tab2Data.students[${index}].avatar`]: "/imgs/common/80_80.png"
    })
  },
  //根据tab获取显示的数据
  clshour_detail: function() {
    let course = new Object();
    course.classesHourId = this.data.classesHourId;
    wx.setStorageSync('course_detail', course)
    let tab = this.data.selectedTabIndex + 1;
    network.request("/manage/clshour_detail", {
        "tab": tab,
        "classesHourId": this.data.classesHourId,
        "memberType": 0
      },
      res => {
        if (res.status == 1) {
       
          //对一些tab的数据做预处理
          if (tab == 1) {
            res.data.classesHour.day_ = util.formatTime(new Date(res.data.classesHour.day * 1000)).substr(0, 10);
            res.data.teacherPerformances.forEach(e => {
              e.avatar = util.filterImgUrl(e.avatar) || "/imgs/common/80_80.png";
              e.createDt = util.formatTime(new Date(e.createDt * 1000)).substr(0, 10);
            })
          }
          if (tab == 2) {
            res.data.attenStatus0 = 0;
            res.data.attenStatus1 = 0;
            res.data.attenStatus2 = 0;
            res.data.attenStatus3 = 0;
            res.data.attenStatus4 = 0;
            res.data.layoutType0 = 0;
            res.data.layoutType1 = 0;
            res.data.layoutType2 = 0;
            res.data.layoutType10 = 0;
            res.data.layoutType11 = 0;
            res.data.layoutType12 = 0;
            if (res.data.students.length == 0) {
              util.toast("暂无学员")
            }
            res.data.students.forEach(student => {
              student.avatar = util.filterImgUrl(student.avatar) || "/imgs/common/80_80.png";
              if (!res.data["attenStatus" + student.attenStatus]) {
                res.data["attenStatus" + student.attenStatus] = 0;
              }
              if (!res.data["layoutType" + student.layoutType]) {
                res.data["layoutType" + student.layoutType] = 0;
              }
              res.data["attenStatus" + student.attenStatus]++;
              res.data["layoutType" + student.layoutType]++;
            })
          }
          if (tab == 3) {
            if (res.data.students.length == 0) {
              util.toast("暂无学员")
            }
            res.data.students.forEach(stu => {
              stu.endDt_ = util.formatTime(new Date(stu.endDt * 1000)).substr(0, 10);
            })
          }
          if (tab == 4) {
            if (res.data.students.length == 0) {
              util.toast("暂无学员")
            }
          }
          if (tab == 6) {
            let tab6teachers = "";
            this.data.member_list.forEach(member => {
              res.data.teachers.forEach(t => {
                if (member.memberId == t.memberId) {
                  member.checked = true;
                  tab6teachers += member.name;
                  tab6teachers += ",";
                }
              })
            })

            if (tab6teachers) {
              tab6teachers = tab6teachers.substring(0, tab6teachers.length - 1);
            }
            if (res.data.classInfo && res.data.classInfo.day)
              res.data.classInfo.day_ = util.formatTime(new Date(res.data.classInfo.day * 1000)).substr(0, 10);
            this.setData({
              member_list: this.data.member_list,
              tab6teachers: tab6teachers,
              tab6field: res.data.classInfo.field
            })
          }

          if (tab == 7) {
            res.data.forEach(stu => {
              stu.attenTime = util.formatTime(new Date(stu.attenTime * 1000));
            })
          }
          let data = {};
          res.data.loaded = true; //用于判断该tab数据是否已获取，避免显示undefined
          console.log(res.data)
          data["tab" + tab + "Data"] = res.data;
          this.setData(data)
        } else {
          wx.showToast({
            title: '获取数据失败',
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
  tab6DataDayChange: function(e) {
    this.data.tab6Data.classInfo.day_ = e.detail.value;
    this.data.tab6Data.classInfo.day = util.dateToDayStamp(e.detail.value.replace(/-/g, '/'));
    this.setData({
      tab6Data: this.data.tab6Data
    })
  },
  tab6DatastartTimeChange: function(e) {
    this.data.tab6Data.classInfo.startTime = e.detail.value + ":00";
    this.setData({
      tab6Data: this.data.tab6Data
    })
  },

  tab6DataendTimeChange: function(e) {
    this.data.tab6Data.classInfo.endTime = e.detail.value + ":00";
    this.setData({
      tab6Data: this.data.tab6Data
    })
  },

  //老师考勤操作前做数据处理
  pre_clshour_detail_attn_sub1: function(e) {
    let dataset = e.currentTarget.dataset;
    if (dataset.d.attenStatus != 0)
      return
    let params = {
      "attnType": "2",
      "attnData": {
        "classesHourTeacherId": dataset.d.classesHourTeacherId,
        "attenStatus": 1,
        "attenDes": ""
      }
    };
    this.clshour_detail_attn_sub(params);
  },
  //tab4下发作业
  clshour_task_send: function(e) {
    wx.showModal({
      content: '您确定要下发作业吗?',
      success: res => {
        if (res.confirm) {
          network.request("/manage/clshour_task_send", {
              classesHourId: this.data.tab4Data.classesHour.classesHourId
            },
            res => {
              if (res.status == 1) {
                util.alert("提示", "下发成功", () => {});
                this.clshour_detail();
              } else {
                util.toast(res.message || "操作失败，请重试")
              }
            },
            error => {
              util.toast("操作失败，请重试")
            });
        }
      }
    })
  },

  //删除串课
  delSeriesStuSub: function(e){
    wx.showModal({
      title: "提示",
      content: "您确认要删除吗？",
      success: sm => {
        if (sm.confirm) {
          network.requestLoading("/manage/clshour_delstu_sub", {
              classesHourStudentId: e.currentTarget.dataset.chsid
            }, "正在提交",
            res => {
              if (res.status == 1) {
                util.alert("提示", "删除成功", () => { });
                this.clshour_detail();
              } else {
                util.toast(res.message || "操作失败，请重试")
              }
            },
            error => {
              util.toast("操作失败，请重试")
            });
        } else if (sm.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
  },

  //调课
  clshour_change_teacher: function(e) {
    if (!this.data.tab6field) {
      util.toast("请输入地点")
      return
    }
    if (Number.parseInt(this.data.tab6Data.classInfo.startTime.replace(":", "")) >= Number.parseInt(this.data.tab6Data.classInfo.endTime.replace(":", ""))) {
      util.toast("开始时间要小于结束时间")
      return
    }
    let params = {
      "teacherIds": [],
      "classHourId": this.data.tab6Data.classInfo.classesHourId,
      "field": this.data.tab6field,
      "day": this.data.tab6Data.classInfo.day,
      "startTime": this.data.tab6Data.classInfo.startTime,
      "endTime": this.data.tab6Data.classInfo.endTime
    };
    this.data.member_list.forEach(t => {
      if (t.checked)
        params.teacherIds.push({
          teacherId: t.memberId
        })
    });
    network.request("/manage/clshour_change_teacher", params,
      res => {
        if (res.status == 1) {
          util.toast(res.message || "操作成功")
          this.clshour_detail();
        } else {
          util.toast(res.message || "操作失败，请重试")
        }
      },
      error => {
        util.toast("操作失败，请重试")
      });
  },
  //停课
  teacher_change_clstatus_close: function(e) {
    if (!this.data.tab6content1) {
      util.toast("请输入停课理由");
      return
    }
    network.request("/manage/teacher_change_clstatus_close", {
        "classesHourId": this.data.tab6Data.classInfo.classesHourId,
        "content": this.data.tab6content1
      },
      res => {
        if (res.status == 1) {
          util.toast(res.message || "操作成功")
          this.clshour_detail();
        } else {
          util.toast(res.message || "操作失败，请重试")
        }
      },
      error => {
        util.toast("操作失败，请重试")
      });
  },

  //开课
  teacher_change_clstatus_open: function(e) {
    if (!this.data.tab6content2) {
      util.toast("请输入开课理由");
      return
    }
    network.request("/manage/teacher_change_clstatus_open", {
        "classesHourId": this.data.tab6Data.classInfo.classesHourId,
        "content": this.data.tab6content2
      },
      res => {
        if (res.status == 1) {
          util.toast(res.message || "操作成功")
          this.clshour_detail();
        } else {
          util.toast(res.message || "操作失败，请重试")
        }
      },
      error => {
        util.toast("操作失败，请重试")
      });
  },

  //老师请假
  teacher_ask_for_leave_teacher: function(e) {
    network.request("/manage/teacher_ask_for_leave_teacher", {
        "classHourId": "1",
        "content": "111"
      },
      res => {
        if (res.status == 1) {
          util.toast(res.message || "操作成功")
          this.clshour_detail();
        } else {
          util.toast(res.message || "操作失败，请重试")
        }
      },
      error => {
        util.toast("操作失败，请重试")
      });
  },

  //老师为学生请假
  teacher_ask_for_leave_student: function(e) {
    network.request("/manage/teacher_ask_for_leave_student", {
        "classesHourStudentIds": [{
          "classesHourStudentId": "64"
        }, {
          "classesHourStudentId": "65"
        }],
        "classHourId": "1",
        "content": "1111"
      },
      res => {
        if (res.status == 1) {
          util.toast(res.message || "操作成功")
          this.clshour_detail();
        } else {
          util.toast(res.message || "操作失败，请重试")
        }
      },
      error => {
        util.toast("操作失败，请重试")
      });
  },

  bindok: function(e) {
    console.log(e)
    let values = e.detail.value;
    this.data.member_list.forEach(t => {
      t.checked = false;
    })
    let tab6teachers = "";
    this.data.member_list.forEach(t => {
      t.checked = false;
      values.forEach(v => {
        if (v == t.memberId) {
          t.checked = true;
          tab6teachers += t.name;
          tab6teachers += ",";
        }
      })
    })
    if (tab6teachers) {
      tab6teachers = tab6teachers.substring(0, tab6teachers.length - 1);
    }
    this.setData({
      member_list: this.data.member_list,
      tab6teachers: tab6teachers,
      tab6ShowTeacherList: false
    })
  },
  bindcancel: function(e) {
    this.setData({
      tab6ShowTeacherList: false
    })
  },
  //老师列表
  member_list: function() {
    network.request("/manage/member_list", {
        campusId: this.data.tab1Data.campusId
      },
      res => {
        if (res.status == 1) {
          this.setData({
            member_list: res.data
          })
        }
      },
      error => {
        util.toast("操作失败，请重试")
      });
  },

  changeAttenStatus: function(e) {
   
    let dataset = e.currentTarget.dataset;
    if (dataset.isattn==0){
      util.toast("学员卡余额不足无法签到")
      return;
    }
    console.log(dataset);
    if (dataset.courseusestatus == 2) {
      util.toast("卡已经过期无法签到")
      return;
    }
    let index = dataset.index;
    let attenStatus = dataset.attenstatus;
    if (this.data.tab2Data.students[index].attenStatus == 0 || this.data.tab2Data.students[index].attenStatus_ != undefined) {
      this.data.tab2Data.students[index].attenStatus_ = attenStatus;
      this.setData({
        tab2Data: this.data.tab2Data
      })
    } else if (this.data.tab2Data.students[index].attenStatus != attenStatus) {
      wx.showModal({
        title: '提示',
        content: '确定要修改吗？',
        success: sm => {
          if (sm.confirm) {
            this.data.tab2Data.students[index].attenStatus_ = attenStatus;
            this.setData({
              tab2Data: this.data.tab2Data
            })
          } else if (sm.cancel) {
            //console.log('用户点击取消')
          }
        }
      })
    }
  },
  //学生考勤操作前做数据处理
  pre_clshour_detail_attn_sub2: function() {
    let attenStatus0 = 0;
    let attenStatus1 = 0;
    let attenStatus2 = 0;
    let attenStatus3 = 0;
    let layoutType1 = 0;
    let layoutType2 = 0;
    let params = {
      "attnType": "1",
      "attnData": []
    };
    this.data.tab2Data.students.forEach(student => {
      attenStatus0 = (student.attenStatus_ || student.attenStatus) == 0 ? ++attenStatus0 : attenStatus0;
      attenStatus1 = (student.attenStatus_ || student.attenStatus) == 1 ? ++attenStatus1 : attenStatus1;
      attenStatus2 = (student.attenStatus_ || student.attenStatus) == 2 ? ++attenStatus2 : attenStatus2;
      attenStatus3 = (student.attenStatus_ || student.attenStatus) == 3 ? ++attenStatus3 : attenStatus3;
      layoutType1 = student.layoutType == 1 ? ++layoutType1 : layoutType1;
      layoutType2 = student.layoutType == 2 ? ++layoutType2 : layoutType2;
      //原本签到状态不存在或者为0的
      if (student.attenStatus == undefined || student.attenStatus == 0) {
        if (student.attenStatus_) {
          params.attnData.push({
            "classesHourStudentId": student.classesHourStudentId,
            "attenStatus": student.attenStatus_,
            "attenDes": ""
          })
        }
      } else if (student.attenStatus_ && student.attenStatus != student.attenStatus_) {
        //做了状态修改的
        params.attnData.push({
          "classesHourStudentId": student.classesHourStudentId,
          "attenStatus": student.attenStatus_,
          "attenDes": ""
        })
      }
    });
    console.log(params)
    if (params.attnData.length == 0) {
      wx.showToast({
        title: '无可提交的更改',
        icon: 'none'
      })
      return
    }
    let content = `您已选中：\r\n到课${attenStatus1}人 串课${layoutType1}人 迟到${attenStatus2}人 请假${attenStatus3}人 试课${layoutType2}人`;
    wx.showModal({
      title: '您确认要提交签到吗？',
      content: content,
      success: sm => {
        if (sm.confirm) {
          this.clshour_detail_attn_sub(params);
        } else if (sm.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
  },
  //考勤操作
  clshour_detail_attn_sub: function(params) {
    let tab = this.data.selectedTabIndex + 1;
    network.requestLoading("/manage/clshour_detail_attn_sub", params, "正在提交",
      res => {
        console.log(res)
        if (res.status == 1) {
          wx.showToast({
            title: '操作成功',
            icon: 'none'
          });
          this.clshour_detail();
        } else {
          wx.showToast({
            title: res.message || '操作失败，请重试',
            icon: 'none'
          })
        }
      },
      error => {
        wx.showToast({
          title: '操作失败，请重试',
          icon: 'none'
        })
      });
  },
  //学员点评切换勾选模式
  tab3selectMode: function() {
    let tab3selectMode = !this.data.tab3selectMode;
    this.setData({
      tab3selectMode: tab3selectMode
    })
    if(!this.data.tab3selectMode){
      this.setData({
        tab3selectBtnTxt: "勾选"
      })
    } else if (this.data.tab3selectMode && this.data.tab3selectAll){
      this.setData({
        tab3selectBtnTxt: "全选"
      })
    }
  },
  //批量点评
  batch_eval: function() {
    console.log(this.data.tab3Data);
    if (!this.data.tab3selectMode) {
      this.setData({
        tab3selectMode: true
      })
      return
    }
    let checkedCount = 0;
    let evalData = [];
    this.data.tab3Data.students.forEach(stu => {
      if (stu.checked) {
        checkedCount++;
        evalData.push({
          classesHourStudentId: stu.classesHourStudentId
        });
      }
    })
    if (checkedCount == 0) {
      wx.showToast({
        title: '请至少选择1人',
        icon: "none"
      })
      return
    }
    this.setData({
      tab3EvalData: evalData,
      tab3EvalStuIndex: -1
    })
    this.tab3ShowEvalInput();
  },
  //单独点评
  eval: function(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      tab3RatingValue: this.data.tab3Data.students[index].tab3RatingValue || this.data.tab3Data.students[index].teachingPerformance || 0,
      teachingEvaluate: this.data.tab3Data.students[index].teachingEvaluate_ || this.data.tab3Data.students[index].teachingEvaluate || "",
    })

    this.setData({
      tab3EvalData: [{
        classesHourStudentId: this.data.tab3Data.students[index].classesHourStudentId
      }],
      tab3EvalStuIndex: index
    });
    this.tab3ShowEvalInput();
  },
  //监听输入框并保存值
  bindinput: function(e) {
    let data = {};
    data[e.currentTarget.dataset.name] = e.detail.value;
    this.setData(data);
    if (e.currentTarget.dataset.name == 'teachingEvaluate' && Number.parseInt(this.data.tab3EvalStuIndex) >= 0) {
      this.data.tab3Data.students[this.data.tab3EvalStuIndex].teachingEvaluate_ = e.detail.value;
      this.setData({
        tab3Data: this.data.tab3Data
      });
    }
  },
  //点评提交
  clshour_detail_eval_sub: function() {
    if (this.data.tab3EvalData.length == 0) {
      console.log("error no tab3EvalData data");
      return;
    }
    if (!this.data.tab3RatingValue) {
      wx.showToast({
        title: '请选择评分',
        icon: 'none'
      })
      return;
    }
    if (!this.data.teachingEvaluate) {
      wx.showToast({
        title: '请输入点评内容',
        icon: 'none'
      })
      return;
    }
    let attachments = wx.getStorageSync("course_addImg");
    let teachingImg = "";
    if (attachments && attachments.length > 0) {
      //teachingImg+=
      attachments.forEach(attachment => {
        teachingImg += attachment.key;
        teachingImg += ",";
      })
    }
    if (teachingImg) {
      teachingImg = teachingImg.substr(0, teachingImg.length - 1);
    }
    let tab3EvalData = this.data.tab3EvalData;
    tab3EvalData.forEach(d => {
      d.teachingEvaluate = this.data.teachingEvaluate;
      d.teachingPerformance = this.data.tab3RatingValue;
      d.teachingImg = teachingImg;
    })
    console.log(tab3EvalData)
    network.requestLoading("/manage/clshour_detail_eval_sub", {
        evalData: this.data.tab3EvalData
      }, 
      res => {
        console.log(res)
        if (res.status == 1) {
          wx.showToast({
            title: '操作成功',
            icon: 'none'
          });
          //点评成功后移除添加的图片
          wx.removeStorage({
            key: 'course_addImg',
            success: function(res) {},
          })
          this.setData({
            tab3ShowEvalInput: false,
            tab3selectMode: false,
            tab3RatingValue: 0,
            teachingEvaluate: ""
          })
          wx.pageScrollTo({
            scrollTop: this.data.pageScrollTop_ || 0,
            duration: 0
          })
          this.clshour_detail();
        } else {
          wx.showToast({
            title: res.message || '操作失败，请重试',
            icon: 'none'
          })
        }
      },
      error => {
        wx.showToast({
          title: '操作失败，请重试',
          icon: 'none'
        })
      });
  },
  closeVideo: function() {
    this.setData({
      showVideo: false
    })
  },
  tab3CheckboxChange: function(e) {
    let tab3Data = this.data.tab3Data;
    tab3Data.students.forEach((student, i) => {
      if (e.detail.value.indexOf('' + i) > -1) {
        student.checked = true;
      } else {
        student.checked = false;
      }
    })
    console.log(tab3Data)
    this.setData({
      tab3Data: tab3Data
    });

    let allselected = true;
    this.data.tab3Data.students.forEach(s => {
      if (!s.checked) {
        allselected = false
      }
    })
    if (allselected) {
      this.setData({
        tab3selectBtnTxt: "全选",
        tab3selectAll:true
      })
    } else {
      this.setData({
        tab3selectBtnTxt: "勾选",
        tab3selectAll:false
      })
    }
  },
  evalRatingChange: function(e) {
    let tab3RatingValue = e.detail.value;
    this.setData({
      tab3RatingValue: tab3RatingValue
    });
    if (Number.parseInt(this.data.tab3EvalStuIndex) >= 0) {
      this.data.tab3Data.students[this.data.tab3EvalStuIndex].tab3RatingValue = tab3RatingValue;
      this.setData({
        tab3Data: this.data.tab3Data
      });
    }
  },
  tab3ShowEvalInput: function(e) {
    this.setData({
      tab3ShowEvalInput: !this.data.tab3ShowEvalInput,
      pageScrollTop_: this.data.pageScrollTop || 0,
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.removeStorage({
      key: 'course_addImg',
      success: function (res) { },
    })
    this.setData({
      classesHourId: options.classesHourId
    });
    this.member_list();
  },
  navigateTo: function(e) {
    if (e.currentTarget.dataset.d) {
      wx.setStorageSync('dataset', e.currentTarget.dataset)
    }
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  tab6topBtnIndex: function(e) {
    this.setData({
      tab6topBtnIndex: e.currentTarget.dataset.index
    })
  },
  tab7topBtnIndex: function(e) {
    this.setData({
      tab7topBtnIndex: e.currentTarget.dataset.index
    })
  },
  tab6ShowTeacherList: function() {
    this.setData({
      tab6ShowTeacherList: true
    })
  },
  c1:function(){
    this.setData({
      tab3ShowEvalInput:false
    })
    wx.pageScrollTo({
      scrollTop: this.data.pageScrollTop_ || 0,
      duration: 0
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  onPageScroll: function (ev) {
    this.setData({
      pageScrollTop: ev.scrollTop
    })
  },
  bindfocus: function (ev) {
    // this.setData({
    //   pageScrollTop_: this.data.pageScrollTop||0,
    //   pageScrollTop:0
    // })
  },
  bindblur: function (ev) {
    wx.pageScrollTo({
      scrollTop: this.data.pageScrollTop_ || 0,
      duration: 0
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (this.data.classesHourId && this.data.selectedTabIndex!=2) {
      this.clshour_detail()
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
  onUnload: function () {
    wx.removeStorage({
      key: 'course_addImg',
      success: function(res) {},
    })
  },
})