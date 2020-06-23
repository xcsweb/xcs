let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData(options)
  },

  onShow: function () {
    this.get_goods_detail();
  },

  swiperChange: function (e) {
    this.setData({
      current: e.detail.current + 1
    })
  },
  create_order:function(){
    let data = {
      "id": 1,
      "name": "鼠标",
      "logPic": "logo图片",
      "price": 300,
      "num": 300,
      "buyNum": 1,
      "buyType": "1",
      "score": 6000,
      "restrictNum": 2,
      "val":""
    };
    for (let key in data){
      data[key]=this.data.data[key]
    }
    wx.navigateTo({
      url: '/pages/mall/create_order/create_order?data='+JSON.stringify(data),
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  get_goods_detail: function (e) {
    let params = {
      "goodsId": this.data.goodsId || 1
    }
    network.requestLoading('/manage/get_goods_detail', params, "", res => {
      if (res.status == 1) {
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
          res.data.imgfiles = [{ img: "/imgs/common/190_190.png"}]
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
        } else {
          res.data.vodfiles = []
        }
        res.data.attachments = res.data.imgfiles.concat(res.data.vodfiles);
        res.data.logPic = network.img_url + res.data.logPic;
        if (res.data.buyType == 0) {
          res.data.val = '￥' + res.data.price;
        } else if (res.data.buyType == 1) {
          res.data.val = res.data.score + '积分';
        }
        this.setData({
          data: res.data
        })
      } else {
        util.toast(res.message || '操作失败');
      }
    }, error => {
      util.toast('网络错误');
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
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