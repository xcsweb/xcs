let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')
var WxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData(options);
    this.weike_detail();
  },

  //文章列表
  weike_detail: function(e) {
    let params = {
      "weikeId": this.data.weikeId
    };
    network.requestLoading('/manage/weike_detail', params, "", res => {
      if (res.status == 1) {
        res.data.weikeDetail.createDt_ = util.formatTime(new Date(res.data.weikeDetail.createDt * 1000), "/").substr(0, 10);
        if (res.data.weikeDetail.imgs) {
          res.data.weikeDetail.imgs = res.data.weikeDetail.imgs.split(",").filter(imgfile => {
            return imgfile ? true : false;
          })
          res.data.weikeDetail.imgs.forEach((e, index) => {
            res.data.weikeDetail.imgs[index] = {
              img: network.img_url + e
            }
          })
        } else {
          res.data.weikeDetail.imgs = []
        }
        res.data.commentList.forEach(comment => {
          comment.avatar = util.filterImgUrl(comment.avatar) || "/imgs/common/140-140@2x.png"
          comment.createDt_ = util.formatTime(new Date(comment.createDt * 1000), "/").substr(0, 10);
        });
        WxParse.wxParse('wxParse', 'html', res.data.weikeDetail.content, this, 5);
        this.setData(res.data)
      } else {
        util.toast('获取数据失败');
      }
    }, error => {
      util.toast('获取数据失败');
    })
  },

  weike_zan: function(e) {
    let url = '/manage/weike_zan';
    let params = {
      "weikeId": this.data.weikeDetail.weikeId
    };
    if (this.data.weikeDetail.isZan == 1) {
      //已经赞过
      util.toast('你已经赞过啦');
      return;
    }
    network.requestLoading(url, params, "", res => {
      if (res.status == 1) {
        util.toast(res.message || '操作成功');
        this.setData({
          [`weikeDetail.isZan`]: 1,
          [`weikeDetail.zan`]: this.data.weikeDetail.zan + 1,
        })
      } else {
        util.toast(res.message || '操作失败');
      }
    }, error => {
      util.toast('操作失败');
    })
  },


  weike_comment_zan: function(e) {
    let index = e.currentTarget.dataset.index;
    let url = '/manage/weike_comment_zan';
    let params = {
      "commentId": this.data.commentList[index].commentId
    };
    if (this.data.commentList[index].isZan == 1) {
      //已经赞过
      util.toast('你已经赞过啦');
      return;
    }
    network.requestLoading(url, params, "", res => {
      if (res.status == 1) {
        util.toast(res.message || '操作成功');
        this.setData({
          [`commentList[${index}].isZan`]: 1,
          [`commentList[${index}].zan`]: this.data.commentList[index].zan + 1
        })
      } else {
        util.toast(res.message || '操作失败');
      }
    }, error => {
      util.toast('操作失败');
    })
  },

  weike_comment: function(e) {
    if (!this.data.content) {
      util.toast("请输入评论内容");
      return
    }
    let url = '/manage/weike_comment';
    let params = {
      "wid": this.data.weikeDetail.weikeId,
      content: this.data.content
    };
    network.requestLoading(url, params, "", res => {
      if (res.status == 1) {
        util.toast(res.message || '操作成功');
        this.setData({
          content: ""
        });
        this.weike_detail();
      } else {
        util.toast(res.message || '操作失败');
      }
    }, error => {
      util.toast('操作失败');
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