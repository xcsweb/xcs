let network = require('../../utils/network.js')
let util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['商城', '积分管理', '学员订单'],
    selectedTabIndex: 0,
  },

  //改变tab
  changeTab: function(event) {
    let tabIndex = event.currentTarget.dataset.tabindex;
    this.setData({
      selectedTabIndex: tabIndex
    });
    this.searchbarInput(event);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.get_goods_category();
  },

  onShow: function() {
    this.initPageParam();
    this.searchbarInput();
  },
  initPageParam: function () {
    this.setData({
      goods_list: [],
      goods_offset: network.offset,
      goods_limit: network.limit,
      goods_isLoad: true,
      stu_score_list: [],
      stu_score_offset: network.offset,
      stu_score_limit: network.limit,
      stu_score_isLoad: true,
      stu_order_list: [],
      stu_order_offset: network.offset,
      stu_order_limit: network.limit,
      stu_order_isLoad: true,
    });
  },
  searchbarInput: function(e) {
    switch (this.data.selectedTabIndex) {
      case 0:
        if (this.data.goods_list.length==0){
          this.get_goods_list(e);
        }
        break;
      case 1:
        if (this.data.stu_score_list.length == 0) {
          this.stu_score_list(e);
        }
        break;
      case 2:
        if (this.data.stu_order_list.length == 0) {
          this.get_stu_order_list(e);
        }
        break;
    }
  },
  score_records:function(e){
    let stu_score=this.data.stu_score_list[e.currentTarget.dataset.index];
    wx.navigateTo({
      url: '/pages/mall/score_records/score_records?studentId=' + stu_score.studentId +'&studentName='+stu_score.studentName,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  score_add: function (e) {
    let stu_score = this.data.stu_score_list[e.currentTarget.dataset.index];
    wx.navigateTo({
      url: '/pages/mall/score_add/score_add?studentId=' + stu_score.studentId + '&studentName=' + stu_score.studentName,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  score_reduce: function (e) {
    let stu_score = this.data.stu_score_list[e.currentTarget.dataset.index];
    wx.navigateTo({
      url: '/pages/mall/score_reduce/score_reduce?studentId=' + stu_score.studentId + '&studentName=' + stu_score.studentName,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //获取帖子列表
  get_goods_list: function(e) {
    if (!this.data.goods_isLoad) {
      return
    }
    let params = {};
    if (e && e.detail.value) {
      params.nameLike = e.detail.value;
    }
    params.offset = this.data.goods_offset;
    params.limit = this.data.goods_limit;
    network.requestLoading('/manage/get_goods_list', params, this.data.goods_list ? "" : "努力加载中...", res => {
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
        if (res.data.length > 0) {
          this.setData({
            goods_list: this.data.goods_list.concat(res.data),
            goods_offset: this.data.goods_offset + this.data.goods_limit
          });
        } else {
          this.setData({
            goods_isLoad: false
          });
        }
      } else {
        util.toast('获取数据失败');
      }
    }, error => {
      util.toast('获取数据失败');
    })
  },


  //加载失败时
  errorImg2: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      [`goods_list[${index}].logPic`]: "/imgs/common/216-164@2x.png"
    })
  },
  //商品分类
  get_goods_category: function(e) {
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
  stu_score_list: function(e) {
    if (!this.data.stu_score_isLoad) {
      return
    }
    let params = {};
    if (e && e.detail.value) {
      params.allLike = e.detail.value;
    }
    params.offset = this.data.stu_score_offset;
    params.limit = this.data.stu_score_limit;
    network.requestLoading('/manage/stu_score_list', params, "", res => {
      if (res.status == 1) {
        res.data.forEach(e => {
          e.avatar = util.filterImgUrl(e.avatar) || "/imgs/common/104-104@2x.png";
        })
        if (res.data.length > 0) {
          this.setData({
            stu_score_list: this.data.stu_score_list.concat(res.data),
            stu_score_offset: this.data.stu_score_offset + this.data.stu_score_limit
          });
        } else {
          this.setData({
            stu_score_isLoad: false
          });
        }
      } else {
        util.toast(res.message || '获取数据失败');
      }
    }, error => {
      util.toast('网络请求失败');
    })
  },
  //头像加载失败时
  errorImg: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      [`stu_score_list[${index}].avatar`]: "/imgs/common/104-104@2x.png"
    })
  },
  //学员订单列表
  get_stu_order_list: function(e) {
    if (!this.data.stu_order_isLoad) {
      return
    }
    let params = {};
    if (e && e.detail.value) {
      params.allLike = e.detail.value;
    }
    params.offset = this.data.stu_order_offset;
    params.limit = this.data.stu_order_limit;
    network.requestLoading('/manage/get_stu_order_list', params, "", res => {
      if (res.status == 1) {
        res.data.forEach(e => {
          e.createDt_ = util.formatTime(new Date(e.createDt * 1000)).substr(0, 16);
          if (e.buyType == 0) {
            e.val = '￥' + e.price;
          } else if (e.buyType == 1) {
            e.val = e.score + '积分';
          }
        })
        if (res.data.length > 0) {
          this.setData({
            stu_order_list: this.data.stu_order_list.concat(res.data),
            stu_order_offset: this.data.stu_order_offset + this.data.stu_order_limit
          });
        } else {
          this.setData({
            stu_order_isLoad: false
          });
        }
      } else {
        util.toast(res.message || '获取数据失败');
      }
    }, error => {
      util.toast('网络请求失败');
    })
  },

  //发放订单
  send_order: function(e) {
    wx.showModal({
      content: '您确定发放商品吗？',
      success: res => {
        if (res.confirm) {
          network.requestLoading('/manage/send_order', {
            "orderId": e.currentTarget.dataset.orderid
          }, "", res => {
            if (res.status == 1) {
              util.toast(res.message || '操作成功');
              this.get_stu_order_list();
            } else {
              util.toast(res.message || '操作失败');
            }
          }, error => {
            util.toast('网络请求失败');
          })
        }
      }
    })
  },
  //取消订单
  undo_order: function(e) {
    wx.showModal({
      content: '您确定取消订单吗',
      success: res => {
        if (res.confirm) {
          network.requestLoading('/manage/undo_order', {
            "orderId": e.currentTarget.dataset.orderid
          }, "", res => {
            if (res.status == 1) {
              util.toast(res.message || '操作成功');
              this.get_stu_order_list();
            } else {
              util.toast(res.message || '操作失败');
            }
          }, error => {
            util.toast('网络请求失败');
          })
        }
      }
    })
  },
  toDetail: function(e) {
    wx.navigateTo({
      url: '/pages/mall/detail/detail?goodsId=' + e.currentTarget.dataset.course.id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.selectedTabIndex==0){
      this.get_goods_list();
    } else if (this.data.selectedTabIndex == 1) {
      this.stu_score_list();
    } else{
      this.get_stu_order_list();
    }
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

  }
})