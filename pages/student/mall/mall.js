let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['商城', '积分记录', '订单记录'],
    selectedTabIndex: 0
  },

  //改变tab
  changeTab: function (event) {
    let tabIndex = event.detail.value;
    this.setData({
      selectedTabIndex: tabIndex
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_goods_category();
    this.get_campus();
  },

  onShow: function () {
    this.get_goods_list();
    this.stu_score_list();
    this.get_stu_order_list();
  },
  get_campus: function () {
    network.requestLoading('/user/get_campus_list', {}, "", res => {
      if (res.status == 1) {
        this.setData({
          campus: res.data
        })
      }
    }, error => {

    })
  },
  //获取商品列表
  get_goods_list: function (e) {
    let params = {};
    if (e && e.detail.value) {
      params.nameLike = e.detail.value;
    }
    if (this.data.goods_category_index>=0){
      params.goodsCategory = this.data.goods_category[this.data.goods_category_index].id
    }
    network.requestLoading('/user/get_goods_list', params, this.data.goods_list ? "" : "努力加载中...", res => {
      if (res.status == 1) {
        res.data.forEach(goods => {
          if (goods.imgfiles) {
            goods.imgfiles = goods.imgfiles.split(",").filter(imgfile => {
              return imgfile ? true : false;
            })
            goods.imgfiles.forEach((e, index) => {
              goods.imgfiles[index] = {
                img: network.img_url + e
              }
            })
          } else {
            goods.imgfiles = []
          }
          if (goods.vodfiles) {
            goods.vodfiles = goods.vodfiles.split(",").filter(vodfile => {
              return vodfile ? true : false;
            })
            goods.vodfiles.forEach((e, index) => {
              goods.vodfiles[index] = {
                img: network.vod_url + e + "?vframe/jpg/offset/0/w/640",
                video: network.vod_url + e
              }
            })
          } else {
            goods.vodfiles = []
          }
          goods.attachments = goods.imgfiles.concat(goods.vodfiles);
          goods.logPic = util.filterImgUrl(goods.logPic) || "/imgs/common/216-164@2x.png";
          if (goods.buyType == 0) {
            goods.val = '￥' + goods.price;
          } else if (goods.buyType == 1) {
            goods.val = goods.score + '积分';
          }
        })
        this.setData({
          goods_list: res.data
        })
        if (res.data.length==0){
          util.toast("暂无商品")
        }
      } else {
        util.toast('获取数据失败');
      }
    }, error => {
      util.toast('获取数据失败');
    })
  },

  //头像加载失败时
  errorImg: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      [`goods_list[${index}].logPic`]: "/imgs/common/216-164@2x.png"
    })
  },
  //商品分类
  get_goods_category: function (e) {
    network.requestLoading('/manage/get_goods_category', {}, "", res => {
      if (res.status == 1) {
        this.setData({
          goods_category: res.data
        })
      } else {

      }
    }, error => {

    })
  },
  //积分管理
  stu_score_list: function (e) {
    let params = {};
    if (e && e.detail.value) {
      params.allLike = e.detail.value;
    }
    network.requestLoading('/user/stu_score_list', params, "", res => {
      if (res.status == 1) {
        res.data.scoreList.forEach(e=>{
          e.createDt_ = util.formatTime(new Date(e.createDt * 1000)).substr(0, 16);
        })
        this.setData({
          stu_score_list: res.data.scoreList,
          allScore: res.data.allScore
        });
      } else {
        util.toast(res.message || '获取数据失败');
      }
    }, error => {
      util.toast('网络请求失败');
    })
  },
  //学员订单列表
  get_stu_order_list: function (buyType) {
    let params = { buyType: buyType};
    network.requestLoading('/user/stu_order_list', params, "", res => {
      if (res.status == 1) {
        res.data.forEach(e => {
          e.createDt_ = util.formatTime(new Date(e.createDt * 1000)).substr(0, 16); 
          e.handleDt_ = util.formatTime(new Date(e.handleDt * 1000)).substr(0, 16); 
          if (e.buyType == 0) {
            e.val = '￥' + e.price;
          } else if (e.buyType == 1) {
            e.val = e.score + '积分';
          }
        })
        this.setData({
          ["stu_order_list"]: res.data
        })
      } else {
        util.toast(res.message || '获取数据失败');
      }
    }, error => {
      util.toast('网络请求失败');
    })
  },
  toDetail: function (e) {
    wx.navigateTo({
      url: '/pages/student/mall/detail/detail?goodsId=' + e.currentTarget.dataset.course.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  }
})