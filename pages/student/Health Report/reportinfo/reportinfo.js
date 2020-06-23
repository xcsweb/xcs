
let network = require('../../../../utils/network.js')
let util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    day_: '',
    listinfo: [],
    tpsRecord: [],
     img_url: network.img_url,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let id = options.id
    this.setData({
      id: id
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.stu_tps_record_detail();
  },
  stu_tps_record_detail: function (e) {
    let studentTpsid = this.data.id
    console.log(studentTpsid)
    network.request("/user/stu_tps_record_detail", { "studentTpsId": studentTpsid },
      res => {
        if (res.status == 1) {
          res.data.studentTpsInfo.day_ = util.formatTime(new Date(res.data.studentTpsInfo.createDt * 1000)).substr(0, 10);
          res.data.studentTpsInfo.studentIcon = util.filterImgUrl(res.data.studentTpsInfo.studentIcon) || "/imgs/common/140-140@2x.png";;
          let listinfo = res.data.studentTpsInfo
          let day_ = res.data.studentTpsInfo.day_
          let tpsRecord = res.data.tpsRecord
          this.setData({
            day_: day_,
            listinfo: listinfo,
            tpsRecord: tpsRecord
          })
        }
      },
      error => {
        util.toast("获取数据失败")
      });

  },
  //头像加载失败时
  errorImg: function (e) {
    this.setData({
      [`listinfo.studentIcon`]: "/imgs/common/140-140@2x.png"
    })
  },
  lookAdvice: function () {
    util.toast(`查看具体结果分析请联系机构`)
    return
    let id = this.data.id
    wx.navigateTo({
      url: '../advice/advice?id=' + id
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})