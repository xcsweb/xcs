var network = require('../../../utils/network.js')
var util = require('../../../utils/util.js')
// pages/student/my_profile/my_profile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    sex: 0,
    sexarray: ["女", "男"],
    tel: "",
    address: "",
    birthDt: "",
    school: "",
    InstitutionName: "",
    customerServiceTel: "",
    campusList: "",
    avatar: "",
    avatar_: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  },
  myInformation: function(){
    network.request(
      "/user/my_information", {},
      res => {
        if (res.status == "1") {
          console.log(res.data)
          var campus = []
          for (var idx in res.data.campusList) {
            campus.push(res.data.campusList[idx].name)
          }
          var studentLevelInfo = []
          for (var idx in res.data.studentLevelInfo) {
            studentLevelInfo.push({
              examinerName: res.data.studentLevelInfo[idx].examinerName,
              level: res.data.studentLevelInfo[idx].level,
              certNum: res.data.studentLevelInfo[idx].certNum,
              promotionDt: util.formatTime(new Date(res.data.studentLevelInfo[idx].promotionDt * 1000)).slice(0, 11),
              name: res.data.studentLevelInfo[idx].name,
            })
          }
          this.setData({
            name: res.data.name,
            sex: res.data.sex,
            tel: res.data.tel,
            avatar_: util.filterImgUrl(res.data.avatar) || "/imgs/common/140-140@2x.png",
            avatar: res.data.avatar,
            address: res.data.address,
            birthDt: res.data.birthDt > 0 ? util.formatDate(new Date(res.data.birthDt * 1000)).slice(0, 11) : "",
            school: res.data.school,
            InstitutionName: res.data.InstitutionName,
            customerServiceTel: res.data.customerServiceTel,
            campusList: campus.toString(),
            studentLevelInfo: studentLevelInfo
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
  //头像加载失败时
  errorImg: function (e) {
    this.setData({
      [`avatar_`]: "/imgs/common/140-140@2x.png"
    })
  },
  sexchange: function(e) {
    this.setData({
      sex: e.detail.value
    })
  },
  call: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  changeavatar: function() {
    util.chooseImgUpload(res => {
      this.setData({
        avatar_1: res.imageURL,
        avatar1: res.key
      })
    }, error => {
      util.toast("上传图片失败：" + JSON.stringify(error));
    });
  },
  bindDateChange: function(e) {
    this.setData({
      birthDt: e.detail.value
    })
  },
  savemess: function () {
    var birthDt = this.data.birthDt == "" ? this.data.birthDt : util.dateToDayStamp(new Date(this.data.birthDt));
    let params = {
      "avatar": this.data.avatar1||this.data.avatar,
      "address": this.data.address,
      "school": this.data.school,
      "sex": this.data.sex,
      "birthDt": birthDt
    };
    network.request("/user/change_student_info", params,
      res => {
        if (res.status == "1") {
          wx.showToast({
            title: res.message,
            icon: "none",
            duration: 2000
          })
          this.myInformation()
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
    this.myInformation();
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