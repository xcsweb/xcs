let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')
let wxCharts = require('../../../utils/wxcharts.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    student: {},
    tabs: ['基本资料', '跟进记录', '上课记录', '测试记录'],
    selectedTabIndex: 0,
    showSecondLineTabs: false,
    tab1Data: {},
    endTim: util.formatDate(new Date()),
    tab2Data: {},  
    tab3Data: {},
    tab4Data: {},
    tab5Data: {},
    tab6Data: {},
    tab7Data: {},
    parentAdd: [1],
    tab8Data: {},
    tab1DataSex: ["女", "男"],
    tab5BtnIndex: 0,
    msgsenderShow:false,
    showVideo: false,
    tab7BtnIndex: 0,
    multichoice1: false,
    multichoiceItems1: [],
    multichoiceName1: "",
    multichoiceValue1: "",
    multichoice2: false,
    multichoiceItems2: [],
    multichoiceName2: "",
    multichoiceValue2: "",
    stu_tps_curve_listIndex: 0
  },
  //显示第二行Tabs
  showSecondLineTabs: function() {
    this.setData({
      showSecondLineTabs: !this.data.showSecondLineTabs
    })
  },
  //头像加载失败时
  errorImg: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      [`student.avatar`]: "/imgs/common/104-104@2x.png"
    })
  },
  //添加家长
  parentAdd: function () {
    let parentAdd = this.data.parentAdd;
    parentAdd.push(1);
    this.setData({
      parentAdd: parentAdd
    })
  },
  msgsenderShow: function () {
    this.setData({
      msgsenderShow: true
    })
  },
  closeVideo: function() {
    this.setData({
      showVideo: false
    })
  },
  stageCrmtagChange: function(e) {
    let index = Number.parseInt(e.detail.value);
    let crmtagId = this.data.tab1Data.stageCrmtag[index].crmtagId;
    let namestageLable = this.data.tab1Data.stageCrmtag[index].name;
    this.data.tab1Data.student.stageCrmtagId = crmtagId;
    this.data.tab1Data.student.stageLable = namestageLable;
    this.setData({
      tab1Data: this.data.tab1Data,
      student: this.data.student,
    })
  },
  intentionsChange: function(e) {
    let index = Number.parseInt(e.detail.value);
    let codeValue = this.data.tab1Data.intentions[index].codeValue;
    let codeDisplay = this.data.tab1Data.intentions[index].codeDisplay;
    this.data.tab1Data.student.saleIntention = codeValue;
    this.data.tab1Data.student.intentionName = codeDisplay;
    this.setData({
      tab1Data: this.data.tab1Data,
      intentionsIndex: index
    })
  },

  //查看已上传的附件 图片或视频
  viewAttachment: function(e) {
    let dataset = e.currentTarget.dataset;
    console.log(dataset)
    if (dataset.video) {
      this.setData({
        videoSrc: this.data.vod_url + dataset.attachment,
        showVideo: true
      })
    } else {
      wx.previewImage({
        current: this.data.img_url + dataset.attachment, // 当前显示图片的http链接
        urls: [this.data.img_url + dataset.attachment] // 需要预览的图片http链接列表
      })
    }
  },
  //改变tab
  changeTab: function(event) {
    let tabIndex = event.currentTarget.dataset.tabindex;
    this.setData({
      selectedTabIndex: tabIndex
    });
    this.stu_detail();
  },
  tab5BtnIndex: function(e) {
    this.setData({
      tab5BtnIndex: e.currentTarget.dataset.index
    })
  },
  tab7BtnIndex: function(e) {
    this.setData({
      tab7BtnIndex: e.currentTarget.dataset.index
    });
    if (this.data.tab7BtnIndex == 1) {
      this.get_stu_tps_curve_list();
    }
  },
  stu_tps_curve_listIndex: function(e) {
    this.setData({
      stu_tps_curve_listIndex: e.currentTarget.dataset.index
    });
    this.get_stu_tps_curve_content(this.data.stu_tps_curve_list[e.currentTarget.dataset.index].id);
  },
  tab7ShowListItemDetail: function(e) {
    this.setData({
      [`tab7Data[${e.currentTarget.dataset.index}].show`]: !this.data.tab7Data[e.currentTarget.dataset.index].show
    })
  },
  saleCourseIndexChange:function(e){
    this.setData({
      ['tab1Data.student.saleCoursePrice']: this.data.tab1Data.courses_[this.data.saleCourseIndex].salesAmount
    })
  },
  //根据tabIndex获取数据
  stu_detail: function() {
    let tab = this.data.selectedTabIndex + 1;
    tab = tab == 4 ? 7 : tab;
    tab = tab == 2 ? 6 : tab;
    network.requestLoading('/manage/stu_detail', {
      studentId: this.data.student.studentId,
      tab: tab
    }, "", res => {
      if (res.status == 1) {
        if (tab == 1) {
          //销毁组件重建避免一些问题
          this.setData({
            ['tab1Data.loaded']:false
          })
          res.data.student.sex = Number.parseInt(res.data.student.sex)
          this.setData({
            ['student.name']: res.data.student.name
          })
          if (res.data.student.birthDt) {
            res.data.student.birthDt_ = util.formatTime(new Date(res.data.student.birthDt * 1000)).split(" ")[0]
          }
          if (typeof res.data.student.stageCrmtagId == 'number') {
            res.data.stageCrmtag.forEach(stageCrmtag => {
              if (stageCrmtag.crmtagId == res.data.student.stageCrmtagId) {
                res.data.student.stageLable = stageCrmtag.name;
              }
            })
          }
          res.data.student.user = {
            userId: res.data.student.studentId,
            userName: res.data.student.userName,
            password: "111111"
          }
          
          res.data.areaCampuses.forEach((areaCampuses, areaCampusesIndex)=>{
            areaCampuses.campusVos.forEach((campusVos, campusVosIndex)=>{
              if (campusVos.campusId == res.data.student.campusId){
                this.setData({
                  areaCampusesIndex: areaCampusesIndex,
                  campusVosIndex: campusVosIndex
                })
              }
            })
          })
          if (res.data.student.sourceCrmtagId){
            res.data.sourceCrmtag.forEach(e=>{
              if (e.crmtagId == res.data.student.sourceCrmtagId) {
                res.data.student.sourceCrmtagName=e.name;
              }
            })
          }
          //intentionsIndex
          if (res.data.student.saleIntention){
            res.data.intentions.forEach((e,index) => {
              if (e.codeValue == res.data.student.saleIntention) {
                res.data.student.intentionName = e.codeDisplay;
                this.setData({
                  intentionsIndex:index
                })
              }
            })
          }
          

          //studentCoursesIndex
          res.data.courses_ = [];
          if (res.data.student.campusId) {
            //意向产品取消选中
            this.setData({
              saleCourseIndex:-1
            })
            //根据学员的学校id获取学校的课程
            res.data.courses.forEach((e, index) => {
              if (e.campusIds.split(",").indexOf(res.data.student.campusId + "") >= 0) {
                res.data.courses_.push(e); //saleCourseIndex
                //意向产品 选中
                if (res.data.student.saleCourseId == e.courseId) {
                  this.setData({
                    saleCourseIndex: res.data.courses_.length - 1
                  })
                }
              }
            })
          }
        }
        if (tab == 3) {
          res.data.forEach(d => {
            if (d.checkInDt && d.checkInDt>0)
              d.checkInDt_ = util.formatTime(new Date(d.checkInDt * 1000))
            else{
              d.checkInDt_="";
            }
          })

          res.data.forEach(d => {
            d.teacherInfo.forEach(teacherInfo => {
              if (!d.teacherInfo_){
                d.teacherInfo_="";
              }
              d.teacherInfo_ += teacherInfo.teacherName
              d.teacherInfo_ += ","
            })
          })
        }

        if (tab == 5) {
          res.data.scoreRecord.forEach(d => {
            d.createDt = util.formatTime(new Date(d.createDt * 1000))
          })
        }


        if (tab == 6) {
          res.data.forEach(d => {
            d.createDt_ = util.formatTime(new Date(d.createDt * 1000))
            if (d.imgfiles) {
              d.imgfiles = d.imgfiles.split(",").filter(imgfile => {
                return imgfile ? true : false;
              })
            }
            if (d.vodfiles) {
              d.vodfiles = d.vodfiles.split(",").filter(vodfile => {
                return vodfile ? true : false;
              })
            }
          })
        }


        if (tab == 7) {
          res.data.forEach(d => {
            d.day = util.formatTime(new Date(d.createDt * 1000)).substr(0, 11)
          })
        }
        let data = {};
        res.data.loaded = true; //用于判断该tab数据是否已获取，避免显示undefined
        console.log(res.data)
        data["tab" + tab + "Data"] = res.data;
        this.setData(data)
      } else {
        wx.showToast({
          title: '获取数据失败',
          icon: "none"
        })
      }
    }, error => {
      wx.showToast({
        title: '获取数据失败',
        icon: "none"
      })
    })
  },

  //根据校区改变重置可选的意向产品
  resetTab1Course_: function (e) {
    if (this.data.tab1Data.student.campusId && this.data.tab1Data.student.saleCourseId) {
      this.data.tab1Data.courses_ = [];
      this.data.tab1Data.courses.forEach((e, index) => {
        if (e.campusIds.split(",").indexOf(this.data.tab1Data.areaCampuses[this.data.areaCampusesIndex || 0].campusVos[this.data.campusVosIndex || 0].campusId + "") >= 0) {
          this.data.tab1Data.courses_.push(e);
        }
      })
      this.setData({
        saleCourseIndex: 0,
        ["tab1Data.courses_"]: this.data.tab1Data.courses_
      })
    }
  },
  areaCampusesIndexChange: function () {
    this.setData({
      campusVosIndex: 0
    });
    this.resetTab1Course_()
  },
  //获取体测列表
  get_tps_big_class: function () {
    network.requestLoading('/manage/get_tps_big_class', {}, "", res => {
      if (res.status == 1) {
        this.setData({
          tps_big_class:res.data
        })
      }
    }, error => {

    })
  },
  //选择了体测
  tps_big_class_change:function(e){
    let index=e.detail.value;
    let tps_big_class_ = this.data.tps_big_class[index];
    let big_class_id = tps_big_class_.id;
    let studentId = this.data.student.studentId;
    wx.navigateTo({
      url: '../tps_item_record_batch/tps_item_record_batch?big_class_id=' + big_class_id + "&studentId=" + studentId,
    })
  },
  stu_change_nomal_member: function() {
    network.requestLoading('/manage/stu_change_nomal_member', {
      "studentId": this.data.student.studentId
    }, "请稍后", res => {
      if (res.status == 1) {
        util.toast(res.message || "操作成功")
        this.stu_detail();
      } else {
        util.toast(res.message || "操作失败")
      }
    }, error => {
      util.toast("操作失败")
    })
  },
  //删除体测记录
  del_tps_item_record: function(e) {
    let index = e.currentTarget.dataset.index;
    let id = this.data.tab7Data[index].id
    network.requestLoading('/manage/del_tps_item_record', {
      "recordId": id
    }, "请稍后", res => {
      if (res.status == 1) {
        util.toast(res.message || "操作成功")
        this.stu_detail();
      } else {
        util.toast(res.message || "操作失败")

      }
    }, error => {
      util.toast("操作失败")
    })
  },
  //指标曲线 测试列表
  get_stu_tps_curve_list: function() {
    network.requestLoading('/manage/get_stu_tps_curve_list', {
      "studentId": this.data.student.studentId
    }, "", res => {
      if (res.status == 1) {
        if(res.data.length==0){
          util.toast("暂无相关数据");
        }
        this.setData({
          stu_tps_curve_list: res.data
        });
        if (res.data[0])
          this.get_stu_tps_curve_content(res.data[0].id)
      } else {
        util.toast(res.message || "获取测试列表失败")
      }
    }, error => {
      util.toast("获取测试列表失败")
    })
  },
  //指标曲线 详情
  get_stu_tps_curve_content: function(tpsItemId) {
    network.requestLoading('/manage/get_stu_tps_curve_content', {
      "tpsItemId": tpsItemId,
      "studentId": this.data.student.studentId
    }, "", res => {
      if (res.status == 1) {
        res.data.recordlist = res.data.recordlist.sort((a, b) => {
          return a.createDt - b.createDt;
        })
        this.setData({
          stu_tps_curve_content: res.data
        });
        let itemUnitInfo = res.data.itemUnitInfo;
        let categories = [];
        let data1 = [];
        let wxChartsDatasExtra=[""];
        res.data.recordlist.forEach(record => {
          record.createDt_ = util.formatTime(new Date(record.createDt * 1000)).substr(5, 5);
          categories.push(record.createDt_);
          if (!isNaN(Number.parseFloat(record.val1)))
            data1.push(Number.parseFloat(record.val1));
          else{
            if (wxChartsDatasExtra.indexOf(record.val1)>=0)
              data1.push(wxChartsDatasExtra.indexOf(record.val1)-0.2);
            else{
              wxChartsDatasExtra.push(record.val1)
              data1.push(wxChartsDatasExtra.indexOf(record.val1) - 0.2);
            }
          }
        })
        this.setData({
          wxChartsDatas:data1,
          wxChartsDatasExtra: wxChartsDatasExtra
        })
        console.log(data1)
        if (data1.length>0)
          setTimeout(() => {
          new wxCharts({
            canvasId: 'areaCanvas',
            type: (wxChartsDatasExtra.length == 1 && data1.length > 1)?'area':'line',
            categories: categories,
            dataPointShape: false,
            background:"#ffffff",
            dataLabel: false,
            series: [{
              name: this.data.stu_tps_curve_list[this.data.stu_tps_curve_listIndex || 0].title,
              data: data1,
              format: function(val) {
                return val;
              }
            }],
            yAxis: {
              format: function (val) {
                if (wxChartsDatasExtra.length==1){
                  return val
                }else{
                  val = val + 0.2;
                  if (val % 1 === 0) {
                    let index = Number.parseInt(val);
                    return wxChartsDatasExtra[index] ? (wxChartsDatasExtra[index]) : ' '
                  } else {
                    return " "
                  }
                }
              }
            },
            width: this.data.windowWidth,
            height: 150,
            extra: {
              lineStyle: "curve"
            }
          });
        }, 100)
      } else {
        util.toast(res.message || "获取数据失败")
      }
    }, error => {
      util.toast("获取数据失败")
    })
  },
  tab1DataSex: function(e) {
    this.setData({
      "tab1Data.student.sex": Number.parseInt(e.detail.value)
    })
  },
  //打电话
  calling: function() {
    if (!this.data.tab1Data.student.tel) {
      return;
    }
    wx.makePhoneCall({
      phoneNumber: this.data.tab1Data.student.tel,
      success: function() {
        console.log("拨打电话成功！")
      },
      fail: function() {
        console.log("拨打电话失败！")
      }
    })
  },
  toSendNotification(){
    let selectedInfo = this.data.tab1Data.student.name;
    let selectedStudentIds = [{ "studentId": this.data.tab1Data.student.studentId, "userId": this.data.tab1Data.student.userId }];
    wx.navigateTo({
      url: '/pages/notification/notification_add/notification_add?selectedStudentIds=' + JSON.stringify(selectedStudentIds) + "&selectedInfo=" + selectedInfo,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      img_url: network.img_url,
      vod_url: network.vod_url
    });
    wx.getSystemInfo({
      success: res => {
        this.setData({
          windowWidth: res.windowWidth
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    this.member_list();
    this.get_tps_big_class();
    
  },
  tab1PickerChangeSale: function(e) {
    let index = Number.parseInt(e.detail.value);
    this.setData({
      ["tab1Data.student.saleName"]: this.data.member_list[index].name,
      ["tab1Data.student.saleMemberId"]: this.data.member_list[index].memberId
    })
  },
  tab1PickerChangeSourceCrmtag: function(e) {
    let index = Number.parseInt(e.detail.value);
    this.setData({
      ["tab1Data.student.sourceCrmtagName"]: this.data.tab1Data.sourceCrmtag[index].name,
      ["tab1Data.student.sourceCrmtagId"]: this.data.tab1Data.sourceCrmtag[index].crmtagId
    })
  },
  showMultiChoice1: function() {
    this.setData({
      multichoice1: true,
      multichoiceItems1: this.data.tab1Data.areaCampuses,
      multichoiceName1: "areaName",
      multichoiceValue1: "areaId"
    });
  },
  showMultiChoice2: function() {
    let items = [];
    this.data.tab1Data.areaCampuses.forEach(areaCampuses => {
      if (areaCampuses.checked) {
        items = items.concat(areaCampuses.campusVos);
      }
    });
    if (items.length == 0) {
      wx.showToast({
        title: '请先选择城市',
        icon: "none"
      });
      return;
    }
    this.setData({
      multichoice2: true,
      multichoiceItems2: items,
      multichoiceName2: "campusName",
      multichoiceValue2: "campusId"
    })
  },
  multichoice1Selected: function(e) {
    let areaCampuses_str = "";
    this.data.tab1Data.areaCampuses.forEach(areaCampus => {
      e.detail.value.forEach(value => {
        if (value == areaCampus.areaId) {
          areaCampuses_str += areaCampus.areaName;
          areaCampuses_str += ',';
        }
      })
    });
    if (areaCampuses_str)
      areaCampuses_str = areaCampuses_str.substr(0, areaCampuses_str.length - 1);
    this.data.tab1Data.areaCampuses.forEach(areaCampuses_all => {
      areaCampuses_all.checked = false;
      e.detail.value.forEach(value => {
        if (value == areaCampuses_all.areaId) {
          areaCampuses_all.checked = true;
        }
      })
    });
    this.setData({
      multichoice1: false,
      areaCampuses_str: areaCampuses_str,
      "tab1Data.areaCampuses": this.data.tab1Data.areaCampuses
    });
    // wx.showToast({
    //   title: '城市修改后请重新选择校区',
    //   icon:"none"
    // });
  },
  multichoice2Selected: function(e) {
    let campusVos_str = "";
    this.data.tab1Data.areaCampuses.forEach(areaCampus => {
      areaCampus.campusVos.forEach(campusVos => {
        e.detail.value.forEach(value => {
          if (value == campusVos.campusId) {
            campusVos_str += campusVos.campusName;
            campusVos_str += ',';
          }
        })
      })
    });
    if (campusVos_str)
      campusVos_str = campusVos_str.substr(0, campusVos_str.length - 1);
    this.data.tab1Data.areaCampuses.forEach(areaCampuses_all => {
      areaCampuses_all.campusVos.forEach(campusVos => {
        campusVos.checked = false;
        e.detail.value.forEach(value => {
          if (value == campusVos.campusId) {
            campusVos.checked = true;
          }
        })
      })
    });
    let campusId = "";
    e.detail.value.forEach(value => {
      campusId += value;
      campusId += ",";
    });
    if (campusId)
      campusId = campusId.substr(0, campusId.length - 1);
    this.setData({
      multichoice2: false,
      campusVos_str: campusVos_str,
      "tab1Data.areaCampuses": this.data.tab1Data.areaCampuses,
      "tab1Data.student.campusId": campusId
    });
  },
  multichoice1Cancel: function() {
    this.setData({
      multichoice1: false
    })
  },
  multichoice2Cancel: function() {
    this.setData({
      multichoice2: false
    })
  },
  //获取老师列表
  member_list: function() {
    network.requestLoading('/manage/member_list', {}, "", res => {
      if (res.status == 1) {
        this.setData({
          member_list: res.data
        });
      }
    }, error => {})
  },
  //编辑学生数据提交
  stu_edit_sub: function() {
    let params = {
      "studentId": 1,
      "campusId": "",
      "avatar": "Fg-Hj8hiPQzwZTTAneW99WFES8Vl",
      "name": "冯雪",
      "sex": "1",
      "birthDt": 1383840000,
      "tel": "13890113141", 
      "wechatNum": "aa",
      "address": "ss",
      "icCard": "dd",
      "idNum": "ff",
      "saleIntention": "",
      "stageCrmtagId": 0,
      "saleMemberId": 3,
      "saleCourseId": 1,
      "saleCoursePrice": 10,
      "sourceCrmtagId": 0,
      "user": {
        "userId": 1,
        "userName": "admin",
        "password": "111111"
      },
      "studentParentList": []
    };
    for (let key in params) {
      params[key] = this.data.tab1Data.student[key];
    }
    if (!util.isPhone(params.tel)){
      util.toast("请输入正确手机号")
      return
    }
    //添加家长数据
    let parents = this.selectAllComponents(".com-parent");
    parents.forEach(parent => {
      if (parent.data.name && parent.data.relation) {
        params.studentParentList.push(parent.data);
      }
    });
    if (this.data.intentionsIndex) {
      params.saleIntention = this.data.tab1Data.intentions[this.data.intentionsIndex].codeValue
    }
    if (this.data.studentCoursesIndex) {
      params.saleCourseId = this.data.tab1Data.studentCourses[this.data.studentCoursesIndex].studentCourseId
    }

    if (this.data.saleCourseIndex>=0) {
      params.saleCourseId = this.data.tab1Data.courses_[this.data.saleCourseIndex].courseId
    }
    if (typeof this.data.areaCampusesIndex!='undefined'){
      let campusId = this.data.tab1Data.areaCampuses[this.data.areaCampusesIndex].campusVos[this.data.campusVosIndex || 0].campusId;
      if (campusId)
        params.campusId = campusId
    }
    network.requestLoading('/manage/stu_edit_sub', params, "正在提交", res => {
      console.log(res)
      if (res.status == 1) {
        let duration = 500;
        wx.showToast({
          title: '保存成功！',
          duration: duration
        });
        this.setData({
          parentAdd:[]
        })
        this.stu_detail();
      } else {
        wx.showToast({
          title: '保存失败',
          icon: "none"
        })
      }
    }, error => {
      wx.showToast({
        title: '保存失败',
        icon: "none"
      })
    })
  },
  //修改家长数据
  bindinputjz: function (e) {
    let data = {};
    var x = 'tab1Data.student.studentParentList[' + e.currentTarget.dataset.index + '].' + e.currentTarget.dataset.name
    this.setData({
      [x]: e.detail.value
    });
  },
  bindStudentInfoInput(e) {
    if (!e.currentTarget.dataset.name_) {
      this.setData({
        [`tab1Data.student.${e.currentTarget.dataset.name}`]: e.detail.value
      });
    } else {
      this.setData({
        [`tab1Data.student.${e.currentTarget.dataset.name_}.${e.currentTarget.dataset.name}`]: e.detail.value
      });
    }
    console.log(this.data.tab1Data.student)
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
    wx.getStorage({
      key: 'my_stu_student',
      success: res => {
        res.data.avatar = util.filterImgUrl(res.data.avatar);
        this.setData({
          student: res.data
        })
        console.log(res.data);
        this.stu_detail();
      },
    });
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