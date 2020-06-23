// components/smartInput/smartInput.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //输入后保存到哪
    name: {
      type: String,
      value: "name"
    },
    //默认值
    value: {
      type: String,
      value: ""
    },
    //小程序输入框的fixed属性
    fixed:{
      type:Boolean,
      value:false
    },
    placeholder: {
      type: String,
      value: ""
    },
    //是否textarea 默认input
    textarea: {
      type: Boolean,
      value: false
    },
    //是否disabled
    disabled: {
      type: Boolean,
      value: false
    },
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
    _bindinput:function(e){
      getCurrentPages()[getCurrentPages().length-1].setData({
        [`${this.data.name}`]: e.detail.value
      });
      this.triggerEvent("Input", {
        value: e.detail.value
      });
    }
  }
})
