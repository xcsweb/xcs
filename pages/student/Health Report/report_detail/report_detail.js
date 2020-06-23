let network = require('../../../../utils/network.js')
let util = require('../../../../utils/util.js')
var wxCharts = require('../../../../utils/wxcharts.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reportId: 3,
    left1: 0
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
        let dotSize = 30;
        //计算表格宽度px
        this.setData({
          tableWidth: res.windowWidth - (tableMarginRpx * 2) / (750 / res.windowWidth),
          tableRight: res.windowWidth - (tableMarginRpx + dotSize + dotSize / 2) / (750 / res.windowWidth),
          tableLeft: tableMarginRpx / (750 / res.windowWidth),
          canvasHeight: 100
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    this.setData(options);
    this.find_healthy_report_one();
  },

  //头像加载失败时
  errorImg: function (e) {
    this.setData({
      "avatar": "/imgs/common/104-104@2x.png"
    })
  },
  find_healthy_report_one: function() {
    let params = {
      "reportId": this.data.reportId
    };
    network.requestLoading('/manage/find_healthy_report_one', params, "", res => {
      if (res.status == 1) {
        res.data.basicContent.birthDt = util.formatTime(new Date(res.data.basicContent.birthDt * 1000), '/').substr(0, 11);
        res.data.startDt = res.data.startDt ? res.data.startDt : 0;
        res.data.endDt = res.data.endDt ? res.data.endDt : 0;
        res.data.startDt = util.formatTime(new Date(res.data.startDt * 1000), '/').substr(0, 11);
        res.data.endDt = util.formatTime(new Date(res.data.endDt * 1000), '/').substr(0, 11);
        
        res.data.avatar =  util.filterImgUrl(res.data.avatar) || "/imgs/common/104-104@2x.png";;

        res.data.reportContent.forEach((reportContent, index) => {
          reportContent.record.forEach((e) => {
            e.day_ = util.formatTime(new Date(e.day * 1000), '/').substr(0, 11);
          })
        });
        this.setData(res.data);
        res.data.reportContent.forEach((reportContent, index) => {
          if (reportContent.bigclass==4){
            let series = [];
            let data = [];
            reportContent.record.forEach((e) => {
              let date = new Date(e.day * 1000);
              let month = date.getMonth();
              let day = date.getDate();
              series.push((month < 10 ? "0" + month : "" + month) + "." + (day < 10 ? "0" + day : "" + day));
              let val = e.val1 || e.val2 || e.val3 || e.val4 || "0";
              console.log(val)
              data.push(Number.parseInt(val));
            });
            setTimeout(()=>{
              this.loadLineCharts("canvas" + index, series, [{
                name: "cjl",
                data: data,
                color: index % 2 == 0 ? "#FF6633" : "#33B0FB"
              }], "", 0, this.data.tableWidth);
            }, 600 * (index+1))
          }
        });
      } else {
        util.toast(res.message || "获取数据失败")
      }
    }, error => {
      util.toast("连接服务器失败")
    })
  },
  //加载折线图
  loadLineCharts: function(canvasId, categories, series, yAxisUtil, yAxisMin, width) {
    console.log(series)
    let sortedData = series[0].data.slice().sort().reverse();
    let max = sortedData[0];
    let chartObj = new wxCharts({
      canvasId: canvasId,
      type: 'area',
      animation: false, //图表太多动画引起卡顿
      categories: categories,
      legend: false,
      series: series,
      dataPointShape: "circle",
      enableScroll: true,
      yAxis: {
        format: function(val) {
          if (val >= max) {
            return val + yAxisUtil;
          }
          return val;
        },
        min: 0,
        fontSize: 8
      },
      xAxis: {
        disableGrid: true
      },
      width: width,
      height: this.data.canvasHeight,
      extra: {
        lineStyle: "curve"
      }
    });
    this.data[canvasId] = chartObj
  },
  //图表滚动事件
  touchHandler: function(e) {
    this.data[e.target.dataset.chart].scrollStart(e);
  },
  //图表滚动事件
  moveHandler: function(e) {
    this.data[e.target.dataset.chart].scroll(e);
  },
  //图表滚动事件
  touchEndHandler: function(e) {
    this.data[e.target.dataset.chart].scrollEnd(e);
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