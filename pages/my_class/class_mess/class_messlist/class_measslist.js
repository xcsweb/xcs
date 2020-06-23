var network = require('../../../../utils/network.js')
var util = require('../../../../utils/util.js')
// pages/my_class/class_mess/class_messlist/class_measslist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messdate: []

  },
  onLoad: function(options) {
    network.request(
      "/manage/sms_list", {},
      res => {
        if (res.status == "1") {
          var messdate = []
          for (var idx in res.data) {
            var data = res.data[idx]
            messdate.push({
              smsRecordId: data.smsRecordId,
              sendDt: util.formatTime(new Date(data.sendDt * 1000)).slice(0, 11),
              smsResult: data.smsResult,
              content: data.content,
              num: data.num,
              name:data.name,
            })
          }
          this.setData({
            messdate: messdate
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
  onGoto: function(event) {
    wx.navigateTo({
      url: "/pages/my_class/class_mess/class_messnum/class_messnum?smsid=" + event.currentTarget.dataset.smsid
    })
  }
})