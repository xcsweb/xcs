var network = require('../../../utils/network.js')
var util = require('../../../utils/util.js')
// pages/jiaowu/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabid: 0,
    layoutType: [],
    inputVal: "",
    searchParam: {},
    list: [],
    offset: network.offset,
    limit: network.limit,
    load: true,
    list1: [],
    offset1: network.offset,
    limit1: network.limit,
    load1: true,
    list2: [],
    offset2: network.offset,
    limit2: network.limit,
    load2: true,
    list3: [],
    offset3: network.offset,
    limit3: network.limit,
    load3: true,
  },
  inputTyping: function(e){
    if (e.detail) {
      this.setData({
        inputVal: e.detail.value ? e.detail.value : "",
      });
      if (e.detail.searchParam) {
        this.setData({
          searchParam: e.detail.searchParam,
        });
      }
      this.initPageParam();
      this.getmess()
    }
  },
  initPageParam: function () {
    this.setData({
      list: [],
      offset: network.offset,
      limit: network.limit,
      load: true,
      list1: [],
      offset1: network.offset,
      limit1: network.limit,
      load1: true,
      list2: [],
      offset2: network.offset,
      limit2: network.limit,
      load2: true,
      list3: [],
      offset3: network.offset,
      limit3: network.limit,
      load3: true,
    });
  },
  onLoad: function(options) {
    this.getFilter()
    this.getopt()
    this.getmess()
  },
  search: function(e) {
    this.getmess(e.detail.value, "")
  },
  goto: function(event) {
    var stuid = event.currentTarget.dataset.stuid;
    wx.navigateTo({
      url: 'order_mess/order_mess?stuid=' + stuid,
    })
  },
  changeTab: function(event) {
    this.setData({
      tabid: event.currentTarget.dataset.id
    })
    if ((event.currentTarget.dataset.id == 0 && this.data.list.length == 0)
      || (event.currentTarget.dataset.id == 1 && this.data.list1.length == 0)
      || (event.currentTarget.dataset.id == 2 && this.data.list2.length == 0)
      || (event.currentTarget.dataset.id == 3 && this.data.list3.length == 0)) {
      this.getmess();
    }
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
  getmess: function() {
    if ((this.data.tabItabidndex == 0 && !this.data.load)
      || (this.data.tabItabidndex == 1 && !this.data.load1)
      || (this.data.tabItabidndex == 2 && !this.data.load2)
      || (this.data.tabItabidndex == 3 && !this.data.load3)) {
      return;
    }
    let offset = this.data.offset;
    let limit = this.data.limit
    if (this.data.tabid == 1) {
      offset = this.data.offset1;
      limit = this.data.limit1;
    } else if (this.data.tabid == 2) {
      offset = this.data.offset2;
      limit = this.data.limit2;
    } else if (this.data.tabid == 3) {
      offset = this.data.offset3;
      limit = this.data.limit3;
    } 
    this.data.searchParam.inputVal = this.data.inputVal;
    this.data.searchParam.tabid = this.data.tabid;
    this.data.searchParam.offset = offset;
    this.data.searchParam.limit = limit;
    network.request(
      "/manage/booking_student_list", this.data.searchParam,
      res => {
        if (res.status == "1") {
          for (var idx in res.data) {
            res.data[idx].avatar = util.filterImgUrl(res.data[idx].avatar) ||"/imgs/common/104-104@2x.png";
            res.data[idx].day = util.formatTime(new Date(res.data[idx].day * 1000)).slice(0, 11) + res.data[idx].startTime.slice(0, 5) + "-" + res.data[idx].endTime.slice(0, 5);
            for (var lt in this.data.layoutType){
              if (this.data.layoutType[lt].codeValue == res.data[idx].layoutType){
                res.data[idx].layoutValue = lt;
                break;
              }
            }
          }
          console.log(res.data);
          if (this.data.tabid == 0) {
            if (res.data.length > 0) {
              this.setData({
                list: this.data.list.concat(res.data),
                offset: offset + limit
              });
            } else {
              this.setData({
                load: false
              });
            }
          } else if (this.data.tabid == 1) {
            if (res.data.length > 0) {
              this.setData({
                list1: this.data.list1.concat(res.data),
                offset1: offset + limit
              });
            } else {
              this.setData({
                load1: false
              });
            }
          } else if (this.data.tabid == 2) {
            if (res.data.length > 0) {
              this.setData({
                list2: this.data.list2.concat(res.data),
                offset2: offset + limit
              });
            } else {
              this.setData({
                load2: false
              });
            }
          } else if (this.data.tabid == 3) {
            if (res.data.length > 0) {
              this.setData({
                list3: this.data.list3.concat(res.data),
                offset3: offset + limit
              });
            } else {
              this.setData({
                load3: false
              });
            }
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
  //头像加载失败时
  errorImg:function(e){
    let list = e.currentTarget.dataset.list;
    let index = e.currentTarget.dataset.index;
    this.setData({
      [`${list}[${index}].avatar`]:"/imgs/common/104-104@2x.png"
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getmess();
  },
  layoutChange: function(e) {
    let thislist = this.data.list;
    if (this.data.tabid == 1) {
      thislist = this.data.list1;
    } else if (this.data.tabid == 2) {
      thislist = this.data.list2;
    } else if (this.data.tabid == 3) {
      thislist = this.data.list3;
    }
    let self = this;
    wx.showModal({
      title: '提示',
      content: '是否确认' + self.data.layoutType[e.detail.value].codeDisplay,
      success: function(res) {
        if (res.confirm) {
          network.requestLoading(
            "/manage/booking_student_layout_sub", {
              "id": thislist[e.currentTarget.dataset.index].id,
              "layoutType": self.data.layoutType[e.detail.value].codeValue
            }, "正在提交",
            function(r) {
              if (r.status == "1") {
                util.toast(res.message || "提交成功！", false);
                var layoutType = 'list[' + e.currentTarget.dataset.index + '].layoutType';
                var layoutDisplay = 'list[' + e.currentTarget.dataset.index + '].layoutDisplay';

                self.setData({
                  [layoutType]: self.data.layoutType[e.detail.value].codeValue,
                  [layoutDisplay]: self.data.layoutType[e.detail.value].codeDisplay,
                })
                self.initPageParam();
                self.getmess();
              } else {
                wx.showToast({
                  title: r.message,
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