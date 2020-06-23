let network = require('../../utils/network.js')
let util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    selectArray: [],
    selectArray2: [],
    index: '',
    studentname: [],
    project: [],
    tabss: [],
    tabs: [],
    bigClassId: 1,
    projectname: [],
    itemid: '',
    studentIdTwo: [],
    studentIdOne: [],
    studentIdOneName: '',
    studentIdTwoName: '',
    addstudentinfos: [],
    addstudentlist: [],
    check: [],
    studentinfoss: [],
    ids: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.inputChange()
    this.get_campus()
    this.get_tps_big_class()
    this.get_tps_item_category()
  },
  addstudent: function(event) {
    // this.setData({
    //   showModal: true
    // })
    this.setData({
      itemid: event.target.dataset.itemid
    });
    wx.navigateTo({
      url: './addstu/addstu?itemId=' + event.target.dataset.itemid + "&bigClassId=" + this.data.bigClassId,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    // console.log(this.data.itemid)
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
 
  preventTouchMove: function() {},
  /**
   * 隐藏模态对话框
   */
  hideModal: function() {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function() {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function(event) {
    this.hideModal();
    let bigClassId = this.data.bigClassId
    let itemid = this.data.itemId
    let check = JSON.stringify(this.data.check)
    let campusId = this.data.studentIdOne-1
    // console.log(campusId)
    // console.log(this.data.studentinfoss)
    let changeStudent = []
    for (let i = 0; i < this.data.studentinfoss.length; i++) {
      for (let j = 0; j <  this.data.selectArray2.length; j++) {
        if (this.data.studentinfoss[i].studentId === this.data.selectArray2[j].id) {
          changeStudent.push(this.data.selectArray2[j])
        }
      }
    }
    // console.log(changeStudent)
    
    if (this.data.studentinfoss == ''){
      util.toast(`请选择学员`)
      return false;
    }
    switch (bigClassId) {
      case 1:
       
        // console.log(this.data.studentinfoss)
         wx.navigateTo({
           url: './growinginfo/growinginfo?bigClassId=' + bigClassId + '&check=' + check + '&itemid=' + this.data.itemid + '&campusId=' + campusId + '&studentId=' + JSON.stringify(this.data.studentinfoss) + '&changeStudent=' + JSON.stringify(changeStudent)
        })
        this.onLoad()
        break;
      case 2:
        wx.navigateTo({
          url: './Body/Body?bigClassId=' + bigClassId + '&check=' + check + '&itemid=' + this.data.itemid + '&campusId=' + campusId + '&studentId=' + JSON.stringify(this.data.studentinfoss)
          
        })
        this.setData({
          addstudentinfos: [],
          studentinfoss: []
        })
        break;
      case 3:
        wx.navigateTo({
          url: './posture/posture?bigClassId=' + bigClassId + '&check=' + check + '&itemid=' + this.data.itemid + '&campusId=' + campusId + '&studentId=' + JSON.stringify(this.data.studentinfoss)
        })

        this.setData({
          addstudentinfos: [],
          studentinfoss: []
        })
        break;
      case 4:
        wx.navigateTo({
          url: './quality/quality?bigClassId=' + bigClassId + '&check=' + check + '&itemid=' + this.data.itemid + '&campusId=' + campusId + '&studentId=' + JSON.stringify(this.data.studentinfoss)
        })
        this.setData({
          addstudentinfos: [],
          studentinfoss: []
        })
        break;
      case 5:
        wx.navigateTo({
          url: './Athleticability/Athleticability?bigClassId=' + bigClassId + '&check=' + check + '&itemid=' + this.data.itemid + '&campusId=' + campusId + '&studentId=' + JSON.stringify(this.data.studentinfoss)
        })
        this.setData({
          addstudentinfos: [],
          studentinfoss: []
        })
        break;
    }
  },

  check_student_item: function (event) {
    let studentIdOne = this.data.studentIdOne
    let studentIdTwo = this.data.studentIdTwo
    let params = this.data.addstudentlist
    // console.log(params)
    function flatten(arr) {
      var studentinfoss = []
      for (var i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
          studentinfoss = studentinfoss.concat(flatten(arr[i]));
        } else {
          studentinfoss.push(arr[i]);
        }
      }
      return studentinfoss;
    }
    let studentinfosss = flatten(params)
    this.setData({
      studentinfoss: studentinfosss
    })
    // console.log(this.data.studentinfoss)

    network.request("/manage/check_student_item", {
      itemId: this.data.itemid,
      studentIds: this.data.studentinfoss
    },
      res => {
        if (res.status == 1) {
          var check = res.data
          // console.log(res.data)

        }
        this.setData({
          check: check
        })
        // console.log(this.data.check)
        // console.log(1)
      })
  },

  //获取当前机构下的所有校区
  get_campus: function() {
    network.request("/manage/get_campus", {},
      res => {
        if (res.status == 1) {
          // console.log(res.data)
          this.setData({
            selectArray: res.data
          })
        }
        // console.log(this.data.selectArray)
      })
  },
  onChangeShowState: function(event) {
    let index = event.detail.value;
    // console.log(index)
    let id = this.data.selectArray[index]
    // console.log(id)
    let studentIdOne = id.id
    let studentIdOneName = id.name
    this.setData({
      index: index,
      studentIdOne: studentIdOne,
      studentIdOneName: studentIdOneName
    })
    this.getstudent()
  },
  onChangeShowStatetwo: function(event) {

    let index = this.data.index;
    let index2 = event.detail.value
    let ids = this.data.selectArray2[index2]
    // console.log(ids)
    let studentIdTwo = ids.id
    let studentIdTwoName = ids.name
    this.setData({
      ids: ids,
      studentIdTwo: studentIdTwo,
      studentIdTwoName: studentIdTwoName
    })
    this.getstudent()
    // console.log(this.data.studentIdTwoName, this.data.studentIdOneName)
    let name2 = this.data.studentIdTwoName
    let id1 = this.data.studentIdTwo
    var parmas = [{
      studentId: ids.id
    }]
    //判断是否已经添加过 避免重复
    let exsit=false;
    this.data.addstudentlist.forEach(stu=>{
      if (stu[0].studentId == ids.id){
        exsit=true;
      }
    })
    if (exsit){
      return
    }
    // console.log(parmas)
    let addstudentlist = []
    var i = this.data.addstudentinfos.length;
    var x = 'addstudentinfos[' + i + ']'
    var j = this.data.addstudentlist.length;
    var y = 'addstudentlist[' + j + ']'
    this.setData({
      [x]: name2,
      [y]: parmas,
    })
    this.check_student_item()
  },
  //检查学生是否符合

  //获取学生
  getstudent: function() {
    network.request("/manage/get_stu_by_campus", {
        campusId: ''
      },
      res => {
        if (res.status == 1) {
          //  console.log(res.data)
          let studentname = res.data
          this.setData({
            selectArray2: studentname
          })
        }
      })
  },


  //获取大分类
  get_tps_big_class: function() {
    network.request("/manage/get_tps_big_class", {},
      res => {
        if (res.status == 1) {
          // console.log(res.data)
          let tabs = res.data
          let tabss = []
          for (var i = 0; i < res.data.length; i++) {
            tabss.push(res.data[i].title)
          }
          if (tabss.length%3==1){
            tabss.push("")
            tabss.push("")
          } else if (tabss.length % 3 ==2) {
            tabss.push("")
          }
          this.setData({
            tabss: tabss,
            tabs: tabs
          })
        }
      })
  },

  tabchange: function(event) {
    let bigClassId = event.detail.value + 1
    this.setData({
      bigClassId: bigClassId
    })
    this.get_tps_item_category()
  },
  // 获取测评分类
  get_tps_item_category: function() {
    network.request("/manage/get_tps_item_category", {
        bigClassId: this.data.bigClassId
      },
      res => {
        console.log(res.data)
        this.setData({
          projectname: res.data.tpsItemList
        })
      })
  },
  deletedata: function(event) {
    // console.log(this.data.addstudentlist)
    let index = event.target.dataset.info
    this.data.studentinfoss.splice(index, 1);
    this.data.addstudentlist.splice(index, 1);
    // console.log(index)
    let newaddstudentinfos = this.data.addstudentinfos.splice(index, 1)
    this.setData({
      addstudentinfos: this.data.addstudentinfos,
      studentinfoss: this.data.studentinfoss,
      addstudentlist: this.data.addstudentlist
    })
    this.check_student_item()
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
this.setData({
  studentIdTwo: [],
  studentIdOne: [],
  studentIdOneName: '',
  studentIdTwoName: '',
  addstudentinfos: [],
  addstudentlist: [],
  check: [],
  studentinfoss: [],
  ids: []
})
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