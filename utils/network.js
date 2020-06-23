//服务器地址-测试
// const SERVER = "https://m1.dongbaoyun.com/rest/wechat";
// const SERVER_WEB = "https://b1.dongbaoyun.com/";
// const SERVER_IMG = "http://b1.dongbaoyun.com/wwx/imgs/";
//服务器地址-正式
const SERVER = "https://miniprogram.dongbaoyun.com/rest/wechat";
const SERVER_WEB = "https://op.dongbaoyun.com/";
const SERVER_IMG = "http://op.dongbaoyun.com/wwx/imgs/";
//从服务器获取图片视频的七牛云url前缀
let img_url = "";
let vod_url = "";
let suffix = "";
let offset = 0; //分页-开始位置
let limit = 10; //分页-查询条数 
function request(url, params, success, fail) {
  this.requestLoading(url, params, "", success, fail)
}
// 展示进度条的网络请求
// url:网络请求的url
// params:请求参数
// message:进度条的提示信息
// success:成功的回调函数
// fail：失败的回调
function requestLoading(url, params, message, success, fail) {
  if (url==""){
    return;
  }
  if (message != "") {
    wx.showLoading({
      title: message,
      mask: true
    })
  }
  //判断url有无insId参数
  if (url.indexOf("insId=") < 0) {
    url += ((url.indexOf("?") < 0) ? ('?insId=' + wx.getStorageSync("institutionId")) : ('&insId=' + wx.getStorageSync("institutionId")));
  }
  wx.showNavigationBarLoading()
  let me = this;
  if (wx.getStorageSync("sessionId") == "") {
    wx.request({
      url: SERVER + "/common/wxxinfo",
      header: {
        Lt: 2
      },
      method: 'post',
      data: {},
      success: function(res) {
        wx.setStorageSync('sessionId', res.data.data.sessionId)
        me.wxrequest(url, params, message, success, fail);
      }
    })
  } else {
    me.wxrequest(url, params, message, success, fail);
  }
}

function wxrequest(url, params, message, success, fail) {
  let token = wx.getStorageSync("token");
  let institutionId = wx.getStorageSync("institutionId");
  let sessionId = wx.getStorageSync("sessionId");
  if ((!token || !institutionId || !sessionId) && url.indexOf("common") == -1) {
    wx.removeStorageSync('token')
    wx.removeStorageSync('sessionId')
    wx.removeStorageSync('institutionId')
    let logoutUrl = "/pages/login/login";
    wx.reLaunch({
      url: logoutUrl
    })
  }
  wx.request({
    url: SERVER + url,
    data: params,
    header: {
      Lt: 2,
      Token: token,
      'Cookie': 'JSESSIONID=' + wx.getStorageSync("sessionId")
    },
    method: 'post',
    success: function(res) {
      //console.log(res.data)
      wx.hideNavigationBarLoading();
      if (message != "") {
        wx.hideLoading()
      }
      if (res.statusCode == 200) {
        success(res.data)
      } else if (res.statusCode == 320){
        wx.showToast({
          title: '登录超时',
          icon: 'none',
          duration: 2000,
          complete: function(){
            wx.removeStorageSync('token')
            wx.removeStorageSync('sessionId')
            wx.removeStorageSync('institutionId')
            let logoutUrl = "/pages/login/login"
            wx.reLaunch({
              url: logoutUrl
            })
          }
        });
      }else {
        if (typeof fail == 'function')
          fail()
      }

    },
    fail: function(res) {
      wx.hideNavigationBarLoading()
      if (message != "") {
        wx.hideLoading()
      }
      if (typeof fail == 'function')
        fail()
    },
    complete: function(res) {

    },
  })
}

function filterInfo(params, success){
  let me = this;
  me.request(
    "/manage/filter_option", 
    params,
    res => {
      if (res.status == "1") {
        let data = {};
        let searchParam = {}
        if (params.isAllData){
          searchParam.isAllData = wx.getStorageSync("isAllData") ? wx.getStorageSync("isAllData") : 0;
        }
        data.filterParam = res.data;
        data.searchParam = searchParam;
        success(data)
      } else {
        wx.showToast({
          title: res.message,
          icon: "none",
          duration: 2000
        })
      }
    },
    function (err) {
      console.log(err)
    }
  )
}

module.exports = {
  request: request,
  requestLoading: requestLoading,
  wxrequest: wxrequest,
  filterInfo: filterInfo,
  SERVER: SERVER,
  SERVER_IMG: SERVER_IMG,
  SERVER_WEB: SERVER_WEB,
  img_url: img_url,
  vod_url: vod_url,
  suffix: suffix,
  offset: offset,
  limit: limit
}
module.exports.img_url = wx.getStorageSync("img_url")
module.exports.vod_url = wx.getStorageSync("vod_url")
module.exports.suffix = wx.getStorageSync("suffix")