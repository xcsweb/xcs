let network = require('../../../../utils/network.js')
let util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vodUrl: "",
    vodIndex: 0,
    detailData: {},
    formData :{ 
      studentTaskId:0, 
      imgfiles:"", 
      vodfiles:"", 
      content:"",
      studentTaskCompleteTermList:[]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.formData.studentTaskId = options.studentTaskId;
    this.setData({
      options: options,
      formData: this.data.formData
    });
    this.findDetail();
  },

  findDetail: function () {
    network.request("/user/task_detail",
      {
        "studentTaskId": this.data.formData.studentTaskId
      },
      res => {
        if (res.status == 1) {
          if (res.data.vodfiles.length > 0) {
            this.data.vodUrl = res.data.vodfiles[0];
          }
          let attachments = [];
          res.data.imgfiles.forEach((v) => {
            attachments.push({ img: v });
          })
          res.data.attachments = attachments;
          let studentTaskCompleteTermList = [];
          res.data.studentTaskTerms.forEach((item) => {
            item.completeVal = 0;
            studentTaskCompleteTermList.push({
              teachLabelId: item.teachLabelId, 
              labelName: item.labelName, 
              val:0
            });
          })
          this.data.formData.studentTaskCompleteTermList = studentTaskCompleteTermList;
          this.data.formData.title = res.data.title;

          res.data.StudentTasksCompletes.forEach((item)=>{
            item.createDt = util.formatTime(item.createDt).substr(0,16);
          });
          
          wx.setNavigationBarTitle({
            title: res.data.title
          });
          this.setData({
            detailData: res.data,
            vodUrl: this.data.vodUrl,
            formData: this.data.formData
          });
          console.log(this.data);
        } else {
          util.toast("获取数据失败")
        }
      },
      error => {
        util.toast("获取数据失败")
      }
    );
  },
  changeVod: function (e) {
    this.videoContext = wx.createVideoContext('myVod');
    this.videoContext.pause();
    let dataset = e.currentTarget.dataset;
    this.setData({
      vodUrl: this.data.detailData.vodfiles[dataset.index],
      vodIndex: dataset.index
    });
  },
  sliderChange: function(e){
    if (e.detail.value){
      this.data.detailData.studentTaskTerms[e.currentTarget.dataset.index].completeVal = e.detail.value;
      this.data.formData.studentTaskCompleteTermList[e.currentTarget.dataset.index].val = e.detail.value;
    }
    this.setData({
      detailData: this.data.detailData,
      formData: this.data.formData
    })
  },
  changeAttachments: function (e) {
    let imgfiles = [];
    let vodfiles = [];
    e.detail.attachments.forEach(attachment => {
      if (attachment.video) {
        vodfiles.push(attachment.key);
      } else {
        imgfiles.push(attachment.key);
      }
    });
    this.data.formData.imgfiles = imgfiles.join(",");
    this.data.formData.vodfiles = vodfiles.join(",");
    this.setData({
      formData: this.data.formData
    })
  },
  changeTaskContent: function (e) {
    this.data.formData.content = e.detail.value;
    this.setData({
      formData: this.data.formData
    })
  },
  subWork: function () {
    if (this.data.formData.content == '') {
      util.toast('内容说明不能为空');
      return;
    }
    network.requestLoading("/user/finish_student_task", this.data.formData, "请稍后...",
      res => {
        if (res.status == "1") {
          wx.showToast({
            title: res.message,
            icon: "none",
            duration: 2000
          })
          wx.redirectTo({
            url: './detail?studentTaskId=' + this.data.formData.studentTaskId
          })
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
  toDetail: function (event){
    wx.navigateTo({
      url: '../work_read/work_read?id=' + event.currentTarget.dataset.studenttaskcompleteid
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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