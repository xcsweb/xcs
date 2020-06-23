Component({
  // 声明组件属性及默认值
  properties: {
    rating: {
      type: Number, // 必需 指定属性类型 [String, Number, Boolean, Object, Array, null(任意类型)]
      value: 10
    },
    max: {
      type: Number,
      value: 5
    },
    disabled: {
      type: Boolean,
      value: false
    },
    size: {
      type: Number,
      value: 25
    },
    name: {
      type: String,
      value: ""
    },
    starType:{
      type: Number,
      value: 0
    }
  },

  // 组件私有和公开的方法，组件所使用的方法需在此声明
  methods: {
    _handleTap: function(e) {
      if (this.data.disabled) return;
      const {
        max
      } = this.data;
      const {
        num
      } = e.currentTarget.dataset;
      this.setData({
        rating: max / 5 * num
      })
      // 自定义组件事件
      this.triggerEvent('change', {
        value: max / 5 * num
      }, e);
      if (this.data.name) {
        getCurrentPages()[getCurrentPages().length - 1].setData({
          [`${this.data.name}`]: max / 5 * num
        })
      }
    }
  }

})