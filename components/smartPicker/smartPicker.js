// components/smartPicker/smartPicker.js
//使用：<com-picker range='{{tab1Data.areaCampuses}}' key='areaName' name='areaCampusesIndex' namekey='key1'></com-picker>
//
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //选项
    range: {
      type: Array,
      value: [{
        __aa: 1
      }],
      observer: function() {
        if (this.data.range[0] && !this.data.range[0].__aa) {

          let range0 = {
            __aa: 1
          };
          range0[this.data.key] = this.data.placeholder || "请选择";
          this.setData({
            range: [range0].concat(this.data.range)
          })
        }
      }
    },
    //range-key
    key: {
      type: String,
      value: "name"
    },
    //选择后保存名称 下标 时间 日期值
    name: {
      type: String,
      value: "name"
    },
    //保存指定key的值
    namekey: {
      type: String,
      value: ""
    },
    //picker的mode
    mode: {
      type: String,
      value: "selector" //time  date
    },
    //picker的value
    value: {
      type: String,
      value: ""
    },
    endTim: {
      type: String,
      value: ""
    },
    //默认选项
    index: {
      type: Number,
      value: -1
    },
    //显示箭头
    arrow: {
      type: Boolean,
      value: false
    },
    //显示箭头
    border: {
      type: Boolean,
      value: false
    },
    //placeholder
    placeholder: {
      type: String,
      value: "请选择"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _index: 0
  },

  ready: function() {
    setTimeout(() => {
      this.setData({
        _index: this.data.index + 1
      })
    }, 100)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _bindchange: function(e) {
      this.setData({
        _index: e.detail.value,
        value: e.detail.value.replace(/-/g, "/")
      })
      let val = e.detail.value;
      if (this.data.mode == 'date') {
        val = Math.round(new Date(val).getTime() / 1000)
      }
      if (this.data.namekey) {
        val = this.range[index][this.data.namekey]
      }
      let page = getCurrentPages()[getCurrentPages().length - 1];
      if (this.data.mode == 'selector' && e.detail.value == 0) {
        delete page.data[this.data.name];
        page.setData(page.data);
      } else {
        if (this.data.mode == 'selector')
          page.setData({
            [`${this.data.name}`]: this.data.namekey ? Number.parseInt(val) : (Number.parseInt(val) - 1)
          })
        else {
          page.setData({
            [`${this.data.name}`]: Number.parseInt(val)
          })
        }
      }
      this.triggerEvent("change", {
        index: Number.parseInt(e.detail.value) - 1
      });
    }
  }
})