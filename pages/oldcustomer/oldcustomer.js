let network = require('../../utils/network.js')
let util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    students: [],
    count: 0,
    selectMode: false,
    showEvalInput: false,
    showStopInput: false,
    noticeType: [],
    selectBtnTxt: "勾选",
    noticeTypeIndex: 0,
    selectAll: false,
    stopClassStatus: 0,
    inputVal: "",
    offset: network.offset,
    limit: network.limit,
    isLoad: true,
    filterParam: [],
    searchParam: {},
  },
  initPageParam: function () {
    this.setData({
      students: [],
      offset: network.offset,
      limit: network.limit,
      isLoad: true
    });
  },
  inputTyping: function (e) {
    if (e.detail) {
      this.setData({
        inputVal: e.detail.value ? e.detail.value : "",
      });
      if (e.detail.searchParam) {
        this.setData({
          searchParam: e.detail.searchParam,
        });
      }
      this.initPageParam()
      this.stu_list()
    }
  },
  getFilter: function () {
    network.request(
      "/manage/filter_option", { campus: 1, classes: 1, stopClassStatus: 1, sex: 1, date: { "title": "出生日期" } },
      res => {
        if (res.status == "1") {
          this.setData({
            filterParam: res.data
          });
        } else {
          wx.showToast({
            title: res.message,
            icon: "none",
            duration: 2000
          })
        }
      },
      function (err) {
        console.log(err)
      }
    )
  },
  showEvalInput: function (e) {
    this.setData({
      showEvalInput: !this.data.showEvalInput
    })
  },
  imageError: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      [`students[${index}].avatar`]: "/imgs/common/104-104@2x.png"
    })
  },
  toDetail: function (e) {
    wx.setStorage({
      key: 'my_stu_student',
      data: this.data.students[e.currentTarget.dataset.index],
      success: function (res) {
        wx.navigateTo({
          url: '/pages/my_stu/stu_detail/stu_detail',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //获取消息类型
  getNoticeType: function () {
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
  bindNoticeTypeChange: function (e) {
    this.setData({
      noticeTypeIndex: e.detail.value
    })
  },
  selectMode: function () {
    this.setData({
      selectMode: !this.data.selectMode
    })
  },
  c: function () {

  },
  isUseConfirm: function (e) {

  },
  studentBindChange: function (e) {
    let values = e.detail.value;
    for (let i = 0; i < this.data.students.length; i++) {
      this.setData({
        [`students[${i}].selected`]: false
      })
    }
    values.forEach(value => {
      let valueNumber = Number.parseInt(value);
      this.setData({
        [`students[${valueNumber}].selected`]: true
      })
    });
    let allselected = true;
    this.data.students.forEach(s => {
      if (!s.selected) {
        allselected = false
      }
    })
    if (allselected) {
      this.setData({
        selectBtnTxt: "全选"
      })
    } else {
      this.setData({
        selectBtnTxt: "勾选"
      })
    }
  },
  selectAll: function () {
    this.setData({
      selectAll: !this.data.selectAll
    })
    for (let i = 0; i < this.data.students.length; i++) {
      this.setData({
        [`students[${i}].selected`]: this.data.selectAll
      })
    }
    if (this.data.selectAll) {
      this.setData({
        selectBtnTxt: "全选"
      })
    } else {
      this.setData({
        selectBtnTxt: "勾选"
      })
    }
  },
  //监听输入框并保存值
  bindinput: function (e) {
    let data = {};
    data[e.currentTarget.dataset.name] = e.detail.value;
    this.setData(data);
  },
  //发通知
  notice_add_sub: function () {
    let params = {
      "title": "",
      "content": "",
      "noticeType": "2",
      "sendDt": "1533657600",
      "noticeRecords": []
    };
    if (!this.data.title) {
      wx.showToast({
        title: '请输入标题',
        icon: "none"
      });
      return;
    }
    if (!this.data.content) {
      wx.showToast({
        title: '请输入内容',
        icon: "none"
      });
      return;
    }
    this.data.students.forEach(student => {
      if (student.selected) {
        params.noticeRecords.push({
          studentId: student.studentId,
          userId: student.userId
        })
      }
    });
    if (params.noticeRecords.length == 0) {
      wx.showToast({
        title: '请选择接收人',
        icon: "none"
      });
      this.setData({
        selectMode: true,
        showEvalInput: false
      })
      return;
    }
    params.title = this.data.title;
    params.content = this.data.content;
    params.noticeType = this.data.noticeType[this.data.noticeTypeIndex].codeValue;
    console.log(params)
    network.requestLoading('/manage/notice_add_sub', params, "正在发送...", res => {
      if (res.status == 1) {
        wx.showToast({
          title: '发送成功',
        });
        this.setData({
          title: "",
          content: "",
          showEvalInput: false,
          selectMode: false
        })
      } else {
        wx.showToast({
          title: '操作失败，请重试',
        })
      }
    }, error => {
      wx.showToast({
        title: '操作失败',
      })
    })
  },
  //停课录入弹出
  showStopInput: function () {
    let params = {
      "studentIds": ""
    };
    this.data.students.forEach(student => {
      if (student.selected && student.stopClassStatus == 0) {
        params.studentIds += student.studentId;
        params.studentIds += ",";
      }
    });
    if (!params.studentIds) {
      wx.showToast({
        title: '请选择要停课的学生',
        icon: "none"
      });
      this.setData({
        selectMode: true,
        showStopInput: false
      })
      return;
    }
    this.setData({
      showStopInput: !this.data.showStopInput,
      stopClassStartDt: "",
      stopClassStartData: "",
      stopClassEndDt: "",
      stopClassEndData: "",
      description: "",
    })
  },
  //停课复课
  stu_change_clstatus: function (e) {
    let params = {
      "studentIds": "",
      "stopClassStatus": e.currentTarget.dataset.stopstatus
    };
    this.data.students.forEach(student => {
      if (student.selected) {
        if (params.stopClassStatus != student.stopClassStatus) {
          params.studentIds += student.studentId;
          params.studentIds += ",";
        }
      }
    });
    if (!params.studentIds) {
      if (params.stopClassStatus == 1) {
        wx.showToast({
          title: '请选择要停课的学生',
          icon: "none"
        });
      } else {
        wx.showToast({
          title: '请选择要复课的学生',
          icon: "none"
        });
      }
      this.setData({
        selectMode: true,
        showEvalInput: false
      })
      return;
    }
    if (params.stopClassStatus == 1) {
      if (!this.data.stopClassStartDt || !this.data.stopClassEndDt) {
        wx.showToast({
          title: '请选择停课时间',
          icon: "none"
        });
        return;
      }
      if (this.data.stopClassStartDt > this.data.stopClassEndDt) {
        wx.showToast({
          title: '停课时间有误',
          icon: "none"
        });
        return;
      }
      params.stopClassStartDt = this.data.stopClassStartDt;
      params.stopClassEndDt = this.data.stopClassEndDt + 86399;
      params.description = !this.data.description ? "" : this.data.description;
    }
    params.studentIds = params.studentIds.substr(0, params.studentIds.length - 1);
    network.requestLoading('/manage/stu_change_clstatus', params, "正在发送...", res => {
      if (res.status == 1) {
        wx.showToast({
          title: '操作成功',
        });
        this.initPageParam()
        this.stu_list()
        this.setData({
          title: "",
          content: "",
          showEvalInput: false,
          showStopInput: false,
          selectMode: false
        })
      } else {
        wx.showToast({
          title: '操作失败，请重试',
        })
      }
    }, error => {
      wx.showToast({
        title: '操作失败',
      })
    })
  },
  stu_list: function () {
    this.data.searchParam.inputVal = this.data.inputVal;
    this.data.searchParam.offset = this.data.offset;
    this.data.searchParam.limit = this.data.limit;
    this.data.searchParam.type = 2;
    network.requestLoading('/manage/stu_list_page', this.data.searchParam, "",
      res => {
        if (res.status == 1) {
          res.data.rows.forEach(e => {
            if (e.loginDt && e.loginDt > 0) {
              e.loginDt_ = util.formatTime(new Date(e.loginDt * 1000)).split(" ")[0]
            } else {
              e.loginDt_ = "";
            }
          })
          if (res.data.rows.length > 0) {
            this.setData({
              count: res.data.count,
              students: this.data.students.concat(res.data.rows),
              offset: this.data.offset + this.data.limit
            });
          } else {
            this.setData({
              isLoad: false
            });
          }
        } else {
          wx.showToast({
            title: '获取学生列表失败',
            icon: "none"
          })
        }
      }, error => {
        wx.showToast({
          title: '获取学生列表失败',
        })
      })
  },
  bindDateChange: function (e) {
    let data = {};
    let name = e.currentTarget.dataset.name;
    data[name.substr(0, name.length - 2) + "Data"] = e.detail.value;
    data[name] = util.dateToDayStamp(e.detail.value);
    this.setData(data);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.stu_list();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getFilter();
    this.initPageParam();
    this.getNoticeType();
    this.stu_list();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
})