// components/tabs/tabs.js
//使用：<com-tabs tabs='{{["1","2","3","4","5","6","7","8"]}}' bindchange='tabchange' index='2'></com-tabs>
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //tabs数组
    tabs: {
      type: Array,
      value: []
    },
    //默认显示的tab index
    index: {
      type: Number,
      value: 0
    },
    //默认颜色
    normalColor: {
      type: String,
      value: "#999"
    },
    //选中颜色
    selectedColor: {
      type: String,
      value: "#333"
    },
    //tab宽度
    tabWidth: {
      type: String,
      value: "25%"
    },
    //tab下横线宽度
    tabBottomWidth: {
      type: String,
      value: "30rpx"
    },
    //控制tab体的下边框
    bottomIndex: {
      type: Number,
      value: 0
    },
    //两行tab之间间隔 rpx
    linegap: {
      type: Number,
      value: 10
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
    _changeTab: function(e) {
      this.setData({
        index: e.currentTarget.dataset.tabindex
      })
      this.triggerEvent("change", {
        value: e.currentTarget.dataset.tabindex
      });
    }
  }
})