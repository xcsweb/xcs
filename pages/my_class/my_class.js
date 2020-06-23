var network = require('../../utils/network.js')
var util = require('../../utils/util.js')
// pages/my_class/my_class.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_url: network.img_url,
    filterParam: [],
    searchParam: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },
  onShow:function(){
    let me = this;
    network.filterInfo(
      { campus: 1, stopClassStatus: 1, isAllData: 1 },
      function (data) {
        me.setData(data);
        me.listPage();
      }
    );
  },
  listPage: function() {
    this.data.searchParam.inputVal = this.data.inputVal;
    network.request(
      "/manage/cls_list_page", this.data.searchParam,
      res => {
        if (res.status == "1") {
          res.data.rows.forEach(item => {
            item.logPic = util.filterImgUrl(item.logPic) || "/imgs/common/190_190.png";
            item.startDt = util.formatTime(new Date(item.startDt * 1000)).slice(0, 11);
            item.endDt = util.formatTime(new Date(item.endDt * 1000)).slice(0, 11);
          })
          this.setData({
            listData: res.data
          })
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
      this.listPage()
    }
  },
  onGoto: function(event) {
    var id = event.currentTarget.dataset.classesid
    wx.navigateTo({
      url: "/pages/my_class/class_detail/class_detail?id=" + id
    })
  }
})