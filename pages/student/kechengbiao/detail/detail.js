let network = require('../../../../utils/network.js')
let util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classesHourStudentId:0,
    detailData:{},
    performance:0,
    attenBtnType:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      classesHourStudentId: options.classesHourStudentId
    });
    this.findDetail();
  },

  findDetail: function(){
    network.request("/user/after_class_summary", 
      {
        "classesHourStudentId": this.data.classesHourStudentId
      },
      res => {
        if (res.status == 1) {
          res.data.classesHourInfo.time = res.data.classesHourInfo.startTime.substr(0, 5) + "-" + res.data.classesHourInfo.endTime.substr(0, 5);
          if (res.data.performance){
            if (res.data.performance.starNum<3){
              res.data.performance.icon = "/imgs/student/kechengbiao/rating_icon12.png";
            } else if (res.data.performance.starNum<5){
              res.data.performance.icon = "/imgs/student/kechengbiao/rating_icon34.png";
            }else{
              res.data.performance.icon = "/imgs/student/kechengbiao/rating_icon5.png";
            }
          }
          if (res.data.classesHourTeach){
            res.data.classesHourTeach.content = res.data.classesHourTeach.content.trim();
            if (res.data.classesHourTeach.content.length > 80) {
              res.data.classesHourTeach.content = res.data.classesHourTeach.content.substr(0, 80) + "...";
            }
          }
          res.data.classesHourTeachers.forEach(item => {
            item.avatar = item.avatar != "" ? item.avatar : util.filterLocalImgUrl("common/104-104@2x.png");
          });
          let attenBtnType = 0;
          if (res.data.classesHourInfo.attenStatus == 0 && res.data.classesHourInfo.classHourStatus == 0){
            if (res.data.classesHourInfo.classType == 0) {
              attenBtnType = 1;
            } else if (res.data.classesHourInfo.classType != 0) {
              attenBtnType = 2;
            }
          }
          
          this.setData({
            detailData: res.data,
            attenBtnType: attenBtnType
          });
        } else {
          util.toast("获取数据失败")
        }
      },
      error => {
        util.toast("获取数据失败")
      }
    );
  },
  toDetail: function (event) {
    let url = "";
    if (event.currentTarget.dataset.clshourteachid){
      url = '../teach_detail/teach_detail?classesHourTeachId=' + event.currentTarget.dataset.clshourteachid
    } else if (event.currentTarget.dataset.studenttaskid){
      url = '../../workreview/detail/detail?studentTaskId=' + event.currentTarget.dataset.studenttaskid
    }
    wx.navigateTo({
      url: url,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  bindTeacher: function (e) {
    this.setData({
      [`detailData.classesHourTeachers[${e.currentTarget.dataset.index}].selected`]: !this.data.detailData.classesHourTeachers[e.currentTarget.dataset.index].selected
    })
  },

  evaluate: function (e) {
    this.setData({
      evaluate: e.detail.value
    })
  },
  rating: function (e) {
    this.setData({
      performance: e.detail.value
    })
  },
  addevaluate_teacher: function () {
    let params = {
      "memberId": [],
      "classesHourStudentId": "",
      "evaluate": "",
      "performance": ""
    };
    this.data.detailData.classesHourTeachers.forEach(teacher => {
      if (teacher.selected) {
        params.memberId.push({
          teacherMemberId: teacher.memberId
        })
      }
    });
    params.classesHourStudentId = this.data.classesHourStudentId;
    params.evaluate = this.data.evaluate;
    params.performance = this.data.performance;
    if (!params.evaluate) {
      util.toast("请输入内容");
      return
    }
    if (params.memberId.length == 0) {
      util.toast("请选择老师");
      return
    }
    if (!params.evaluate) {
      util.toast("请输入内容");
      return
    }
    if (!params.performance) {
      util.toast("请评分");
      return
    }
    console.log(params);
    network.requestLoading("/user/addevaluate_teacher", params, "请稍后...",
      res => {
        //接口status字段取值有误 做兼容处理
        if (res.status == 1 || (res.message && res.message.indexOf("成功") >= 0)) {
          util.toast(res.message || "操作成功");
          let classesHourTeachersNew = [];
          this.data.detailData.classesHourTeachers.forEach(teacher => {
            if (!teacher.selected) {
              classesHourTeachersNew.push(teacher);
            }
          });
          this.data.detailData.classesHourTeachers = classesHourTeachersNew;
          this.setData({
            evaluate: "",
            performance: 0,
            detailData: this.data.detailData
          })
        } else {
          util.toast(res.message || "操作失败")
        }
      },
      error => {
        this.setData({
          disableBtn: false
        })
        util.toast("操作失败")
      });
  },
  //取消预约
  undo_clshour: function (e) {
    let me = this;
    wx.showModal({
      title: '提示',
      content: '请确认请假',
      success: function (res) {
        if (res.confirm) {
          network.request("/user/undo_clshour", {
            "classesHourStudentId": me.data.classesHourStudentId
            },
            res => {
              if (res.status == 1) {
                util.toast("操作成功")
                me.setData({
                  attenBtnType: 0
                })
              } else {
                util.toast(res.message || "操作失败")
              }
            },
            error => {
              util.toast("操作失败")
            }
          );
        }
      }
    });
  },
  //请假
  ask_for_leave: function (e) {
    let me = this;
    wx.showModal({
      title: '提示',
      content: '请确认请假',
      success: function (res) {
        if (res.confirm) {
          network.request("/user/ask_for_leave",
            {
              "classesHourStudentId": me.data.classesHourStudentId
            },
            res => {
              if (res.status == 1) {
                util.toast(res.message || "操作成功")
                me.setData({
                  attenBtnType: 0
                })
              } else {
                util.toast(res.message || "操作失败")
              }
            },
            error => {
              util.toast("操作失败")
            }
          );
        }
      }
    })
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