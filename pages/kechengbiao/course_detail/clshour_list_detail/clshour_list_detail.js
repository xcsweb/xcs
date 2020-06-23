let network = require('../../../../utils/network.js')
let util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    attachments: [{
      img: "https://www.baidu.com/img/baidu_jgylogo3.gif"
    }],
    fbdisabled: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData(options)
    this.clshour_studenttask_detail()
  },

  clshour_studenttask_detail: function() {
    network.request("/manage/clshour_studenttask_detail", {
        "studentTaskCompleteId": this.data.id || "57"
      }, res => {
        if (res.status == 1) {
          res.data = res.data[0];
          if (res.data.imgfiles) {
            res.data.imgfiles = res.data.imgfiles.split(",").filter(imgfile => {
              return imgfile ? true : false;
            })
            res.data.imgfiles.forEach((e,index) => {
              res.data.imgfiles[index]= {
                img: network.img_url + e
              }
            })
          }
          if (res.data.vodfiles) {
            res.data.vodfiles = res.data.vodfiles.split(",").filter(vodfile => {
              return vodfile ? true : false;
            })
            res.data.vodfiles.forEach((e, index) => {
              res.data.vodfiles[index] = {
                img: network.vod_url + e + "?vframe/jpg/offset/0/w/640",
                video: network.vod_url + e
              }
            })
          }
          this.setData({
            clshour_studenttask_detail: res.data
          });
          if (res.data.length == 0) {
            util.toast("获取数据失败")
          }
        } else {
          util.toast(res.message || "获取数据失败")
        }
      },
      error => {
        util.toast("获取数据失败")
      });
  },

  clshour_studenttask_add_feedback: function() {
    if (!this.data.rating) {
      util.toast("请评分")
      return
    }
    if (!this.data.evalute) {
      util.toast("请输入内容")
      return
    }
    this.setData({
      fbdisabled: true
    });
    network.request("/manage/clshour_studenttask_add_feedback", {
        "studentTaskCompleteId": this.data.id,
        "feedback": this.data.evalute,
        "performance": this.data.rating
      }, res => {
      
        if (res.status == 1) {
          util.toast(res.message || "评分成功", true)
        } else {
          this.setData({
            fbdisabled: false
          });
          util.toast(res.message || "操作失败")
        }
      },
      error => {
        this.setData({
          fbdisabled: false
        });
        util.toast("操作失败")
      });
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