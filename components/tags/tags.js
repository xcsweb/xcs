// components/tags/tags.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tags:{
      type:Array,
      value:[
        { name: "全部" },
        { name: "怀柔校区" },
        { name: "浦口校区" },
        { name: "普外校区" },
        { name: "北大校区" },
        { name: "南大校区" },
      ]
    },
    index:{
      type:Number,
      value:0
    },
    //隐藏右侧箭头
    hidearrow:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    scrollLeft:0
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _scroll:function(e){
      console.log(e)
      this.setData({
        scrollLeft: e.detail.scrollLeft
      })
    },
    _scrollLeft:function(){
      this.setData({
        scrollLeft: this.data.scrollLeft+50
      })
    },
    _tagTaped:function(e){
      let index=e.currentTarget.dataset.index;
      this.setData({
        index: index
      })
      this.triggerEvent("change", {
        index: index
      })
    }
  }
})
