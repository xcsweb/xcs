let network = require('../../../../utils/network.js')
let util = require('../../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    visualStatuses: [],
    post_score: [],
    visualStatusIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
      backgroundColor: '#85AFFF'
    })

    this.setData(options)
    this.get_post_detail();
  },
  //获取帖子详情
  get_post_detail: function () {
    let url = '';
    url = '/user/get_post_detail';
    network.requestLoading(url, { "postId": this.data.postid||"4" }, "", res => {
      if (res.status == 1) {
        res.data.visualStatus.forEach((item,index)=>{
          if (item.codeValue == res.data.postDetail.visualStatus){
            this.setData({
              visualStatusIndex:index
            })
          }
        })
        res.data.postDetail = [res.data.postDetail]
        res.data.postDetail.forEach(post => {
          post.avatar = util.filterImgUrl(post.avatar) || "/imgs/common/80_80.png";
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
              e = (e && e.startsWith("http")) ? e : network.vod_url + e;
              post.vodfiles[index] = {
                img: e + "?vframe/jpg/offset/0/w/640",
                video:e
              }
            })
          } else {
            post.vodfiles = []
          }
          post.attachments = post.imgfiles.concat(post.vodfiles);
          post.postPraiseList.forEach(postPraise => {
            postPraise.avatar = util.filterImgUrl(postPraise.avatar) || "/imgs/common/80_80.png";
          });

          post.postContent.forEach(postContent => {
            postContent.avatar = util.filterImgUrl(postContent.avatar) || "/imgs/common/80_80.png";
            postContent.createDt_ = util.formatTime(new Date(postContent.createDt * 1000)).substr(0, 16);
          });
          if (!post.createDt)
            post.createDt = 0;
          post.createDt_ = util.formatTime(new Date(post.createDt * 1000)).substr(0, 16);
        })
        this.setData({
          post_list: res.data.postDetail,
          visualStatuses: res.data.visualStatus
        })
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
      [`post_list[${index}].avatar`]: "/imgs/common/84-84@2x.png"
    })
  },
  //头像加载失败时
  errorImg2: function (e) {
    let index = e.currentTarget.dataset.index;
    let subindex = e.currentTarget.dataset.subindex;
    this.setData({
      [`post_list[${index}].postPraiseList[${subindex}].avatar`]: "/imgs/common/84-84@2x.png"
    })
  },
  //头像加载失败时
  errorImg3: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      [`post_list[0].postContent[${index}].avatar`]: "/imgs/common/84-84@2x.png"
    })
  },
  visualStatusIndexChange:function(e){
    let url = '/manage/update_post_visualstatus';
    let params = { "postId": this.data.post_list[0].postId, "visualStatus": this.data.visualStatuses[e.detail.index].codeValue };
    network.requestLoading(url, params, "", res => {
      if (res.status == 1) {
        util.toast(res.message || '操作成功');
      } else {
        util.toast(res.message || '操作失败');
      }
    }, error => {
      util.toast('操作失败');
    })
  },
  //点赞
  add_praise: function (e) {
    if (this.data.post_list[0].isPraise==0){
      util.toast('已经赞过了');
      return
    }
    let url = '';
    let params = {};
    url = '/user/add_praise';
    params = { "postId": e.currentTarget.dataset.postid };
    network.requestLoading(url, params, "", res => {
      if (res.status == 1) {
        util.toast(res.message || '操作成功');
        this.get_post_detail();
      } else {
        util.toast(res.message || '操作失败');
      }
    }, error => {
      util.toast('操作失败');
    })
  },
  add_comment_show: function (e) {
    this.setData({
      add_comment_show: !this.data.add_comment_show,
      postId: e.currentTarget.dataset.postid ? e.currentTarget.dataset.postid:0,
    })
  },
  //评论
  add_comment: function (e) {
    if (!this.data.content) {
      util.toast('请输入内容');
      return;
    }
    let url = '';
    let params = { "postId": this.data.postId, "content": this.data.content };
    url = '/user/add_comment';
    network.requestLoading(url, params, "", res => {
      if (res.status == 1) {
        util.toast(res.message || '操作成功');
        this.setData({
          content: "",
          add_comment_show: false
        })
        this.get_post_detail();
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
  onReady: function () {

  },
  c: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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