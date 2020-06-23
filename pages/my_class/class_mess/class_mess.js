var network = require('../../../utils/network.js')
var util = require('../../../utils/util.js')
// pages/my_class/class_mess/class_mess.js
Page({
  data: {
    index: 0,
    classId: 0,
    classes: [],
    smsCnt: 0,
    messarea: ""
  },
  onLoad: function(options) {
    this.setData({
      classId: options.classesId
    })
    this.get()
  },

  get:function(){
    network.request(
      "/manage/sms_send", {},
      res => {
        if (res.status == "1") {
          var idx = 0;
          for (var i in res.data.classes) {
            if (res.data.classes[i].classesId == this.data.classId) {
              console.log(i)
              idx = i
            }
          }

          this.setData({
            classes: res.data.classes,
            smsCnt: res.data.smsCnt,
            classId: res.data.classes[idx].classesId,
            index: idx
          })
          console.log(this.data)
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
  },
  bindPickerChange: function(e) {
    var classid = this.data.classes[e.detail.value].classesId
    this.setData({
      index: e.detail.value,
      classId: classid
    })
  },
  bindKeyInput: function(event) {
    var dataname = event.currentTarget.dataset.dataname;
    this.setData({
      [dataname]: event.detail.value
    })
  },
  postmess: function() {
    if (this.data.messarea == "") {
      wx.showToast({
        title: "请输入内容",
        icon: "none",
        duration: 2000
      })
    } else {
      network.requestLoading(
        "/manage/sms_send_sub", {
          "classesId": this.data.classId,
          "content": this.data.messarea
        }, "正在提交",
        res => {
          if (res.status == "1") {
            wx.showToast({
              title: res.message,
              icon: "none",
              duration: 2000
            })
            this.setData({
              messarea:""
            })
            this.get()
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
  }
})