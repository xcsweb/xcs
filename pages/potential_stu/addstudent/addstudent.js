let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')
// pages/potential_stu/addstudent/addstudent.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaCampus: [],
    courses: [],
    intentions: [],
    sales: [],
    sourceCrmtags: [],
    sexes: ["女", "男"],
    parentAdd: [1],
    endBirth: util.formatDate(new Date()),
  },

  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    network.request(
      "/manage/rec_add_opt", {},
      res => {
        if (res.status == "1") {
          this.setData({
            areaCampus: res.data.areaCampus,
            courses: res.data.courses,
            intentions: res.data.intentions,
            sales: res.data.sales,
            sourceCrmtags: res.data.sourceCrmtags,
          });
          this.resetTab1Course_();
          console.log(this.data)
        } else {
          wx.showToast({
            title: res.message,
            icon: "none",
            duration: 2000
          })
        }
      },
      err => {
        console.log(err)
      }
    )
  },
  enroll_newstu_sub: function() {
    if (!this.data.name) {
      util.toast("请输入姓名")
      return
    }
    if (!util.isPhone(this.data.tel)) {
      util.toast("请输入正确的手机号")
      return
    }
    if (!this.data.birthDt) {
      util.toast("请选择生日")
      return
    }

    if (!this.data.areaCampus[this.data.areaCampusIndex || 0]) {
      util.toast("请选择城市")
      return
    }

    if (!this.data.areaCampus[this.data.areaCampusIndex || 0] || !this.data.areaCampus[this.data.areaCampusIndex || 0].campuses[this.data.campusesIndex || 0]) {
      util.toast("请选择校区")
      return
    }
    // if (!this.data.sales[this.data.salesIndex || 0]) {
    //   util.toast("请选择销售")
    //   return
    // }
    if (!this.data.courses[this.data.coursesIndex || 0]) {
      util.toast("请选择课程")
      return
    }
    let params = {
      "avatar": this.data.avatar || "",
      "name": this.data.name || "",
      "sex": this.data.sexIndex || 0,
      "tel": this.data.tel || "",
      "saleCoursePrice": this.data.saleCoursePrice || "",
      "campusId": this.data.areaCampus[this.data.areaCampusIndex || 0].campuses[this.data.campusesIndex || 0].campusId || 0,
      "saleMemberId": this.data.salesIndex >= 0 ? this.data.sales[this.data.salesIndex].memberId : 0,
      "sourceCrmtagId": this.data.sourceCrmtagsIndex >= 0 ? this.data.sourceCrmtags[this.data.sourceCrmtagsIndex].crmtagId : 0,
      "saleCourseId": this.data.courses_[this.data.saleCourseIndex || 0].courseId,
      "birthDt": this.data.birthDt || "",
      "wechatNum": this.data.wechatNum || "",
      "address": this.data.address || "",
      "studentParentList": [],
      "idNum": this.data.idNum,
      "saleIntention": this.data.intentions[this.data.intentionsIndex || 0].codeValue
    };
    //添加家长数据
    let parents = this.selectAllComponents(".com-parent");
    parents.forEach(parent => {
      if (parent.data.name && parent.data.relation) {
        params.studentParentList.push(parent.data);
      }
    });

    if (this.data.saleCourseIndex) {
      params.saleCourseId = this.data.courses_[this.data.saleCourseIndex].courseId
    }
    if (1) {
      console.log(params);
    }
    network.requestLoading("/manage/rec_add_sub", params, "正在提交",
      res => {
        if (res.status == 1) {
          util.toast(res.message || "操作成功", true);
        } else {
          util.toast("操作失败");
        }
      },
      error => {
        util.toast("操作失败");
      });
  },
  //添加家长
  parentAdd: function() {
    let parentAdd = this.data.parentAdd;
    parentAdd.push(1);
    this.setData({
      parentAdd: parentAdd
    })
  },
  //上传头像
  chooseImgUpload: function() {
    util.chooseImgUpload(res => {
      this.setData({
        avatar_: res.imageURL,
        avatar: res.key
      })
    }, error => {
      if (error) {
        util.toast("上传图片失败：" + JSON.stringify(error));
      }
    });
  },
  //监听输入框并保存值
  bindinput: function(e) {
    let data = {};
    data[e.currentTarget.dataset.name] = e.detail.value;
    this.setData(data);
  },
  //各种picker的改变响应
  pickerChange: function(e) {
    let indexname = e.currentTarget.dataset.indexname;
    this.setData({
      [indexname]: Number.parseInt(e.detail.value)
    });
    switch (indexname) {
      case "areaCampusIndex":
        this.setData({
          campusesIndex: 0,
          saleCourseIndex: 0
        })
        this.resetTab1Course_();
        break;
      case "campusesIndex":
        this.setData({
          saleCourseIndex: 0,
        })
        this.resetTab1Course_();
        break;
      case "saleCourseIndex":
        this.setData({
          saleCoursePrice: this.data.courses_[this.data.saleCourseIndex || 0].salesAmount
        })
        break;
    }
  },

  //根据校区改变重置可选的意向产品
  resetTab1Course_: function(e) {
    this.data.courses_ = [];
    this.data.courses.forEach((e, index) => {
      if (e.campusIds.split(",").indexOf(this.data.areaCampus[this.data.areaCampusIndex || 0].campuses[this.data.campusesIndex || 0].campusId + "") >= 0) {
        this.data.courses_.push(e);
      }
    })
    this.setData({
      saleCourseIndex: 0,
      ["courses_"]: this.data.courses_,
      saleCoursePrice: this.data.courses_[0].salesAmount
    })
  },
  bindDateChange: function(e) {
    let birthDt = Math.floor(new Date(e.detail.value).getTime() / 1000);
    this.setData({
      date: e.detail.value,
      birthDt: birthDt
    })
    console.log(1)
  },
  back:function(){
    wx.navigateBack({
      delta: 1,
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