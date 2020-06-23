var wxCharts = require('../../../utils/wxcharts.js');
let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 1,
    multichoice1: false,
    multichoice2: false,
    date: null,
    dateStr: "",
    canvasHeight: 140//图表高度 px
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let windowWidth = 320;
    try {
      let res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      // do something when get system info failed
    }
    let padding = 10;
    let date = new Date();
    date.setHours(0,0,0,0);
    this.setData({
      date: date,
      windowWidth: windowWidth,
      columnWidthFull: windowWidth - padding * 2,
      columnWidthHalf: (windowWidth - padding * 3) * 0.7,
      ringWidth: (windowWidth - padding * 3) * 0.4,
      memberId: options.memberId,
      today: util.formatDate(date).substr(0, 10)
    })
    this.dateOp();
    this.member_performance_memberinfo();
    this.get_campus();
    this.member_performance_statistics();
  },
  formSubmit: function(e) {
    let formData = e.detail.value;
    if (this.data.campusIds) {
      formData.campusIds = this.data.campusIds;
    }
    if (this.data.trainCategoryIds) {
      formData.trainCategoryIds = this.data.trainCategoryIds;
    }
    formData.des = this.data.memberinfo.des || "";
    formData.birthDt = this.data.memberinfo.birthDt;
    formData.memberId = this.data.memberId || "68";
    delete formData.course;
    delete formData.cityName;
    delete formData.age;
    console.log(formData)
    network.requestLoading('/manage/member_performance_modifymemberinfo', formData, "",
      res => {
        if (res.status == 1) {
          util.toast(res.message || '已保存')
        } else {
          util.toast(res.message || '操作失败')
        }
      }, error => {
        util.toast('网络请求失败')
      })
  },
  //性别改变
  sexchange: function(e) {
    this.setData({
      ['memberinfo.sex']: Number.parseInt(e.detail.value)
    })
  },
  birthDtChange: function(e) {
    let newDate = new Date(e.detail.value.replace(/-/g, "/"));
    this.setData({
      ['memberinfo.birthDt']: Math.round(newDate.getTime()/1000),
      ['memberinfo.birthDt_']: e.detail.value,
      ['memberinfo.age']: new Date().getFullYear() - newDate.getFullYear()
    })
  },
  //获取校区列表
  get_campus: function() {
    network.requestLoading('/manage/get_campus', {}, "", res => {
      if (res.status == 1) {
        this.setData({
          campus: res.data
        });
        let campusIds="";
        res.data.forEach(e=>{
          campusIds += e.id;
          campusIds += ",";
        });
        if (campusIds){
          campusIds = campusIds.substr(0, campusIds.length-1);
          this.get_train_category({ campusIds: campusIds})
        }
      } else {
        util.toast(res.message || '获取数据失败')
      }
    }, error => {
      util.toast('网络请求失败')
    })
  },
  //获取统计数据
  member_performance_statistics: function () {
    this.data.date.setDate(1);
    let startDt = Math.round(this.data.date.getTime() / 1000);
    this.data.date.setMonth(this.data.date.getMonth()+1);
    this.data.date.setDate(0);
    let endDt = Math.round(this.data.date.getTime() / 1000);
    this.data.date.setDate(1);
    network.requestLoading('/manage/member_performance_statistics', {
      "startDt": startDt,
      "endDt": endDt,
      "memberId": this.data.memberId ||"68"
    }, this.data.statistics?"加载中...":"", res => {
      if (res.status == 1) {
        this.setData({
          statistics: res.data
        });
        this.loadCharts();
      } else {
        util.toast(res.message || '获取数据失败')
      }
    }, error => {
      util.toast('网络请求失败')
    })
  },
  //获取老师个人信息
  member_performance_memberinfo: function() {
    network.requestLoading('/manage/member_performance_memberinfo', {
      "memberId": this.data.memberId || "68"
    }, "加载中...", res => {
      if (res.status == 1) {
        if (res.data.birthDt) {
          let date = new Date(res.data.birthDt * 1000);
          res.data.birthDt_ = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
        }
        this.setData({
          memberinfo: res.data
        });
        //如果已有授课内容 那么恢复已选项
        this.syncCheckedTrainCategory();
      } else {
        util.toast(res.message || '获取数据失败')
      }
    }, error => {
      util.toast('网络请求失败')
    })
  },
  //如果已有授课内容 那么恢复已选项
  syncCheckedTrainCategory:function(){
    if (this.data.train_category && this.data.memberinfo.trainCategoryList) {
      this.data.train_category.forEach(train_category => {
        this.data.memberinfo.trainCategoryList.forEach(checked_train_category => {
          if (train_category.train == checked_train_category.id){
            train_category.checked=true;
          }
        })
      })
      this.setData({
        train_category: this.data.train_category
      })
    }
  },
  //获取授课内容分类
  get_train_category: function (params) {
    network.requestLoading('/manage/get_train_category', params, "", res => {
      if (res.status == 1) {
        this.setData({
          train_category: res.data
        });
        //如果已有授课内容 那么恢复已选项
        this.syncCheckedTrainCategory();
      } else {
        util.toast(res.message || '获取数据失败')
      }
    }, error => {
      util.toast('网络请求失败')
    })
  },
  loadCharts: function() {
    this.loadColumnCharts('columnCanvas1', ['试课量', '试课转正量'], [{
      name: 'name1',
      data: [this.data.statistics.testclassNum, this.data.statistics.testclassNumNomal]
    }], "", 20, this.data.columnWidthHalf, ["#A375FF", "#FFBF79"]);
    this.loadRingChart('ringCanvas1', this.data.statistics.testclassPercent, "#FFBF79");


    this.loadColumnCharts('columnCanvas2', ['其中转介绍量', '转介绍转正量'], [{
      name: 'name1',
      data: [this.data.statistics.introduceNum, this.data.statistics.introduceNumNomal]
    }], "", 20, this.data.columnWidthHalf, ["#A375FF", "#8DC8FF"]);
    this.loadRingChart('ringCanvas2', this.data.statistics.introducePercent, "#8DC8FF");

    this.loadColumnCharts('columnCanvas3', ['试课转正收入额', '其他销售收入额'], [{
      name: 'name1',
      data: [this.data.statistics.testclassNumNomalIncome, this.data.statistics.otherIncome]
    }], "(元)", 500, this.data.columnWidthFull, ["#FF6633", "#8DC8FF"]);




    this.loadColumnCharts('columnCanvas4', ['排课次数', '上课次数'], [{
      name: 'name1',
      data: [this.data.statistics.classhourNum, this.data.statistics.gotoclassNum]
    }], "(次)", 0, this.data.columnWidthHalf, ["#FFBF79", "#8DC8FF"]);
    this.loadRingChart('ringCanvas4', this.data.statistics.gotoclassPercent, "#FF6633");



    this.loadColumnCharts('columnCanvas5', ['请假次数'], [{
      name: 'name1',
      data: [this.data.statistics.leave]
    }], "(次)", 0, this.data.columnWidthHalf, ["#756BFF"]);
    this.loadRingChart('ringCanvas5', this.data.statistics.leavePercent, "#756BFF");


    this.loadColumnCharts('columnCanvas6', ['应到人次', "签到人次"], [{
      name: 'name1',
      data: [this.data.statistics.shouldNum, this.data.statistics.loginNum]
    }], "(次)", 0, this.data.columnWidthHalf, ["#FFBF79", "#756BFF"]);
    this.loadRingChart('ringCanvas6', this.data.statistics.loginPercent, "#756BFF");



    this.loadColumnCharts('columnCanvas7', ['课后总结次数', "点评学员人次"], [{
      name: 'name1',
      data: [this.data.statistics.summaryNum, this.data.statistics.evaluateStudentNum]
    }], "(次)", 0, this.data.columnWidthFull, ["#756BFF", "#FFBF79"]);


    this.loadColumnCharts('columnCanvas8', ['评价作业次数', "学员发帖次数", "帖子点评次数"], [{
      name: 'name1',
      data: [this.data.statistics.evaluateStudentHomeworkNum, this.data.statistics.studentPostNum, this.data.statistics.evaluateNum]
    }], "", 100, this.data.columnWidthFull, ["#756BFF", "#92CAFF", "#756BFF"]);



    this.loadColumnCharts('columnCanvas9', ['学员分享', "回访次数", "家长好评", "家长差评"], [{
      name: 'name1',
      data: [this.data.statistics.studentShareNum, this.data.statistics.returnvisitNum, this.data.statistics.parentHighPraiseNum, this.data.statistics.parentLowPraiseNum]
    }], "(次)", 100, this.data.columnWidthFull, ["#A375FF", "#FFBF79", "#FFBF79", "#FFBF79"]);
  },
  loadColumnCharts: function(canvasId, categories, series, yAxisUtil, yAxisMin, width, columnColors) {
    let sortedData = series[0].data.slice().sort().reverse();
    let max = sortedData[0];
    max=max==0?10:max;
    new wxCharts({
      columnColors: columnColors,
      canvasId: canvasId,
      type: 'column',
      categories: categories,
      legend: false,
      series: series,
      yAxis: {
        format: function(val) {
          if (val >= max) {
            return val + yAxisUtil;
          }
          return val;
        },
        min: 0,
        max: max,
        fontSize: 8
      },
      xAxis: {
        disableGrid: true
      },
      width: width,
      height: this.data.canvasHeight
    });
  },
  loadRingChart: function(canvasId, percent, color) {
    new wxCharts({
      canvasId: canvasId,
      type: 'ring',
      disablePieStroke: true,
      legend: false,
      title: {
        name: percent+"%",
        fontSize: 12,
        color: "#333"
      },
      series: [{
        name: 'name1',
        data: percent,
        color: color || "#FF6633"
      }, {
        name: 'name2',
        data: 100 - percent,
        color: "#ccc"
      }],
      width: this.data.ringWidth,
      height: this.data.canvasHeight,
      dataLabel: false,
      extra: {
        ringWidth: 3,
        pie: {
          offsetAngle: -90
        }
      }
    });
  },
  dateOp: function(e) {
    let op = 0;
    if (e) {
      op = e.currentTarget.dataset.op;
    }
    if (op > 0) {
      this.data.date.setMonth(this.data.date.getMonth() + 1)
    } else if (op < 0) {
      this.data.date.setMonth(this.data.date.getMonth() - 1)
    }
    let dateStr = this.data.date.getFullYear() + "年" + (this.data.date.getMonth() + 1) + "月";
    this.setData({
      date: this.data.date,
      dateStr: dateStr
    });
    this.member_performance_statistics();
  },
  tabIndex: function(e) {
    this.setData({
      tabIndex: e.detail.value
    })
    if(!this.data.flag){
      this.data.flag=1;
      this.loadCharts();
    }
  },
  multichoice1: function(e) {
    this.setData({
      multichoice1: true
    })
  },
  multichoice1ok: function(e) {
    console.log(e.detail.value)
    let campusIds = "";
    e.detail.value.forEach(c => {
      campusIds += c;
      campusIds += ",";
    });
    let campusStr = "";
    this.data.campus.forEach(c => {
      c.checked = false;
      if (e.detail.value.indexOf(c.id + "") > -1) {
        c.checked = true;
        campusStr += c.name;
        campusStr += ",";
      }
    })
    campusIds = campusIds ? campusIds.substr(0, campusIds.length - 1) : ""
    campusStr = campusStr ? campusStr.substr(0, campusStr.length - 1) : ""
    this.setData({
      multichoice1: false,
      campusIds: campusIds,
      ['memberinfo.campusName']: campusStr,
      campus: this.data.campus
    })
  },
  multichoice1cancel: function(e) {
    this.setData({
      multichoice1: false
    })
  },
  multichoice2: function(e) {
    this.setData({
      multichoice2: true
    })
  },
  multichoice2ok: function(e) {

    let trainCategoryIds = "";
    e.detail.value.forEach(c => {
      trainCategoryIds += c;
      trainCategoryIds += ",";
    });
    let trainName = "";
    this.data.train_category.forEach(c => {
      c.checked = false;
      if (e.detail.value.indexOf(c.train + "") > -1) {
        c.checked = true;
        trainName += c.name;
        trainName += ",";
      }
    })
    trainCategoryIds = trainCategoryIds ? trainCategoryIds.substr(0, trainCategoryIds.length - 1) : ""
    trainName = trainName ? trainName.substr(0, trainName.length - 1) : ""
    this.setData({
      multichoice2: false,
      trainCategoryIds: trainCategoryIds,
      ['memberinfo.trainName']: trainName,
      train_category: this.data.train_category
    })
  },
  multichoice2cancel: function(e) {
    this.setData({
      multichoice2: false
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