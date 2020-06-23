let network = require('../../utils/network.js')
let util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1,
    selectedTabIndex: 0,
    category: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.weike_list();
  },
  //改变分类
  changeCategory: function(e) {
    let category = e.currentTarget.dataset.cat;
    if (!this.data.category.cid || this.data.category.cid != category.cid) {
      this.setData({
        category: category
      })
    } else {
      this.setData({
        category: {}
      })
    }
    this.weike_list();
  },
  //文章列表
  weike_list: function(e) {
    let params = {};
    if (e && e.detail.value) {
      params.nameLike = e.detail.value;
    }
    if (this.data.category) {
      params.cid = this.data.category.cid;
    }
    if (this.data.selectedTabIndex == 1) {
      params.iscollect = 1;
    }
    network.requestLoading('/manage/weike_list', params, this.data.weikeList ? "" : "努力加载中...", res => {
      if (res.status == 1) {
        res.data.weikeList.forEach(weike => {
          weike.createDt_ = util.formatTime(new Date(weike.createDt * 1000), "/").substr(0, 10);
          weike.imgs = util.filterImgUrl(weike.imgs) ||"/imgs/common/216-164@2x.png";
        })
        res.data.imgs = [];
        res.data.weikeCategoryList.forEach(weikeCategory => {
          if (weikeCategory.imgs) {
            weikeCategory.imgs = weikeCategory.imgs.split(",").filter(imgfile => {
              return imgfile ? true : false;
            })
            weikeCategory.imgs.forEach((e, index) => {
              weikeCategory.imgs[index] = {
                img: util.filterImgUrl(e) || "/imgs/common/216-164@2x.png"
              }
            })
          } else {
            weikeCategory.imgs = []
          }
          res.data.imgs = res.data.imgs.concat(weikeCategory.imgs);
        })
        this.setData(res.data)
      } else {
        util.toast('获取数据失败');
      }
    }, error => {
      util.toast('获取数据失败');
    })
  },
  weike_zan: function(e) {
    let index = e.currentTarget.dataset.index;
    let url = '/manage/weike_zan';
    let params = {
      "weikeId": this.data.weikeList[index].weikeId
    };
    if (this.data.weikeList[index].isZan == 1) {
      //已经赞过
      util.toast('你已经赞过啦');
      return;
    }
    network.requestLoading(url, params, "", res => {
      if (res.status == 1) {
        util.toast(res.message || '操作成功');
        this.setData({
          [`weikeList[${index}].isZan`]: 1
        })
      } else {
        util.toast(res.message || '操作失败');
      }
    }, error => {
      util.toast('操作失败');
    })
  },
  weike_collect: function(e) {
    let index = e.currentTarget.dataset.index;
    let url = '/manage/weike_collect';
    let params = {
      "wid": this.data.weikeList[index].weikeId
    };
    if (this.data.weikeList[index].iscollect == 1) {
      //已经赞过
      util.toast('你已经收藏过啦');
      return;
    }
    network.requestLoading(url, params, "", res => {
      if (res.status == 1) {
        util.toast(res.message || '操作成功');
        this.setData({
          [`weikeList[${index}].iscollect`]: 1
        })
      } else {
        util.toast(res.message || '操作失败');
      }
    }, error => {
      util.toast('操作失败');
    })
  },
  share: function() {

  },
  toDetail: function(e) {
    wx.navigateTo({
      url: '/pages/weike/detail/detail?weikeId=' + e.currentTarget.dataset.id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  swiperChange: function(e) {
    this.setData({
      current: e.detail.current + 1
    })
  },
  //改变tab
  changeTab: function(event) {
    this.setData({
      selectedTabIndex: event.detail.value
    });
    this.weike_list();
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