let network = require('../../utils/network.js')
let util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    visualStatuses: [{
      name: '全部可见',
      visualStatus: 0
    }, {
      name: '班级可见',
      visualStatus: 3
    }, {
      name: '学校可见',
      visualStatus: 2
    }, {
      name: '城市可见',
      visualStatus: 1
    }, {
      name: '个人可见',
      visualStatus: 4
    }],
    post_score: [],
    offset: 0,
    limit: 10,
    post_list: [],
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getStorage({
      key: 'avatar',
      success: res => {
        this.setData({
          avatar: network.img_url + res.data
        })
      },
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#A375FF'
    })
    this.get_post_score_list();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      offset: network.offset,
      limit: network.limit
    })
    this.get_post_list();
  },
  //获取帖子列表
  get_post_list: function() {
    if (this.data.loading) {
      return
    }
    this.setData({
      loading: true
    })
    let url = '/manage/get_post_list';
    network.requestLoading(url, {
      offset: this.data.offset,
      limit: this.data.limit
    }, this.data.post_list ? "" : "努力加载中...", res => {
      this.setData({
        loading: false
      })
      if (res.status == 1) {
        res.data.forEach(post => {
          if (post.imgfiles) {
            post.imgfiles = post.imgfiles.split(",").filter(imgfile => {
              return imgfile ? true : false;
            })
            post.imgfiles.forEach((e, index) => {
              post.imgfiles[index] = {
                img: util.filterImgUrl(e)
              }
            })
          } else {
            post.imgfiles = []
          }
          if (post.vodfiles) {
            post.vodfiles = post.vodfiles.split(",").filter(vodfile => {
              return vodfile ? true : false;
            })
            post.vodfiles.forEach((e, index) => {
              post.vodfiles[index] = {
                img: util.filterVodUrl(e) + "?vframe/jpg/offset/0/w/640",
                video: util.filterVodUrl(e)
              }
            })
          } else {
            post.vodfiles = []
          }
          post.attachments = post.imgfiles.concat(post.vodfiles);
          post.postPraiseList.forEach(postPraise => {
            postPraise.avatar = util.filterImgUrl(postPraise.avatar) || "/imgs/common/104-104@2x.png";
          });
          post.avatar = util.filterImgUrl(post.avatar) || "/imgs/common/104-104@2x.png";
          if (!post.createDt)
            post.createDt = 0;
          post.createDt_ = util.formatTime(new Date(post.createDt * 1000)).substr(0, 16);
        })
        if (this.data.offset == 0) {
          this.setData({
            post_list: res.data,
            offset: this.data.offset + 10
          })
        } else {
          this.setData({
            post_list: this.data.post_list.concat(res.data),
            offset: this.data.offset + 10
          })
        }
      } else {
        util.toast('获取数据失败');
      }
    }, error => {
      this.setData({
        loading: false
      })
      util.toast('获取数据失败');
    })
  },

  //发帖人头像加载失败时
  errorImg: function(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      [`post_list[${index}].avatar`]: "/imgs/common/104-104@2x.png"
    })
  },
  //点赞头像加载失败时
  errorImg2: function(e) {
    let index = e.currentTarget.dataset.index;
    let subindex = e.currentTarget.dataset.subindex;
    this.setData({
      [`post_list[${index}].postPraiseList[${subindex}].avatar`]: "/imgs/common/104-104@2x.png"
    })
  },
  //点赞
  add_praise: function(e) {
    let url = '';
    let params = {};
    let index = e.currentTarget.dataset.index;
    if (this.data.post_list[index].isPraise == 0) {
      //已经赞过
      util.toast('你已经赞过啦');
      return;
    }
    url = '/manage/add_praise';
    params = {
      "postId": this.data.post_list[index].postId
    };
    network.requestLoading(url, params, "", res => {
      if (res.status == 1) {
        util.toast(res.message || '操作成功');
        this.data.post_list[index].postPraiseList.push({
          avatar: this.data.avatar || ""
        })
        this.setData({
          [`post_list[${index}].isPraise`]: 0,
          [`post_list[${index}].postPraiseList`]: this.data.post_list[index].postPraiseList
        })
      } else {
        util.toast(res.message || '操作失败');
      }
    }, error => {
      util.toast('操作失败');
    })
  },
  add_comment_show: function(e) {
    this.setData({
      add_comment_show: !this.data.add_comment_show,
      postId: e.currentTarget.dataset.postid
    })
  },
  //评论
  add_comment: function(e) {
    if (!this.data.content) {
      util.toast('请输入内容');
      return;
    }
    let url = '';
    let params = {
      "postId": this.data.postId,
      "content": this.data.content
    };
    url = '/manage/add_comment';
    network.requestLoading(url, params, "", res => {
      if (res.status == 1) {
        util.toast(res.message || '操作成功');
        this.setData({
          content: "",
          add_comment_show: false
        })
      } else {
        util.toast(res.message || '操作失败');
      }
    }, error => {
      util.toast('操作失败');
    })
  },

  //积分列表
  get_post_score_list: function(e) {
    network.requestLoading('/manage/get_post_score_list', {}, "", res => {
      if (res.status == 1) {
        this.setData({
          post_score: res.data
        })
      }
    }, error => {

    })
  },
  //积分
  post_scoreadd_sub: function(e) {
    let postIndex = e.currentTarget.dataset.index;
    let tapIndex = Number.parseInt(e.detail.value);
    let url = '/manage/post_scoreadd_sub';
    let params = {
      "postId": this.data.post_list[postIndex].postId,
      "scoreConfigId": this.data.post_score[tapIndex].id
    };
    network.requestLoading(url, params, "正在提交", res => {
      if (res.status == 1) {
        util.toast(res.message || '操作成功');
        this.setData({
          [`post_list[${postIndex}].val`]: this.data.post_score[tapIndex].val
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
      url: './interaction_detail/interaction_detail?postid=' + e.currentTarget.dataset.postid,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  c: function() {

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
    this.get_post_list();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})