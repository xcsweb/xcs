const qiniuUploader = require("../qiniuUploader");
const network = require('./network.js')
let imgUptoken, vodUptoken;
const formatTime = (date, separator) => {
  date = typeof date == 'number' ? new Date(date*1000) : date;
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join(separator||'-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatDate = (date, separator) => {
  if (!date) {
    date = new Date();
  } else if (typeof (date) == "string") {
    date = new Date(date)
  } else if (typeof (date) == "number") {
    date = new Date(date * 1000)
  }
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  return [year, month, day].map(formatNumber).join(separator || '-')
}
const dateToDayStamp = date => {
  if (!date){
    date = new Date();
  } else if (typeof (date) == "string"){
    date = new Date(formatDate(date.replace(/-/g, '/'),"/") + " 0:0:0")
  }
  return date.getTime() / 1000
}
const dateToStamp = date => {
  if (!date) {
    date = new Date();
  } else if (typeof (date) == "string") {
    date = new Date(date.replace(/-/g, '/'));
  }
  return date.getTime() / 1000
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//过滤本地图片url
function filterLocalImgUrl(imgUrl) {
  if (!imgUrl) {
    return ""
  }
  if (imgUrl.indexOf("http") == -1) {
    imgUrl = network.SERVER_IMG + imgUrl;
  }
  return imgUrl;
}

//过滤图片url
function filterImgUrl(imgUrl){
  if (!imgUrl){
    return ""
  }
  if (imgUrl.indexOf("http")==-1){
    imgUrl = network.img_url+imgUrl;
  }
  return imgUrl;
}

//过滤视频url
function filterVodUrl(vodUrl) {
  if (!vodUrl) {
    return ""
  }
  if (vodUrl.indexOf("http") == -1) {
    vodUrl = network.vod_url + vodUrl;
  }
  return encodeURI(vodUrl);
}
//获取星期
function getWeekStr(week){
  if (week==1){
    return "星期一"
  } else if (week==2){
    return "星期二"
  } else if (week == 3) {
    return "星期三"
  } else if (week == 4) {
    return "星期四"
  } else if (week == 5) {
    return "星期五"
  } else if (week == 6) {
    return "星期六"
  } else {
    return "星期天"
  }
}

//手机号格式判断
function isPhone(phoneNumber){
  var result = (!phoneNumber) ? false : !!phoneNumber.match(/^(0|86|17951)?(13[0-9]|16[0-9]|15[0-9]|17[3678]|18[0-9]|14[57]|199)[0-9]{8}$/);
  if (result){
    return result
  }else{
    //判断8位8开头的GSM格式手机号码
    return /^8\d{7}$/.test(phoneNumber)
  }
}
function stararray(stars) {
  var num = stars.toString().substring(0, 1);
  var array = [];
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1);
    } else {
      array.push(0);
    }
  }
  return array;
}
/**
 * Toast
 * title 标题
 * back toast消失后返回上个页面
 * duration 时长
 * icon 图标
 * mask 点击穿透
 */
function toast(title, back, duration, icon, mask) {
  wx.showToast({
    title: title || 'hello',
    duration: duration || 1000,
    icon: icon || 'none',
    mask:mask||false
  });
  if (back) {
    setTimeout(() => {
      wx.navigateBack({
        delta: 1,
      });
    }, duration || 1000)
  }
}

/**
 * Alert
 * title 标题
 * content
 */
function alert(title, content, success) {
  wx.showModal({
    title: title||"提示",
    content: content,
    showCancel:false,
    success:(res)=>{
      success(res)
    }
  })
}
/**
 * 模块内部使用
 */
function _find_uptoken() {
  network.requestLoading('/common/find_uptoken', {}, "", res => {
    if (res.status == 1) {
      imgUptoken = res.data.imgUptoken;
      vodUptoken = res.data.vodUptoken;
    }
  }, error => {})
}

/**
 * 选择图片并上传
 * success 成功回调
 * fail 失败回调
 */
function chooseImgUpload(success, fail) {
  if (!imgUptoken) {
    _find_uptoken();
    if (typeof fail == 'function') {
      fail();
    }
    return;
  }
  // 选择图片
  wx.chooseImage({
    count: 1,
    success: function(res) {
      var filePath = res.tempFilePaths[0];
      // 交给七牛上传
      qiniuUploader.upload(filePath, (res) => {
        if (typeof success == 'function')
          success(res);
        // that.data.attachments.push({ key: res.key, img: filePath, localfile: filePath })
        // that.setData({
        //   'attachments': that.data.attachments
        // });
      }, (error) => {
        if (typeof fail == 'function')
          fail(error);
      }, {
        region: 'ECN',
        domain: network.img_url,
        uptoken: imgUptoken
        }, (res) => {
          //toast("已上传" + res.progress + "%")
        // console.log('上传进度', res.progress)
        // console.log('已经上传的数据长度', res.totalBytesSent)
        // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
      });
    }
  })
}
/**
 * 选择视频并上传
 * success 成功回调
 * fail 失败回调
 */
