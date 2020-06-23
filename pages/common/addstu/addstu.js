// pages/common/addstu/addstu.js
let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')
Page({
  data: {
    students: [],
    chkStus: [],
    selectBtnTxt: "勾选",
    inputVal: "",
    searchParam: { campusId:""},
    offset: network.offset,
    limit: network.limit,
    selectMode:false, 
    selectAll:false,
    isLoad: true,
    btnMsg: "新增学员"
  },
  selectAll: function () {
    this.setData({
      selectAll: !this.data.selectAll
    })
    for (let i = 0; i < this.data.students.length; i++) {
      this.setData({
        [`students[${i}].selected`]: this.data.selectAll
      })
    }
    if (this.data.selectAll) {
      this.setData({
        selectBtnTxt: "全选"
      })
    } else {
      this.setData({
        selectBtnTxt: "勾选"
      })
    }
  },
  selectMode: function () {
    this.setData({
      selectMode: !this.data.selectMode
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let setdata = {};
    setdata.ptype = options.ptype;
    if (options.ptype == 0){
      let btnMsg = "新增学员";
      if (wx.getStorageSync("classesTimes").length > 1){
        btnMsg = "下一步";
      }
      setdata.btnMsg = btnMsg;
      setdata.classesTimes = wx.getStorageSync("classesTimes");
      setdata.classesId = options.classesId;
    } else if (options.ptype == 1){
      setdata.classesHourId = options.classesHourId;
    }
    this.setData(setdata);
    this.getFilter();
    this.addstu_list();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.addstu_list();
  },
  initPageParam: function(){
    this.setData({
      students: [],
      offset: network.offset,
      limit: network.limit,
      isLoad: true
    })
  },
  inputTyping: function (e) {
    if (e.detail) {
      this.setData({
        inputVal: e.detail.value ? e.detail.value : "",
      });
      if (e.detail.searchParam) {
        this.setData({
          searchParam: e.detail.searchParam,
        });
      }
      this.initPageParam();
      this.addstu_list();
    }
  },
  getFilter: function () {
    network.request(
      "/manage/filter_option", { campus: 1 },
      res => {
        if (res.status == "1") {
          this.setData({
            filterParam: res.data
          });
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
  //获取学生列表
  addstu_list: function () {
    if (!this.data.isLoad) {
      return;
    }
    let url = "";
    if (this.data.ptype == 0) {
      url = "/manage/stucrs_list";
    }else if (this.data.ptype == 1){
      url = "/manage/clshour_addstu";
    }
    let params = {};
    if (this.data.classesId){
      params.classesId = this.data.classesId;
    }
    if (this.data.classesHourId) {
      params.classesHourId = this.data.classesHourId;
    }
    params.campusId = this.data.searchParam.campusId;
    params.areaNum = this.data.searchParam.areaNum;
    params.inputVal = this.data.inputVal;
    params.offset = this.data.offset;
    params.limit = this.data.limit;
    network.request(url, params, 
      res => {
        if (res.status == 1) {
          //设置默认的卡为第一涨
          res.data.forEach(stu => {
            stu.cardIndex = 0;
            stu.selected = false;
            stu.stuCourseVos.forEach(stuCourseVo => {
              stuCourseVo.courseNameDisplay = stuCourseVo.courseName;
              if (stuCourseVo.isOpen == 0) {
                stuCourseVo.courseNameDisplay += " (未开卡)";
              } else if (stuCourseVo.chargeType < 3) {
                stuCourseVo.courseNameDisplay += " (剩" + stuCourseVo.remainVal + ")";
              }
            })
          })
          if (res.data.length > 0) {
            this.setData({
              students: this.data.students.concat(res.data),
              offset: this.data.offset + this.data.limit
            });
          } else {
            this.setData({
              isLoad: false
            });
          }
        } else {
          wx.showToast({
            title: res.message || '获取数据失败',
            icon: 'none'
          })
        }
      },
      error => {
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        })
      }
    );
  },
  addstu_sub: function () {
    let url = "";
    let params = {};
    if (this.data.ptype == 0){
      let classesTimeIds = "";
      if (this.data.classesTimes.length>0){
        classesTimeIds = this.data.classesTimes[0].classesTimeId;
      }
      url = "/manage/cls_addstu_sub";
      let studentCourses = [];
      this.data.students.forEach(stu => {
        if (stu.selected) {
          studentCourses.push({
            "studentId": stu.studentId,
            "studentCourseId": stu.stuCourseVos[stu.cardIndex].studentCourseId,
            "classesId": this.data.classesId,
            "classesTimeIds": classesTimeIds
          });
        }
      })
      if (studentCourses.length == 0) {
        wx.showToast({
          title: '请选择学员',
          icon: 'none'
        })
        return
      }
      if (this.data.classesTimes.length>1){
        wx.setStorageSync('studentCourses', studentCourses)
        wx.navigateTo({
          url: "/pages/my_class/my_class_addstu/my_class_addstu"
        })
        return;
      }
      params = studentCourses;
    }else if (this.data.ptype == 1) {
      url = "/manage/clshour_addstu_sub";
      params.classesHourId = this.data.classesHourId
      params.studentCourses = [];
      this.data.students.forEach(stu => {
        if (stu.selected) {
          params.studentCourses.push({
            "studentId": stu.studentId,
            "studentCourseId": stu.stuCourseVos[stu.cardIndex].studentCourseId
          });
        }
      })
      if (params.studentCourses.length == 0) {
        wx.showToast({
          title: '请选择学员',
          icon: 'none'
        })
        return
      }
    }
    network.requestLoading(url, params, "正在提交", 
      res => {
        if (res.status == 1) {
          wx.showToast({
            title: res.message || '添加成功',
            icon: 'none'
          });
          wx.navigateBack({
            delta: 1,
          })
        } else {
          wx.showToast({
            title: res.message || '添加失败',
            icon: 'none'
          })
        }
      },
      error => {
        wx.showToast({
          title: '操作失败',
          icon: 'none'
        })
      }
    );
  },
  bindchange: function (e) {
    this.data.students.forEach(item => {
      item.selected = false;
    })
    this.setData({
      students: this.data.students
    })
    e.detail.value.forEach(val => {
      let index = Number.parseInt(val);
      this.setData({
        [`students[${index}].selected`]: true
      })
    })
    if (e.detail.value.length > this.data.chkStus.length){
      let index = e.detail.value[e.detail.value.length-1];
      if (this.data.students[index].stuCourseVos[this.data.students[index].cardIndex].isOpen == 0) {
        wx.showModal({
          title: "提示",
          content: "学员卡未激活是否激活添加？",
          success: sm => {
            if (sm.confirm) {
            } else {
              this.setData({
                [`students[${index}].selected`]: false
              })
              this.setData({
                chkStus: e.detail.value.splice(e.detail.value.length-1,1)
              })
            }
            let allselected = true;
            this.data.students.forEach(s => {
              if (!s.selected) {
                allselected = false
              }
            })
            if (allselected) {
              this.setData({
                selectBtnTxt: "全选"
              })
            } else {
              this.setData({
                selectBtnTxt: "勾选"
              })
            }
          }
        })
      }
    } else {
      this.setData({
        chkStus: e.detail.value
      })
    }
    let allselected = true;
    this.data.students.forEach(s => {
      if (!s.selected) {
        allselected = false
      }
    })
    if (allselected) {
      this.setData({
        selectBtnTxt: "全选"
      })
    } else {
      this.setData({
        selectBtnTxt: "勾选"
      })
    }
    this.setData({
      chkStus: e.detail.value
    })
  },
  checkboxtaped: function (e) {
    if (e.currentTarget.dataset.stu.stuCourseVos.length == 0) {
      wx.showToast({
        title: '该生没有卡，无法添加',
        icon: 'none'
      })
    }
  },
  //更改卡
  changeCard: function (e) {
    let itemList = [];
    console.log(this.data.students[e.currentTarget.dataset.index].stuCourseVos)
    this.data.students[e.currentTarget.dataset.index].stuCourseVos.forEach((stuCourseVos_,index) => {
      if (this.data.students[e.currentTarget.dataset.index].cardIndex==index){
        itemList.push("√ " + stuCourseVos_.courseNameDisplay)
      }else{
        itemList.push("　" + stuCourseVos_.courseNameDisplay)
      }
    })
    wx.showActionSheet({
      itemList: itemList,
      success: res => {
        if (!res.cancel) {
          this.setData({
            [`students[${e.currentTarget.dataset.index}].cardIndex`]: res.tapIndex,
            [`students[${e.currentTarget.dataset.index}].selected`]: false
          })
        }
      }
    });
  },
});