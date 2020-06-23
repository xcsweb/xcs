let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    course_detail: {},
    students: []
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
    this.clshour_addstu(true)
  },
  developing: function () {
    wx.showToast({
      title: '开发中...',
      icon: 'loading',
      duration: 500
    });
  },
  onShow: function () {

  },
  onLoad: function () {
    wx.getStorage({
      key: 'course_detail',
      success: res => {
        if (res && res.data) {
          this.setData({
            course_detail: res.data
          });
          this.clshour_addstu();
        }
      },
    })
  },
  bindchange: function (e) {
    e.detail.value.forEach(val => {
      let index = Number.parseInt(val);
      this.setData({
        [`students[${index}].selected`]: true
      })
    })
  },
  //获取学生列表
  clshour_addstu: function (doSearch) {
    let titleLike = this.data.inputVal ? this.data.inputVal.trim() : "";
    network.request("/manage/clshour_addstu", {
      titleLike: doSearch ? titleLike : '',
      classesHourId: this.data.course_detail.classesHourId
    }, res => {
      if (res.status == 1) {
        //设置默认的卡为第一涨
        res.data.forEach(stu => {
          stu.cardIndex = 0;
          stu.selected = false;
        })
        this.setData({
          students: res.data
        });
      } else {
        wx.showToast({
          title: res.message || '获取数据失败',
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
  checkboxtaped: function (e) {
    if (e.currentTarget.dataset.stu.stuCourseVos.length == 0) {
      wx.showToast({
        title: '该生没有卡，无法添加',
        icon: 'none'
      })
    }
  },
  //更改卡
  changeCard: function (e) {
    let itemList = [];
    this.data.students[e.currentTarget.dataset.index].stuCourseVos.forEach(stuCourseVos_ => {
      itemList.push(stuCourseVos_.courseName)
    })
    wx.showActionSheet({
      itemList: itemList,
      success: res => {
        if (!res.cancel) {
          this.setData({
            [`students[${e.currentTarget.dataset.index}].cardIndex`]: res.tapIndex
          })
        }
      }
    });
  },
  clshour_addstu_sub: function () {
    let params = {
      "classesHourId": this.data.course_detail.classesHourId,
      "studentCourses": []
    };
    this.data.students.forEach(stu => {
      if (stu.selected) {
        params.studentCourses.push({
          "studentId": stu.studentId,
          "studentCourseId": stu.stuCourseVos[stu.cardIndex].studentCourseId
        });
      }
    })
    network.requestLoading("/manage/clshour_addstu_sub", params, "正在提交", res => {
      if (res.status == 1) {
        wx.showToast({
          title: res.message || '添加成功',
          icon: 'none'
        });
        wx.navigateBack({
          delta: 1,
        })
      } else {
        wx.showToast({
          title: res.message || '添加失败',
          icon: 'none'
        })
      }
    },
      error => {
        wx.showToast({
          title: '操作失败',
          icon: 'none'
        })
      });
  }
});