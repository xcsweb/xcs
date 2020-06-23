let network = require('../../utils/network.js')
let util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    clshour_list: [],
    img_url: "",
    vod_url: "",
    showCourseTable:false,
    filterParam: [],
    searchParam: {},
  },
  showCourseTable:function(e){
    this.setData({
      showCourseTable: e.currentTarget.dataset.b
    })
  },
  calanderShowAll:function(){
    this.setData({
      calanderShowAll: !this.data.calanderShowAll
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let me = this;
    me.setData({
      img_url: network.img_url,
      vod_url: network.vod_url
    })
    network.filterInfo(
      {campus: 1, classType: 1, isAllData: 1 },
      function(data){
        me.setData(data);
        me.clshour_list();
      }
    );
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    this.setData({
      selectedDate: Math.floor(date.getTime() / 1000)
    })
  },
  changeDate:function(e){
    this.setData({
      selectedDate: Math.floor(e.detail.milliseconds / 1000)
    })
    this.clshour_list(this.data.selectedDate);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },
  clshour_list: function (day) {
    this.data.searchParam.inputVal = this.data.inputVal;
    this.data.searchParam.day = day || this.data.selectedDate;
    network.request("/manage/clshour_list", this.data.searchParam,
      res => {
        if (res.status == 1) {
          console.log(res.data)
          res.data.forEach(e=>{
            e.logPic = util.filterImgUrl(e.logPic) ||"/imgs/common/190_190.png";
          })
          this.setData({
            clshour_list: res.data
          }) 
          if(res.data.length==0){
            util.toast("无课程信息")
          }
        } else {
          util.toast("获取数据失败")
        }
      },
      error => {
        util.toast("获取数据失败")
      });
  },
  errorImg:function(e){
    let index=e.currentTarget.dataset.index;
    this.setData({
      [`clshour_list[${index}].logPic`]:"/imgs/common/190_190.png"
    })
  },
  toDetail: function(event) {
    let course = event.currentTarget.dataset.course || event.detail.course;
    wx.navigateTo({
      url: './course_detail/course_detail?classesHourId=' + course.classesHourId,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function(e) {
    if (e.detail) {
      this.setData({
        inputVal: e.detail.value ? e.detail.value : "",
      });
      if (e.detail.searchParam) {
        this.setData({
          searchParam: e.detail.searchParam,
        });
      }
      this.clshour_list(this.data.selectedDate)
    }
  }
})