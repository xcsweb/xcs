let network = require('../../../../utils/network.js')
let util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listdata: [],
    selectArray: [{
      "id": "0",
      "name": "其他通知"
    }, {
      "id": "1",
      "name": "系统通知"
    },],
    index:'',
    xtinfo:[],
    qttinfo:[]
    // isisConfirmsStrStyle="block"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      img_url: network.img_url,
      vod_url: network.vod_url
    })
  },

  // tabchange: function(e) {
  //   this.setData({
  //     tabIndex: e.detail.value
  //   })
  // },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.get_notice_list();
  },

  onChangeShowState: function (e) {
    let index = e.detail.value;
    
    this.setData({
      index: index
    })
    console.log(this.data.index)
    // this.get_notice_list()
    console.log(this.data.qttinfo)
    console.log(this.data.xtinfo)
    
  },
  get_notice_list: function() {
    network.request("/user/get_notice_list", {},
      res => {
        let index=100
        this.setData({
          index:index
        })
        console.log(this.data.index)
        if (res.status == 1) {
          // console.log(res.data) 
        
         
         
          res.data.forEach(e => {
            e.day_ = util.formatTime(new Date(e.sendDt * 1000)).substr(0, 16);
            if (e.isUseConfirm==1){
              if (e.isConfirm == 0) {
                e.isConfirmsStr = '未确认';
                e.isConfirmsStrColor = '#fac2be';
              } else if (e.isConfirm == 1) {
                e.isConfirmsStr = '已确认';
                e.isConfirmsStrColor = '#cccccc';
                e.isConfirmsStrStyle = "none";
              }
            } else if (e.isRead) {
              e.isConfirmsStr = '已读';
              e.isConfirmsStrColor = '#cccccc';
            }else{
              e.isConfirmsStr = '未读';
              e.isConfirmsStrColor = '#cccccc';
            }
          });
          var xtinfo = [];
          var qttinfo = []
          var j = 0;
          for (let i in res.data) {
            if (res.data[i].noticeType == '1') {
              xtinfo.push(res.data[i])
            }

          }
          this.setData({
            xtinfo: xtinfo,

          })
          console.log(this.data.xtinfo)
          for (let i in res.data) {
            if (res.data[i].noticeType == '0') {
              qttinfo.push(res.data[i])
            }
          }
          this.setData({
            qttinfo: qttinfo,
          })

          // console.log(res.data) 
        }
        this.setData({
          listdata: res.data
        });
      },
      error => {
        util.toast("获取数据失败")
      });
  },
  
  gettzinfo: function(event) {
     console.log(event.currentTarget);
    let noticeid = event.currentTarget.dataset.noticeid;
    let day_ = event.currentTarget.dataset.day_;
    let name = event.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../tongzhiinfo/tongzhiinfo?noticeid=' + noticeid + '&day_=' + day_ + '&name=' + name
    })
  },
  // get_notic:function () {
  //   network.request("/user/get_notice_detail", 
  //   { noticeId:6},
  //     res => {
  //          console.log(res.data);

  //     });
  // },

  /**
   * 生命周期函数--监听页面隐藏
   */



  onHide: function() {},
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