function chooseVodUpload(success, fail){
  if (!vodUptoken) {
    _find_uptoken();
    if (typeof fail == 'function') {
      fail();
    }
    return;
  }
  // 选择视频
  wx.chooseVideo({
    success: function (res) {
      //缩略图真机不返回 采用七牛云的视频截图
      var filePath = res.tempFilePath;
      // 交给七牛上传
      qiniuUploader.upload(filePath, (res) => {
        if (typeof success == 'function')
          success(res);
        // that.data.attachments.push({
        //   img: res.imageURL + "?vframe/jpg/offset/0/w/640/h/360",
        //   key: res.key,
        //   video: true,
        //   localfile: filePath
        // })
      }, (error) => {
        if (typeof fail == 'function')
          fail(error);
      }, {
          region: 'ECN',
          domain: network.img_url,
          uptoken: vodUptoken
        }, (res) => {
          toast("已上传" + res.progress+"%",false,2000,null,true)
          // console.log('上传进度', res.progress)
          // console.log('已经上传的数据长度', res.totalBytesSent)
          // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
        });
    },
    fail: error => {
      if (typeof fail == 'function'){
        if (JSON.stringify(error).indexOf("cancel")<0)
          fail(error);
      }
    }
  })
}

// //体测模块算法
// function tc(student, parentinfo) {
//   var date = new Date;
//   var year = date.getFullYear();
//   for (let i = 0; i < student.length; i++) {
//     student[i].age = year - student[i].day_.slice(0, 4)
//     if (student[i].sex == 1) {
//       // console.log('男')
//       student[i].ycheight = 59.699 + (0.419 * parentinfo[i].pa) + (0.265 * parentinfo[i].mo)
//     }
//     else {
//       // console.log('女')
//       student[i].ycheight = 43.089 + (0.306 * parentinfo[i].pa) + (0.431 * parentinfo[i].mo)
//     }
//   }
//   for (let i = 0; i < student.length; i++) {
//     if (student[i].sex == 1) {
//       if (student[i].age < 13) {
//         student[i].nowBasics = student[i].ycheight - 24 - (13 - student[i].age * 5)
//       }
//       else if (student[i].age >= 13 && student[i].age <= 15) {
//         student[i].nowBasics = student[i].ycheight - (15 - student[i].age) * 8 - 6
//       }
//       else if (student[i].age > 15) {
//         student[i].nowBasics = student[i].ycheight - (18.4 - student[i].age) * 2
//       }
//     }
//     else if (student[i].sex == 0) {
//       if (student[i].age < 11) {
//         student[i].nowBasics = student[i].ycheight - 24 - (11 - student[i].age * 5)
//       }
//       else if (student[i].age >= 11 && student[i].age <= 13) {
//         student[i].nowBasics = student[i].ycheight - (15 - student[i].age) * 8 - 6
//       }
//       else if (student[i].age > 13) {
//         student[i].nowBasics = student[i].ycheight - (17.3 - student[i].age) * 2
//       }
//     }
//   }
//   for (let i = 0; i < student.length; i++) {
//     student[i].HeightDifference = parentinfo[i].nowheight - student[i].nowBasics
//     student[i].adultheight = student[i].ycheight + student[i].HeightDifference
//   }

