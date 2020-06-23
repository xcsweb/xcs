let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')


var wxCharts = require('../../../utils/wxcharts.js');
var app = getApp();
var lineChart = null;
var startPos = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selectArray: [
    ],
    index: 0,
    stu_tps_record_list_data: [],
    buttonitem: [],
    xDatas: [],
    yDatas: [],
    recordInfo: {},
    mininfo: '',
    usernames: "",
    page: "",
    tabIndex: 0,
    zjbutton: 0,
    btn_title: ''

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options, e) {
    this.get_tps_big_class();
    this.get_stu_tps_item();
    wx.getStorage({
      key: 'studentId',
      success: res => {
        if (res.data) {
          this.get_stu_healthy_report_list(res.data)
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  //获取运动项目大类
  get_tps_big_class: function () {
    network.request(
      "/user/get_tps_big_class", {},
      res => {
        if (res.status == "1") {
          res.data.forEach(e=>{
            e.name=e.title;
          })
          this.setData({
            selectArray:res.data
          })
          this.get_stu_tps_item_category();
        } else {
          wx.showToast({
            title: res.message,
            icon: "none",
            duration: 2000
          })
        }
      },
      function (err) {
        console.log(err)
      }
    )
  },
  tabchange: function(e) {
    this.setData({
      tabIndex: e.detail.value
    })
    // console.log(this.data.tabIndex)
  },

  onChangeShowState: function(e) {
    
    let index = Number.parseInt(e.detail.value);
    this.setData({
      index: index
    })
    this.get_stu_tps_item_category()
  },
  //  体测记录接口
  get_stu_tps_item: function() {
    network.request("/user/stu_tps_record_list", {},
      res => {
        if (res.status == 1) {
          res.data.forEach(e => {
            e.day_ = util.formatTime(new Date(e.createDt * 1000)).substr(0, 10);
          });
          let stu_tps_record_list_data = res.data
          this.setData({
            stu_tps_record_list_data: stu_tps_record_list_data
          })
        }
      },
      error => {
        util.toast("获取数据失败")
      });
  },
  // 指标曲线_获取项目接口
  get_stu_tps_item_category: function() {
    network.request("/user/get_stu_tps_item_category", {
      "bigClassId": this.data.selectArray[this.data.index].id
      },
      res => {
        if (res.status == 1 && res.data != '') {
          console.log(res.data)
          let page = 0
          this.setData({
            buttonitem: res.data,
            // btn_title:res.data
            page: page
          })
          if (res.data.length > 0) {
            this.getcontent(res.data[0].id, res.data[0].title)
          }
        } else {
          util.toast(`还未进行该项目测试`)
          this.setData({
            buttonitem: ''
          })
          let page = 1
          this.setData({
            page: page,
            xDatas: [],
            yDatas: [],
          })
        }
      },
      error => {
        util.toast("获取数据失败")
      });
  },
  tapcontent: function(event) {
    console.log(event)
    var id = event.target.dataset.item;
    var title = event.target.dataset.title;
    this.getcontent(id, title)
  },
  //获取指标曲线_内容
  getcontent: function(id, title) {
    var that = this
    this.setData({
      btn_title: title,
    })
    wx.getStorage({
      key: 'username',
      success: function(res) {
        var username = res.data
        // console.log(username)
        that.setData({
          usernames: res.data
        })
      },
    })
    network.request("/user/stu_tps_curve_content", {
        "tpsItemId": id
      },
      res => {
        if (res.status == 1) {
          console.log(res.data)
          if (res.data.itemUnitInfo == '') {
            let zjbutton = 0;
            this.setData({
              zjbutton: zjbutton
            })
          } else {
            let zjbutton = 1;
            this.setData({
              zjbutton: zjbutton
            })
          }
          res.data.recordlist.forEach(e => {
            e.day_ = util.formatTime(new Date(e.createDt * 1000)).substr(5, 5);
          });
          let arr = res.data.recordlist
          let xData = []
          let yData = []
          let mindata = []
          let newdata = 0
          let time = new Date().getTime()
          let newtime = time.toString().substr(0, 10);
          // console.log(newtime.substr(0,10)) 
          // console.log(newtime)
          for (let i = 0; i < arr.length; i++) {
            mindata.push(newtime - arr[i].createDt)
            var newdata = Math.min.apply(null, mindata)
          }
          // console.log(mindata.indexOf(newdata))
          let mininfo = arr[mindata.indexOf(newdata)]
          let mintime = mininfo.createDt
          let mindatas = util.formatTime(new Date(mintime * 1000)).substr(0, 10);
          this.setData({
            mininfo: mindatas
          })
          let recordInfo = res.data.recordlist[0].recordInfo
          for (var i = 0; i < arr.length; i++) {
            // console.log(arr[i].day_);
            xData.push(arr[i].day_)
            this.setData({
              xDatas: xData,
              recordInfo: recordInfo
            })
          }
          console.log(this.data.recordInfo)
          for (var i = 0; i < arr.length; i++) {
            yData.push(arr[i].val1)
            this.setData({
              yDatas: yData
            })
          }
          console.log(this.data.btn_title)
          console.log(this.data.yDatas)
          // console.log(this.data.recordInfo)
          for (var i = 0; i < this.data.yDatas.length; i++) {
            if (this.data.yDatas[i] === '左侧弯') {
              this.data.yDatas[i] = 60
            } else if (this.data.yDatas[i] === '高弓足') {
              this.data.yDatas[i] = 60
            } else if (this.data.yDatas[i] === '右侧弯') {
              this.data.yDatas[i] = 40
            } else if (this.data.yDatas[i] === '扁平足') {
              this.data.yDatas[i] = 40
            } else if (this.data.yDatas[i] === '正常') {
              this.data.yDatas[i] = 50
            } else if (this.data.yDatas[i] === '可能缺乏') {
              this.data.yDatas[i] = 40
            } else if (this.data.yDatas[i] === '未见缺乏') {
              this.data.yDatas[i] = 50
            }
          }

          this.echarts_show()
        }
      },
      error => {
        util.toast("获取数据失败")
      });
  },

  //echarts
  echarts_show: function() {
    let yDatasMax = Number.parseInt(Math.max(...this.data.yDatas) * 2+"");
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {}
    lineChart = new wxCharts({
      dataLabel: false,
      canvasId: 'lineCanvas',
      type: 'line',
      categories: this.data.xDatas,
      animation: true,
      series: [{
        name: this.data.btn_title,
        data: this.data.yDatas,
        format: val => {

          switch (this.data.btn_title) {
            case "脊柱测试":
              if (val >= 60) {
                return "左侧弯"
              } else if (val <= 40) {
                return "左侧弯"
              } else if (40 < val < 60) {
                return "正常"
              } else {
                return val
              }
              break;
            case "左足弓":
              if (val >= 60) {
                return "高弓足"
              } else if (val <= 40) {
                return "扁平足"
              } else if (40 < val < 60) {
                return "正常"
              } else {
                return val
              }

              break;
            case "右足弓":
              if (val >= 60) {
                return "高弓足"
              } else if (val <= 40) {
                return "扁平足"
              } else if (40 < val < 60) {
                return "正常"
              } else {
                return val
              }
              break;
            case "骨密度":
              return val
              break;
            case "微量元素—钙":
              // console.log(val)
              if (val < 60) {
                return "可能缺乏"
              } else if (val >= 60) {
                return "未见缺乏"
              }
              break;
            case "微量元素—锌":
              // console.log(val)
              if (val < 60) {
                return "可能缺乏"
              } else if (val >= 60) {
                return "未见缺乏"
              }
              break;
            case "微量元素—硒":
              // console.log(val)
              if (val < 60) {
                return "可能缺乏"
              } else if (val >= 60) {
                return "未见缺乏"
              }
              break;
            case "微量元素—铁":
              // console.log(val)
              if (val < 60) {
                return "可能缺乏"
              } else if (val >= 60) {
                return "未见缺乏"
              }
              break;
            case "体重":
              return val
              break;
            default:
              return val
              break;
          }
        }
      }, ],
      xAxis: {
        disableGrid: false,
        gridColor: '#ffffff',
      },
      yAxis: {
        format: val => {
          switch (this.data.btn_title) {
            case "脊柱测试":
              if (val > 60) {
                return "左侧弯"
              } else if (val < 40) {
                return "左侧弯"
              } else if (40 <= val <= 60) {
                return "正常"
              } else {
                return val
              }
            case "左足弓":
              if (val > 60) {
                return "高弓足"
              } else if (val < 40) {
                return "扁平足"
              } else if (40 <= val <= 60) {
                return "正常"
              } else {
                return val
              }

            case "右足弓":
              if (val > 60) {
                return "高弓足"
              } else if (val < 40) {
                return "扁平足"
              } else if (40 <= val <= 60) {
                return "正常"
              } else {
                return val
              }
            case "骨密度":
              return val
            case "微量元素—钙":
              // console.log(val)
              if (val < 60) {
                return "可能缺乏"
              } else if (val >= 60) {
                return "未见缺乏"
              }
            case "微量元素—铁":
              // console.log(val)
              if (val < 60) {
                return "可能缺乏"
              } else if (val >= 60) {
                return "未见缺乏"
              }

            case "微量元素—锌":
              // console.log(val)
              if (val < 60) {
                return "可能缺乏"
              } else if (val >= 60) {
                return "未见缺乏"
              }
              break;
            case "微量元素—硒":
              // console.log(val)
              if (val < 60) {
                return "可能缺乏"
              } else if (val >= 60) {
                return "未见缺乏"
              }
              break;
            case "体重":
              return val
            default:
              return val

          }
        },

        min: 20,
        max: yDatasMax||100,

        labels: {
          enabled: false
        },
        disableGrid: false,
      },
      width: windowWidth,
      height: 200,
      // dataLabel: false,
      dataPointShape: false,
      enableScroll: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },
  reportinfo: function(event) {
    let id = event.currentTarget.dataset.id;
    // console.log(id)
    wx.navigateTo({
      url: './reportinfo/reportinfo?id=' + id
    })
  },

  get_stu_healthy_report_list: function(studentId) {
    let params = {
      "studentId": studentId
    };
    network.requestLoading('/manage/get_stu_healthy_report_list', params, "", res => {
      if (res.status == 1) {
        res.data.forEach(e => {
          e.createDt = util.formatTime(new Date(e.createDt * 1000), '/').substr(0, 11);
        });
        this.setData({
          report_list: res.data
        })
      } else {
        util.toast(res.message || "获取数据失败")
      }
    }, error => {
      util.toast("连接服务器失败")
    })
  },
  touchHandler: function(e) {
    lineChart.scrollStart(e);
  },
  moveHandler: function(e) {
    lineChart.scroll(e);
  },
  touchEndHandler: function(e) {
    lineChart.scrollEnd(e);
    console.log(e)

    lineChart.showToolTip(e, {

      format: function(item, category) {
        // let qdatas = this.data.yDatas;
        console.log(item)
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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