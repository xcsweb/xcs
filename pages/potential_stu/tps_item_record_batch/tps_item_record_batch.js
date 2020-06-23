let network = require('../../../utils/network.js')
let util = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    campusIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData(options)
    this.get_tps_item_category();
    this.get_campus();
    this.setData({
      date: util.formatTime(new Date()).substr(0, 10)
    })
  },
  //获取体测列表
  get_tps_item_category: function() {
    network.requestLoading('/manage/get_tps_item_category', {
      "bigClassId": this.data.big_class_id,
      studentId: this.data.studentId
    }, "", res => {
      if (res.status == 1) {
        res.data.tpsItemList.forEach(e => {
          let cus=[];
          switch (e.title) {
            case '骨密度':
              cus.push({
                title1: "Z值",
                title2: "同龄百分比",
                title3: "骨密度",
                id: e.id
              })
              if (this.data.cus){
                this.setData({
                  doubleInput:true,
                  cus: this.data.cus.concat(cus)
                })
              }else{
                this.setData({
                  doubleInput: true,
                  cus: cus
                })
              }
              break;
            case '反应能力':
              cus.push({
                title1: "击打数",
                title2: "错误击打数",
                title3: "反应能力测试",
                id: e.id
              })
              if (this.data.cus) {
                this.setData({
                  doubleInput: true,
                  cus: this.data.cus.concat(cus)
                })
              } else {
                this.setData({
                  doubleInput: true,
                  cus: cus
                })
              }
              break;
            case '灵敏能力':
              cus.push({
                title1: "躲过数",
                title2: "未躲过数",
                title3: "灵敏能力测试",
                id: e.id
              })
              if (this.data.cus) {
                this.setData({
                  doubleInput: true,
                  cus: this.data.cus.concat(cus)
                })
              } else {
                this.setData({
                  doubleInput: true,
                  cus: cus
                })
              }
              break;
          }
        })

        this.setData({
          tps_item_category: res.data.tpsItemList,
          currentLogin: res.data.currentLogin
        });
        console.log(this.data.tps_item_category)
      }
    }, error => {

    })
  },

  //获取体测列表
  get_campus: function() {
    network.requestLoading('/manage/get_campus', {}, "", res => {
      if (res.status == 1) {
        this.setData({
          campus: res.data
        });
      }
    }, error => {

    })
  },
  //提交体测 普通
  add_tps_item_record: function() {
    let params = {
      "campusId": this.data.campus[this.data.campusIndex].id,
      "studentId": this.data.studentId,
      "bigClassId": this.data.big_class_id,
      "tpsItemRecords": []
    }
    this.data.tps_item_category.forEach(e => {
      let tpsItemRecord = {
        itemId: e.id,
        zbcs: e.zbcs
      };
      if (e.zbcs == 0 && typeof e.index != 'undefined') {
        tpsItemRecord.optionId = e.tpsCategoriesOption[e.index].id;
        tpsItemRecord.val1 = e.tpsCategoriesOption[e.index].title;
        params.tpsItemRecords.push(tpsItemRecord)
      } else {
        e.tpsCategories.forEach((e2, index) => {
          tpsItemRecord["val" + (index + 1)] = e2.value || "";
        });
        params.tpsItemRecords.push(tpsItemRecord)
      }
    })
    network.requestLoading('/manage/add_tps_item_record', params, "请稍等", res => {
      if (res.status == 1) {
        util.toast(res.message || '已提交', true)
      } else {
        util.toast(res.message || '操作失败')
      }
    }, error => {
      util.toast('操作失败')
    })
  },


  //提交体测 特殊 骨密度 运动能力等
  add_tps_item_record_cus: function() {
    let params = {
      "campusId": this.data.campus[this.data.campusIndex].id,
      "studentId": this.data.studentId,
      "bigClassId": this.data.big_class_id,
      "tpsItemRecords": []
    }
    this.data.cus.forEach(e => {
      let tpsItemRecord = {
        itemId: e.id,
        zbcs: 1,
        val1: e.val1,
        val2: e.val2
      };
      params.tpsItemRecords.push(tpsItemRecord)
    })
    network.requestLoading('/manage/add_tps_item_record', params, "请稍等", res => {
      if (res.status == 1) {
        util.toast(res.message || '已提交', true)
      } else {
        util.toast(res.message || '操作失败')
      }
    }, error => {
      util.toast('操作失败')
    })
  },

  tpsCategoriesOptionChange(e) {
    let id = e.currentTarget.dataset.id;
    let index = Number.parseInt(e.detail.value);
    this.data.tps_item_category.forEach(e => {
      if (e.id == id) {
        e.index = index;
      }
    })
    this.setData({
      tps_item_category: this.data.tps_item_category
    });
  },
  campusIndex(e) {
    let index = Number.parseInt(e.detail.value);
    this.setData({
      campusIndex: index
    });
  },
  bindinput(ev) {
    let id = ev.currentTarget.dataset.id;
    let index = ev.currentTarget.dataset.index;
    this.data.tps_item_category.forEach(e => {
      if (e.id == id) {
        e.tpsCategories.forEach((e2, index2) => {
          if (index == index2) {
            e2.value = ev.detail.value;
          }
        })
      }
    })
    this.setData({
      tps_item_category: this.data.tps_item_category
    });
  },

  bindinput2(ev) {
    let name = ev.currentTarget.dataset.name;
    let index = ev.currentTarget.dataset.index;
    this.data.cus[index][name] = ev.detail.value;
    this.setData({
      cus: this.data.cus
    });
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