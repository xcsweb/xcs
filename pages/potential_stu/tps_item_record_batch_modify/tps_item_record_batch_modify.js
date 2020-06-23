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
    this.get_stu_tps_record_detail();
    this.get_campus();
  },
  //设置学校
  changeSelectedCampusName:function(){
    if (this.data.campus && this.data.studentTpsInfo[0]){
      this.data.campus.forEach((campus,index)=>{
        if (campus.name == this.data.studentTpsInfo[0].campusName){
          this.setData({
            campusIndex:index
          })
        }
      })
    }
  },
  //获取体测详情
  get_stu_tps_record_detail: function() {
    network.requestLoading('/manage/get_stu_tps_record_detail', {
      "studentTpsId": this.data.id
    }, "", res => {
      if (res.status == 1) {
        if (JSON.stringify(res.data.studentTpsRecord).indexOf('"反应能力"') >= 0 || JSON.stringify(res.data.studentTpsRecord).indexOf('"骨密度"') >= 0) {
          res.data.studentTpsRecord.forEach(e => {
            let cus = [];
            switch (e.title) {
              case '骨密度':
                cus.push({
                  title1: "Z值",
                  title2: "同龄百分比",
                  title3: "骨密度",
                  id: e.recordId,
                  val1: e.val1,
                  val2: e.val2,
                  itemId: e.itemId
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
              case '反应能力':
                cus.push({
                  title1: "击打数",
                  title2: "错误击打数",
                  title3: "反应能力测试",
                  id: e.recordId,
                  val1: e.val1,
                  val2: e.val2,
                  itemId: e.itemId
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
                  id: e.recordId,
                  val1: e.val1,
                  val2: e.val2,
                  itemId: e.itemId
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
        } else {
          let tpsItemList = [];
          res.data.studentTpsRecord.forEach(studentTpsRecord => {
            if (studentTpsRecord.zbcs == 1) {
              let tpsItem = {
                "id": studentTpsRecord.itemId,
                "title": studentTpsRecord.title,
                "content": studentTpsRecord.content,
                "zbcs": 1,
                "recordId": studentTpsRecord.recordId,
                "tpsCategories": [{
                  "id": studentTpsRecord.tpsCategoryList[0].tpsCategory,
                  "title": studentTpsRecord.tpsCategoryList[0].title,
                  "value": studentTpsRecord.val1
                }],
                "tpsCategoriesOption": []
              }
              tpsItemList.push(tpsItem);
            } else {
              let tpsItem = {
                "id": studentTpsRecord.itemId,
                "title": studentTpsRecord.title,
                "content": studentTpsRecord.content,
                "zbcs": 0,
                "recordId": studentTpsRecord.recordId,
                "tpsCategories": [],
                "tpsCategoriesOption": []
              }
              studentTpsRecord.itemList.forEach((item, index) => {
                item.id = item.tpsCategory;
                if (item.title == studentTpsRecord.val1) {
                  tpsItem.index = index;
                }
              })
              tpsItem.tpsCategoriesOption = studentTpsRecord.itemList;
              tpsItemList.push(tpsItem);
            }
          })
          res.data.tps_item_category = tpsItemList;
        }
        this.setData(res.data);
        this.setData({
          date: util.formatTime(new Date(res.data.studentTpsInfo[0].createDt * 1000)).substr(0, 10)
        })
        this.changeSelectedCampusName();
        console.log(res.data)
      } else {
        util.toast(res.message || "获取数据失败")
      }
    }, error => {
      util.toast("获取数据失败")
    })
  },

  //获取体测列表
  get_campus: function() {
    network.requestLoading('/manage/get_campus', {}, "", res => {
      if (res.status == 1) {
        this.setData({
          campus: res.data
        });
        this.changeSelectedCampusName();
      }
    }, error => {

    })
  },
  //提交体测  普通
  update_tps_item_record: function() {
    let params = {
      "campusId": this.data.campus[this.data.campusIndex].id,
      "studentId": this.data.studentId,
      "studentTpsId":this.data.id,
      "tpsItemRecords": []
    }

    this.data.tps_item_category.forEach(e => {
      let tpsItemRecord = {
        itemId:e.id,
        recordId: e.recordId,
        zbcs: e.zbcs,
        val2: ""
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
    network.requestLoading('/manage/update_tps_item_record', params, "请稍等", res => {
      if (res.status == 1) {
        util.toast(res.message || '已提交', true)
      } else {
        util.toast(res.message || '操作失败')
      }
    }, error => {
      util.toast('操作失败')
    })
  },

  //提交体测  特殊
  update_tps_item_record_cus: function() {
    let params = {
      "campusId": this.data.campus[this.data.campusIndex].id,
      "studentId": this.data.studentId,
      "tpsItemRecords": []
    }
    this.data.cus.forEach(e => {
      let tpsItemRecord = {
        recordId: e.id,
        zbcs: 1,
        itemId: e.itemId
      };
      tpsItemRecord.val1 = e.val1;
      tpsItemRecord.val2 = e.val2;
      params.tpsItemRecords.push(tpsItemRecord)
    })
    network.requestLoading('/manage/update_tps_item_record', params, "请稍等", res => {
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