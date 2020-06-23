let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sexes: ["女", "男"],
    parentAdd: [1],
    classesIndex: 0,
    classesTimeIds: [],
    weeks: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    active: true,
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
      vod_url: network.vod_url
    });
    this.member_list();
    this.enroll_newstu({
      init: true
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

    let salesAmount = this.data.courses[this.data.coursesIndex || 0].salesAmount;
    this.data.courseDiscounts.forEach(discount=>{
      if (discount.checked&&discount.discountType==1){
        salesAmount = salesAmount * discount.discountVal * 0.1;
      }
    })
    this.setData({
      receivable: Number.parseFloat(salesAmount.toFixed(1))
    })
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
  imageloaderror1: function(e) {
    this.setData({
      [`tab1Data[${e.currentTarget.dataset.index}].avatar_`]: '/imgs/kechengbiao/kechengbiao_default_img.jpg'
    })
  },
  //获取初始表单数据
  enroll_newstu: function(params) {
    network.request("/manage/enroll_newstu", params,
      res => {
        if (res.status == 1) {
          if (res.data.areaCampus) {
            this.setData({
              areaCampus: res.data.areaCampus,
              member_list: res.data.sales,
              sourceCrmtags: res.data.sourceCrmtags
            });
            if (params.init && res.data.areaCampus.length > 0 && res.data.areaCampus[0].campuses && res.data.areaCampus[0].campuses.length > 0) {
              this.enroll_newstu({
                campusId: res.data.areaCampus[0].campuses[0].campusId,
                init: true
              });
            }
          }
          if (res.data.courses) {
            this.setData({
              courses: res.data.courses,
              receivable: res.data.courses.length > 0 ? res.data.courses[0].salesAmount : 0,
              paymentMethod: res.data.paymentMethod,
              payment: res.data.paymentMethod[0].payment
            });
            if (params.init && res.data.courses.length > 0 && res.data.courses[0].courseId) {
              this.enroll_newstu({
                campusId: this.data.areaCampus[this.data.areaCampusIndex || 0].campuses[this.data.campusesIndex || 0].campusId,
                courseId: res.data.courses[0].courseId,
                init: true
              })
            }
          }
          if (res.data.courseDiscounts) {

            // res.data.classes.forEach(itemA=>{
            //   itemA.clsTimeVos.forEach(itemB=>{
            //     itemB.checked = true;
            //     itemB.name = util.getWeekStr(itemB.week) + ' ' + itemB.startTime.slice(0, 5) + '-' + itemB.endTime.slice(0, 5)
            //     this.data.classesTimeIds.push(itemB.classesTimeId)
            //   });
            // });

            let clsTimeVosStr = "";
            this.data.classesTimeIds = [];
            res.data.classes.forEach((classes, clsIndex) => {
              classes.clsTimeVos.forEach(clsTimeVos => {
                clsTimeVos.checked = true;
                clsTimeVos.startTime = clsTimeVos.startTime.substr(0, 5);
                clsTimeVos.endTime = clsTimeVos.endTime.substr(0, 5);
                clsTimeVos.timestr = this.data.weeks[Number.parseInt(clsTimeVos.week) - 1] + clsTimeVos.startTime + '-' + clsTimeVos.endTime;
                if (clsIndex==0){
                  clsTimeVosStr = clsTimeVosStr + clsTimeVos.timestr + ",";
                }
                this.data.classesTimeIds.push(clsTimeVos.classesTimeId)
              })
            })
            this.setData({
              courseDiscounts: res.data.courseDiscounts,
              courseDiscountsSelectCount: 0,
              courseDiscountsSelectedStr: "",
              classes: res.data.classes,
              classesTimeIds: this.data.classesTimeIds,
              receivable: this.data.courses[this.data.coursesIndex || 0].salesAmount,
              qianfei: "",
              receipts: "",
              clsTimeVosStr: clsTimeVosStr
            });
          }
          if (res.data.editPower!=undefined) {
            this.setData({
              editPower: res.data.editPower
            })
          }
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
    if ("receipts" == e.currentTarget.dataset.name && this.data.receivable) {
      let qianfei = Number.parseFloat((this.data.receivable - (Number.parseFloat(e.detail.value) || 0)).toFixed(1));
      this.setData({
        'qianfei': qianfei < 0 ? 0 : qianfei
      });
    }
  },
  courseDiscountsChange: function(e) {
    let courseDiscounts = this.data.courseDiscounts[e.detail.index];
    let salesAmount = this.data.courses[this.data.coursesIndex||0].salesAmount;
    if (courseDiscounts&&courseDiscounts.discountType == 1 && this.data.receivable) {
      let receivable = salesAmount * courseDiscounts.discountVal * 0.1;
      receivable = Number.parseFloat(receivable.toFixed(1))
      this.setData({
        receivable: receivable
      })
    }else{
      this.setData({
        receivable: salesAmount
      })
    }
  },
  //续费提交
  enroll_newstu_sub: function() {
    console.log(this.data);
    if (!this.data.name) {
      util.toast("请输入姓名")
      return
    }
    if (!this.data.tel) {
      util.toast("请输入手机号")
      return
    }
    if (!util.isPhone(this.data.tel)) {
      util.toast("请输入正确的手机号")
      return
    }
    if (!this.data.userName) {
      util.toast("请输入账号")
      return
    }
    if (this.data.userName.length < 6) {
      util.toast("账号必须是6位以上")
      return
    }
    if (!this.data.password) {
      util.toast("请输入密码")
      return
    }
    if (!this.data.receivable) {
      util.toast("请输入应收金额")
      return
    }
    if (!this.data.receipts) {
      util.toast("请输入实收金额")
      return
    }
    if (this.data.receipts && this.data.receivable){
      if (this.data.receivable < this.data.receipts){
        util.toast("应收金额必须大于实收金额")
        return
      }
    }
    if (!this.data.birthDt) {
      util.toast("请选择生日")
      return
    }
    if (!this.data.address) {
      util.toast("请输入地址")
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

    if (!this.data.paymentMethod[this.data.paymentMethodIndex || 0]) {
      util.toast("请选择支付方式")
      return
    }
    if (!this.data.member_list[this.data.member_listIndex || 0]) {
      util.toast("请选择销售")
      return
    }
    if (!this.data.courses[this.data.coursesIndex || 0]) {
      util.toast("请选择课程")
      return
    }

    let courseDiscountIds = [];
    this.data.courseDiscounts.forEach(discount => {
      if (discount.checked) {
        courseDiscountIds.push({
          courseDiscountId: discount.id
        })
      }
    })

    let paramSC = {
      "courseId": this.data.courses[this.data.coursesIndex || 0].courseId || 0,
      "receivable": this.data.receivable,
      "studentCourseDiscountList":courseDiscountIds,
      "paymentMethod": this.data.paymentMethod[this.data.paymentMethodIndex || 0].codeValue || 0,
      "receipts": this.data.receipts || 0,
      "classesId": this.data.classes[this.data.classesIndex || 0] ? this.data.classes[this.data.classesIndex || 0].classesId : 0,
      "classesTimeIds": this.data.classesTimeIds.length > 0 ? this.data.classesTimeIds.join(",") : "",
      "des": this.data.des || "",
      "isOpen": this.data.active ? "1" : "0"
    }
    if (this.data.payment.length > 0) {
      paramSC.payConfigId = this.data.payment[this.data.paymentIndex || 0].payConfigId || 0
    }
    let params = {
      "avatar": this.data.avatar || "",
      "name": this.data.name || "",
      "sex": this.data.sex || 0,
      "tel": this.data.tel || "",
      "campusId": this.data.areaCampus[this.data.areaCampusIndex || 0].campuses[this.data.campusesIndex || 0].campusId || 0,
      "idNum": this.data.idNum || "",
      "userName": this.data.userName || "",
      "password": this.data.password || "",
      "saleMemberId": this.data.member_list[this.data.member_listIndex || 0].memberId || 0,
      "sourceCrmtagId": this.data.sourceCrmtags[this.data.sourceCrmtagsIndex || 0].crmtagId || 0,
      "studentCourse": paramSC,
      "birthDt": this.data.birthDt || "",
      "wechatNum": this.data.wechatNum || "",
      "address": this.data.address || "",
      "icCard": this.data.icCard || "",
      "schoolNum": this.data.schoolNum || "",
      "faceImg": this.data.faceImg || "",
      "studentParentList": []
    };
    //添加家长数据
    let parents = this.selectAllComponents(".com-parent");
    parents.forEach(parent => {
      if (parent.data.name && parent.data.relation) {
        params.studentParentList.push(parent.data);
      }
    });
    console.log(params);
    network.requestLoading("/manage/enroll_newstu_sub", params, "正在提交",
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

  active: function(e) {
    this.setData({
      active: e.detail.value
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
      util.toast("上传图片失败：" + JSON.stringify(error));
    });
  },
  //各种picker的改变响应
  pickerChange: function(e) {
    let indexname = e.currentTarget.dataset.indexname;
    console.log(e.detail);
    this.setData({
      [indexname]: Number.parseInt(e.detail.value)
    });
    switch (indexname) {
      case "coursesIndex":
        this.enroll_newstu({
          campusId: this.data.areaCampus[this.data.areaCampusIndex || 0].campuses[this.data.campusesIndex || 0].campusId,
          courseId: this.data.courses[this.data.coursesIndex || 0].courseId
        });
        break;
      case "areaCampusIndex":
        this.setData({
          campusesIndex: 0,
          coursesIndex: 0,
          classesIndex: 0,
          classesTimeIds: []
        })
        this.enroll_newstu({
          campusId: this.data.areaCampus[this.data.areaCampusIndex || 0].campuses[this.data.campusesIndex || 0].campusId,
          init: true,
        });
        break;
      case "campusesIndex":
        this.setData({
          coursesIndex: 0,
          classesIndex: 0,
          classesTimeIds: []
        })
        this.enroll_newstu({
          campusId: this.data.areaCampus[this.data.areaCampusIndex || 0].campuses[this.data.campusesIndex || 0].campusId,
          init: true
        });
        break;
      case "paymentMethodIndex":
        this.setData({
          payment: this.data.paymentMethod[this.data.paymentMethodIndex || 0].payment
        })
        break;
      case "classesIndex":
        let clsTimeVosStr = "";
        let classesTimeIds = [];
        this.data.classes[e.detail.value].clsTimeVos.forEach(clsTimeVos => {
          if (clsTimeVos.checked){
            clsTimeVosStr += clsTimeVos.timestr + ",";
            classesTimeIds.push(clsTimeVos.classesTimeId);
          }
        })
        this.setData({
          clsTimeVosStr: clsTimeVosStr,
          classesTimeIds: classesTimeIds
        })
        break;
    }
  },
  bindDateChange: function(e) {
    let birthDt = Math.floor(new Date(e.detail.value.replace(/-/g, '/')).getTime() / 1000);
    this.setData({
      date: e.detail.value,
      birthDt: birthDt
    })
  },
  switch1Change: function(e) {
    console.log(e.detail.value)
  },
  checkClsTime: function(e) {
    this.setData({
      classesTimeIds: e.detail.value
    })
  },
  //多选组件响应事件 显示组件
  multichoice: function() {
    this.setData({
      multichoice: true
    })
  },
  //多选组件响应事件 取消
  multichoice_cancel: function() {
    this.setData({
      multichoice: false
    })
  },
  //多选组件响应事件 确定
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
      classes: this.data.classes,
      classesTimeIds: e.detail.value
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