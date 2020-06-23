var network = require('../../../utils/network.js')
var util = require('../../../utils/util.js')
// pages/jiaowu/attend/attend.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputVal: "",
    list: [],
    offset: network.offset,
    limit: network.limit,
    isLoad: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.get_tchatten_list();
  },
  initPageParam: function () {
    this.setData({
      list: [],
      offset: network.offset,
      limit: network.limit,
      isLoad: true
    });
  },
  inputTyping: function (e) {
    let inputVal = "";
    if (e.detail) {
      inputVal = e.detail.value;
    }
    this.setData({
      inputVal: inputVal,
    });
    this.initPageParam()
    this.get_tchatten_list()
  }, 
  goto: function (event) {
    let course = new Object();
    course.classesHourId = event.currentTarget.dataset.id;
    wx.setStorageSync('course_detail', course)
    wx.navigateTo({
      url: '/pages/kechengbiao/course_detail/course_detail?classesHourId=' + event.currentTarget.dataset.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  get_tchatten_list: function(){
    if (!this.data.isLoad) {
      return;
    }
    network.request(
      "/manage/tchatten_list",
      {
        inputVal: this.data.inputVal,
        offset: this.data.offset,
        limit: this.data.limit
      },
      res => {
        if (res.status == "1") {
          for (var idx in res.data) {
            if (res.data[idx].startTime != null) {
              res.data[idx].day = util.formatTime(new Date(res.data[idx].day * 1000)).slice(0, 11) + res.data[idx].startTime.slice(0, 5) + "-" + res.data[idx].endTime.slice(0, 5);
            }
          }
          console.log(res.data)
          
          if (res.data.length > 0) {
            this.setData({
              list: this.data.list.concat(res.data),
              offset: this.data.offset + this.data.limit
            });
          } else {
            this.setData({
              isLoad: false
            });
          }
        } else {
          wx.showToast({
            title: res.message,
            icon: "none",
            duration: 2000
          })
        }
      },
      function (err) {
        console.log(err)
      }
    )
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.get_tchatten_list();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})