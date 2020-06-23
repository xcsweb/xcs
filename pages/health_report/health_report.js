let network = require('../../utils/network.js')
let util = require('../../utils/util.js')

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
  onShow: function() {
    this.get_healthy_report_list();
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
      this.get_healthy_report_list()
    }
  },
  getFilter: function() {
    network.request(
      "/manage/filter_option", {
        campus: {
          "relation": 2
        },
        classes: 1
      },
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
      function(err) {
        console.log(err)
      }
    )
  },
  get_healthy_report_list: function() {
    this.data.searchParam.inputVal = this.data.inputVal;
    this.data.searchParam.offset = this.data.offset;
    this.data.searchParam.limit = this.data.limit;
    network.request('/manage/get_healthy_report_list', this.data.searchParam, res => {
      if (res.status == 1) {
        res.data.forEach(e => {
          e.avatar = util.filterImgUrl(e.avatar) || "/imgs/common/104-104@2x.png";
        })
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
        util.toast(res.message || "获取数据失败")
      }
    }, error => {
      util.toast("连接服务器失败")
    })
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
  onReachBottom: function() {
    if (this.data.isLoad) {
      this.get_healthy_report_list();
    }
  },
  toDetail: function(e) {
    wx.navigateTo({
      url: './report_list/report_list?studentId=' + e.currentTarget.dataset.id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
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