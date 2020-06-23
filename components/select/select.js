Component({
  /**
   * 组件的属性列表
   */
  properties: {
    propArray: {
      type: Array,
    },
    showText: {
      type: String,
      value: ""
    },

    maxheight: {
      type: Number,
      value: 120
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    selectShow: false,//初始option不显示
    nowText: "",//初始内容
    animationData: {},//右边箭头的动画
    nowIdx:"",
    nowId:""
  },
  /**
   * 组件的方法列表
   */
  methods: {
    　　　//option的显示与否
    selectToggle: function () {
      var nowShow = this.data.selectShow;//获取当前option显示的状态
      //创建动画
      var animation = wx.createAnimation({
        timingFunction: "ease"
      })
      this.animation = animation;
      if (nowShow) {
        animation.rotate(0).step();
        this.setData({
          animationData: animation.export()
        })
      } else {
        animation.rotate(180).step();
        this.setData({
          animationData: animation.export()
        })
      }
      this.setData({
        selectShow: !nowShow
      })
    },
    //设置内容
    setText: function (e) {
      var nowData = this.properties.propArray;//当前option的数据是引入组件的页面传过来的，所以这里获取数据只有通过this.properties
      // console.log(nowData[1].name)
      var nowIdx = e.target.dataset.index;//当前点击的索引
      var nowText = nowData[nowIdx].name;//当前点击的内容
      var nowId = nowData[nowIdx].id //当前点击的id
      
      //再次执行动画，注意这里一定，一定，一定是this.animation来使用动画
      this.animation.rotate(0).step();
      this.setData({
        selectShow: false,
        nowText: nowText,
        animationData: this.animation.export(),
        nowIdx: nowIdx,
        nowId: nowId
      })
      // console.log(e.target)
      this.triggerEvent("change", { value: e.target.dataset.index,});
      this.triggerEvent("chushi", { value: this.data.nowText});
    }
  }
})