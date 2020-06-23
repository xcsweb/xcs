let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentId: 332,
    weeks: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    hiddenModal: true,
    courseDiscountsSelectCount: 0,//已选优惠数量
    courseDiscountsSelectShow: false,//控制优惠多选框显隐
    courseDiscountsSelectedStr: ""//已选优惠名
  },

  /**
   * 生命周期函数--监听页面加载
   * 
   */
  onLoad: function(options) {
    this.setData({
      img_url: network.img_url,
      vod_url: network.vod_url,
      studentId: options.studentId || 10409
    });
    this.rec_nomal_add_opt({
      studentId: this.data.studentId
    });
  },
  //优惠多选框
  courseDiscountsSelected: function (e) {
    this.data.courseDiscounts.forEach((discount, index) => {
      if (e.detail.checkedIndexs.indexOf(index) >= 0) {
        discount.checked = true;
      } else {
        discount.checked = false;
      }
    })
    this.setData({
      courseDiscountsSelectShow: false,
      courseDiscounts: this.data.courseDiscounts,
      courseDiscountsSelectCount: e.detail.value.length,
      courseDiscountsSelectedStr: e.detail.values_.join(",")
    });
    this.yingfu();
    this.chae();
  },
  courseDiscountsCancel: function () {
    this.setData({
      courseDiscountsSelectShow: false
    })
  },
  courseDiscountsSelectShow: function () {
    this.setData({
      courseDiscountsSelectShow: true
    })
  },
  //优惠活动详情弹框
  modalConfirm: function () {
    this.setData({
      hiddenModal: true
    })
  },
  showModal: function () {
    this.setData({
      hiddenModal: false
    })
  },
  //获取表单参数
  rec_nomal_add_opt: function(params) {
    network.request("/manage/rec_nomal_add_opt", params,
      res => {
        if (res.status == 1) {
          if (res.data.classes) {
            res.data.classes.forEach(classes => {
              classes.clsTimeVos.forEach(clsTimeVos => {
                clsTimeVos.checked = true;
                clsTimeVos.startTime = clsTimeVos.startTime.substr(0, 5);
                clsTimeVos.endTime = clsTimeVos.endTime.substr(0, 5);
                clsTimeVos.timestr = this.data.weeks[Number.parseInt(clsTimeVos.week)-1] + clsTimeVos.startTime + '-' + clsTimeVos.endTime;
              })
            })
          }
          if(res.data.courseDiscounts){
            res.data.courseDiscountsIndex = -1;
            res.data.courseDiscountsSelectCount = 0;
            res.data.courseDiscountsSelectedStr = "";
            this.setData(res.data)
            this.yingfu();
          } else {
            this.setData(res.data)
          }
        } else {
          wx.showToast({
            title: '获取数据失败',
            icon: 'none'
          })
        }
      },
      error => {
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        })
      });
  },
  //提交表单
  formSubmit: function(e) {
    let formData = e.detail.value;
    console.log(formData)
    if (!formData.courseId) {
      util.toast("请选择课程");
      return;
    }
    if (!formData.password) {
      util.toast("请输入密码");
      return;
    }
    if (!formData.userName) {
      util.toast("请输入用户名");
      return;
    }
    if (!formData.paymentMethod) {
      util.toast("请选择付款方式");
      return;
    }
    if (!formData.receipts) {
      util.toast("请输入实收金额");
      return;
    }
    // if (!formData.courseDiscountId || this.data.courseDiscountsIndex<0) {
    //   util.toast("请选择优惠活动");
    //   return;
    // }
    if (!this.data.clsTimeVos) {
      util.toast("请选择上课时段");
      return;
    }
    //已选优惠提交
    let courseDiscountIds = [];
    this.data.courseDiscounts.forEach(discount => {
      if (discount.checked) {
        courseDiscountIds.push({
          courseDiscountId: discount.id
        })
      }
    })
    let params = {
      "studentId": this.data.studentId,
      "userName": formData.userName,
      "password": formData.password,
      "studentCourse": {
        "salesAmount": formData.receivable,
        "courseId": this.data.courses[Number.parseInt(formData.courseId)].courseId,
        "receivable": formData.receivable,
        "studentCourseDiscountList": courseDiscountIds,
        "discountVal": 0,//没用了
        "paymentMethod": this.data.paymentMethod[Number.parseInt(formData.paymentMethod)].codeValue,
        "receipts": formData.receipts,
        "classesId": this.data.classes[Number.parseInt(formData.classesId)].classesId,
        "classesTimeIds": this.data.clsTimeVos||"",
        "isOpen": formData.isOpen?"1":"0",
        "des": formData.des||"",
        "mdiscountAmount": this.data.sdyh||0
      }
    }
    network.requestLoading("/manage/rec_nomal_sub", params, "正在提交",
      res => {
        if (res.status == 1) {
          util.toast("操作成功",true)
        } else {
          wx.showToast({
            title: '操作失败',
            icon: 'none'
          })
        }
      },
      error => {
        wx.showToast({
          title: '操作失败',
          icon: 'none'
        })
      });
  },
  switch1Change:function(e){
    
  },
  bindinput: function(e) {
    let name = e.currentTarget.dataset.name;
    this.setData({
      [name]: e.detail.value
    })
    //手动优惠
    if (name == 'sdyh') {
      this.yingfu();
      this.chae();
    } else if (name == 'receipts') {
      //实收
      this.yingfu();
      this.chae();
    }
  },

  //计算应付金额 
  yingfu: function() {
    if (this.data.coursesIndex >= 0) {
      let yingfu = this.data.courses[this.data.coursesIndex].salesAmount;
      this.data.courseDiscounts.forEach(discount => {
        if (discount.checked && discount.discountType == 1) {
          yingfu = yingfu * discount.discountVal * 0.1;
        }
      });
      yingfu = yingfu - (this.data.sdyh || 0);
      //应付金额最小0
      yingfu = yingfu < 0 ? 0 : yingfu;
      yingfu = Number.parseFloat(yingfu.toFixed(1));
      this.setData({
        yingfu: yingfu
      })
    } else {
      this.setData({
        yingfu: ""
      })
    }
    this.chae();
  },
  //计算差额
  chae: function() {
    if (this.data.yingfu != "" && this.data.receipts != "") {
      let chae = this.data.courses[this.data.coursesIndex].salesAmount - (this.data.sdyh || 0);
      //应付金额最小0
      chae = this.data.yingfu - this.data.receipts;
      chae = Number.parseFloat(chae.toFixed(1));
      this.setData({
        chae: chae 
      })
    } else {
      this.setData({
        chae: ""
      })
    }
  },
  multichoice: function() {
    this.setData({
      multichoice: true
    })
  },
  multichoice_cancel: function() {
    this.setData({
      multichoice: false
    })
  },
  multichoice_ok: function(e) {
    console.log(e)
    this.data.classes[this.data.classesIndex].clsTimeVos.forEach((clsTimeVos, index) => {
      if (e.detail.checkedIndexs.indexOf(index) > -1) {
        clsTimeVos.checked = true;
      } else {
        clsTimeVos.checked = false;
      }
    });
    this.setData({
      multichoice: false,
      clsTimeVosStr: e.detail.values_.toString(),
      clsTimeVos: e.detail.value.toString(),
      classes: this.data.classes
    })
  },


  //改变课程
  coursesPickChange: function(e) {
    if (this.data.courses.length==0){
      return
    }
    //选中下标
    let index = Number.parseInt(e.detail.value);
    //没改变课程卡直接返回
    if (this.data.coursesIndex == index) {
      return
    }
    this.setData({
      coursesIndex: index,
      receivable: this.data.courses[index].salesAmount
    });
    //课程卡改变后重新拉取优惠信息
    let params = {
      studentId: this.data.studentId,
      courseId: this.data.courses[index].courseId
    }
    this.rec_nomal_add_opt(params);
  },
  //收款方式
  paymentMethodPickerChange: function(e) {
    //选中下标
    let index = Number.parseInt(e.detail.value);
    this.setData({
      paymentMethodIndex: index,
      paymentIndex: ""
    })
  },
  //收款账号
  paymentPickerChange: function(e) {
    //选中下标
    let index = Number.parseInt(e.detail.value);
    this.setData({
      paymentIndex: index
    })
  },
  //班级
  classesChange: function(e) {
    //选中下标
    let index = Number.parseInt(e.detail.value);
    let clsTimeVosStr_ = "";
    let clsTimeVos_ = "";
    this.data.classes[index].clsTimeVos.forEach(clsTimeVos => {
      if (clsTimeVos.checked){
        clsTimeVosStr_ += clsTimeVos.timestr + ",";
        clsTimeVos_ += clsTimeVos.classesTimeId + ",";
      }
    });
    if (clsTimeVosStr_!=""){
      clsTimeVosStr_ = clsTimeVosStr_.substring(0, clsTimeVosStr_.length-1);
      clsTimeVos_ = clsTimeVos_.substring(0, clsTimeVos_.length - 1);
    }
    this.setData({
      classesIndex: index,
      clsTimeVosStr: clsTimeVosStr_,
      clsTimeVos: clsTimeVos_
    })
  },
  //优惠活动
  courseDiscountsChange: function(e) {
    //选中下标
    let index = Number.parseInt(e.detail.value);
    this.setData({
      courseDiscountsIndex: index
    });
    this.yingfu();
    this.chae();
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