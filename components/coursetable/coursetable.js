// components/coursetable/coursetable.js
// <com-coursetable bindclick='toDetail' course='{{clshour_list}}' wx:if='{{showCourseTable}}'></com-coursetable>
  
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    min: {
      type: Number,
      value: 8
    },
    max: {
      type: Number,
      value: 23
    },
    course: {
      type: Array,
      value: [],
      observer: "_courseChange"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    hours: []
  },
  processCourseTableData: function() {
    console.log
  },
  ready: function() {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    _coursetaped: function(e) {
      this.triggerEvent('click', {
        course: this.data.course[e.currentTarget.dataset.index]
      });
    },
    _courseChange: function() {
      this.setData({
        hours: []
      });
      this.data.course.forEach(cs => {
        let startTimes = cs.startTime.split(":");
        let endTimes = cs.endTime.split(":");
        if (this.data.min > parseInt(startTimes[0])) {
          this.data.min = parseInt(startTimes[0])
        }
        if (this.data.max < parseInt(endTimes[0])) {
          this.data.max = parseInt(endTimes[0])
        }
      });
      let date = new Date();
      date.setHours(this.data.min, 0, 0, 0);
      let startTimeData = new Date();
      let endTimeData = new Date();
      let totalMs = (this.data.max - this.data.min + 1) * 60 * 60 * 1000; //课程表显示的时间段毫秒数
      this.data.course.forEach(cs => {
        let startTimes = cs.startTime.split(":");
        let endTimes = cs.endTime.split(":");
        startTimeData.setHours(Number.parseInt(startTimes[0]), Number.parseInt(startTimes[1]), 0, 0);
        endTimeData.setHours(Number.parseInt(endTimes[0]), Number.parseInt(endTimes[1]), 0, 0);
        cs.top = ((startTimeData - date) / totalMs) * 100;
        cs.height = ((endTimeData - startTimeData) / totalMs) * 100;
      });
      this.data.course = this.data.course.sort((cs1, cs2) => {
        return cs1.top - cs2.top;
      });
      this.data.course.forEach((cs, index) => {
        if (index > 0) {
          let lastCourse = this.data.course[index - 1]
          let lastBottom = lastCourse.top + lastCourse.height; //上一个课程的底部距离课程表顶部百分比
          //上个课程顶部是否和本课程有叠加冲突
          if (lastBottom > cs.top) {
            cs.left = (lastCourse.left || 0) + 110;
          }
        }
      });
      for (let i = this.data.min; i <= this.data.max; i++) {
        this.data.hours.push(i + ":00");
      }
      this.setData({
        course: this.data.course,
        hours: this.data.hours
      })
    }
  }
})