var network = require('../../../../utils/network.js')
var util = require('../../../../utils/util.js')

// pages/my_class/class_blog/class_placard/class_placard.js
Page({
  data: {
    classesId: 1
  },
  onLoad: function(options) {
    network.request(
      "/manage/cls_noticelist", {
        "classesId": options.classesId
      },
      res => {
        if (res.status == "1") {
          res.data.forEach(data =>{
            data.createDt = util.formatTime(new Date(data.createDt * 1000)).slice(0, 11);
          })
          this.setData({
            data:res.data
          })
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
})