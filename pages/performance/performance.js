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
    this.member_performance_memberlist();
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
      this.member_performance_memberlist()
    }
  },
  getFilter: function () {
    network.request(
      "/manage/filter_option", { campus: 1, trainCate: 1 },
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
  member_performance_memberlist: function() {
    this.data.searchParam.inputVal = this.data.inputVal;
    this.data.searchParam.offset = this.data.offset;
    this.data.searchParam.limit = this.data.limit;
    network.request('/manage/member_performance_memberlist', this.data.searchParam,
      res => {
        if (res.status == 1) {
          res.data.forEach((member,index)=>{
            if(index%3==0){
              member.bg ='#756BFF';
            } else if (index % 3 == 1) {
              member.bg = '#FFBF79';
            } else if (index % 3 == 2) {
              member.bg = '#8DC8FF';
            }
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
          util.toast(res.message || '获取数据失败')
        }
      }, 
      error => {
        util.toast('网络请求失败')
      }
    );
  },
  toDetail: function(e) {
    wx.navigateTo({
      url: '/pages/performance/detail/detail?memberId=' + this.data.list[e.currentTarget.dataset.index].id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isLoad) {
      this.member_performance_memberlist();
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