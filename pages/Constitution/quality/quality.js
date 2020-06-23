let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bigClassId: '',
    studentname: [],
    itemid: '',
    studentinfo: [],
    inputxze: '',
    display: 0,
    check: {},
    zbcs: '',
    val1: '',
    campusId: '',
    studentId: '',
    onlick: '',
    studentIds: [],
    stuTpsItemRecords:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  console.log(options)
    let bigClassId = options.bigClassId
    let studentname = JSON.parse(options.check);
    let itemid = options.itemid
    let studentId = JSON.parse(options.studentId);
    console.log(studentId)
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
      studentIds: studentIds
    })
    this.get_tps_item_category()
  },

  getvalues: function (event) {
    console.log(event)
    let index = event.currentTarget.dataset.index;
    let value = event.detail.value;
    // console.log(index)
    let studentindex = this.data.studentId[index]
    // console.log(this.data.studentId)
    // console.log(studentindex)
    // console.log(value)
    console.log(this.data.zbcs)
    let params = {
      "zbcs": this.data.zbcs,
      "val1": value,
      "studentId": studentindex.studentId
    }
    let stuTpsItemRecords = []
    var x = 'stuTpsItemRecords[' + index + ']'
    // console.log(x)
    this.setData({
      [x]: params,
    })
    console.log(this.data.stuTpsItemRecords)
  },
  get_tps_item_category: function () {
    network.request("/manage/get_tps_item_category", {
      bigClassId: this.data.bigClassId
    },
      res => {
          // console.log(res.data)
        let q = res.data
        for (let i = 0; i < q.tpsItemList.length; i++) {
          if (this.data.itemid == q.tpsItemList[i].id) {
            // console.log(q[i])
            wx: wx.setNavigationBarTitle({
              title: q.tpsItemList[i].title,
            })
            //保存测试项的单位 
            if (q.tpsItemList[i].tpsCategories && q.tpsItemList[i].tpsCategories.length>0 && q.tpsItemList[i].tpsCategories[0].title){
              this.setData({
                danwei: q.tpsItemList[i].tpsCategories[0].title
              })
            }
          }
        }
        let info = res.data
        // this.setData({
        //   projectname: res.data
        // })
        let studentinfo = []
        var j = 0;
        for (let i in q.tpsItemList) {
          if (q.tpsItemList[i].id == this.data.itemid) {
            studentinfo[j++] = q.tpsItemList[i]
          }
        }
        // console.log(studentinfo)
        this.setData({
          studentinfo: studentinfo
        })

        this.setData({
          content: this.data.studentinfo[0].content
        })
        let check = this.data.check
        // console.log(this.data.check)
        // for (var j in check) {
        //   if (check[j] == '不符合该项测试') {
        //     // console.log(check)
        //     let inputxze = 'readonly'
        //     let display = 1
        //     this.setData({
        //       inputxze: inputxze,
        //       display: display
        //     })
        //   }
        // }
        // console.log(this.data.studentinfo)
        let zbcs = this.data.studentinfo[0].zbcs
        this.setData({
          zbcs: zbcs
        })

      })
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */


  handleDelete: function (e) {
    console.log(e)
    let index = e.currentTarget.dataset.index;
    console.log(index)
    console.log(this.data.check)
    let checks = this.data.check.splice(index, 1);
    this.setData({
      check: this.data.check
    })
  },


  addrecord: function () {
    console.log(this.data.campusId, this.data.itemId, this.data.bigClassId, )
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
    console.log(typeinfo)
    if (typeinfo.includes("0")) {
      util.toast(`请检查是否有学员不可进行该项目测试`)
    }
    else {
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
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})