var network = require('../../../utils/network.js')
var util = require('../../../utils/util.js')
// pages/jiaowu/studentrial/studentrial.js
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
    filterParam: [],
    searchParam: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getFilter();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getList();
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
    if (e.detail) {
      this.setData({
        inputVal: e.detail.value ? e.detail.value : "",
      });
      if (e.detail.searchParam) {
        this.setData({
          searchParam: e.detail.searchParam,
        });
      }
      this.initPageParam()
      this.getList()
    }
  },
  getFilter: function () {
    network.request(
      "/manage/filter_option", { campus: { "relation": 2 }, classes: 1, date: 1 },
      res => {
        if (res.status == "1") {
          this.setData({
            filterParam: res.data
          });
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
  getList: function(){
    this.data.searchParam.inputVal = this.data.inputVal;
    this.data.searchParam.offset = this.data.offset;
    this.data.searchParam.limit = this.data.limit;
    network.request(
      "/manage/student_trial_class", this.data.searchParam,
      res => {
        if (res.status == "1") {
          res.data.forEach(item => {
            item.day = util.formatTime(new Date(item.day * 1000)).slice(0, 11) + item.startTime.slice(0, 5) + "-" + item.endTime.slice(0, 5)
            item.avatar = util.filterImgUrl(item.avatar) || "/imgs/common/104-104@2x.png";
          });
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
      err => {
        console.log(err)
      }
    )
  },
  //头像加载失败时
  errorImg: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      [`list[${index}].avatar`]: "/imgs/common/104-104@2x.png"
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isLoad) {
      this.getList();
    }
  },
  toDetail: function (e) {
    wx.setStorage({
      key: 'my_stu_student',
      data: this.data.list[e.currentTarget.dataset.index],
      success: function (res) {
        wx.navigateTo({
          url: '/pages/potential_stu/stu_detail/stu_detail',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
})