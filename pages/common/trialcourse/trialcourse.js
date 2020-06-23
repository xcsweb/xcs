let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {},
  calendarChange: function(e) {
    console.log(e)
    let day = Math.floor(e.detail.milliseconds / 1000);
    this.tricls_list(day)
  },
  tricls_addstu_sub: function(day) {
    let params = {
      "classesHourIds": [],
      "students": []
    }
    this.data.tricls_list.forEach(tricls => {
      if (tricls.selected) {
        params.classesHourIds.push(tricls.classesHourId + "");
      }
    })
    this.data.studentIds.forEach(studentId => {
      params.students.push({
        studentId: studentId
      })
    })
    if (params.classesHourIds.length == 0) {
      util.toast("请选择课程");
      return;
    }
    network.requestLoading('/manage/tricls_addstu_sub', params, "正在提交", res => {
      if (res.status == 1) {
        util.toast(res.message||"操作成功", true);
      } else {
        util.toast(res.message ||"操作失败");
      }
    }, error => {
      util.toast("操作失败");
    });
  },
  tricls_list: function(day) {
    network.requestLoading('/manage/tricls_list', {
      day: day 
    }, "", res => {
      if (res.status == 1) {
        console.log(res)
        this.setData({
          tricls_list: res.data,
        });
        if (res.data.length==0){
          util.toast("所选日期无课程")
        }
      } else {
        util.toast("获取列表失败");
      }
    }, error => {
      util.toast("获取列表失败");
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let date=new Date();
    date.setHours(0,0,0,0);
    this.tricls_list(Math.floor(date.getTime()/1000));
    wx.getStorage({
      key: 'studentIds',
      success: res => {
        this.setData({
          studentIds: res.data
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  e: function() {

  },
  studentBindChange: function(e) {
    let values = e.detail.value;
    for (let i = 0; i < this.data.tricls_list.length; i++) {
      this.setData({
        [`tricls_list[${i}].selected`]: false
      })
    }
    values.forEach(value => {
      let valueNumber = Number.parseInt(value);
      this.setData({
        [`tricls_list[${valueNumber}].selected`]: true
      })
    });
    console.log(this.data.tricls_list)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  }
})