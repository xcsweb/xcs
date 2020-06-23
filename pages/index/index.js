var network = require('../../utils/network.js')
var util = require('../../utils/util.js')
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    body_bg: util.filterLocalImgUrl("index/index_body.png"),
    index_voice: util.filterLocalImgUrl("index/index_voice.png"),
    noticeCount: 0,
    autoplay: true,
    interval: 5000,
    duration: 1000
  },
  onLoad: function(options) {
    if (options.navigateTo){
      let param = "";
      for (let key in options){
        if (key !="navigateTo"){
          if (param == "") {
            param += "?" + key + "=" + options[key]
          } else {
            param += "&" + key + "=" + options[key]
          }
        }
      }
      wx.navigateTo({
        url: options.navigateTo + param
      })
    }
    wx.login({
      success(res) {
        if (res.code) {
          console.log(res.code)
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  onShow: function () {
    network.request("/manage/index", {},
    res => {
      let imgUrls = [];
      let body_bg = util.filterLocalImgUrl("index/index_body.png");
      if (res.data.miniMap.isMiniprogram == 0) {
        imgUrls = [
          {
            msg: '动宝云，专为体育和艺术培训设计！',
            img: util.filterLocalImgUrl('dongbaolog.png')
          },
          {
            msg: res.data.miniMap.miniText,
            img: res.data.miniMap.miniLogo
          }
        ]
      }else{
        imgUrls = [
          {
            msg: res.data.miniMap.miniText,
            img: res.data.miniMap.miniLogo
          }
        ]
        if (res.data.miniMap.miniBanner){
          body_bg = res.data.miniMap.miniBanner;
          wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#000000'
          })
        }
      }
      if(res.data.myRank){
        if (res.data.myRank.rankChange >= 0) {
          res.data.myRank.rankChange = "↑" + res.data.myRank.rankChange;
        } else {
          res.data.myRank.rankChange = "↓" + (-res.data.myRank.rankChange);
        }
      }
      this.setData({
        body_bg:body_bg,
        noticeCount: res.data.noticeCount,
        imgUrls: imgUrls,
        authList: res.data.authList,
        myRank: res.data.myRank||{}
      });
    },
    error => {
      wx.showToast({
        title: '获取数据失败',
        icon: 'none'
      })
    });
  },
})