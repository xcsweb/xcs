var wxCharts = require('../../utils/wxcharts.js');
let network = require('../../utils/network.js')
let util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["企业效率分析", "体测统计", "财务统计", "教务统计", "销售统计", ""],
    tabIndex: 0, //页面tab索引
    canvasHeight: 125, //图表高度
    tab2sex: 1, //tab2性别
    tab3Index: 0, //tab3下的tab索引
    startAge: 3, //tab2开始年龄
    endAge: 10, //tab2结束年龄
    tab4data1: [], //教务统计下的消课统计
    tab4data2: [], //教务统计下的出勤统计
    tjxm3: 1, //tab3统计项目类型
    tjxm4: 1, //tab4统计项目类型
    tjxm5: 1, //tab5统计项目类型
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
    let padding = 10; //页面边距 10px

    //默认取最近一个月数据
    let date = new Date();
    let endDtStr = util.formatDate(date).substr(0, 10);
    let endDt = util.dateToStamp(endDtStr + " 23:59:59");
    date.setMonth(date.getMonth() - 1);
    let startDtStr = util.formatDate(date).substr(0, 10);
    let startDt = util.dateToStamp(startDtStr + " 0:0:0");

    let setdata = {
      windowWidth: windowWidth,
      lineWidth: windowWidth - padding * 2,
      ringWidth: (windowWidth - padding * 2) * 0.33,
      startDtStr: startDtStr,
      startDt: startDt,
      endDtStr: endDtStr,
      endDt: endDt
    };
    options.tabIndex = options.tabIndex ? options.tabIndex:0;
    if (options.tabIndex!=undefined) {
      setdata.tabIndex = options.tabIndex;
      wx.setNavigationBarTitle({
        title: this.data.tabs[options.tabIndex],
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }

    this.setData(setdata);

    //获取所有校区
    network.requestLoading('/manage/get_campus', {}, "", res => {
      if (res.status == 1) {
        //设置五个tab对应的校区id为空
        this.setData({
          campus: [{
            "id": "",
            "name": "全部"
          }].concat(res.data),
          campusId1: "",
          campusId2: "",
          campusId3: "",
          campusId4: "",
          campusId5: "",
        });
        //获取体测大类
        network.requestLoading('/manage/get_tps_big_class', {}, "", res => {
          if (res.status == 1) {
            this.setData({
              tps_big_class: res.data,
              bigclassId: res.data[0].id
            });
            if (res.data && res.data[0]) {

            }
            //初始tab
            this.changeTab();
          } else {
            util.toast('获取数据失败，请尝试重新进入本页面')
          }
        }, error => {
          util.toast('获取数据失败，请尝试重新进入本页面')
        })
      } else {
        util.toast('获取数据失败，请尝试重新进入本页面')
      }
    }, error => {
      util.toast('获取数据失败，请尝试重新进入本页面')
    })
  },
  tab2age: function(e) {
    this.bodytest_statistics();
  },
  //5个主要tab改变
  tabIndex: function(e) {
    let index = e.detail.value;
    index = index == 5 ? 2 : index;
    this.setData({
      tabIndex: index
    });
    this.changeTab();
  },
  changeTab: function() {
    switch (parseInt(this.data.tabIndex)) {
      case 0:
        //企业效率分析
        this.business_efficiency_analysis();
        break;
      case 1:
        //体测
        this.bodytest_statistics();
        break;
      case 2:
        //财务统计
        this.financial_statistics();
        break;
      case 3:
        //教务统计
        this.educational_affairs_statistics();
        break;
      case 4:
        //销售统计
        this.sales_statistics();
        break;
    }
  },
  tab3Index: function(e) {
    let index = e.detail.value;
    this.setData({
      tab3Index: index
    });
    this.educational_affairs_statistics();
  },

  tab2items: function(e) {
    this.setData({
      tab2itemsIndex: e.currentTarget.dataset.index
    });
    this.reloadTab2Charts();
  },

  sexchange: function(e) {
    this.setData({
      tab2sex: e.currentTarget.dataset.sex
    });
    this.bodytest_statistics()
  },
  daterange1change: function(e) {
    this.setData({
      daterange1: e.detail
    });
    this.business_efficiency_analysis();
  },

  daterange2change: function(e) {
    this.setData({
      daterange2: e.detail
    });
    this.bodytest_statistics();
  },
  daterange3change: function(e) {
    this.setData({
      daterange3: e.detail
    });
    this.financial_statistics();
  },
  daterange4change: function(e) {
    this.setData({
      daterange4: e.detail
    });
    this.educational_affairs_statistics();
  },
  daterange5change: function(e) {
    this.setData({
      daterange5: e.detail
    });
    this.sales_statistics();
  },
  tags1change: function(e) {
    this.setData({
      campusId1: this.data.campus[e.detail.index].id
    })
    this.business_efficiency_analysis();
  },
  tags2change: function(e) {
    this.setData({
      bigclassId: this.data.tps_big_class[e.detail.index].id
    })
    this.bodytest_statistics()
  },

  tags3change: function(e) {
    this.setData({
      campusId3: this.data.campus[e.detail.index].id
    })
    this.financial_statistics();
  },
  tags4change: function(e) {
    this.setData({
      tjxm3: e.detail.index + 1
    })
    this.financial_statistics()
  },

  tags5change: function(e) {
    this.setData({
      campusId4: this.data.campus[e.detail.index].id
    })
    this.educational_affairs_statistics();
  },

  tags6change: function(e) {
    this.setData({
      tjxm4: e.detail.index + 1
    })
    this.educational_affairs_statistics()
  },

  tags7change: function(e) {
    this.setData({
      campusId5: this.data.campus[e.detail.index].id
    })
    this.sales_statistics();
  },

  tags8change: function(e) {
    this.setData({
      tjxm5: e.detail.index + 1
    })
    this.sales_statistics()
  },
  //销售统计图表标题左右滑动切换图表
  touchStart: function(e) {
    this.setData({
      pageX: e.changedTouches[0].pageX
    })
  },
  //销售统计图表标题左右滑动切换图表
  touchEnd: function(e) {
    //滑动小于20判定非滑动手势
    if (Math.abs(e.changedTouches[0].pageX - this.data.pageX) < 20) {
      return
    }
    let index = e.currentTarget.dataset.index;
    let analysis = this.data.sales_statistics[index];
    //如果没有显示图表  返回
    if (!analysis.showChart) {
      return;
    }
    if (e.changedTouches[0].pageX > this.data.pageX) {
      console.log("右滑")
      this.SalesStatisticsNext(e);
    } else {
      console.log("左滑")
      this.SalesStatisticsPrev(e);
    }
  },
  //销售统计切换下一个统计图
  SalesStatisticsNext: function(e) {
    let index = e.currentTarget.dataset.index;
    let analysis = this.data.sales_statistics[index];
    if (analysis.stuLogType == 2) {
      analysis.stuLogType = 10;
      analysis.showName = "试课人数";
      analysis.showNum = analysis.teststudent;
    } else if (analysis.stuLogType == 10) {
      analysis.stuLogType = 3;
      analysis.showName = "转正人数";
      analysis.showNum = analysis.nomalstudent;
    } else if (analysis.stuLogType == 3) {
      analysis.stuLogType = 20;
      analysis.showName = "续卡人数";
      analysis.showNum = analysis.renewstudent;
    } else if (analysis.stuLogType == 20) {
      analysis.stuLogType = 2;
      analysis.showName = "新生咨询";
      analysis.showNum = analysis.newstudent;
    }
    this.preLoadSalesStatisticsChart(index);
  },
  //销售统计切换上一个统计图
  SalesStatisticsPrev: function(e) {
    let index = e.currentTarget.dataset.index;
    let analysis = this.data.sales_statistics[index];
    if (analysis.stuLogType == 2) {
      analysis.stuLogType = 20;
      analysis.showName = "续卡人数";
      analysis.showNum = analysis.renewstudent;
    } else if (analysis.stuLogType == 10) {
      analysis.stuLogType = 2;
      analysis.showName = "新生咨询";
      analysis.showNum = analysis.newstudent;
    } else if (analysis.stuLogType == 3) {
      analysis.stuLogType = 10;
      analysis.showName = "试课人数";
      analysis.showNum = analysis.teststudent;
    } else if (analysis.stuLogType == 20) {
      analysis.stuLogType = 3;
      analysis.showName = "转正人数";
      analysis.showNum = analysis.nomalstudent;
    }
    this.preLoadSalesStatisticsChart(index);
  },
  //销售统计
  sales_statistics: function() {
    let params = {
      "startDt": this.data.startDt,
      "endDt": this.data.endDt,
      "tab": this.data.tjxm5,
      "campusId": this.data.campusId5 || ""
    };
    if (this.data.daterange5 && this.data.daterange5.startDt) {
      params.startDt = this.data.daterange5.startDt;
      params.endDt = this.data.daterange5.endDt;
    }
    if (params.startDt > params.endDt) {
      util.toast('开始时间必须小于结束时间')
      return
    }
    network.requestLoading('/manage/sales_statistics', params, "", res => {
      if (res.status == 1) {
        //配色方案
        let colors = [{
            bg: "#918AFB", //背景色
            textColor1: "#531BC6", //新生咨询、试课人数等的颜色
            textColor2: "#EFEEFC", //人数、收入等的颜色
            dividerbg1: "#c6c6c6",
            dividerbg2: "#a59ff8",
          },
          {
            bg: "#EFBF4D",
            textColor1: "#9D720C",
            textColor2: "#9D720C",
            dividerbg1: "#fff",
            dividerbg2: "#FFE6C1",
          },
          {
            bg: "#FFA489",
            textColor1: "#6C1E07",
            textColor2: "#E76B46",
            dividerbg1: "#fff",
            dividerbg2: "#FFE6C1",
          },
          {
            bg: "#8DB0FF",
            textColor1: "#0018FD",
            textColor2: "#456FCE",
            dividerbg1: "#fff",
            dividerbg2: "#BECDEE",
          }
        ]
        res.data.analysis.forEach((e, index) => {
          e.color = colors[index % 4];
          e.showChart = false; //控制图表显隐
          e.stuLogType = 2; //当前显示的图表类型 2:新生咨询 10：试课人数 3：转正人数 20：续卡人数 
          e.showName = "新生咨询";
          e.showNum = e.newstudent;
        })
        this.setData({
          sales_statistics: res.data.analysis
        })
        // res.data.analysis.forEach((analysis, index) => {
        //   //判读有无数据可供显示图表
        //   let hasData = false;
        //   let showNameKey = "";
        //   let showName = "";
        //   let showNum = "";
        //   let data = [];
        //   let series = [];
        //   if (!hasData && analysis.newstudentPic && analysis.newstudentPic.length > 0) {
        //     hasData = true;
        //     showNameKey = "newstudentPic";
        //     showName = "新生咨询";
        //     showNum = analysis.newstudent;
        //   }
        //   if (!hasData && analysis.teststudenttPic && analysis.teststudenttPic.length > 0) {
        //     hasData = true;
        //     showNameKey = "teststudenttPic";
        //     showName = "试课人数";
        //     showNum = analysis.teststudent;
        //   }
        //   if (!hasData && analysis.nomalstudentPic && analysis.nomalstudentPic.length > 0) {
        //     hasData = true;
        //     showNameKey = "nomalstudentPic";
        //     showName = "转正人数";
        //     showNum = analysis.nomalstudent;
        //   }
        //   if (!hasData && analysis.renewstudentPic && analysis.renewstudentPic.length > 0) {
        //     hasData = true;
        //     showNameKey = "renewstudentPic";
        //     showName = "续卡人次";
        //     showNum = analysis.renewstudent;
        //   }
        //   analysis.hasData = hasData;
        //   analysis.showName = showName;
        //   analysis.showNum = showNum;
        //   if (hasData) {
        //     analysis[showNameKey].forEach(e => {
        //       let date = new Date(e.day * 1000);
        //       let month = date.getMonth();
        //       let day = date.getDate();
        //       series.push((month < 10 ? "0" + month : "" + month) + "." + (day < 10 ? "0" + day : "" + day));
        //       data.push(e.peopleNum);
        //     })
        //     this.loadLineCharts("tab5canvas" + index, series, [{
        //       name: "cjl",
        //       data: data,
        //       color: analysis.color.bg
        //     }], "", 0, this.data.lineWidth);
        //   }
        // })

        this.setData({
          sales_statistics: res.data.analysis
        })
      } else {
        util.toast(res.message || '获取数据失败')
      }
    }, error => {
      util.toast('网络请求失败')
    })
  },
  //销售统计控制图表显隐
  showChart: function(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      [`sales_statistics[${index}].showChart`]: !this.data.sales_statistics[index].showChart
    });
    if (this.data.sales_statistics[index].showChart) {
      this.preLoadSalesStatisticsChart(index);
    }
  },
  //准备加载销售统计的曲线图
  preLoadSalesStatisticsChart: function(index) {
    let series = [];
    let data = [];
    let analysis = this.data.sales_statistics[index];
    //如果没有显示图表  返回
    if (!analysis.showChart) {
      return;
    }
    //准备请求参数
    let params = {
      "startDt": this.data.startDt,
      "endDt": this.data.endDt,
      "campusId": this.data.campusId5,
      "tab": this.data.tjxm5,
      "stuLogType": analysis.stuLogType
    };

    if (this.data.tjxm5 == 1) {
      params.trainId = analysis.trainId;
    } else if (this.data.tjxm5 == 2) {
      params.chargeType = analysis.chargeType;
    } else if (this.data.tjxm5 == 3) {
      params.memberId = analysis.memberId;
    }
    if (this.data.daterange5 && this.data.daterange5.startDt) {
      params.startDt = this.data.daterange5.startDt;
      params.endDt = this.data.daterange5.endDt;
    }
    if (params.startDt > params.endDt) {
      util.toast('开始时间必须小于结束时间')
      return
    }
    network.requestLoading('/manage/sales_statistics_picline', params, "", res => {
      if (res.status == 1) {
        let data = [];
        let series = [];
        res.data.analysis.forEach(e => {
          let date = new Date(e.day * 1000);
          let month = date.getMonth()+1;
          let day = date.getDate();
          series.push((month < 10 ? "0" + month : "" + month) + "." + (day < 10 ? "0" + day : "" + day));
          data.push(e.peopleNum);
        })
        if (data.length != 0 && series.length != 0) {
          analysis.hasData = true;
          this.loadLineCharts("tab5canvas" + index, series, [{
            name: "cjl",
            data: data,
            color: analysis.color.bg
          }], "", 0, this.data.lineWidth);
        } else {
          analysis.hasData = false;
          util.toast(analysis.showName + "无数据可展示")
        }
        this.setData({
          [`sales_statistics[${index}]`]: analysis
        })
      } else {
        util.toast(res.message || '获取数据失败')
      }
    }, error => {
      util.toast('网络出问题了...')
    })

  },
  //教务统计
  educational_affairs_statistics: function() {
    let params = {
      "startDt": this.data.startDt,
      "endDt": this.data.endDt,
      "campusId": this.data.campusId4 || "",
      "bigtab": this.data.tab3Index + 1,
      "tab": this.data.tjxm4
    };
    if (this.data.daterange4 && this.data.daterange4.startDt) {
      params.startDt = this.data.daterange4.startDt;
      params.endDt = this.data.daterange4.endDt;
    }
    if (params.startDt > params.endDt) {
      util.toast('开始时间必须小于结束时间')
      return
    }
    //参数必须为字符串不能为数值否则报错
    for (let key in params) {
      params[key] = "" + params[key]
    }
    network.requestLoading('/manage/educational_affairs_statistics', params, "", res => {
      if (res.status == 1) {
        //配色方案1
        let tab4colors1 = [{
            bg: "#918AFB",
            color1: "#fff",
            color2: "#EBACFF"
          },
          {
            bg: "#EFBF4D",
            color1: "#fff",
            color2: "#A375FF"
          },
          {
            bg: "#FFA489",
            color1: "#fff",
            color2: "#FC6234"
          },
          {
            bg: "#8DB0FF",
            color1: "#fff",
            color2: "#73EFC2"
          }
        ]
        //配色方案2
        let tab4colors2 = [{
            bg: "#918AFB",
            color1: "#EBACFF",
            color2: "#81E2E8",
            color3: "#FF7979",
            color4: "#FFE400"
          },
          {
            bg: "#EFBF4D",
            color1: "#FF7200",
            color2: "#E0A32D",
            color3: "#9BB4EF",
            color4: "#00A0E9"
          },
          {
            bg: "#FFA489",
            color1: "#FEEF00",
            color2: "#FF6B64",
            color3: "#EE88D7",
            color4: "#D09BEF"
          }
        ];
        //消课统计
        if (params.bigtab == 1) {
          res.data.analysis.forEach((e, index) => {
            e.allnum = e.allnum ? e.allnum : 0;
            e.eliminateclassnum = e.eliminateclassnum ? e.eliminateclassnum : 0;
            e.color = tab4colors1[index % 4];
            e.percent1 = "100%";
            //计算消课长度百分比
            if (e.allnum == 0) {
              if (e.eliminateclassnum == 0) {
                e.title = "0%";
                e.percent2 = "0%";
                e.percent1 = "0%";
              } else {
                e.title = "100%";
                e.percent2 = "100%";
              }
            } else {
              e.title = Number.parseInt(((e.eliminateclassnum / e.allnum) * 100)) + "%";
              e.percent2 = Number.parseInt(((e.eliminateclassnum / e.allnum) * 100)) + "%";
            }
          })
          this.setData({
            tab4data1: res.data.analysis
          })
          this.data.tab4data1.forEach((e, index) => {
            let series = [];
            series.push({
              name: "a",
              data: e.allnum,
              color: e.color.color1
            })
            series.push({
              name: "a",
              data: e.eliminateclassnum,
              color: e.color.color2
            })
            //数据全0圆环图显示异常 填充一个数据
            if (Math.max(e.eliminateclassnum, e.allnum) == 0) {
              series.push({
                name: "a",
                data: 1,
                color: "#fff"
              })
            }
            //解决一些情况下图表不显示
            setTimeout(() => {
              this.loadRingChart3('tab4ring1' + index, series, e.title, e.color.bg);
            },50)
          })
        } else {
          //出勤统计
          res.data.analysis.forEach((e, index) => {
            e.attendance = e.attendance ? e.attendance : 0;
            e.late = e.late ? e.late : 0;
            e.leave = e.leave ? e.leave : 0;
            e.absence = e.absence ? e.absence : 0;

            e.attendance = Number.parseInt(e.attendance);
            e.late = Number.parseInt(e.late);
            e.leave = Number.parseInt(e.leave);
            e.absence = Number.parseInt(e.absence);

            e.color = tab4colors2[index % 3];
            e.title = Number.parseInt(e.percent) + "%";
            e.percent1 = "100%";

            //计算各种类型的长度百分比
            let max = Math.max(e.attendance, e.late, e.leave, e.absence)
            if (max > 0) {
              e.percent1 = Number.parseInt(((e.attendance / max) * 100)) + "%";
              e.percent2 = Number.parseInt(((e.late / max) * 100)) + "%";
              e.percent3 = Number.parseInt(((e.leave / max) * 100)) + "%";
              e.percent4 = Number.parseInt(((e.absence / max) * 100)) + "%";
            } else {
              e.percent1 = "0%";
              e.percent2 = "0%";
              e.percent3 = "0%";
              e.percent4 = "0%";
            }
          })
          this.setData({
            tab4data2: res.data.analysis
          })
          this.data.tab4data2.forEach((e, index) => {
            let series = [];
            series.push({
              name: "a",
              data: e.attendance,
              color: e.color.color1
            })
            series.push({
              name: "a",
              data: e.late,
              color: e.color.color2
            })
            series.push({
              name: "a",
              data: e.leave,
              color: e.color.color3
            })
            series.push({
              name: "a",
              data: e.absence,
              color: e.color.color4
            })
            //数据全0时圆环显示有问题 加一个数据填满圆环
            if (Math.max(e.attendance, e.late, e.leave, e.absence) == 0) {
              series.push({
                name: "a",
                data: 1,
                color: "#fff"
              })
            }
            //解决一些情况下图表不显示
            setTimeout(()=>{
              this.loadRingChart3('tab4ring2' + index, series, e.title, e.color.bg);
            },50)
          })
        }
      } else {
        util.toast(res.message || '获取数据失败')
      }
    }, error => {
      util.toast('网络请求失败')
    })
  },

  //分析_企业效率分析
  business_efficiency_analysis: function() {
    let params = {
      "startDt": this.data.startDt,
      "endDt": this.data.endDt,
      "campusId": this.data.campusId1 || ""
    };
    if (this.data.daterange1 && this.data.daterange1.startDt) {
      params.startDt = this.data.daterange1.startDt;
      params.endDt = this.data.daterange1.endDt;
    }
    if (params.startDt > params.endDt) {
      util.toast('开始时间必须小于结束时间')
      return
    }
    network.requestLoading('/manage/business_efficiency_analysis', params, "", res => {
      if (res.status == 1) {
        res.data.becomeformal = res.data.becomeformal > 100 ? 100 : res.data.becomeformal;
        res.data.introduction = res.data.introduction > 100 ? 100 : res.data.introduction;
        res.data.gotoclass = res.data.gotoclass > 100 ? 100 : res.data.gotoclass;
        res.data.renew = res.data.renew > 100 ? 100 : res.data.renew;
        res.data.renewincome = res.data.renewincome > 100 ? 100 : res.data.renewincome;
        res.data.refund = res.data.refund > 100 ? 100 : res.data.refund;

        let series = [];
        let data = [];
        let total = 0;
        res.data.linePic.forEach(e => {
          let date = new Date(e.day * 1000);
          let month = date.getMonth()+1;
          let day = date.getDate();
          series.push((month < 10 ? "0" + month : "" + month) + "." + (day < 10 ? "0" + day : "" + day));
          data.push(e.peopleNum);
          total += e.peopleNum;
        });
        res.data.total = total;
        if (series.length != 0 && data.length != 0) {
          this.loadLineCharts("lineCanvas1", series, [{
            name: "cjl",
            data: data,
            color: "#A375FF"
          }], "", 0, this.data.lineWidth);
        }
        this.loadRingChart('ringCanvas1', res.data.becomeformal, "#8DC8FF");
        this.loadRingChart('ringCanvas2', res.data.introduction, "#8DC8FF");
        this.loadRingChart('ringCanvas3', res.data.gotoclass, "#FF6633");
        this.loadRingChart('ringCanvas4', res.data.renew, "#44D2C9");
        this.loadRingChart('ringCanvas5', res.data.renewincome, "#6DCA57");
        this.loadRingChart('ringCanvas6', res.data.refund, "#A375FF");
        this.setData({
          business_efficiency_analysis: res.data
        })
      } else {
        util.toast(res.message || '获取数据失败')
      }
    }, error => {
      util.toast('网络请求失败')
    })
  },

  //体测统计
  bodytest_statistics: function() {
    if (!this.data.startAge || !this.data.endAge) {
      util.toast('请输入年龄')
      return
    }
    let params = {
      "startDt": this.data.startDt,
      "endDt": this.data.endDt,
      "startAge": this.data.startAge,
      "endAge": this.data.endAge,
      "sex": this.data.tab2sex,
      "bigclassId": this.data.bigclassId
    };
    if (this.data.daterange2 && this.data.daterange2.startDt) {
      params.startDt = this.data.daterange2.startDt;
      params.endDt = this.data.daterange2.endDt;
    }
    if (params.startDt > params.endDt) {
      util.toast('开始时间必须小于结束时间')
      return
    }
    network.requestLoading('/manage/bodytest_statistics', params, "", res => {
      if (res.status == 1) {
        //依照设计图 每隔3个放一个canvas图表 获取上下界 控制显隐
        res.data.forEach((e, index) => {
          let i = index;
          e.top = 3 - (i % 3) + i;
          e.bottom = e.top - 3;
        })
        this.setData({
          bodytest_statistics: res.data,
          tab2itemsIndex: -1
        })
        if (!res.data[this.data.tab2itemsIndex]) {
          this.setData({
            tab2itemsIndex: 0
          })
          if (!res.data[0]) {
            this.setData({
              tab2itemsIndex: -1
            })
          }
          if (this.data.tab2itemsIndex >= 0) {
            this.reloadTab2Charts();
          }
        }
      } else {
        util.toast(res.message || '获取数据失败')
      }
    }, error => {
      util.toast('网络请求失败')
    })
  },

  //分析_财务统计
  financial_statistics: function() {
    let params = {
      "startDt": this.data.startDt,
      "endDt": this.data.endDt,
      "campusId": this.data.campusId3,
      "tab": this.data.tjxm3
    };
    if (this.data.daterange3 && this.data.daterange3.startDt) {
      params.startDt = this.data.daterange3.startDt;
      params.endDt = this.data.daterange3.endDt;
    }
    if (params.startDt > params.endDt) {
      util.toast('开始时间必须小于结束时间')
      return
    }
    network.requestLoading('/manage/financial_statistics', params, "", res => {
      if (res.status == 1) {
        this.setData({
          financial_statistics: res.data
        });
      } else {
        util.toast('获取数据失败，请尝试重新进入本页面')
      }
    }, error => {
      util.toast('获取数据失败，请尝试重新进入本页面')
    })
  },
  //加载体测图表
  reloadTab2Charts: function() {
    //图表配色方案
    let colors = ["#FFCC66", "#F74A4A", "#A375FF", "#F87D57", "#9BCDFC"];
    //如果没有可显示的数据隐藏图表
    if (this.data.bodytest_statistics[this.data.tab2itemsIndex].picInfo.length == 0) {
      this.setData({
        bodytest_statistics_hide: true,
        showRingCanvas7: false
      })
      util.toast("该项目暂无数据");
      return
    }
    //计算总数，以便计算百分比
    let total = 0;
    this.data.bodytest_statistics[this.data.tab2itemsIndex].picInfo.forEach(e => {
      total += e.num;
    });
    this.data.bodytest_statistics[this.data.tab2itemsIndex].picInfo.forEach((picInfo, index) => {
      picInfo.name = picInfo.title;
      picInfo.data = picInfo.num;
      picInfo.color = colors[index % 4];
      picInfo.percent = picInfo.num
    });
    this.setData({
      [`bodytest_statistics[${this.data.tab2itemsIndex}]`]: this.data.bodytest_statistics[this.data.tab2itemsIndex],
      bodytest_statistics_hide: false
    })
    //根据不同情况获取canvasId
    //正常情况下
    let ringCanvas7Id = 'ringCanvas7' + this.data.bodytest_statistics[this.data.tab2itemsIndex].top;
    //特殊情况 wxfor没有生成的
    let yushu = this.data.bodytest_statistics.length%3;
    if (yushu != 0 && (this.data.tab2itemsIndex>=this.data.bodytest_statistics.length - yushu)) {
      ringCanvas7Id = 'ringCanvas7'
      this.setData({
        showRingCanvas7:true
      })
    }else{
      this.setData({
        showRingCanvas7: false
      })
    }
    //延时执行  解决有时不能绘制canvas问题
    setTimeout(() => {
      this.loadRingChart2(ringCanvas7Id, this.data.bodytest_statistics[this.data.tab2itemsIndex].picInfo);
    }, 100)
  },
  //加载折线图
  loadLineCharts: function(canvasId, categories, series, yAxisUtil, yAxisMin, width) {
    let sortedData = series[0].data.slice().sort().reverse();
    let max = sortedData[0];
    let chartObj = new wxCharts({
      canvasId: canvasId,
      type: 'line',
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
  //加载圆环图 单百分比形式
  loadRingChart: function(canvasId, percent, color) {
    let chartObj = new wxCharts({
      canvasId: canvasId,
      animation: false, //图表太多动画引起卡顿
      ringPadding: 6, //修改默认padding
      type: 'ring',
      disablePieStroke: true,
      legend: false,
      title: {
        name: percent + "%",        
        fontSize: 14,
        color: "#333"
      },
      series: [{
        name: 'name1',
        data: percent,
        color: color || "#FF6633"
      }, {
        name: 'name2',
        data: (100 - percent),
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
    this.setData({
      [`${canvasId}`]: chartObj
    })
  },

  //加载圆环图 正常形式
  loadRingChart2: function(canvasId, series) {
    console.log(canvasId, series)
    let chartObj = new wxCharts({
      canvasId: canvasId,
      animation: false, //图表太多动画引起卡顿
      ringPadding: 6, //修改默认padding
      type: 'ring',
      disablePieStroke: false,
      legend: false,
      series: series,
      width: this.data.lineWidth / 2,
      height: this.data.canvasHeight,
      dataLabel: false,
      extra: {
        ringWidth: 24,
        pie: {
          offsetAngle: -90
        }
      }
    });
  },

  //加载圆环图 tab3教务统计
  loadRingChart3: function(canvasId, series, title, bg) {
    let chartObj = new wxCharts({
      canvasId: canvasId,
      background: bg || "#918AFB",
      title: {
        name: title,
        fontSize: 14,
        color: "white"
      },
      animation: false, //图表太多动画引起卡顿
      ringPadding: 6, //修改默认padding
      type: 'ring',
      disablePieStroke: true,
      series: series,
      legend: false,
      width: this.data.ringWidth,
      height: this.data.canvasHeight,
      dataLabel: false,
      extra: {
        ringWidth: 6,
        pie: {
          offsetAngle: -90
        }
      }
    });
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