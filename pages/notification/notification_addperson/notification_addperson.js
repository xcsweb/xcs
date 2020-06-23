let network = require('../../../utils/network.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    classes: [],
    selectAll: false,
    allUserCount:0//总共人数  0时全选disabled
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getClassList();
  },
  //获取班级列表
  getClassList: function() {
    network.requestLoading('/manage/notice_add', {
      "type": "1"
    }, "", res => {
      if (res.status == 1) {
        //首次获取列表 设置第一个班级显示人员列表
        if (res.data.personnel[0]) {
          res.data.personnel[0].showUser = true;
        }
        res.data.personnel.forEach(e=>{
          if (e.person){
            this.data.allUserCount += e.person.teachers.length;
            this.data.allUserCount += e.person.students.length;
          }
        })
        this.setData({
          classes: res.data.personnel,
          allUserCount: this.data.allUserCount
        });
      } else {
        wx.showToast({
          title: '获取消息类型失败',
        })
      }
    }, error => {
      wx.showToast({
        title: '获取消息类型失败',
      })
    })
  },
  //获取班级成员列表
  getUserList: function(classesId) {
    network.requestLoading('/manage/notice_add', {
      "type": "1",
      classesId: classesId
    }, "", res => {
      if (res.status == 1) {
        this.data.classes.forEach(class_ => {
          if (class_.id == classesId) {
            class_.person = res.data.person
          }
        })
        this.setData({
          classes: this.data.classes
        });
      } else {
        wx.showToast({
          title: '获取消息类型失败',
        })
      }
    }, error => {
      wx.showToast({
        title: '获取消息类型失败',
      })
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
  //选择、取消选择班级
  selectClass: function(event) {
    let classIndex = event.currentTarget.dataset.index;
    if (!this.data.classes[classIndex].person) {
      return;
    }
    this.data.classes[classIndex].selected = !this.data.classes[classIndex].selected;
    if (this.data.classes[classIndex].person.teachers)
      for (let i = 0; i < this.data.classes[classIndex].person.teachers.length; i++) {
        this.data.classes[classIndex].person.teachers[i].selected = this.data.classes[classIndex].selected;
      }
    if (this.data.classes[classIndex].person.students)
      for (let i = 0; i < this.data.classes[classIndex].person.students.length; i++) {
        this.data.classes[classIndex].person.students[i].selected = this.data.classes[classIndex].selected;
      }
    this.setData({
      classes: this.data.classes
    });
  },
  showUser: function(event) {
    let classIndex = event.currentTarget.dataset.index;
    this.data.classes[classIndex].showUser = !this.data.classes[classIndex].showUser
    this.setData({
      classes: this.data.classes
    })
  },
  checkboxgroupChange: function(d) {

    for (let i = 0; i < this.data.classes.length; i++) {
      //this.data.classes[i].selected = false;
      if (!this.data.classes[i].person) {
        continue
      }
      for (let j = 0; j < this.data.classes[i].person.teachers.length; j++) {
        this.data.classes[i].person.teachers[j].selected = false;
      }
      for (let j = 0; j < this.data.classes[i].person.students.length; j++) {
        this.data.classes[i].person.students[j].selected = false;
      }
    }
    
    console.log(d.detail.value)
    d.detail.value.forEach(value => {
      let values = value.split(",");
      if (values[1] == 'stu') {
        this.data.classes[Number.parseInt(values[0])].person.students[Number.parseInt(values[2])].selected = true;
      }
      if (values[1] == 'tech') {
        this.data.classes[Number.parseInt(values[0])].person.teachers[Number.parseInt(values[2])].selected = true;
      }
    })

    //是否全部老师学生已全部选择
    let selectAll=true;
    for (let i = 0; i < this.data.classes.length; i++) {
      //this.data.classes[i].selected = false;
      if (!this.data.classes[i].person) {
        continue
      }
      //是否班级的老师学生已全部选择
      let classAllSelected=true;
      for (let j = 0; j < this.data.classes[i].person.teachers.length; j++) {
        if (!this.data.classes[i].person.teachers[j].selected){
          classAllSelected=false;
          selectAll = false;
        }
      }
      for (let j = 0; j < this.data.classes[i].person.students.length; j++) {
        if (!this.data.classes[i].person.students[j].selected){
          classAllSelected = false;
          selectAll = false;
        }
      }
      this.data.classes[i].selected = classAllSelected;
    }
    this.setData({
      classes: this.data.classes,
      selectAll: selectAll
    })
  },
  //选择所有人
  selectAll: function(e) {
    if (e.detail.value[0]) {
      //选择

      for (let i = 0; i < this.data.classes.length; i++) {
        this.data.classes[i].selected = true;
        if (!this.data.classes[i].person) {
          continue
        }
        for (let j = 0; j < this.data.classes[i].person.teachers.length; j++) {
          this.data.classes[i].person.teachers[j].selected = true;
        }
        for (let j = 0; j < this.data.classes[i].person.students.length; j++) {
          this.data.classes[i].person.students[j].selected = true;
        }
      }
    } else {
      //未选择

      for (let i = 0; i < this.data.classes.length; i++) {
        this.data.classes[i].selected = false;
        if (!this.data.classes[i].person) {
          continue
        }
        for (let j = 0; j < this.data.classes[i].person.teachers.length; j++) {
          this.data.classes[i].person.teachers[j].selected = false;
        }
        for (let j = 0; j < this.data.classes[i].person.students.length; j++) {
          this.data.classes[i].person.students[j].selected = false;
        }
      }
    }
    this.setData({
      classes: this.data.classes
    });
  },
  //完成选人
  finishSelct: function() {
    let selectedTeacherIds = [];
    let selectedStudentIds = [];
    let selectedInfo = "";
    let teacherIds = [];
    let studentIds = [];
    for (let i = 0; i < this.data.classes.length; i++) {
      if (!this.data.classes[i].person) {
        continue
      } 
      for (let j = 0; j < this.data.classes[i].person.teachers.length; j++) {
        if (this.data.classes[i].person.teachers[j].selected && teacherIds.indexOf(this.data.classes[i].person.teachers[j].memberId) == -1) {
          teacherIds.push(this.data.classes[i].person.teachers[j].memberId);
          selectedInfo += this.data.classes[i].person.teachers[j].name;
          selectedInfo += ",";
          selectedTeacherIds.push({
            teacherId: this.data.classes[i].person.teachers[j].memberId,
            userId: this.data.classes[i].person.teachers[j].userId,
            tel: this.data.classes[i].person.teachers[j].tel
          })
        }
      }
      for (let j = 0; j < this.data.classes[i].person.students.length; j++) {
        if (this.data.classes[i].person.students[j].selected && studentIds.indexOf(this.data.classes[i].person.students[j].studentId)==-1) {
          studentIds.push(this.data.classes[i].person.students[j].studentId);
          selectedInfo += this.data.classes[i].person.students[j].name;
          selectedInfo += ",";
          selectedStudentIds.push({
            studentId: this.data.classes[i].person.students[j].studentId,
            userId: this.data.classes[i].person.students[j].userId,
            tel: this.data.classes[i].person.students[j].tel
          })
        }
      }
    }
    //保存已选信息  
    wx.setStorage({
      key: 'selectedTeacherIds',
      data: selectedTeacherIds,
    })
    wx.setStorage({
      key: 'selectedStudentIds',
      data: selectedStudentIds,
    })
    wx.setStorage({
      key: 'selectedInfo',
      data: selectedInfo,
    });
    wx.navigateBack({

    });
  }
})