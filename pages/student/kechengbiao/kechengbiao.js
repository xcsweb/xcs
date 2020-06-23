let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0,
    filterParam: [],
    searchParam:"",
    mycourse:[],
    finished_course:[],
    offset: network.offset,
    limit: network.limit,
    isLoad: true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      img_url: network.img_url,
      vod_url: network.vod_url
    });
    this.getFilter();
  },
  initPageParam: function () {
    this.setData({
      finished_course: [],
      offset: network.offset,
      limit: network.limit,
      isLoad: true
    });
  },
  tabchange: function(e) {
    this.setData({
      tabIndex: e.detail.value
    });
    if (e.detail.value == 0 && this.data.mycourse.length == 0) {
      this.mycourse();
    }
    if (e.detail.value == 1 && this.data.finished_course.length == 0) {
      this.finished_course();
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.mycourse();
  },
  //我的课程
  //classesType     班级类型（0常规1预约团课2预约私教）
  mycourse: function() {
    network.request("/user/mycourse", {
        "inputVal": "",
      "classesType": this.data.searchParam
      },
      res => {
        if (res.status == 1) {
          console.log(res.data.mycourseList)
          res.data.mycourseList.forEach(e => {
            e.logPic = util.filterImgUrl(e.logPic) || "/imgs/common/190_190.png";
            e.day_ = util.formatTime(new Date(e.day * 1000)).substr(0, 10);
            e.endTime = e.endTime.substr(0, 5);
            e.startTime = e.startTime.substr(0, 5);
            e.clsHourTeacher = '';
            e.clsHourTeacherVos.forEach(clsHourTeacher => {
              e.clsHourTeacher += clsHourTeacher.callName;
              e.clsHourTeacher += ',';
            });
            e.clsHourTeacher = e.clsHourTeacher ? e.clsHourTeacher.substr(0, e.clsHourTeacher.length - 1) : '';
            e.classHourStatusStr = '未开始';
            if (e.classHourStatus == 2) {
              e.classHourStatusStr = '停课';
            } else if (e.clsHourStudentVo.layoutType == 11) {
              e.classHourStatusStr = '排队中';
            }

            if (e.clsHourStudentVo.layoutType == 12 && e.classType != 0) {
              e.classHourStatusStr = '已取消';
            } else if (e.clsHourStudentVo.attenStatus == 3 && e.classType == 0) {
              e.classHourStatusStr = '已请假';
            }
          });
          this.setData({
            mycourse: res.data.mycourseList || []
          });
          if (res.data.mycourseList.length == 0 && this.data.tabIndex == 0) {
            util.toast("无数据")
          }
        } else {
          util.toast("获取数据失败")
        }
      },
      error => {
        util.toast("获取数据失败")
      });
  },

  errorImg: function(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      [`mycourse[${index}].logPic`]: "/imgs/common/190_190.png"
    })
  },
  //已完成课程
  finished_course: function() {
    if (!this.data.isLoad) {
      return
    }
    let param = {};
    param.value = 1;
    param.inputVal = "";
    param.classesType = this.data.searchParam;
    param.offset = this.data.offset;
    param.limit = this.data.limit;
    network.request("/user/finished_course_list", param,
      res => {
        if (res.status == 1) {
          console.log(res.data)
          res.data.rows.forEach(e => {
            e.day_ = util.formatTime(new Date(e.day * 1000)).substr(0, 10);
            e.endTime = e.endTime.substr(0, 5);
            e.startTime = e.startTime.substr(0, 5);
            switch (e.attenStatus) {
              case '0':
                e.attenStatusStr = '未签到';
                e.attenStatusColor = '#ccc';
                break;
              case '1':
                e.attenStatusStr = '已完成';
                e.attenStatusColor = '#333';
                break;
              case '2':
                e.attenStatusStr = '已迟到';
                e.attenStatusColor = '#ccc';
                break;
              case '3':
                e.attenStatusStr = '已请假';
                e.attenStatusColor = '#78a6ff';
                break;
              case '4':
                e.attenStatusStr = '已旷课';
                e.attenStatusColor = '#ccc';
                break;
            }
          })
          if (res.data.rows.length == 0 && this.data.finished_course && this.data.tabIndex == 1) {
            util.toast("无数据")
          }
          if (res.data.rows.length > 0) {
            this.setData({
              count: res.data.count,
              finished_course: this.data.finished_course.concat(res.data.rows),
              offset: this.data.offset + this.data.limit
            });
          } else {
            this.setData({
              isLoad: false
            });
          }
        } else {
          util.toast("获取数据失败")
        }
      },
      error => {
        util.toast("获取数据失败")
      });
  },
  toDetail: function(event) {
    wx.navigateTo({
      url: './detail/detail?classesHourStudentId=' + event.currentTarget.dataset.clshourstuid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //取消预约
  undo_clshour: function(e) {
    network.request("/user/undo_clshour", {
        "classesHourStudentId": e.currentTarget.dataset.id
      },
      res => {
        if (res.status == 1) {
          util.toast("操作成功")
          this.mycourse();
        } else {
          util.toast(res.message || "操作失败")
        }
      },
      error => {
        util.toast("操作失败")
      });
  },

  getFilter: function() {
    network.request(
      "/user/filter_option", {
        "classType": "1"
      },
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
      function(err) {
        console.log(err)
      }
    )
  },
  inputTyping: function(e) {
    if (e.detail) {
      this.setData({
        inputVal: e.detail.value ? e.detail.value : "",
      });
      if (e.detail.searchParam) {
        this.setData({
          searchParam: e.detail.searchParam.classType ? e.detail.searchParam.classType:"",
        });
      }
    }
    this.mycourse();
    this.finished_course();
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.finished_course();
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})