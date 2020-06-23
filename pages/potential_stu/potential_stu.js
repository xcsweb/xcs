let network = require('../../utils/network.js')
let util = require('../../utils/util.js')
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx,
    students: [],
    count: 0,
    selectMode: false,
    selectBtnTxt: "勾选",
    showEvalInput: false,
    noticeType: [],
    noticeTypeIndex: 0,
    selectAll: false,
    inputVal: "",
    searchParam: {},
    offset: network.offset,
    limit: network.limit,
    isLoad: true,
  },
  getFilter: function () {
    network.request(
      "/manage/filter_option", { campus: 1, date: 1, intention: 1, crmSource: 1, crmStage: 1 },
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
      this.initPageParam();
      this.stu_list();
    }
  },
  initPageParam: function () {
    this.setData({
      selectMode: false,
      students: [],
      offset: network.offset,
      limit: network.limit,
      isLoad: true,
    });
  },
  showEvalInput: function(e) {
    this.setData({
      showEvalInput: !this.data.showEvalInput
    })
  },
  imageError: function(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      [`students[${index}].avatar`]: "/imgs/common/104-104@2x.png"
    })
  },
  addstudent: function() {
    wx.navigateTo({
      url: "/pages/potential_stu/addstudent/addstudent"
    })
  },
  toDetail: function(e) {
    wx.setStorage({
      key: 'my_stu_student',
      data: this.data.students[e.currentTarget.dataset.index],
      success: function(res) {
        wx.navigateTo({
          url: './stu_detail/stu_detail',
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
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
      }
    }, error => {
    })
  },
  bindNoticeTypeChange: function(e) {
    this.setData({
      noticeTypeIndex: e.detail.value
    })
  },
  selectMode: function() {
    this.setData({
      selectMode: !this.data.selectMode
    })
  },
  c: function() {

  },
  isUseConfirm: function(e) {

  },
  studentBindChange: function(e) {
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
  selectAll: function() {
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
  bindinput: function(e) {
    let data = {};
    data[e.currentTarget.dataset.name] = e.detail.value;
    this.setData(data);
  },
  //发通知
  notice_add_sub: function() {
    let params = {
      "content": "",
      "noticeType": "0",
      "sendDt": "1533657600",
      "isSms":"1",
      "noticeRecords": []
    };
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
          userId: student.userId,
          tel: student.tel
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
    params.content = this.data.content;
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
  stu_list: function() {
    if (!this.data.isLoad) {
      return
    }
    this.data.searchParam.inputVal = this.data.inputVal;
    this.data.searchParam.offset = this.data.offset;
    this.data.searchParam.limit = this.data.limit;
    network.requestLoading('/manage/rec_list', this.data.searchParam, "", 
      res => {
        if (res.status == 1) {
          console.log(res)
          res.data.students.forEach(stu => {
            stu.createDt_ = util.formatTime(new Date(stu.createDt * 1000)).substr(0, 10);
            stu.avatar = util.filterImgUrl(stu.avatar) || "/imgs/common/104-104@2x.png";
            switch (stu.stageCrmtagId) {
              case "1":
                stu.stageLableColor = "#A175FF";
                break;
              case "2":
                stu.stageLableColor = "#333";
                break;
              case "3":
                stu.stageLableColor = "#666";
                break;
              case "5":
                stu.stageLableColor = "#999";
                break;
              default:
                stu.stageLableColor = "#333";
                break;
            }
          })
          if (res.data.students.length > 0) {
            this.setData({
              count: res.data.count,
              students: this.data.students.concat(res.data.students),
              offset: this.data.offset + this.data.limit
            });
          } else {
            this.setData({
              isLoad: false
            });
          }
        } else {
          util.toast("获取学生列表失败");
        }
      }, 
      error => {
        util.toast("获取学生列表失败");
      }
    );
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.stu_list();
  },
  relsale: function() {
    let studentIds = [];
    this.data.students.forEach(student => {
      if (student.selected) {
        studentIds.push(student.studentId);
      }
    });
    if (studentIds.length == 0) {
      this.setData({
        selectMode: true,
        showEvalInput: false
      });
      util.toast("请选择学员");
      return;
    }
    wx.setStorage({
      key: 'studentIds',
      data: studentIds,
      success: function(res) {
        wx.navigateTo({
          url: '/pages/common/relsale/relsale',
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  e: function() {

  },
  trialcourse: function() {
    let studentIds = [];
    this.data.students.forEach(student => {
      if (student.selected) {
        studentIds.push(student.studentId);
      }
    });
    if (studentIds.length == 0) {
      this.setData({
        selectMode: true,
        showEvalInput: false
      });
      util.toast("请选择学员");
      return;
    }
    wx.setStorage({
      key: 'studentIds',
      data: studentIds,
      success: function(res) {
        wx.navigateTo({
          url: '/pages/common/trialcourse/trialcourse',
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      img_url: network.img_url,
      vod_url: network.vod_url
    })
    this.getFilter();
    this.getNoticeType();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initPageParam();
    this.stu_list();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },
})