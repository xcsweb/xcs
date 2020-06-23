let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenModal:true,
    courseDiscountsSelectCount:0,//已选优惠数量
    courseDiscountsSelectShow:false,//控制优惠多选框显隐
    courseDiscountsSelectedStr:""//已选优惠名
  },

  /**
   * 生命周期函数--监听页面加载
   * 
   */
  onLoad: function(options) {
    this.setData({
      img_url: network.img_url,
      vod_url: network.vod_url,
      title: options.title
    });
    wx.setNavigationBarTitle({
      title: options.title || "续费",
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    });
    wx.getStorage({
      key: 'enroll_stu',
      success: res => {
        this.setData({
          student: res.data,
          title: options.title
        });
        if (options.title == '续费') {
          this.enroll_renew({
            studentId: res.data.studentId,
            init: true
          });
        } else if (options.title == '补费') {
          this.enroll_subsidy();
        } else {
          this.enroll_refund();
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    });
    this.member_list();
  },
  //优惠多选框
  courseDiscountsSelected:function(e){
    console.log(e)
    this.data.courseDiscounts.forEach((discount,index)=>{
      if(e.detail.checkedIndexs.indexOf(index)>=0){
        discount.checked=true;
      }else{
        discount.checked=false;
      }
    })
    this.setData({
      courseDiscountsSelectShow: false,
      courseDiscountsSelectCount:e.detail.value.length,
      courseDiscounts: this.data.courseDiscounts,
      courseDiscountsSelectedStr:e.detail.values_.join(",")
    });
    this.recalcFee();
  },
  courseDiscountsCancel:function(){
    this.setData({
      courseDiscountsSelectShow:false
    })
  },
  courseDiscountsSelectShow:function(){
    this.setData({
      courseDiscountsSelectShow:true
    })
  },
  //优惠活动详情弹框
  modalConfirm:function(){
    this.setData({
      hiddenModal:true
    })
  },
  showModal: function () {
    this.setData({
      hiddenModal: false
    })
  },
  imageloaderror1: function(e) {
    this.setData({
      [`tab1Data[${e.currentTarget.dataset.index}].avatar_`]: '/imgs/kechengbiao/kechengbiao_default_img.jpg'
    })
  },
  enroll_renew: function(params) {
    network.request("/manage/enroll_renew", params,
      res => {
        if (res.status == 1) {
          if (res.data.editPower) {
            this.setData({
              editPower: res.data.editPower
            })
          }
          if (params.studentId) {
            this.setData({
              campuses: res.data.campuses
            });
            if (params.init && res.data.campuses.length > 0 && res.data.campuses[0].campusId) {
              this.enroll_renew({
                campusId: res.data.campuses[0].campusId,
                init: true
              })
            }
          }
          if (params.campusId) {
            this.setData({
              courses: res.data.courses,
              receivable: res.data.courses[0].salesAmount,
              paymentMethod: res.data.paymentMethod,
              payment: res.data.paymentMethod[0].payment
            });
            this.qianfei();
            if (params.init && res.data.courses.length > 0 && res.data.courses[0].courseId) {
              this.enroll_renew({
                courseId: res.data.courses[0].courseId,
                init: true
              })
            }
          }
          if (params.courseId) {
            this.setData({
              courseDiscounts: res.data.courseDiscounts,
              courseDiscountsSelectCount:0,
              courseDiscountsSelectedStr:""
            });
            this.recalcFee();
          }
        } else {
          util.toast("获取数据失败")
        }
      },
      error => {
        util.toast("获取数据失败")
      });
  },
  //补费
  enroll_subsidy: function() {
    network.request("/manage/enroll_subsidy", {
        "studentId": this.data.student.studentId
      },
      res => {
        if (res.status == 1) {
          this.setData({
            courses: res.data.studentCourses,
            paymentMethod: res.data.paymentMethod,
            payment: res.data.paymentMethod[0].payment
          });
          this.qianfei();
        } else {
          util.toast("获取数据失败")
        }
      },
      error => {
        util.toast("获取数据失败")
      });
  },
  //退费
  enroll_refund: function(params) {
    network.request("/manage/enroll_refund", {
        "studentId": this.data.student.studentId
      },
      res => {
        if (res.status == 1) {
          res.data.studentCourses.forEach(e => {
            //接口缺少mdiscountAmount字段  避免报错设为0
            e.mdiscountAmount = e.mdiscountAmount ? e.mdiscountAmount : 0;
          })
          this.setData({
            courses: res.data.studentCourses,
            paymentMethod: res.data.paymentMethod,
            payment: res.data.paymentMethod[0].payment
          });
        } else {
          util.toast("获取数据失败")
        }
      },
      error => {
        util.toast("获取数据失败")
      });
  },
  //监听输入框并保存值
  bindinput: function(e) {
    let data = {};
    data[e.currentTarget.dataset.name] = e.detail.value;
    this.setData(data);
    switch (e.currentTarget.dataset.name) {
      case "mdiscountAmount":
        break;
    }
    this.qianfei();
    let receivable_ = this.data.receivable;
    this.data.courseDiscounts.forEach(discount=>{
      if (discount.checked&&discount.discountType==1){
        receivable_ = receivable_ * discount.discountVal * 0.1;
      }
    })
    this.setData({
      price2: Number.parseFloat((receivable_ - (this.data.mdiscountAmount || 0)).toFixed(1))
    })
  },
  //计算优惠后金额
  recalcFee: function() {
    let receivable_ = this.data.receivable;
    this.data.courseDiscounts.forEach(discount => {
      if (discount.checked && discount.discountType==1) {
        receivable_ = receivable_ * discount.discountVal * 0.1;
      }
    });
    this.setData({
      price2: Number.parseFloat((receivable_ - (this.data.mdiscountAmount || 0)).toFixed(1)),
      receipts:""
    })
    this.qianfei();
  },
  //续费提交
  enroll_renew_sub: function() {
    if (!this.data.campuses[0]) {
      util.toast("请选择校区")
      return
    }
    if (!this.data.courses[this.data.coursesIndex || 0]) {
      util.toast("请选择卡")
      return
    } 
    if (typeof this.data.receipts == 'undefined') {
      util.toast("请输入应收金额");
      return
    }
    if (typeof this.data.receivable == 'undefined') {
      util.toast("请输入实收金额");
      return
    }
    if (!this.data.paymentMethod[this.data.paymentMethodIndex || 0]) {
      util.toast("请选择支付方式")
      return
    }
    if (!this.data.member_list[this.data.member_listIndex || 0]) {
      util.toast("请选择销售")
      return
    }
    let courseDiscountIds=[];
    this.data.courseDiscounts.forEach(discount=>{
      if(discount.checked){
        courseDiscountIds.push({
          courseDiscountId:discount.id
        })
      }
    })
    let params = {
      "studentId": this.data.student.studentId,
      "courseId": this.data.courses[this.data.coursesIndex || 0].courseId,
      "saleMemberId": this.data.member_list[this.data.member_listIndex || 0].memberId,
      "receivable": this.data.receivable,
      "receipts": this.data.receipts,
      "studentCourseDiscountList": courseDiscountIds,
      "paymentMethod": this.data.paymentMethod[this.data.paymentMethodIndex || 0].codeValue,
      "mdiscountAmount": this.data.mdiscountAmount || 0,
      "des": this.data.des || " "
    };
    if (this.data.payment.length > 0) {
      params.payConfigId = this.data.payment[this.data.paymentIndex || 0].payConfigId || 0
    }
    if (1) {
      console.log(params);
    }
    network.requestLoading("/manage/enroll_renew_sub", params, "正在提交",
      res => {
        if (res.status == 1) {
          util.toast(res.message || "操作成功", true);
        } else {
          util.toast(res.message || "操作失败");
        }
      },
      error => {
        util.toast("操作失败");
      });
  },
  //补费提交
  enroll_subsidy_sub: function() {
    if (!this.data.courses[this.data.coursesIndex || 0]) {
      util.toast("请选择卡")
      return
    }
    if (typeof this.data.price == 'undefined') {
      util.toast("请输入实际补缴金额");
      return
    }
    if (!this.data.paymentMethod[this.data.paymentMethodIndex || 0]) {
      util.toast("请选择支付方式")
      return
    }
    if (!this.data.des) {
      util.toast("请输入备注")
      return
    }
    let params = {
      "studentCourseId": this.data.courses[this.data.coursesIndex || 0].studentCourseId,
      "paymentMethod": this.data.paymentMethod[this.data.paymentMethodIndex || 0].codeValue,
      "price": this.data.price,
      "des": this.data.des || " "
    }
    if (this.data.payment.length > 0) {
      params.payConfigId = this.data.payment[this.data.paymentIndex || 0].payConfigId || 0
    }
    if (1) {
      console.log(params);
    }
    network.requestLoading("/manage/enroll_subsidy_sub", params, "正在提交",
      res => {
        if (res.status == 1) {
          util.toast(res.message || "操作成功", true);
        } else {
          util.toast(res.message || "操作失败");
        }
      },
      error => {
        util.toast("操作失败");
      });
  },
  //退费提交
  enroll_refund_sub: function() {
    if (!this.data.courses[this.data.coursesIndex || 0]) {
      util.toast("请选择卡")
      return
    }
    if (typeof this.data.price == 'undefined') {
      util.toast("请输入实际退费金额");
      return
    }
    
    if (!this.data.paymentMethod[this.data.paymentMethodIndex || 0]) {
      util.toast("请选择支付方式")
      return
    }
    if (!this.data.des) {
      util.toast("请输入备注")
      return
    }
    let params = {
      "studentCourseId": this.data.courses[this.data.coursesIndex || 0].studentCourseId,
      "paymentMethod": this.data.paymentMethod[this.data.paymentMethodIndex || 0].codeValue,
      "price": this.data.price,
      "des": this.data.des || " "
    }
    if (this.data.payment.length > 0) {
      params.payConfigId = this.data.payment[this.data.paymentIndex || 0].payConfigId || 0
    }
    if (1) {
      console.log(params);
    }
    network.requestLoading("/manage/enroll_refund_sub", params, "正在提交",
      res => {
        if (res.status == 1) {
          util.toast(res.message || "操作成功", true);
        } else {
          util.toast(res.message || "操作失败");
        }
      },
      error => {
        util.toast("操作失败");
      });
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
  campusesPickChange: function(e) {
    // this.setData({
    //   campusesIndex: Number.parseInt(e.detail.value)
    // });
    // this.enroll_renew({
    //   campusId: this.data.campuses[this.data.campusesIndex].campusId
    // });
  },
  coursesPickChange: function(e) {
    this.setData({
      coursesIndex: Number.parseInt(e.detail.value),
      receivable: this.data.courses[Number.parseInt(e.detail.value)].salesAmount
    });
    this.enroll_renew({
      courseId: this.data.courses[Number.parseInt(e.detail.value)].courseId
    })
    this.setData({
      price:0
    })
    this.qianfei();
  },
  //选择优惠后
  courseDiscountsChange: function(e) {
    this.recalcFee();
  },
  member_listPickerChange: function(e) {
    this.setData({
      member_listIndex: Number.parseInt(e.detail.value)
    });
  },
  paymentMethodPickerChange: function(e) {
    this.setData({
      paymentMethodIndex: Number.parseInt(e.detail.value),
      payment: this.data.paymentMethod[Number.parseInt(e.detail.value) || 0].payment
    });
  },
  paymentPickerChange: function(e) {
    this.setData({
      paymentIndex: Number.parseInt(e.detail.value)
    });
  },
  switch1Change: function(e) {
    console.log(e.detail.value)
  },
  //计算欠费金额 根据续费、补费等三种情况
  qianfei: function() {
    if (this.data.title == '续费') {
      let qianfei = (this.data.price2 || this.data.receivable) - (this.data.receipts || 0);
      qianfei = qianfei < 0 ? 0 : qianfei;
      this.setData({
        qianfei: qianfei.toFixed(1)
      })
    } else if (this.data.title == '补费') {
      let qianfei = this.data.courses[this.data.coursesIndex || 0].receivable - this.data.courses[this.data.coursesIndex || 0].receipts - this.data.courses[this.data.coursesIndex || 0].mdiscountAmount - (this.data.price||0);
      qianfei = qianfei < 0 ? 0 : qianfei;
      this.setData({
        qianfei: this.data.courses[this.data.coursesIndex || 0].balanceNum
      })
    } else {
      let qianfei = this.data.courses[this.data.coursesIndex || 0].receivable - this.data.courses[this.data.coursesIndex || 0].receipts - this.data.courses[this.data.coursesIndex || 0].mdiscountAmount - this.data.price;
      qianfei = qianfei < 0 ? 0 : qianfei;
      this.setData({
        qianfei: qianfei.toFixed(1)
      })
    }
    this.data.qianfei = this.data.qianfei == 0 ? 0 : this.data.qianfei;
    this.setData({
      qianfei: this.data.qianfei
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