//   //体重
//   let manBMI = [
//     { age: 3, BMI: 16.3 },
//     { age: 3.5, BMI: 16.1 },
//     { age: 4, BMI: 15.8 },
//     { age: 4.5, BMI: 15.7 },
//     { age: 5, BMI: 15.6 },
//     { age: 5.5, BMI: 15.6 },
//     { age: 6, BMI: 15.6 },
//     { age: 6.5, BMI: 15.7 },
//     { age: 7, BMI: 15.8 },
//     { age: 7.5, BMI: 16 },
//     { age: 8, BMI: 16.2 },
//     { age: 8.5, BMI: 16.5 },
//     { age: 9, BMI: 16.4 },
//     { age: 9.5, BMI: 16.7 },
//     { age: 10, BMI: 17.3 },
//     { age: 10.5, BMI: 17.3 },
//     { age: 11, BMI: 17.3 },
//     { age: 11.5, BMI: 17.6 },
//     { age: 12, BMI: 17.9 },
//     { age: 12.5, BMI: 18.2 },
//     { age: 13, BMI: 18.5 },
//     { age: 13.5, BMI: 18.8 },
//     { age: 14, BMI: 19.1 },
//     { age: 14.5, BMI: 19.5 },
//     { age: 15, BMI: 19.9 },
//     { age: 15.5, BMI: 20.3 },
//     { age: 16, BMI: 20.7 },
//     { age: 16.5, BMI: 21 },
//     { age: 17, BMI: 21.3 },
//     { age: 17.5, BMI: 21.7 },
//     { age: 18, BMI: 22 },
//   ]

//   let womanBMI = [
//     { age: 3, BMI: 15.8 },
//     { age: 3.5, BMI: 15.6 },
//     { age: 4, BMI: 15.5 },
//     { age: 4.5, BMI: 15.5 },
//     { age: 5, BMI: 15.5 },
//     { age: 5.5, BMI: 15.4 },
//     { age: 6, BMI: 15.2 },
//     { age: 6.5, BMI: 15.7 },
//     { age: 7, BMI: 15.3 },
//     { age: 7.5, BMI: 15 },
//     { age: 8, BMI: 15.6 },
//     { age: 8.5, BMI: 15.8 },
//     { age: 9, BMI: 16 },
//     { age: 9.5, BMI: 16.5 },
//     { age: 10, BMI: 16.6 },
//     { age: 10.5, BMI: 17.1 },
//     { age: 11, BMI: 17.3 },
//     { age: 11.5, BMI: 17.6 },
//     { age: 12, BMI: 17.8 },
//     { age: 12.5, BMI: 18.3 },
//     { age: 13, BMI: 18.6 },
//     { age: 13.5, BMI: 18.8 },
//     { age: 14, BMI: 19.2 },
//     { age: 14.5, BMI: 19.5 },
//     { age: 15, BMI: 19.8 },
//     { age: 15.5, BMI: 20 },
//     { age: 16, BMI: 20.1 },
//     { age: 16.5, BMI: 20.1 },
//     { age: 17, BMI: 20.3 },
//     { age: 17.5, BMI: 20.3 },
//     { age: 18, BMI: 20 },
//   ]
//   for (let i = 0; i < student.length; i++) {
//     if (student[i].sex == 0) {
//       if (student[i].age > 18) {
//         console.log('当前学员岁数超过18岁')
//       }
//       else if (student[i].age>=3&&studen[i].age<=18) {
//         console.log('bmi111111')
//         var nowBMI = manBMI.find((a) => (a.age == student[i].age))
//         student[i].BMI = manBMI.find((a) => (a.age == student[i].age)).BMI
//         student[i].StandardWeight = student[i].BMI * (parentinfo[i].nowheight / 100 * parentinfo[i].nowheight / 100)
//         student[i].weightDifference = parentinfo[i].nowweight - student[i].StandardWeight
//       }
//       else if(student[i].age<3){
//         console.log('当前学员年龄过小，请长大点吧')
//       }
//     }
//     else if (student[i].sex == 1) {
//       if (student[i].age > 18) {
//         console.log('当前学员岁数超过18岁')
//       }
//       else if (student[i].age >= 3 && studen[i].age <= 18) {
//         var nowBMI = manBMI.find((a) => (a.age == student[i].age))
//         student[i].BMI = manBMI.find((a) => (a.age == student[i].age)).BMI
//         student[i].StandardWeight = student[i].BMI * (parentinfo[i].nowheight / 100 * parentinfo[i].nowheight / 100)
//         student[i].weightDifference = parentinfo[i].nowweight - student[i].StandardWeight
//       }
//        else if (student[i].age < 3) {
//         console.log('当前学员年龄过小，请长大点吧')
//       }
//     }
//   }
//   return student;
// }


module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  dateToDayStamp: dateToDayStamp,
  dateToStamp: dateToStamp,
  filterLocalImgUrl: filterLocalImgUrl,
  filterImgUrl: filterImgUrl,
  filterVodUrl: filterVodUrl,
  getWeekStr: getWeekStr,
  stararray: stararray,
  toast: toast,
  chooseImgUpload: chooseImgUpload,
  _find_uptoken: _find_uptoken,
  chooseVodUpload: chooseVodUpload,
  alert: alert,
  isPhone: isPhone
  // tc:tc
}