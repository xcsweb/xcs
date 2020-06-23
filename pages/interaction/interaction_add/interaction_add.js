let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classes: [],
    classIndex: 0,
    fbdisabled: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#A375FF'
    })
    this.get_class_list();
  },

  //发帖
  add_post: function(e) {
    if (!this.data.content) {
      util.toast('请输入内容');
      return
    }
    if (isNaN(this.data.classIndex)) {
      util.toast('请选择班级');
      return
    }
    this.setData({
      fbdisabled: true
    });
    let url = '';
    let params = {
      content: this.data.content,
      classesId: this.data.classes[this.data.classIndex].id,
      imgfiles: "",
      vodfiles: ""
    };
    if (this.data.imgfiles) {
      let imgfiles = "";
      this.data.imgfiles.forEach(imgfile => {
        imgfiles += imgfile.key;
        imgfiles += ",";
      })
      imgfiles = imgfiles ? imgfiles.substr(0, imgfiles.length - 1) : imgfiles;
      params.imgfiles = imgfiles;
    }
    if (this.data.vodfiles) {
      let vodfiles = "";
      this.data.vodfiles.forEach(vodfile => {
        vodfiles += vodfile.key;
        vodfiles += ",";
      })
      vodfiles = vodfiles ? vodfiles.substr(0, vodfiles.length - 1) : vodfiles;
      params.vodfiles = vodfiles;
    }
    url = '/manage/add_post';
    network.requestLoading(url, params, "", res => {
      if (res.status == 1) {
        util.toast(res.message || '操作成功', true);
      } else {
        this.setData({
          fbdisabled: false
        });
        util.toast(res.message || '操作失败');
      }
    }, error => {
      this.setData({
        fbdisabled: false
      });
      util.toast('操作失败');
    })
  },
  //https://miniprogram.dongbaoyun.com/rest/wechat/user/get_class_list?insId=1


  //积分列表
  get_class_list: function (e) {
    let url=''
    url = '/manage/get_class_list';
    network.requestLoading(url, {}, "", res => {
      if (res.status == 1) {
        this.setData({
          classes: res.data
        })
      }else{
        util.toast('获取班级信息失败');
      }
    }, error => {
      util.toast('获取班级信息失败');
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