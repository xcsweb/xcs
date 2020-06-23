var network = require('../../../utils/network.js')
var util = require('../../../utils/util.js')
// pages/my_class/class_stop/class_stop.js
Page({
  data: {
    classesId: 0,
    today: "",
    startdate: "",
    enddate: "",
    result: ""
  },
  onLoad: function(options) {
    this.setData({
      classesId: options.classesId,
      today: new Date()
    })
  },
  startDateChange: function(event) {
    this.setData({
      startdate: event.detail.value
    })
  },
  endDateChange: function(event) {
    this.setData({
      enddate: event.detail.value
    })
  },
  bindKeyInput: function(event) {
    this.setData({
      result: event.detail.value
    })
  },
  subform: function() {
    network.requestLoading(
      "/manage/cls_stop_sub", {
        "classesId": this.data.classesId,
        "stopClassStartDt": new Date(this.data.startdate).getTime() / 1000,
        "stopClassEndDt": new Date(this.data.enddate).getTime() / 1000,
        "stopClassDes": this.data.result
      }, "正在提交",
      res => {
        if (res.status == "1") {
          util.toast(res.message||"操作成功",true)
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
})