let network = require('../../../../utils/network.js')
let util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1,
    number_: 1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData(options)
  },

  onShow: function() {
    this.get_goods_detail();
  },

  swiperChange: function(e) {
    this.setData({
      current: e.detail.current + 1
    })
  },
  add: function() {
    if (this.data.number_ == this.data.data.restrictNum) {
      util.toast("限购" + this.data.number_ + "件")
      return
    }
    this.setData({
      number_: this.data.number_ + 1
    })
  },

  reduce: function() {
    let number_ = this.data.number_ - 1;
    this.setData({
      number_: number_ < 1 ? 1 : number_
    })
  },
  get_campus: function() {
    network.requestLoading('/user/get_campus_list', {}, "", res => {
      if (res.status == 1) {
        this.setData({
          campus: res.data
        })
      }
    }, error => {

    })
  },
  add_goods_order: function() {
    if (this.data.campusIndex == undefined) {
      util.toast("请选择校区")
      return
    }
    if (this.data.number_ <= 0) {
      util.toast("请输入购买数量")
      return
    }
    let params = {
      "campusId": this.data.campus[this.data.campusIndex].id,
      "orderFromId": this.data.data.id,
      "buyNum": this.data.number_,
      "buyType": this.data.data.buyType
    }
    network.requestLoading('/user/add_goods_order', params, "", res => {
      if (res.status == 1) {
        util.toast(res.message || "操作成功", true)
      } else {
        util.toast(res.message || "操作失败")
      }
    }, error => {
      util.toast("请求网络失败")
    })
  },
  get_goods_detail: function(e) {
    let params = {
      "goodsId": this.data.goodsId || 1
    }
    network.requestLoading('/user/get_goods_detail', params, "", res => {
      if (res.status == 1) {
        this.handleData(res);
      } else {
        util.toast(res.message || '操作失败');
      }
    }, error => {
      this.handleData();
      util.toast('网络错误');
    })
  },
  handleData: function(res) {
    if (res.data.imgfiles) {
      res.data.imgfiles = res.data.imgfiles.split(",").filter(imgfile => {
        return imgfile ? true : false;
      })
      res.data.imgfiles.forEach((e, index) => {
        res.data.imgfiles[index] = {
          img: util.filterImgUrl(e) || "/imgs/common/190_190.png"
        }
      })
    } else {
      res.data.imgfiles = [{ img: "/imgs/common/190_190.png" }]
    }
    if (res.data.vodfiles) {
      res.data.vodfiles = res.data.vodfiles.split(",").filter(vodfile => {
        return vodfile ? true : false;
      })
      res.data.vodfiles.forEach((e, index) => {
        res.data.vodfiles[index] = {
          img: ((e && e.startsWith("http")) ? e : network.img_url + e) + "?vframe/jpg/offset/0/w/640",
          video: ((e && e.startsWith("http")) ? e : network.vod_url + e)
        }
      })
    } else {
      res.data.vodfiles = []
    }
    res.data.attachments = res.data.imgfiles.concat(res.data.vodfiles);
    res.data.logPic = ((res.data.logPic && res.data.logPic.startsWith("http")) ? res.data.logPic : network.img_url + res.data.logPic);
    res.data.startDt_ = util.formatTime(new Date(res.data.startDt * 1000)).substr(0, 16);
    res.data.endDt_ = util.formatTime(new Date(res.data.endDt * 1000)).substr(0, 16);
    if (res.data.buyType == 0) {
      res.data.val = '￥' + res.data.price;
      res.data.buyBtnText = "购买";
      res.data.buyTypeTxt = "购";
    } else if (res.data.buyType == 1) {
      res.data.val = res.data.score + '积分';
      res.data.buyBtnText = "积分兑换";
      res.data.buyTypeTxt = "兑";
    }
    this.setData({
      data: res.data,
      campus: res.data.campusList
    })
  },
  //
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
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