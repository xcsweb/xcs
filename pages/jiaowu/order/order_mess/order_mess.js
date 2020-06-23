var network = require('../../../../utils/network.js')
var util = require('../../../../utils/util.js')
// pages/jiaowu/order/order_mess/order_mess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    student: {},
    order_phone: network.SERVER_IMG + "order/order_phone.png",
    order_id: network.SERVER_IMG + "order/order_id.png",
    list: [],
    layoutType: [],
    msgsenderShow: false,
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    wx.getStorage({
      key: 'my_stu_student',
      success: res => {
        this.setData({
          student: res.data
        })
      },
    });
  },
  msgsenderShow: function () {
    console.log("1212")
    this.setData({
      msgsenderShow: true
    })
  },
  toDetail: function (e) {
    wx.setStorage({
      key: 'my_stu_student',
      data: this.data.list[0],
      success: function (res) {
        wx.navigateTo({
          url: '/pages/my_stu/stu_detail/stu_detail',
          success: function (res) { 
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getopt()
    this.getmess(options)
  },
  call: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.list[0].tel
    })
  },
  getopt: function() {
    let self = this;
    network.request(
      "/manage/booking_student_option", {},
      function(res) {
        if (res.status == "1") {
          self.setData({
            layoutType: res.data.layoutType
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: "none",
            duration: 2000
          })
        }
      },
      function(err) {
        console.log(err)
      }
    )
  },
  getmess: function(options) {
    let self = this;
    network.request(
      "/manage/booking_student_list", {
        "titleLike": "",
        "studentId": options.stuid
      },
      function(res) {
        if (res.status == "1") {
          var list = []
          for (var idx in res.data) {
            if (res.data[idx].layoutType == "10") {
              var layoutDisplay = "预约"
            }
            if (res.data[idx].layoutType == "11") {
              var layoutDisplay = "排队"
            }
            if (res.data[idx].layoutType == "12") {
              var layoutDisplay = "取消"
            }
            
            var temp = {
              avatar: util.filterImgUrl(res.data[idx].avatar) || "/imgs/common/104-104@2x.png",
              classHourStatus: res.data[idx].classHourStatus,
              classesName: res.data[idx].classesName,
              day: util.formatTime(new Date(res.data[idx].day * 1000)).slice(0, 11) + res.data[idx].startTime.slice(0, 5) + "-" + res.data[idx].endTime.slice(0, 5),
              id: res.data[idx].id,
              layoutType: res.data[idx].layoutType,
              layoutDisplay: layoutDisplay,
              studentId: res.data[idx].studentId,
              studentName: res.data[idx].studentName,
              tel: res.data[idx].tel,
            };
            list.push(temp)
          }
          self.setData({
            list: list
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: "none",
            duration: 2000
          })
        }
      },
      function(err) {
        console.log(err)
      }
    )
  },
  //头像加载失败时
  errorImg: function (e) {
    this.setData({
      [`list[0].avatar`]: "/imgs/common/104-104@2x.png"
    })
  },
  layoutChange: function(e) {
    let self = this;
    wx.showModal({
      title: '提示',
      content: '是否确认' + self.data.layoutType[e.detail.value].codeDisplay,
      success: function(res) {
        if (res.confirm) {
          network.requestLoading(
            "/manage/booking_student_layout_sub", {
              "id": self.data.list[e.currentTarget.dataset.index].id,
              "layoutType": self.data.layoutType[e.detail.value].codeValue
            }, "正在提交",
            function(r) {
              if (r.status == "1") {
                var layoutType = 'list[' + e.currentTarget.dataset.index + '].layoutType';
                var layoutDisplay = 'list[' + e.currentTarget.dataset.index + '].layoutDisplay';

                self.setData({
                  [layoutType]: self.data.layoutType[e.detail.value].codeValue,
                  [layoutDisplay]: self.data.layoutType[e.detail.value].codeDisplay
                })
              } else {
                wx.showToast({
                  title: res.message,
                  icon: "none",
                  duration: 2000
                })
              }
            },
            function(e) {
              console.log(e)
            }
          )
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})