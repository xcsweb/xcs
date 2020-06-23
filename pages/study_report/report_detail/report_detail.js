let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')
let wxParse = require('../../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    reportId: 46,
    left1:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getSystemInfo({
      success: res => {
        //左右边距rpx
        let tableMarginRpx = 20;
        //滚动圆尺寸
        let dotSize=30;
        //计算表格宽度px
        this.setData({
          tableWidth: res.windowWidth - (tableMarginRpx*2) / (750 / res.windowWidth),
          tableRight: res.windowWidth - (tableMarginRpx + dotSize + dotSize/2) / (750 / res.windowWidth),
          tableLeft: tableMarginRpx / (750 / res.windowWidth),
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    this.setData(options);
    this.find_report_one();
  },

  find_report_one: function() {
    let params = {
      "reportId": this.data.reportId
    };
    network.requestLoading('/manage/find_report_one', params, "", res => {
      if (res.status == 1) {
        res.data.classContent.forEach(e => {
          e.createDt = util.formatTime(new Date(e.createDt * 1000), '/').substr(0, 11);
        });
        res.data.courseContent.forEach(e => {
          e.createDt = util.formatTime(new Date(e.createDt * 1000), '/').substr(0, 11);
        });
        res.data.attendClassContent.forEach(e => {
          e.day = util.formatTime(new Date(e.day * 1000), '/').substr(0, 11);
        });
        res.data.basicContent.birthDt = util.formatTime(new Date(res.data.basicContent.birthDt * 1000), '/').substr(0, 11); 
        res.data.basicContent.avatar =util.filterImgUrl(res.data.basicContent.avatar) || "/imgs/common/104-104@2x.png";
        let attachments=[];
        if (res.data.imgfiles){
          res.data.imgfiles.split(",").forEach(e=>{
            if(e){
              e = util.filterImgUrl(e);
              attachments.push({
                img:e
              })
            }
          })
        }
        res.data.attachments = attachments;
        wxParse.wxParse('wxParse', 'html', res.data.institutionDes, this, 5);
        this.setData(res.data);
        this.scrollviewWidth();
      } else {
        util.toast(res.message || "获取数据失败")
      }
    }, error => {
      util.toast("连接服务器失败")
    })
  },
  //头像加载失败时
  errorImg: function (e) {
    this.setData({
      ["basicContent.avatar"]: "/imgs/common/104-104@2x.png"
    })
  },
  scrollviewWidth:function(){
    this.queryMultipleNodes1();
    this.queryMultipleNodes2();
  },
  //获取分班信息表格总宽度scrollview1width
  queryMultipleNodes1: function () {
    var query = wx.createSelectorQuery()
    query.selectAll('.col1').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(res=>{
      let width=0;
      res[0].forEach((e,index)=>{
        width += e.width;
        //记录第一列即标题列的宽度
        if(index==0){
          this.setData({
            col1titleWidth:e.width
          })
        }
      })
      this.setData({
        scrollview1width: width
      })
    })
  },
  //获取缴费记录表格总宽度scrollview2width
  queryMultipleNodes2: function () {
    var query = wx.createSelectorQuery()
    query.selectAll('.col2').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(res => {
      let width = 0;
      //记录第一列即标题列的宽度
      res[0].forEach((e, index) => {
        width += e.width;
        if (index == 0) {
          this.setData({
            col2titleWidth: e.width
          })
        }
      })
      this.setData({
        scrollview2width: width
      })
    })
  },
  scrollbarmove1: function(e) {
    let left = e.touches[0].pageX > this.data.tableRight ? this.data.tableRight : e.touches[0].pageX;
    left = left <0 ?0:left;
    let left_ = (left / this.data.tableRight) * (this.data.scrollview1width - this.data.tableWidth);
    let width = (left / this.data.tableRight)*100+"%";
    this.setData({
      left1: left,
      left1_: left_,
      width1: width
    })
  },
  scrollbarmove2: function (e) {
    let left = e.touches[0].pageX > this.data.tableRight ? this.data.tableRight : e.touches[0].pageX;
    left = left < 0 ? 0 : left;
    let left_ = (left / this.data.tableRight) * (this.data.scrollview2width - this.data.tableWidth);
    let width = (left / this.data.tableRight) * 100 + "%";
    this.setData({
      left2: left,
      left2_: left_,
      width2: width
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