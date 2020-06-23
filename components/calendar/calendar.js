// components/calendar/calendar.js
//使用：<com-calendar bindchange='calendarChange' course-flag='{{false}}'/>
Component({
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    //是否显示日历底部的课程状态标志
    courseFlag: {
      type: Boolean,
      value: true
    },
    //选中日期背景色
    color: {
      type: String,
      value: "#FFBB00"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    arr: [],
    arr_prev: [],
    arr_next: [],
    arr_: [],
    arr_prev_: [],
    arr_next_: [],
    sysW: null,
    lastDay: null,
    firstDay: null,
    weekArr: ['日', '一', '二', '三', '四', '五', '六'],
    year: null,
    calanderShowAll: true,
    _date: null, //当前日期
    _calanderData: null, //日历节点信息
    _itemData: null, //日期节点信息
    height1: "auto", //收缩时高度
    height2: "auto", //展开时高度
    monthChange: 0
  },
  ready: function() {
    var res = wx.getSystemInfoSync();
    this.setData({
      sysW: res.windowWidth / 7, //更具屏幕宽度变化自动设置宽度
    })
    this.dataTime();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    calanderShowAll: function() {
      this.setData({
        calanderShowAll: !this.data.calanderShowAll
      });
      this._showOneLine()
    },
    //收缩时只显示所选行的日期
    _showOneLine: function() {
      if (!this.data.calanderShowAll) {
        let getDate = Number.parseInt(this.data.getDate);
        if (this.data.monthChange == -1) {
            //不作处理
        } else if (this.data.monthChange == 0) {
          if (7 - this.data.arr_prev.length >= getDate) {
            //不作处理
          } else {
            let arr_temp = this.data.arr_next.slice();
            let i = this.data.arr.length - 1;
            do {
              arr_temp.push(this.data.arr[i]);
              i--;
            } while (arr_temp.length < 7) {

            }
            if (arr_temp.indexOf(getDate) >= 0) {
              this.data.arr_prev = [];
              this.setData({
                arr: this.data.arr.slice(i + 1),
                arr_next: this.data.arr_next,
                arr_prev: this.data.arr_prev
              });
            } else {
              let alldays = this.data.arr_prev.concat(this.data.arr).concat(this.data.arr_next);
              let alldays7 = [];
              for (let i = 0; i < alldays.length; i += 7) {
                alldays7.push(alldays.slice(i, i + 7));
              }
              alldays7.shift();
              alldays7.pop();
              alldays7.forEach(alldays7_ => {
                if (alldays7_.indexOf(getDate) > -1) {
                  this.setData({
                    arr_prev: [],
                    arr: alldays7_,
                    arr_next: []
                  })
                }
              })
            }
          }
        } else {
          let arr_temp = [];
          let i = this.data.arr.length - 1;
          do {
            arr_temp.unshift(this.data.arr[i]);
            i--;
          } while (arr_temp.length+this.data.arr_next.length < 7) {

          }
          this.setData({
            arr_prev: [],
            arr: arr_temp,
            arr_next: this.data.arr_next
          })
        }
      } else {
        this.setData({
          arr: this.data.arr_,
          arr_next: this.data.arr_next_,
          arr_prev: this.data.arr_prev_
        })
      }
    },
    _changeDate: function(e) {
      let dataset = e.currentTarget.dataset;
      this.setData({
        getDate: dataset.date
      });
      let date = new Date(this.data._date.getTime());
      date.setMonth(date.getMonth() + dataset.month);
      date.setDate(dataset.date);
      this.setData({
        monthChange: dataset.month
      })
      this.triggerEvent("change", {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: e.currentTarget.dataset.date,
        milliseconds: new Date(this.data.year + "/" + (this.data.month + dataset.month) + "/" + e.currentTarget.dataset.date).getTime(),
        seconds: Math.floor(new Date(this.data.year + "/" + (this.data.month + dataset.month) + "/" + e.currentTarget.dataset.date).getTime() / 1000)
      }, e)
    },
    //月份++
    _addMonth: function() {
      let date = this.data._date;
      date.setMonth(date.getMonth() + 1);
      this.setData({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        _date: date
      });
      this.dataTime();
      this.setData({
        animation1: true
      })
      setTimeout(() => {
        this.setData({
          animation1: false
        })
      }, 200)
    },
    //月份--
    _reduceMonth: function() {
      let date = this.data._date;
      date.setMonth(date.getMonth() - 1);
      this.setData({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        _date: date
      });
      this.dataTime();
      this.setData({
        animation2: true
      })
      setTimeout(() => {
        this.setData({
          animation2: false
        })
      }, 200)
    },
    //获取日历相关参数
    dataTime: function() {
      if (!this.data._date) {
        this.setData({
          _date: new Date()
        })
      }
      var date = this.data._date;
      var year = date.getFullYear();
      var month = date.getMonth();
      var months = date.getMonth() + 1;

      //获取现今年份
      this.data.year = year;

      //获取现今月份
      this.data.month = months;

      //获取今日日期
      this.data.getDate = date.getDate();

      //最后一天是几号
      var d = new Date(year, months, 0);
      this.data.lastDay = d.getDate();

      //第一天星期几
      let firstDay = new Date(year, month, 1);
      this.data.firstDay = firstDay.getDay(); //根据得到今月的最后一天日期遍历 得到所有日期
      this.data.arr = [];
      for (var i = 1; i < this.data.lastDay + 1; i++) {
        this.data.arr.push(i);
      }
      //获取上月、下月应当显示的日期
      let arr_prev = [];
      let arr_next = [];
      let lastMonth = new Date(date.getTime());
      console.log("lastMonth", lastMonth)
      let nextMonth = new Date(date.getTime());
      //lastMonth.setMonth(lastMonth.getMonth() - 1);
      lastMonth.setDate(0);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      nextMonth.setDate(0);
      for (let i = 0; i < this.data.firstDay; i++) {
        arr_prev.unshift(lastMonth.getDate() + "");
        lastMonth.setDate(lastMonth.getDate() - 1);
      }
      let a = nextMonth.getDay();
      let arr_next_len = 7 - a - 1;
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      nextMonth.setDate(1);
      for (let i = 0; i < arr_next_len; i++) {
        arr_next.push(nextMonth.getDate() + "");
        nextMonth.setDate(nextMonth.getDate() + 1);
      }
      this.setData({
        marLet: this.data.firstDay,
        arr: this.data.arr,
        arr_: this.data.arr.slice(),
        year: this.data.year,
        getDate: this.data.getDate,
        month: this.data.month,
        arr_prev: arr_prev,
        arr_next: arr_next,
        arr_prev_: arr_prev.slice(),
        arr_next_: arr_next.slice(),
      });
      //月份改变后需要重新判断日历高度
      this._queryCalendarNodeInfo();
    },
    //获取日历节点信息
    _queryCalendarNodeInfo: function() {
      //只有首次加载完日历需要设置收缩状态
      let calanderShowAll = this.data.height1 == "auto" ? false : true;
      this.setData({
        height1: "auto",
        height2: "auto",
      })
      var query = wx.createSelectorQuery().in(this)
      query.select('.calendar').boundingClientRect(res => {
        this.setData({
          _calanderData: res
        })
        this._calcHeight(calanderShowAll);
      }).exec()
      query.select('._item').boundingClientRect(res => {
        this.setData({
          _itemData: res
        })
        this._calcHeight(calanderShowAll);
      }).exec()
    },
    //计算日历不同状态时的高度
    _calcHeight: function(calanderShowAll) {
      if (!this.data._calanderData || !this.data._itemData) {
        return;
      }
      let _calanderData = this.data._calanderData;
      let _itemData = this.data._itemData;
      let height1 = _itemData.top - _calanderData.top + _itemData.height + "px"
      let height2 = _calanderData.height + "px";

      this.setData({
        height1: height1,
        height2: height2,
        calanderShowAll: calanderShowAll
      })
      this._showOneLine();
    }
  },
})