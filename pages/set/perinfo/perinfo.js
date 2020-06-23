var network = require('../../../utils/network.js')
var util = require('../../../utils/util.js')
// pages/set/perinfo/perinfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    name: "",
    avatar_: "",
    avatar: "",
    sex: 0,
    campus: "",
    array: ["女","男"]
  },

  //头像加载失败时
  errorImg: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      "avatar_": "/imgs/common/104-104@2x.png"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    network.request(
      "/manage/member_info", {},
      res => {
        if (res.status == "1") {
          this.setData({
            id: res.data.id,
            avatar_: util.filterImgUrl(res.data.avatar) || "/imgs/common/104-104@2x.png",
            name: res.data.name,
            sex: res.data.sex,
            campus: res.data.campus,
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
  saveMess: function() {
    network.request(
      "/manage/modify_member_info", {
        "name": this.data.name,
        "avatar": this.data.avatar,
        "sex": this.data.sex,
        "memberId": this.data.id
      },
      res => {
        if (res.status == "1") {
          wx.showToast({
            title: res.message,
            icon: "none",
            duration: 2000,
            complete: wx.navigateBack({})
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
  changeavatar: function() {
    util.chooseImgUpload(res => {
      this.setData({
        avatar_: res.imageURL,
        avatar: res.key
      })
    }, error => {
      util.toast("上传图片失败：" + JSON.stringify(error));
    });
  },
  bindPickerChange: function(e) {
    this.setData({
      sex: e.detail.value
    })
  },
  bindKeyInput: function(event) {
    var dataname = event.currentTarget.dataset.dataname;
    this.setData({
      [dataname]: event.detail.value
    })
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