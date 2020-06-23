let network = require('../../utils/network.js')
let util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex:0,
    arrIndex: null,
    teache_model_list: [],
    teache_course_list: [],
    teache_task_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.get_teache_model_list();
  },
  tabchange:function(e){
    this.data.teache_model_list.forEach(teache_model=>{
      teache_model.showAll=false;
    })
    this.setData({
      teache_model_list: this.data.teache_model_list,
      tabIndex: e.detail.value
    });
  },
  showAll: function(e) {
    if (this.data.teache_course_list.length>0){
      this.setData({
        [`teache_course_list[${e.currentTarget.dataset.index}].showAll`]: !this.data.teache_course_list[e.currentTarget.dataset.index].showAll
      });
    }
    if (this.data.teache_task_list.length > 0) {
      this.setData({
        [`teache_task_list[${e.currentTarget.dataset.index}].showAll`]: !this.data.teache_task_list[e.currentTarget.dataset.index].showAll
      });
    }
    
    /*if (this.data.teache_model_list[e.currentTarget.dataset.index].showAll) {
      if(this.data.tabIndex==0){
        let params = {
          "teachModelId": this.data.teache_model_list[e.currentTarget.dataset.index].id
        };
        this.get_teache_course_list(params);
      }else{
        let params = {
          "teachModelId": this.data.teache_model_list[e.currentTarget.dataset.index].id
        };
        this.get_teache_task_list(params);
      }
    }*/
  },
  toDetail:function(e){
    let title=this.data.tabIndex==0?"教学教案详情":"作业详情";
    wx.navigateTo({
      url: '/pages/teach_course/course_detail/course_detail?title='+title+'&id='+e.currentTarget.dataset.id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  grandson:function(e){
    let dataset = e.currentTarget.dataset;
    let index1 = e.currentTarget.dataset.index1;
    let index2 = e.currentTarget.dataset.index2;
    /*if(this.data.tabIndex==0){
      this.setData({
        [`teache_model_list[${index1}].teache_course_list[${index2}].grandson`]: !this.data.teache_model_list[index1].teache_course_list[index2].grandson
      })
    }else{
      this.setData({
        [`teache_model_list[${index1}].teache_task_list[${index2}].grandson`]: !this.data.teache_model_list[index1].teache_task_list[index2].grandson
      })
    }*/
  },
  pickerChange: function(e) {
    let teache_model = this.data.teache_model_list[e.detail.value];
    teache_model.showAll = true;
    let params = {
      "teachModelId": teache_model.id
    };
    this.get_teache_course_list(params);
    this.get_teache_task_list(params);
    this.setData({
      arrIndex: e.detail.value,
      teache_model_list: this.data.teache_model_list
    });
  },
  //获取模板列表
  get_teache_model_list: function() {
    network.requestLoading('/manage/get_teache_model_list', {}, "", res => {
      if (res.status == 1) {
        console.log(res.data)
        this.setData({
          teache_model_list: res.data
        });
        if (this.data.teache_course_list.length==0){
          let params = {
            "teachModelId": this.data.teache_model_list[0].id
          };
          this.get_teache_course_list(params);
        }
        if (this.data.teache_task_list.length==0){
          let params = {
            "teachModelId": this.data.teache_model_list[0].id
          };
          this.get_teache_task_list(params);
        }
        if (res.data.length == 0) {
          util.toast("模板列表为空!")
        }
      } else {
        util.toast("获取数据失败")
      }
    }, error => {
      util.toast("获取数据失败")
    })
  },
  //获取子模板列表
  get_teache_course_list: function(params) {
    network.requestLoading('/manage/get_teache_course_list', params, "", res => {
      if (res.status == 1) {
        /*this.data.teache_model_list.forEach(teache_model => {
          res.data.forEach(teache_course_list => {
            if (teache_course_list.teachModelId == teache_model.id) {
              teache_model.teache_course_list = teache_course_list.teachModels;
            }
          })
        })*/
        this.setData({
          teache_course_list: res.data
        })
        /*if (res.data.length == 0 || res.data[0].teachModels.length == 0) {
          util.toast("子模板列表为空!")
        }*/
      } else {
        util.toast("获取数据失败")
      }
    }, error => {
      util.toast("获取数据失败")
    })
  },
  //获取作业列表
  get_teache_task_list: function (params) {
    network.requestLoading('/manage/get_teache_task_list', params, "", res => {
      if (res.status == 1) {
        /*this.data.teache_model_list.forEach(teache_model => {
          res.data.forEach(teache_course_list => {
            if (teache_course_list.teachModelId == teache_model.id) {
              teache_model.teache_task_list = teache_course_list.teachModels;
            }
          })
        })*/
        this.setData({
          teache_task_list: res.data
        })
        /*if (res.data.length == 0 || res.data[0].teachModels.length == 0) {
          util.toast("子模板列表为空!")
        }*/
      } else {
        util.toast("获取数据失败")
      }
    }, error => {
      util.toast("获取数据失败")
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