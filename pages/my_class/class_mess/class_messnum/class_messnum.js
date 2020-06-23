var network = require('../../../../utils/network.js')
var util = require('../../../../utils/util.js')
// pages/my_class/class_mess/class_messnum/class_messnum.js
Page({
  data: {
    sendUser:[],
    smsResult:0
  },
  onLoad: function(options) {
    console.log(options.smsid)
    network.request(
      "/manage/sms_detail_list", {
        "smsRecordId": options.smsid
      },
      res => {
        if (res.status == "1") {
          this.setData({
            sendUser: res.data.sendUser,
            smsResult: res.data.smsRecord.smsResult
          })
          console.log(this.data.sendUser)
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