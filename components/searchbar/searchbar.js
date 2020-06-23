// components/searchbar/searchbar.js
//使用：    <com-searchbar bindinput='inputTyping' bindclear='clearInput' bindshow='showInput' bindhide='hideInput' placeholder='请输入客户姓名/电话' filter='true' bindfilter='filter'>
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //搜索框placeholder
    placeholder:{
      type:String,
      value:"输入客户姓名/电话"
    },
    //是否显示筛选按钮
    filter: {
      type: Boolean,
      value: false
    },
    //筛选按钮文字
    filterText: {
      type: String,
      value: "筛选"
    },
    //筛选按钮下标
    filterimg: {
      type: String,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    inputVal:"",
    inputShowed:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _clearInput:function(){
      this.setData({
        inputVal: ""
      });
      this.triggerEvent('clear');
      this.triggerEvent('input', { value: ''});
    },
    _showInput: function () {
      this.setData({
        inputShowed: true,
        inputVal: "",
      });
      this.triggerEvent('show');
    },
    _hideInput: function () {
      this.setData({
        inputShowed: false
      });
      this.triggerEvent('hide');
      this.triggerEvent('input', { value: ""});
    },
    _inputTyping: function (e) {
      this.setData({
        inputVal: e.detail.value
      });
      this.triggerEvent('input', { value: e.detail.value});
    },
    _showFilter: function () {
      this.triggerEvent('filter');
    }
  }
})
