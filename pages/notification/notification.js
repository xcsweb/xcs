let network = require('../../utils/network.js')
let util = require('../../utils/util.js')
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    tabIndex: 0,
    filter: false,
    institutionId: 1,
    noticeType: "",
    fiterItems: [],
    notice_list: {},
    notice_list_search:{},
    inbox:[],
    inOffset: network.offset,
    inLimit: network.limit,
    inLoad: true,
    hairbox:[],
    hairOffset: network.offset,
    hairLimit: network.limit,
    hairLoad: true,
  },
  initPageParam: function(){
    this.setData({
      inbox: [],
      inOffset: network.offset,
      inLimit: network.limit,
      inLoad: true,
      hairbox: [],
      hairOffset: network.offset,
      hairLimit: network.limit,
      hairLoad: true,
    });
  },
  showInput: function() {
    // this.setData({
    //   inputShowed: true
    // });
  },
  hideInput: function() {
    // this.setData({
    //   inputVal: "",
    //   inputShowed: false
    // });
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value,
    });
    this.initPageParam();
    this.notice_list()
  },
  changeTab: function(event) {
    this.setData({
      tabIndex: event.currentTarget.dataset.index
    })
    if (event.currentTarget.dataset.index == 0 && this.data.inbox.length == 0){
      this.notice_list();
    } else if (event.currentTarget.dataset.index == 1 && this.data.hairbox.length == 0){
      this.notice_list();
    }
  },
  showFilter: function() {
    this.setData({
      filter: !this.data.filter
    })
  },
  filterSelect: function(event) {
    this.data.fiterItems.forEach(item => {
      item.selected = false;
    })
    this.data.fiterItems[event.currentTarget.dataset.d].selected = !this.data.fiterItems[event.currentTarget.dataset.d].selected
    this.setData({
      fiterItems: this.data.fiterItems
    })
  },
  resetFilterItem: function(){
    this.data.fiterItems.forEach(item => {
      item.selected = false;
    })
    this.setData({
      fiterItems: this.data.fiterItems
    })
  },
  subFilterItem: function(){
    this.data.fiterItems.forEach(item => {
      if (item.selected==true){
        this.setData({
          noticeType: item.codeValue
        });
        this.initPageParam();
      }
    })
    this.setData({
      filter: !this.data.filter
    })
    this.notice_list()
  },
  developing: function() {
    wx.showToast({
      title: '开发中...',
      icon: 'loading',
      duration: 500
    });
  },
  toInboxDetail: function(event) {
    wx.navigateTo({
      url: './notification_inboxdetail/notification_inboxdetail?noticerecordid=' + event.currentTarget.dataset.noticerecordid, 
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  toHairboxDetail: function (event) {
    console.log(event);
    wx.navigateTo({
      url: './notification_hairboxdetail/notification_hairboxdetail?noticeid=' + event.currentTarget.dataset.noticeid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  toNotificationAddPage: function() {
    wx.navigateTo({
      url: './notification_add/notification_add',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  onPullDownRefresh: function() {
    //wx.startPullDownRefresh({ })
  },
  onShow: function () {
    this.initPageParam()
    this.notice_list();
  },
  onReady: function (res) {
    let videoContext = wx.createVideoContext('myVideo')
    videoContext.play();
    videoContext.requestFullScreen();
  },
  onLoad: function() {

  },
  notice_list: function(doSearch) {
    if (this.data.tabIndex == 0 && !this.data.inLoad) {
      return;
    } else if (this.data.tabIndex == 1 && !this.data.hairLoad){
      return;
    }
    let titleLike = this.data.inputVal ? this.data.inputVal.trim() : "";
    let offset = this.data.inOffset;
    let limit = this.data.inLimit
    if (this.data.tabIndex == 1) {
      offset = this.data.hairOffset;
      limit = this.data.hairLimit;
    }
    network.request("/manage/notice_list", {
      titleLike: titleLike,
      noticeType: this.data.noticeType,
      tabIndex: this.data.tabIndex,
      offset: offset,
      limit: limit
      },
      res => {
        res.data.notices.forEach(msg => {
          msg.sendDt = util.formatDate(new Date(msg.sendDt * 1000));
        })
        if (this.data.tabIndex==0){
          if (res.data.notices.length>0){
            this.setData({
              inbox: this.data.inbox.concat(res.data.notices),
              inOffset: offset + limit
            }); 
          }else{
            this.setData({
              inLoad: false
            });
          }
        }else{
          if (res.data.notices.length > 0) {
            this.setData({
              hairbox: this.data.hairbox.concat(res.data.notices),
              hairOffset: offset + limit
            });
          } else {
            this.setData({
              hairLoad: false
            });
          }
        }
        if (this.data.fiterItems.length==0){
          this.setData({
            fiterItems: res.data.noticeType
          });
        }
        /*if (doSearch){
          this.setData({
            notice_list_search: res
          });
          console.log(res)
        }else{
          this.setData({
            notice_list: res
          });
        }*/
      },
      error => {
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        })
      });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.notice_list();
  },
});