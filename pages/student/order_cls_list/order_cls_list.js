let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    this.setData({
      img_url: wx.getStorageSync("img_url"),
      vod_url: wx.getStorageSync("vod_url"),
      day: Math.floor(date.getTime() / 1000)
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.get_campus_list(true);
  },
  campus_listChange: function(e) {
    this.setData({
      campus_listIndex: e.detail.value
    });
    this.get_clshour_list(this.data.campus_list[e.detail.value].id, this.data.btnIndex + 1, this.data.day)
  },
  datechange: function(e) {
    this.setData({
      day: e.detail.seconds
    });
    this.get_clshour_list(this.data.campus_list[this.data.campus_listIndex || 0].id, this.data.btnIndex + 1, this.data.day)
  },
  toDetail: function(e) {
    wx.navigateTo({
      url: '../order_cls_detail/order_cls_detail?id=' + e.currentTarget.dataset.id + "&classType=" + (this.data.btnIndex + 1),
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //获取校区列表
  get_campus_list: function(init) {
    network.request("/user/get_campus_list", {},
      res => {
        if (res.status == 1) {
          console.log(res.data)
          this.setData({
            campus_list: res.data
          });
          if (init && res.data[0]) {
            this.get_clshour_list(this.data.campus_list[this.data.campus_listIndex || 0].id, this.data.btnIndex + 1, this.data.day);
          }
          if (res.data.length == 0) {
            util.toast("无校区")
          }
        } else {
          util.toast("获取数据失败")
        }
      },
      error => {
        util.toast("获取数据失败")
      });
  },
  //获取课程列表
  // classType：1团课 2私教
  get_clshour_list: function(campusId, classType, day) {
    network.request("/user/get_clshour_list", {
        "campusId": campusId,
        "classType": classType,
        day: day
      },
      res => {
        if (res.status == 1) {
          console.log(res.data)
          res.data.forEach(cls => {
            cls.logPic = util.filterImgUrl(cls.logPic) || "/imgs/common/216-164@2x.png";
            if (cls.startTime){
              cls.startTime = cls.startTime.substr(0,5);
            }
            if (cls.endTime) {
              cls.endTime = cls.endTime.substr(0, 5);
            }
            if (cls.bespokeStatus == 1) {
              if (cls.bespeakNum > cls.studentNum) {
                cls.statusStr = '可预约';
                cls.statusColor = '#FEA8A8';
              } else if (cls.lineupNum > cls.studentLineupNum) {
                cls.statusStr = '可排队';
                cls.statusColor = '#DDC5FF';
              }
            } else if (cls.bespokeStatus == 2) {
              cls.statusStr = '不可预约';
              cls.statusColor = '#DDC5FF';
            } else if (cls.bespokeStatus == 3) {
              cls.statusStr = '已过期'; 
              cls.statusColor = '#969696';
            }
          })
          this.setData({
            [`clshour_list${this.data.btnIndex}`]: res.data
          }); 
          if (res.data.length == 0) {
            util.toast("当前校区没有可预约的课程")
          }
        } else {
          util.toast("获取数据失败")
        }
      },
      error => {
        util.toast("获取数据失败")
      });
  },
  btnIndex: function(e) {
    this.setData({
      btnIndex: Number.parseInt(e.currentTarget.dataset.index)
    })
    this.get_clshour_list(this.data.campus_list[this.data.campus_listIndex || 0].id, this.data.btnIndex + 1, this.data.day)
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})