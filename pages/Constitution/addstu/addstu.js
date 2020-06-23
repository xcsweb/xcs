let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classes: [],
    selectAll: false,
    campus: [{
      name: "小学1"
    }, {
      name: "小学2"
    }],
    itemId: 15,
    bigClassId: 1,
    selectAll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData(options)
    this.get_campus();
  },
  //全选
  selectAll: function() {
    this.data.classes.forEach(clazz => {
      clazz.checked = !this.data.selectAll;
      clazz.person.students.forEach(student => {
        student.checked = !this.data.selectAll;
      })

    });
    this.setData({
      classes: this.data.classes,
      selectAll: !this.data.selectAll
    })
  },
  //监听表单改变
  checkboxgroupChange: function(e) {
    console.log(e)
    let classes = this.data.classes;
    classes.forEach(clazz => {
      if (e.currentTarget.dataset.classid == clazz.id) {
        clazz.checked = false;
        if (e.detail.value.indexOf("-" + clazz.id) >= 0) {
          clazz.checked = true;
        } 
        let checkedStuCount = 0;
        clazz.person.students.forEach(student => {
          if (clazz.checked) {
            student.checked = true;
          } else {
            student.checked = false;
            if (e.detail.value.indexOf(student.studentId + "") >= 0) {
              student.checked = true;
              checkedStuCount++;
              if (checkedStuCount == clazz.person.students.length) {
                clazz.checked = true;
              }
            }
          }
        })
      }
    });
    let selectAll = true;
    classes.forEach(cls => {
      cls.person.students.forEach(stu => {
        if (!stu.checked) {
          selectAll = false;
        }
      })
    })
    this.setData({
      classes: this.data.classes,
      selectAll: selectAll
    })
  },
  showUser: function(event) {
    let classIndex = event.currentTarget.dataset.index;
    if (!this.data.classes[classIndex].showUser)
      this.data.classes.forEach(e => {
        e.showUser = false;
      })
    this.data.classes[classIndex].showUser = !this.data.classes[classIndex].showUser
    this.setData({
      classes: this.data.classes
    })
  },
  //确定
  formSubmit: function(e) {
    console.log(e)
    let studentIds = [];
    for (let key in e.detail.value) {
      e.detail.value[key].forEach(stuId=>{
        if (studentIds.indexOf(stuId)<0){
          studentIds.push(stuId);
        }
      })
    }
    e.detail.value.studentIds = studentIds;
    if (e.detail.value.studentIds.length == 0) {
      util.toast("请选择")
      return
    }
    let params = {
      studentIds: [],
      check: []
    }

    e.detail.value.studentIds.forEach(id => {
      //form中将班级id进行了取反数以便区分学生id
      if (Number.parseInt(id) > 0) {
        params.studentIds.push({
          studentId: id
        })
      }
    });

    network.request("/manage/check_student_item", {
        "itemId": this.data.itemId,
        "studentIds": params.studentIds
      },
      res => {
        if (res.status == 1) {
          params.check = res.data;
          this.setData(params);
          this.toCheckPage();
        }
      })
  },
  //跳转检查页面
  toCheckPage: function() {
    let bigClassId = Number.parseInt(this.data.bigClassId)
    let itemid = this.data.itemId
    let check = JSON.stringify(this.data.check)
    let campusId = this.data.campus[this.data.campusIndex2 || 0].id;
    let changeStudent = []; //没用的参数

    switch (bigClassId) {
      case 1:
        // console.log(this.data.studentIds)
        wx.navigateTo({
          url: '../growinginfo/growinginfo?bigClassId=' + bigClassId + '&check=' + check + '&itemid=' + this.data.itemId + '&campusId=' + campusId + '&studentId=' + JSON.stringify(this.data.studentIds) + '&changeStudent=' + JSON.stringify(changeStudent)
        })
        this.onLoad()
        break;
      case 2:
        wx.navigateTo({
          url: '../Body/Body?bigClassId=' + bigClassId + '&check=' + check + '&itemid=' + this.data.itemId + '&campusId=' + campusId + '&studentId=' + JSON.stringify(this.data.studentIds)

        })
        this.setData({
          addstudentinfos: [],
          studentinfoss: []
        })
        break;
      case 3:
        wx.navigateTo({
          url: '../posture/posture?bigClassId=' + bigClassId + '&check=' + check + '&itemid=' + this.data.itemId + '&campusId=' + campusId + '&studentId=' + JSON.stringify(this.data.studentIds)
        })

        this.setData({
          addstudentinfos: [],
          studentinfoss: []
        })
        break;
      case 4:
        wx.navigateTo({
          url: '../quality/quality?bigClassId=' + bigClassId + '&check=' + check + '&itemid=' + this.data.itemId + '&campusId=' + campusId + '&studentId=' + JSON.stringify(this.data.studentIds)
        })
        break;
      case 5:
        wx.navigateTo({
          url: '../Athleticability/Athleticability?bigClassId=' + bigClassId + '&check=' + check + '&itemid=' + this.data.itemId + '&campusId=' + campusId + '&studentId=' + JSON.stringify(this.data.studentIds)
        })
        break;
    }
  },

  //学校改变
  campusChange: function(e) {
    let index = Number.parseInt(e.detail.value);
    this.setData({
      campusIndex: index
    });
    this.cls_stu_list();
  },
  back: function() {
    wx.navigateBack({
      delta: 1,
    })
  },
  //学校改变
  campusChange2: function(e) {
    let index = Number.parseInt(e.detail.value);
    this.setData({
      campusIndex2: index
    });
  },
  //获取当前机构下的所有校区
  get_campus: function() {
    network.request("/manage/get_campus", {},
      res => {
        if (res.status == 1) {
          // console.log(res.data)
          this.setData({
            campus: res.data
          })
          if (res.data.length > 0) {
            this.cls_stu_list()
          }
        }
      })
  },

  //获取学生
  cls_stu_list: function() {
    network.request("/manage/cls_stu_list", {
        campusId: this.data.campus[this.data.campusIndex || 0].id
      },
      res => {
        if (res.status == 1) {
          this.setData({
            classes: res.data.personnel,
            selectAll: false
          })
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

  },
})