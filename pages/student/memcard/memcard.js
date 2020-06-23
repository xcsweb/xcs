var network = require('../../../utils/network.js')
var util = require('../../../utils/util.js')
// pages/student/memcard/memcard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0,
    cardlist: [],
    cardidlist: [],
    cardid: 0,
    cardname: "",
    classlist: [],
    feelist: [],
  },
  tabchange: function(e) {
    this.setData({
      tabIndex: e.detail.value
    })
    this.getdata()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getcardid()
    this.getdata()
  },
  bindPickerChange: function(e) {
    this.setData({
      cardid: this.data.cardidlist[e.detail.value].id,
      cardname: this.data.cardidlist[e.detail.value].name,
    })
    this.getclass()
  },
  getdata: function() {
    if (this.data.tabIndex == 0) {
      network.request(
        "/user/my_vip_course", {},
        res => {
          if (res.status == "1") {
            var cardlist = []
            for (var idx in res.data) {
              var startDt = ""
              if (res.data[idx].startDt == 0) {
                startDt = "0000/00/00"
              } else {
                startDt = util.formatTime(new Date(res.data[idx].startDt * 1000)).slice(0, 11)
              }
              var endDt = ""
              if (res.data[idx].endDt == 0) {
                endDt = "0000/00/00"
              } else {
                endDt = util.formatTime(new Date(res.data[idx].endDt * 1000)).slice(0, 11)
              }
              cardlist.push({
                arrears: res.data[idx].arrears,
                courseState: res.data[idx].courseState,
                courseVal: res.data[idx].courseVal,
                chargeType: res.data[idx].chargeType,
                createDt: util.formatTime(new Date(res.data[idx].createDt * 1000)).slice(0, 11),
                endDt: endDt,
                id: res.data[idx].id,
                name: res.data[idx].name,
                receipts: res.data[idx].receipts,
                startDt: startDt,
                useTerm: res.data[idx].useTerm,
              })
            }
            this.setData({
              cardlist: cardlist
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
    }
    if (this.data.tabIndex == 1) {
      this.getclass()
    }
    if (this.data.tabIndex == 2) {
      network.request(
        "/user/my_consume_record", {},
        res => {
          if (res.status == "1") {
            var feelist = []
            for (var idx in res.data) {
              feelist.push({
                courseName: res.data[idx].courseName,
                price: res.data[idx].price,
                stucsmFromType: res.data[idx].stucsmFromType,
                teacherName: res.data[idx].teacherName,
                createDt: util.formatTime(new Date(res.data[idx].createDt * 1000)).slice(0, 11),
              })
            }
            this.setData({
              feelist: feelist
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
    }
  },
  getcardid: function() {
    network.request(
      "/user/my_course", {},
      res => {
        if (res.status == "1") {
          this.setData({
            cardidlist: res.data,
            cardid: res.data[0].id,
            cardname: res.data[0].name,
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
  getclass: function() {
    network.request(
      "/user/my_class_record", {
        "studentCourseId": this.data.cardid
      },
      res => {
        if (res.status == "1") {
          var classlist = []
          for (var idx in res.data) {
            classlist.push({
              className: res.data[idx].className,
              startTime: res.data[idx].startTime.substr(0, 5),
              endTime: res.data[idx].endTime.substr(0, 5),
              chargeType: res.data[idx].chargeType,
              chargeVal: res.data[idx].chargeVal,
              day: util.formatTime(new Date(res.data[idx].day * 1000)).slice(0, 11),
            })
          }
          this.setData({
            classlist: classlist
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
  showmess:function(){
    wx.showToast({
      title: "目前无法补费",
      icon: "none",
      duration: 2000
    })
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