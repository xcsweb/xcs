let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      img_url: wx.getStorageSync("img_url"),
      vod_url: wx.getStorageSync("vod_url"),
      classType: options.classType,
      classesHourId: options.id,
    });
    this.get_clshour_detail()
  },

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    });
  },
  studentCoursesChange: function (e) {
    console.log(e);
    this.setData({
      studentCoursesIndex: e.detail.value
    });
  },
  
  //排课预约详情
  get_clshour_detail: function (classesHourId) {
    network.request("/user/get_clshour_detail", { "classesHourId": this.data.classesHourId },
      res => {
        if (res.status == 1) {
          res.data.day_ = util.formatTime(new Date(res.data.day * 1000)).substr(0, 10);
          res.data.endTime = res.data.endTime.substr(0, 5);
          res.data.startTime = res.data.startTime.substr(0, 5);
          res.data.clsHourTeacher = '';
          res.data.clsHourTeacherVos.forEach(clsHourTeacher => {
            res.data.clsHourTeacher += clsHourTeacher.callName;
            res.data.clsHourTeacher += ',';
          });
          res.data.clsHourTeacher = res.data.clsHourTeacher ? res.data.clsHourTeacher.substr(0, res.data.clsHourTeacher.length - 1) : '';
          if (res.data.classHourStatus == 0) {
            res.data.classHourStatusStr = '未开始';
          } else if (res.data.classHourStatus == 1) {
            res.data.classHourStatusStr = '已完成';
          } else if (res.data.classHourStatus == 2) {
            res.data.classHourStatusStr = '停课';
          }
          res.data.studentCourses.forEach(e1=>{
            if (e1.endDt>0){
              e1.endDt_ = util.formatTime(new Date(e1.endDt * 1000)).substr(0, 10);
            }
            e1.val = e1.remainVal;
            if (e1.chargeType=="0"){
              e1.content = "剩余课时：" + e1.val;
            } else if (e1.chargeType == "1"){
              e1.content = "剩余课次：" + e1.val;
            } else if (e1.chargeType == "2") {
              e1.content = "剩余金额：" + e1.val;
            }
          })
          if (res.data.bespokeStatus != 1) {
            util.toast("该课程目前不可预约")
          }
          console.log(res.data)
          this.setData({
            course_detail: res.data,
            date: res.data.startTime
          });
        } else {
          util.toast(res.message||"获取数据失败")
        }
      },
      error => {
        util.toast("获取数据失败")
      });
  },

  //预约
  order_clshour: function () {
    if (typeof this.data.date == 'undefined' && this.data.course_detail.classType==2) {
      util.toast("请选择时间");
      return
    }
    if (typeof this.data.studentCoursesIndex=='undefined'){
      util.toast("请选择卡");
      return
    }
    network.request("/user/order_clshour"
      , { 
        "classesHourId": this.data.classesHourId, 
        "studentCourseId": this.data.course_detail.studentCourses[this.data.studentCoursesIndex].studentCourseId,
        "startTime": this.data.date?this.data.date:"" },
      res => {
        if (res.status == 1) {
          util.toast(res.message||"操作成功",true)
        } else {
          util.toast(res.message || "操作失败")
        }
      },
      error => {
        util.toast("操作失败")
      });
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})