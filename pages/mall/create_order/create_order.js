let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number_: 1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.data){
      let data = JSON.parse(options.data);
      this.setData(JSON.parse(options.data))
    }
    this.get_member_stu();
  },
  add: function() {
    if (this.data.number_ == this.data.restrictNum) {
      util.toast("限购" + this.data.number_ + "件")
      return
    }
    this.setData({
      number_: this.data.number_ + 1
    })
  },
  member_stu_index_change:function(e){
    let index=e.detail.index;
    if (index>=0){
      this.setData({
        campusName: this.data.member_stu[index].campusName
      })
    }else{
      this.setData({
        campusName:""
      })
    }
  },
  get_member_stu: function() {
    network.requestLoading('/manage/get_member_stu', {}, "", res => {
      if (res.status == 1) {
        this.setData({
          member_stu: res.data
        })
      }
    }, error => {

    })
  },
  add_goods_order: function () {
    if (this.data.member_stu_index == undefined) {
      util.toast("请选择学员")
      return
    }
    if (this.data.number_==0){
      util.toast("请输入购买数量")
      return
    }
    let params = {
      "studentId": this.data.member_stu[this.data.member_stu_index].id,
      "campusId": this.data.member_stu[this.data.member_stu_index].campusId,
      "orderFromId":this.data.id,
      "buyNum": this.data.number_,
      "buyType": this.data.buyType
    }
    network.requestLoading('/manage/add_goods_order', params, "", res => {
      if (res.status == 1) {
        util.toast(res.message||"操作成功",true)
      } else {
        util.toast(res.message || "操作失败")
      }
    }, error => {
      util.toast("请求网络失败")
    })
  },
  reduce: function() {
    let number_ = this.data.number_ - 1;
    this.setData({
      number_: number_ < 1 ? 1 : number_
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