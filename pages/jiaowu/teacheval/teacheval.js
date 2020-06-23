var network = require('../../../utils/network.js')
var util = require('../../../utils/util.js')
// pages/jiaowu/teacheval/teacheval.js
Page({
  data: {
    inputVal: "",
    list: [],
    offset: network.offset,
    limit: network.limit,
    isLoad: true,
    filterParam: [],
    searchParam: {},
    modalId: 0,
    modalHidden: true,
    modalMess: "",
  },
  onLoad: function(options) {
    this.setData({
      list:[]
    })
    this.tchplist()
    this.getFilter()
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
      this.tchplist()
    }
  },
  getFilter: function () {
    network.request(
      "/manage/filter_option", { campus: 1, date: 1 },
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
  tchplist: function(){
    let self = this;
    self.data.searchParam.inputVal = self.data.inputVal;
    self.data.searchParam.offset = self.data.offset;
    self.data.searchParam.limit = self.data.limit;
    network.request(
      "/manage/cls_tchperf", self.data.searchParam,
      function (res) {
        if (res.status == "1") {
          var list = [];
          for (var idx in res.data) {
            var temp = {
              id: res.data[idx].id,
              campusName: res.data[idx].campusName,
              classesName: res.data[idx].classesName,
              updateDt: util.formatTime(new Date(res.data[idx].updateDt * 1000)),
              createDt: util.formatTime(new Date(res.data[idx].createDt * 1000)),
              day: util.formatTime(new Date(res.data[idx].day * 1000)).slice(0, 11) + res.data[idx].startTime.slice(0, 5) + "-" + res.data[idx].endTime.slice(0, 5),
              evaluate: res.data[idx].evaluate,
              handleContent: res.data[idx].handleContent,
              handleId: res.data[idx].handleId,
              studentName: res.data[idx].studentName,
              teacherName: res.data[idx].teacherName,
              performance: util.stararray(res.data[idx].performance),
            };
            list.push(temp)
          }
          console.log(list)
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
      function (err) {
        console.log(err)
      }
    )
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isLoad) {
      this.tchplist();
    }
  },
  edit: function(event) {
    this.setData({
      modalId: event.currentTarget.dataset.id,
      modalHidden: false,
    })
  },
  onmodalmess: function(event) {
    this.setData({
      modalMess: event.detail.value,
    })
  },
  onmodalConfirm: function() {
    network.requestLoading(
      "/manage/cls_tchperfhd_sub", {
        "id": this.data.modalId,
        "handleContent": this.data.modalMess
      }, "正在提交",
      res => {
        if (res.status == "1") {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
          this.initPageParam();
          this.tchplist()
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
    this.setData({
      modalHidden: true,
    })
  },
  onmodalCancel: function() {
    this.setData({
      modalHidden: true,
    })
  }
})