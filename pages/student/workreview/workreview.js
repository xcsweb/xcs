var network = require('../../../utils/network.js')
var util = require('../../../utils/util.js')
// pages/student/workreview/workreview.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0,
    worklist: [],
    jieduanlist: [],
    classlist: [],
    startdate: "",
    enddate: "",
    today:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let startDate = new Date();
    startDate.setDate(startDate.getDate()-7);
    this.setData({
      startdate: util.formatDate(startDate),
      enddate: util.formatDate(new Date()),
      today: util.formatDate(new Date())
    })
  },
  onShow: function() {
    this.geturl()
  },
  tabchange: function(e) {
    this.setData({
      tabIndex: e.detail.value
    })
    this.geturl()
  },
  ontabShow: function(event) {
    var worklistnum = 'worklist[' + event.currentTarget.dataset.index + '].hidden';
    this.setData({
      [worklistnum]: !this.data.worklist[event.currentTarget.dataset.index].hidden
    })
  },
  geturl: function() {
    if (this.data.tabIndex == 0) {
      network.request(
        "/user/student_task_list", {},
        res => {
          if (res.status == "1") {
            var worklist = [];
            for (var idx in res.data) {
              var studentTaskCompletes = [];
              for (var i in res.data[idx].studentTaskCompletes) {
                studentTaskCompletes.push({
                  studentTaskCompleteId: res.data[idx].studentTaskCompletes[i].studentTaskCompleteId,
                  title: res.data[idx].studentTaskCompletes[i].title,
                  createDt: util.formatTime(new Date(res.data[idx].studentTaskCompletes[i].createDt * 1000)).slice(0, 11),
                  isApproveState: res.data[idx].studentTaskCompletes[i].isApproveState,
                  isApprove: res.data[idx].studentTaskCompletes[i].isApprove,
                })
              }
              worklist.push({
                approveCount: res.data[idx].approveCount,
                createDt: util.formatTime(new Date(res.data[idx].createDt * 1000)).slice(0, 11),
                handCount: res.data[idx].handCount,
                studentTaskId: res.data[idx].studentTaskId,
                title: res.data[idx].title,
                studentTaskCompletes: studentTaskCompletes,
                hidden: true
              })
            }
            this.setData({
              worklist: worklist
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
    if (this.data.tabIndex == 1) {
      network.request(
        "/user/student_follow_list", {},
        res => {
          if (res.status == "1") {
            var jieduanlist = [];
            for (var idx in res.data) {
              jieduanlist.push({
                followDt: util.formatTime(new Date(res.data[idx].followDt * 1000)).slice(0, 11),
                followId: res.data[idx].followId,
                teacherName: res.data[idx].teacherName,
                title: res.data[idx].title,
              })
            }
            this.setData({
              jieduanlist: jieduanlist
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
    if (this.data.tabIndex == 2) {
      console.log(this.data)
      network.request(
        "/user/class_evaluate_list", {
          "teachingEvaluateStartDt": util.dateToStamp(this.data.startdate + " 0:0:0"),
          "teachingEvaluateEndDt": util.dateToStamp(this.data.enddate + " 23:59:59"),
        },
        res => {
          if (res.status == "1") {
            var classlist = [];
            for (var idx in res.data) {
              classlist.push({
                day: util.formatTime(new Date(res.data[idx].day * 1000)).slice(0, 11),
                teachingEvaluateDt: util.formatTime(new Date(res.data[idx].teachingEvaluateDt * 1000)).slice(0, 16),
                classHourStudentId: res.data[idx].classHourStudentId,
                className: res.data[idx].className,
                teacherName: res.data[idx].teacherName,
              })
            }
            this.setData({
              classlist: classlist
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
  startDateChange: function(event) {
    this.setData({
      startdate: event.detail.value
    })
    this.geturl()
  },
  endDateChange: function(event) {
    this.setData({
      enddate: event.detail.value
    })
    this.geturl()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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