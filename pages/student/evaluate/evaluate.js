let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')
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
    this.setData({
      id: options.id
    })
    this.evaluate_teacher(this.data.id)
  },
  evaluate: function(e) {
    this.setData({
      evaluate: e.detail.value
    })
  },
  rating: function(e) {
    this.setData({
      performance: e.detail.value
    })
  },

  teacher: function(e) {
    this.setData({
      [`evaluate_teacher.teacherList[${e.currentTarget.dataset.index}].selected`]: !this.data.evaluate_teacher.teacherList[e.currentTarget.dataset.index].selected
    })
  },
  evaluate_teacher: function(clsHourStudentId) {
    network.requestLoading("/user/evaluate_teacher", {
      "classesHourStudentId": clsHourStudentId
      },"请稍后...",
      res => {
        if (res.status  == 1) {
          console.log(res.data)
          this.setData({
            evaluate_teacher: res.data
          })
          let hasUnEavl=false;
          res.data.teacherList.forEach(e=>{
            if (e.isEval==0){
              hasUnEavl=true;
            }
          })
          if (!hasUnEavl){
            wx.navigateBack({
              delta: 1,
            })
          }
        } else {
          util.toast(res.message || "操作失败")
        }
      },
      error => {
        util.toast("操作失败")
      });
  },

  addevaluate_teacher: function() {
    let params = {
      "memberId": [],
      "classesHourStudentId": "",
      "evaluate": "",
      "performance": ""
    };
    this.data.evaluate_teacher.teacherList.forEach(teacher=>{
      if (teacher.selected){
        params.memberId.push({
          teacherMemberId: teacher.teacherMemberId
        })
      }
    });
    params.classesHourStudentId = this.data.id;
    params.evaluate = this.data.evaluate;
    params.performance = this.data.performance;
    if(!params.evaluate){
      util.toast("请输入内容");
      return
    }
    if (params.memberId.length==0) {
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
    console.log(params) 
    network.requestLoading("/user/addevaluate_teacher", params, "请稍后...",
      res => {
        //接口status字段取值有误 做兼容处理
        if (res.status == 1 || (res.message && res.message.indexOf("成功")>=0)) {
          util.toast(res.message || "操作成功");
          this.setData({
            evaluate:"",
            performance:0,
            disableBtn:false
          })
          this.evaluate_teacher(this.data.id)
        } else {
          this.setData({
            disableBtn: false
          })
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