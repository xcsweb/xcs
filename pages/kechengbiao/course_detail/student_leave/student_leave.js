let network = require('../../../../utils/network.js')
let util = require('../../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getStorage({
      key: 'course_detail',
      success: res => {
        this.setData({
          course: res.data
        });
        this.get_classes_hour_student_list(this.data.course.classesHourId);
      },
    })
  },

  //监听输入框并保存值
  bindinput: function(e) {
    let data = {};
    data[e.currentTarget.dataset.name] = e.detail.value;
    this.setData(data);
  },
  //获取排课下所有学生
  get_classes_hour_student_list: function(classesHourId) {
    network.request("/manage/get_classes_hour_student_list", {
        "classHourId": classesHourId
      },
      res => {
        if (res.status == 1) {
          this.setData({
            classes_hour_student_list: res.data
          })
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
    this.data.classes_hour_student_list.forEach(t => {
      t.checked = false;
    })
    let studentNames = "";
    this.data.classes_hour_student_list.forEach(t => {
      t.checked = false;
      values.forEach(v => {
        if (v == t.classesHourStudentId) {
          t.checked = true;
          studentNames += t.name;
          studentNames += ",";
        }
      })
    })
    if (studentNames) {
      studentNames = studentNames.substring(0, studentNames.length - 1);
    }
    this.setData({
      classes_hour_student_list: this.data.classes_hour_student_list,
      studentNames: studentNames,
      classes_hour_student_list_show: false
    })
  },
  bindcancel: function(e) {
    this.setData({
      classes_hour_student_list_show: false
    })
  },
  classes_hour_student_list_show: function() {
    this.setData({
      classes_hour_student_list_show: true
    })
  },
  //老师为学生请假
  teacher_ask_for_leave_student: function(e) {
    if (!this.data.content) {
      util.toast("请输入请假事由");
      return
    }
    let params = {
      "classesHourStudentIds": [],
      "classHourId": this.data.course.classesHourId,
      "content": this.data.content
    };
    this.data.classes_hour_student_list.forEach(t => {
      if (t.checked){
        params.classesHourStudentIds.push({
          classesHourStudentId: t.classesHourStudentId
        })
      }
    });
    if(params.classesHourStudentIds.length==0){
      util.toast("请添加请假的学员");
      return
    }
    network.request("/manage/teacher_ask_for_leave_student", params,
      res => {
        if (res.status == 1) {
          util.toast(res.message || "操作成功",true)
        } else {
          let msg = res.message || "操作失败，请重试";
          if(res.data){
            for(let key in res.data){
              msg+=";"
              msg+=key;
              msg += ":";
              msg += res.data[key];
            }
          }
          util.toast(msg,false,4000)
        }
      },
      error => {
        util.toast("操作失败，请重试")
      });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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