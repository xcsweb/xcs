// components/daterange/daterange.js
//使用：<com-daterange bindchange='daterange1change' startDt='2016-04-11' endDt='2018-11-12'></com-daterange>

let util = require('../../utils/util.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //开始时间
    startDt: {
      type: String,
      value: "2010-10-10"
    },
    //结束时间
    endDt: {
      type: String,
      value: "2018-10-18"
    },
    //结束
    end: {
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    _picker1change: function(e) {
      this.setData({
        startDt: e.detail.value.replace(/\//g, '-')
      });
      //将时间转换成后台使用的秒
      let startDt = util.dateToStamp(this.data.startDt + " 0:0:0");
      let endDt = util.dateToStamp(this.data.endDt + " 23:59:59");
      this.triggerEvent("change", {
        startDt: startDt,
        endDt: endDt
      })
    },
    _picker2change: function(e) {
      this.setData({
        endDt: e.detail.value.replace(/\//g, '-')
      });
      //将时间转换成后台使用的秒
      let startDt = util.dateToStamp(this.data.startDt + " 0:0:0");
      let endDt = util.dateToStamp(this.data.endDt + " 23:59:59");
      this.triggerEvent("change", {
        startDt: startDt,
        endDt: endDt
      })
    },
  }
})