let network = require('../../utils/network.js')
let util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuIndex: "1",
    areaIndex: 0,
    campusIndex: 0,
    rankingType: 1, //个人 门店排名
    campusVos: []
  },
  //左侧菜单改变
  changeLeftMenu: function(e) {
    this.setData({
      menuIndex: e.currentTarget.dataset.index
    })
    this.rank_list()
  },
  //榜单类型改变 个人或门店
  rankingType: function(e) {
    this.setData({
      rankingType: e.currentTarget.dataset.type
    })
    this.rank_list()
  },
  //获取城市校区
  find_area_campus: function() {
    network.request(
      "/manage/find_area_campus", {},
      res => {
        if (res.status == "1") {
          let allCampus = [{ campusName: "全部" }];
          res.data.forEach(area=>{
            allCampus.push(...area.campusVos);
            area.campusVos.unshift({ campusName: "全部" })
          })
          res.data.unshift({
            name: "全部", campusVos: allCampus
          })
          this.setData({
            areas: res.data,
            campusVos: res.data[0].campusVos
          });
          this.rank_list()
        } else {
          wx.showToast({
            title: res.message,
            icon: "none",
            duration: 2000
          })
        }
      },
      function(err) {
        console.log(err)
      }
    )
  },
  //tab改变
  tabChange:function(e){
    if(e.detail.value>0){
      util.toast("转介绍榜和流失榜暂时没有数据！");
    }
  },
  //获取排行数据
  rank_list: function() {
    let params = {
      "campusId": this.data.campusVos[this.data.campusIndex].campusId||"",
      "cityNum": this.data.areas[this.data.areaIndex].num||"",
      "day": "",
      "week": "",
      "month": "",
      "season": "",
      "year": ""
    }
    if (this.data.rankingType==2){
      params.campusId="";
    }
    switch (this.data.menuIndex) {
      case "1":
        params.day = "1";
        break;
      case "2":
        params.week = "1";
        break;
      case "3":
        params.month = "1";
        break;
      case "4":
        params.season = "1";
        break;
      case "5":
        params.year = "1";
        break;
    }
    //暂时不传这2个参数 接口会报错
    // params.campusId = "";
    // params.cityNum = "";
    let url = "/manage/rank_list"
    if(this.data.rankingType==2){
      delete params.campusId;
      url ="/manage/rank_campus_list";
    }
    network.request(url, params,
      res => {
        if (res.status == "1") {
          if (res.data.myrank){
            if (res.data.myrank.rankChange >= 0) {
              res.data.myrank.rankChange = "↑" + res.data.myrank.rankChange;
            } else {
              res.data.myrank.rankChange = "↓" + (-res.data.myrank.rankChange);
            }
          }
          res.data.rankList.forEach(e=>{
            e.avatar = util.filterImgUrl(e.avatar) ||"/imgs/common/104-104@2x.png"
          })
          this.setData(res.data)
        } else {
          util.toast(res.message||"获取数据失败")
        }
      },
      function (err) {
        util.toast("获取数据失败")
        console.log(err)
      }
    )
  },
  avatarError:function(){
    this.setData({
      ['myrank.avatar']:"/imgs/common/104-104@2x.png"
    })
  },
  //城市改变
  areaIndexChange: function(e) {
    if (Number.parseInt(e.detail.value) != this.data.areaIndex) {
      let areaIndex = Number.parseInt(e.detail.value);
      this.setData({
        areaIndex: areaIndex,
        campusVos: this.data.areas[areaIndex].campusVos,
        campusIndex: 0
      })
      this.rank_list()
    }
  },
  //校区改变
  campusIndexChange: function(e) {
    this.setData({
      campusIndex: Number.parseInt(e.detail.value)
    })
    this.rank_list()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.find_area_campus()
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