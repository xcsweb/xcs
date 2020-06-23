var network = require('../../../utils/network.js')
var util = require('../../../utils/util.js')
// pages/jiaowu/attence/attence.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabid: 0,
    inputVal: "",
    list: [],
    offset: network.offset,
    limit: network.limit,
    isLoad: true,
    absenteeismoCnt: 0,
    beginsCnt: 0,
    leaveCnt: 0,
    filterParam: [],
    searchParam: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.get();
    this.getFilter();
  },
  initPageParam: function() {
    this.setData({
      list: [],
      offset: network.offset,
      limit: network.limit,
      isLoad: true
    });
  },
  inputTyping: function(e) {
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
      this.get()
    }
  },
  changeTab: function(event) {
    this.initPageParam()
    this.setData({
      tabid: event.currentTarget.dataset.id
    })
    this.get()
  },
  getFilter: function () {
    network.request(
      "/manage/filter_option", { campus: 1, date: 1},
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
  get: function() {
    let self = this;
    if (!self.data.isLoad) {
      return
    }
    self.data.searchParam.tabid = self.data.tabid;
    self.data.searchParam.inputVal = self.data.inputVal;
    self.data.searchParam.offset = self.data.offset;
    self.data.searchParam.limit = self.data.limit;
    network.request(
      "/manage/stuatten_list", self.data.searchParam,
      function(res) {
        if (res.status == "1") {
          var list = [];
          self.setData({
            beginsCnt: res.data.beginsCnt,
            leaveCnt: res.data.leaveCnt,
            absenteeismoCnt: res.data.absenteeismoCnt
          })
          for (var idx in res.data.clsHourStus) {
            if (res.data.clsHourStus[idx].attenMemberName == null) {
              var attenMemberName = ""
            } else {
              var attenMemberName = res.data.clsHourStus[idx].attenMemberName
            }
            var temp = {
              attenMemberName: attenMemberName,
              campusName: res.data.clsHourStus[idx].campusName,
              checkInDt: util.formatTime(new Date(res.data.clsHourStus[idx].checkInDt * 1000)),
              classesName: res.data.clsHourStus[idx].classesName,
              day: util.formatTime(new Date(res.data.clsHourStus[idx].day * 1000)).slice(0, 11) + res.data.clsHourStus[idx].startTime.slice(0, 5) + "-" + res.data.clsHourStus[idx].endTime.slice(0, 5),
              studentName: res.data.clsHourStus[idx].studentName,
            };
            list.push(temp)
          }
          if (list.length > 0) {
            self.setData({
              list: self.data.list.concat(list),
              offset: self.data.offset + self.data.limit
            });
          } else {
            self.setData({
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
      function(err) {
        console.log(err)
      }
    )
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.get();
  },
})