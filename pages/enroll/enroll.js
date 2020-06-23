let network = require('../../utils/network.js')
let util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedTabIndex: 0,
    img_url: network.img_url,
    vod_url: network.vod_url,
    tab1Data: [],
    tab2Data: [],
    tab3Data: [],
    tab5Data: [],
    inputVal: "",
    offset: network.offset,
    limit: network.limit,
    isLoad: true,
    filterParam: [],
    searchParam: {},
  },

  /**
   * 生命周期函数--监听页面加载
   * 
   */
  onLoad: function(options) {
    let me = this;
    network.filterInfo(
      { campus: 1, date: 1, isAllData: 1 },
      function (data) {
        me.setData(data);
        me.initPageParam();
        me.enroll();
      }
    );
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  initPageParam: function () {
    this.setData({
      tab1Data: [],
      tab2Data: [],
      tab3Data: [],
      tab5Data: [],
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
      this.enroll()
    }
  },
  imageloaderror1:function(e){
    this.setData({
      [`tab1Data[${e.currentTarget.dataset.index}].avatar`]:'/imgs/common/104-104@2x.png'
    })
  },
  imageloaderror2:function(e){
    this.setData({
      [`tab2Data[${e.currentTarget.dataset.index}].avatar`]:'/imgs/common/104-104@2x.png'
    })
  },
  imageloaderror3:function(e){
    this.setData({
      [`tab3Data[${e.currentTarget.dataset.index}].avatar`]:'/imgs/common/104-104@2x.png'
    })
  },
  imageloaderror4: function (e) {
    this.setData({
      [`tab5Data[${e.currentTarget.dataset.index}].avatar`]: '/imgs/common/104-104@2x.png'
    })
  },
  tabchange: function(e) {
    this.setData({
      selectedTabIndex: e.detail.value
    });
    this.initPageParam();
    this.enroll();
  },
  toEnrollNew1:function(e){
    wx.setStorage({
      key: 'enroll_stu',
      data: e.currentTarget.dataset.stu,
      success: function(res) {
        wx.navigateTo({
          url: './enroll_renew/enroll_renew?title=续费',
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  toEnrollNew2: function (e) {
    wx.setStorage({
      key: 'enroll_stu',
      data: e.currentTarget.dataset.stu,
      success: function (res) {
        wx.navigateTo({
          url: './enroll_renew/enroll_renew?title=补费',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  toEnrollNew3: function (e) {
    wx.setStorage({
      key: 'enroll_stu',
      data: e.currentTarget.dataset.stu,
      success: function (res) {
        wx.navigateTo({
          url: './enroll_renew/enroll_renew?title=退费',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //根据tab获取显示的数据
  enroll: function() {
    let tab = this.data.selectedTabIndex + 1;
    tab = tab==4?5:tab;
    this.data.searchParam.inputVal = this.data.inputVal;
    this.data.searchParam.offset = this.data.offset;
    this.data.searchParam.limit = this.data.limit;
    this.data.searchParam.inputVal = this.data.inputVal;
    this.data.searchParam.offset = this.data.offset;
    this.data.searchParam.tab = tab;
    network.request("/manage/enroll", this.data.searchParam,
      res => {
        if (res.status == 1) {
          //对一些tab的数据做预处理
          if(tab==5){
            res.data.forEach(d=>{
              d.createDt_ = util.formatTime(new Date(d.createDt*1000)).substr(0,10);
            });
          }
          res.data.forEach(d => {
            d.avatar = util.filterImgUrl(d.avatar) || "/imgs/common/104-104@2x.png";
          });
          console.log(res.data)
          if (res.data.length > 0) {
            let data = {};
            console.log(this.data["tab" + tab + "Data"]);
            data["tab" + tab + "Data"] = this.data["tab" + tab + "Data"].concat(res.data);
            data["offset"] = this.data.offset + this.data.limit;
            this.setData(data);
          } else {
            this.setData({
              isLoad: false
            });
          }
        } else {
          wx.showToast({
            title: '获取数据失败',
            icon: 'none'
          })
        }
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
    if (this.data.isLoad) {
      this.enroll();
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})