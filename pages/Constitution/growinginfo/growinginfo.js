let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bigClassId: '',
    studentname: [],
    mess_table: [],
    itemid: '',
    studentinfo: [],
    inputxze: '',
    display: 0,
    check: {},
    zbcs: '',
    val1: '',
    campusId: '',
    studentId: [],
    studentId: '',
    items: [{
        value: '正常'
      },
      {
        value: '缺乏'
      }
    ],
    onlick: '',
    studentIds: [],
    stuTpsItemRecords: [],
    changeStudent: [],
    parentinfos: [],
    studentindex: [],
    content:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)
    let bigClassId = options.bigClassId
    let studentname = JSON.parse(options.check);
    let itemid = options.itemid
    let studentId = JSON.parse(options.studentId);
    let changeStudent = JSON.parse(options.changeStudent)
    for (let i = 0; i < changeStudent.length; i++) {
      changeStudent[i].day_ = util.formatTime(new Date(changeStudent[i].birthDt * 1000)).substr(0, 4);
    }
    // console.log(changeStudent)
    // console.log(studentId)
    var studentIds = []
    for (let i = 0; i < studentId.length; i++) {
      if ((i + 1) % 2 == 0) {
        // console.log(i)
        studentIds.push(studentId[i].studentId)
      }
    }
    // console.log(studentIds)
    this.setData({
      bigClassId: bigClassId,
      itemid: itemid,
      check: studentname,
      studentname: Object.keys(studentname),
      campusId: options.campusId,
      studentId: studentId,
      studentIds: studentIds,
      changeStudent: changeStudent

    })
    this.get_tps_item_category()
  },
  get_tps_item_category: function() {
    network.request("/manage/get_tps_item_category", {
        bigClassId: this.data.bigClassId
      },
      res => {
        let q=res.data
        console.log(q)
        for (let i = 0; i < q.tpsItemList.length; i++){
          if (this.data.itemid == q.tpsItemList[i].id){
            // console.log(q[i])
            wx:wx.setNavigationBarTitle({
              title: q.tpsItemList[i].title,
            })
            this.setData({
              tpsCategoriesOption: q.tpsItemList[i].tpsCategoriesOption
            })
          }
        }
        let studentinfo = []
        var j = 0;
        for (let i in q.tpsItemList) {
          if (q.tpsItemList[i].id == this.data.itemid) {
            studentinfo[j++] = q.tpsItemList[i]
          }
        }
        console.log(studentinfo)
        this.setData({
          studentinfo: studentinfo
        })
        // let content =  this.data.studentIdinfo.content
        this.setData({
          content: this.data.studentinfo[0].content
        })
        let check = this.data.check
        // console.log(this.data.check)
        // console.log(this.data.studentinfo)
        // console.log(this.data.studentinfo)
        let zbcs = this.data.studentinfo[0].zbcs
        // console.log(zbcs)
        if (zbcs == '0') {
          this.setData({
            zbcs: 0
          })
        } else if (zbcs == '1') {
          this.setData({
            zbcs: 1
          })
        }
        // console.log(this.data.zbcs)
        // console.log(this.data.studentname)

        // console.log(123123123)
        // console.log(this.data.check)
        // console.log(this.data.studentId)
      })
  },
  getvalue: function(event) {
    // console.log(event)
    let onlick = ''
    if (event.detail.value == '') {
      onlick = 0
    } else {
      onlick = 1
    }
    this.setData({
      val1: onlick
    })
    // console.log(this.data.val1)
  },
  //滑动删除事件
  handleDelete: function(e) {
    let index = e.currentTarget.dataset.index;
    let checks = this.data.check.splice(index, 1);
    this.data.studentId.splice(index,1)
    this.setData({
      check: this.data.check
    })
  },
  //获取输入框的值
  getvalues: function(event) {
    // console.log(event)
    let index = event.currentTarget.dataset.index;
    let list = event.currentTarget.dataset.list;
    let stuid = event.currentTarget.dataset.stuid;
    let value = event.detail.value;
    var x = "mess_table[" + index + "]." + list
    var stuid_li = "mess_table[" + index + "].studentId"
    var zbcs = "mess_table[" + index + "].zbcs"
    this.setData({
      [x]: value,
      [stuid_li]: stuid,
      [zbcs]: this.data.zbcs
    })
    let stuTpsItemRecords=this.data.mess_table
    this.setData({
      stuTpsItemRecords: stuTpsItemRecords
    })
    // console.log(this.data.stuTpsItemRecords)
  },

  //获取单选框的值
  radioChange: function(e) {
    // console.log(e)
    let index = e.currentTarget.dataset.index;
    let value = e.detail.value;
    let studentindex = this.data.studentId[index];
    //判断是否符合测试条件  不符合不加入
    if(this.data.check[index].type==0){
      return
    }
    let stuTpsItemRecords = [];

    //判断是否已经加入
    var i = this.data.stuTpsItemRecords.length;
    this.data.stuTpsItemRecords.forEach((e,j)=>{
      if (e.studentId == studentindex.studentId){
        i=j;
      }
    })
    var x = 'stuTpsItemRecords[' + i + ']'
    let val1="";
    if (this.data.tpsCategoriesOption[0].id==value){
      val1 = this.data.tpsCategoriesOption[0].title;
    }
    if (this.data.tpsCategoriesOption[1].id == value) {
      val1 = this.data.tpsCategoriesOption[1].title;
    }
    let params = {
      "zbcs": this.data.zbcs+"",
      "val1": val1 || value,
      "optionId":value,
      "studentId": studentindex.studentId
    }
    this.setData({
      [x]: params,
    })
    // console.log(this.data.stuTpsItemRecords)
    // console.log(this.data.studentIdinfo)


  },
  addrecord: function() {

    // let a = util.tc(this.data.changeStudent, this.data.parentinfos)
    // console.log(a)
    // console.log(this.data.stuTpsItemRecords)
    // console.log(this.data.campusId, this.data.itemid, this.data.bigClassId, )
    var types = []
    for (let i = 0; i < this.data.check.length; i++) {
      types.push(this.data.check[i].type)
    }
    function flatten(arr) {
      while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr);
      }
      return arr;
    }
    let typeinfo = flatten(types)
    // console.log(typeinfo)
    if (typeinfo.includes("0")) {
      util.toast(`请检查是否有学员不可进行该项目测试`)
    } else {
      if (this.data.stuTpsItemRecords != '') {
        network.request("/manage/add_tps_item_record_batch", {
          campusId: this.data.campusId, itemId: this.data.itemid, bigClassId: this.data.bigClassId, stuTpsItemRecords: this.data.stuTpsItemRecords
        },
          res => {
            if (res.status == 1) {

              util.toast(`提交成功`)
              setTimeout(function () {
                wx.navigateBack({
                  delta: 2
                })
              }, 1000)
              // console.log(res.data)
            }
          })
      }
      else {
        util.toast(`请输入测试数值`)
      }
    }
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