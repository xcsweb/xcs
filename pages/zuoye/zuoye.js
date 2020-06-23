var network = require('../../utils/network.js')
var util = require('../../utils/util.js')
// pages/zuoye/zuoye.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    offset: network.offset,
    limit: network.limit,
    filterParam: [],
    searchParam: {},
  },
  inputTyping: function() {

  },
  imageError: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      [`list[${index}].avatar`]: util.filterLocalImgUrl("common/104-104@2x.png")
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getFilter();
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
    this.setData({
      list: [],
      offset: network.offset,
      limit: network.limit,
    });
    this.listData();
  },
  listData: function () {
    let url = '/manage/studenttask_manage_list';
    let params = {
      offset: this.data.offset,
      limit: this.data.limit,
    campusId: "5",
      inputVal: this.data.inputVal,
      area_num: this.data.searchParam.areaNum ? this.data.searchParam.areaNum : "",
      campusId: this.data.searchParam.campusId ? this.data.searchParam.campusId:"",
      startDt: this.data.searchParam.beginFDt ? this.data.searchParam.beginFDt : "",
      endDt: this.data.searchParam.endFDt ? this.data.searchParam.endFDt : "",
    };
    network.requestLoading(url, params, "", res => {
      if (res.status == 1) {
        res.data.forEach(e => {
          e.avatar = util.filterImgUrl(e.avatar) || util.filterLocalImgUrl("common/104-104@2x.png");
          console.log(e.avatar )
        })
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].createDt = util.formatTime(new Date(res.data[i].createDt * 1000)).split(" ")[0]
        }
        this.setData({
          list: this.data.list.concat(res.data),
          offset: this.data.offset + this.data.limit
        })
      } else {
        util.toast(res.message || '查询失败');
      }
    }, error => {
      util.toast('查询失败');
    })
  },
  inputTyping: function (e) {
    console.log(e)
    if (e.detail) {
      this.setData({
        inputVal: e.detail.value ? e.detail.value : "",
      });
      if (e.detail.searchParam) {
        this.setData({
          searchParam: e.detail.searchParam,
        });
      }
    }
    this.onShow();
  },
  getFilter: function () {
    network.request(
      "/manage/filter_option", { campus: { "area_num": 1 },  date: 1 },
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
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },
  toDetail: function (e) {
    wx.navigateTo({
      url: '/pages/kechengbiao/course_detail/clshour_list_detail/clshour_list_detail?id=' + e.currentTarget.dataset.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
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
    this.listData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})