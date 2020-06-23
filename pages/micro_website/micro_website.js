let network = require('../../utils/network.js')
let util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedTabIndex: 0,
    swiperIndex: 1,
    index: 0,
  },

  //logo加载失败时
  errorImg: function (e) {
    this.setData({
      "pic": "/imgs/common/104-104@2x.png"
    })
  },
  //头像加载失败时
  errorImg2: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      [`star_tacher_list[${index}].avatar`]: "/imgs/common/104-104@2x.png"
    })
  },
  swiperChange: function(e) {
    this.setData({
      swiperIndex: e.detail.current,
    })
    this.star_tacher_detail(this.data.star_tacher_list[this.data.swiperIndex].id);
  },
  //改变tab
  changeTab: function(event) {
    this.setData({
      selectedTabIndex: event.detail.value
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //判断当前用户是学生还是老师
    this.setData({
      isMember: wx.getStorageSync('isMember')
    })
    if (this.data.isMember) {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#A375FF'
      })
    } else {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#85AFFF'
      })
    }
    this.micro_website_about();
    this.micro_website_campus();
    this.star_tacher_list();
  },

  //关于
  micro_website_about: function(e) {
    let params = {};
    network.requestLoading('/manage/micro_website_about', params, "", res => {
      if (res.status == 1) {
        res.data.pic = util.filterImgUrl(res.data.pic) || "/imgs/common/104-104@2x.png";
        if (res.data.des){
          res.data.des = res.data.des.replace(/\n/g, "<br>")
          res.data.des = res.data.des.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ');
        }
        this.setData(res.data)
      } else {
        util.toast('获取数据失败');
      }
    }, error => {
      util.toast('获取数据失败');
    })
  },
  //明星老师列表
  star_tacher_list: function (e) {
    let params = {};
    network.requestLoading('/common/star_tacher_list', params, "", res => {
      if (res.status == 1) {
        res.data.forEach(e=>{
          e.avatar = util.filterImgUrl(e.avatar) || "/imgs/common/104-104@2x.png";
        })
        //老师数量小于3时 默认显示第一个 大于三时显示第二个
        let swiperIndex=res.data.length<3?0:1;
        this.setData({
          star_tacher_list: res.data,
          swiperIndex: swiperIndex
        });
        if (res.data.length>0){
          this.star_tacher_detail(res.data[swiperIndex].id);
        }
      } else {
        util.toast('获取数据失败');
      }
    }, error => {
      util.toast('获取数据失败');
    })
  },

  //明星老师详情
  star_tacher_detail: function (id) {
    let params = { "starTeacherId": id };
    network.requestLoading('/common/star_tacher_detail', params, "", res => {
      if (res.status == 1) {
        
        res.data.resume = res.data.resume.replace(/\n/g, "<br>")
        res.data.resume = res.data.resume.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ');
        res.data.imgfiles = res.data.imgfiles.split(",").filter(e=>{
          return e?true:false;
        })
        res.data.imgfiles.forEach((e,index) => {
          e = (e && !e.startsWith('http')) ? network.img_url + e : e;
          res.data.imgfiles[index]={img:e}
        })
        this.setData({
          star_tacher_detail: res.data
        });
      } else {
        util.toast('获取数据失败');
      }
    }, error => {
      util.toast('获取数据失败');
    })
  },
  micro_website_campus: function(e) {
    let params = {};
    network.requestLoading('/manage/micro_website_campus', params, "", res => {
      if (res.status == 1) {
        this.setData({
          micro_website_campus: res.data
        })
      } else {
        util.toast('获取数据失败');
      }
    }, error => {
      util.toast('获取数据失败');
    })
  },
  //打电话
  calling: function(e) {
    if (!e.currentTarget.dataset.tel) {
      util.toast("该学校没有电话")
      return;
    }
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
      success: function() {
        console.log("拨打电话成功！")
      },
      fail: function() {
        console.log("拨打电话失败！")
      }
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