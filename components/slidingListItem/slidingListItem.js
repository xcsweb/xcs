//使用：
//<com-sliding-listitem del-btn-width='150' bindopen='open' binddelete='delete'>
//<view slot='body'>列表内容</view>
//<view slot='del' style='background:blue'>
//删除
//</view>
//</com-sliding-listitem>

Component({
  //启用多slots
  options:{
    multipleSlots: true
  },
  // 声明组件属性及默认值
  properties: {
    delBtnWidth: {
      type: Number,  // 必需 指定属性类型 [String, Number, Boolean, Object, Array, null(任意类型)]
      value: 180
    }
  },

  // 组件私有和公开的方法，组件所使用的方法需在此声明
  methods: {
    touchS: function (e) {
      if (e.touches.length == 1) {
        this.setData({
          //设置触摸起始点水平方向位置
          startX: e.touches[0].clientX
        });
      }
      
    },
    touchM: function (e) {
      var that = this
      if (e.touches.length == 1) {
        //手指移动时水平方向位置
        var moveX = e.touches[0].clientX;
        //手指起始点位置与移动期间的差值
        var disX = this.data.startX - moveX;
        var delBtnWidth = this.data.delBtnWidth;
        var txtStyle = "";
        if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
          txtStyle = "left:0rpx";
        } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
          txtStyle = "left:-" + disX + "rpx";
          if (disX >= delBtnWidth) {
            //控制手指移动距离最大值为删除按钮的宽度
            txtStyle = "left:-" + delBtnWidth + "rpx";
          }
        }
        this.setData({ txtStyle: txtStyle})
      }
    },

    touchE: function (e) {
      if (e.changedTouches.length == 1) {
        //手指移动结束后水平位置
        var endX = e.changedTouches[0].clientX;
        //触摸开始与结束，手指移动的距离
        var disX = this.data.startX - endX;
        var delBtnWidth = this.data.delBtnWidth;
        //如果距离小于删除按钮的1/2，不显示删除按钮
        var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "rpx" : "left:0rpx";
        this.setData({ txtStyle: txtStyle });
        if (disX > delBtnWidth / 2)
          this.triggerEvent('open')
      }
    },
    _delete: function (e) {
      this.triggerEvent('delete',{},e);
      this.setData({ txtStyle:{}})
    }
  }

})