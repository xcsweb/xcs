Component({
  properties: {
    bar: {
      type: Object
    },
    val: {
      type: String,
      value: 'true',
      observer: "_change"
    },
    classs: {
      type: String,
      value: ""
    }
  },
  data: {
    begin: 0, //进度条起始值
    height: 12,//进度条高度
    from: "#02A7F0",//默认颜色
    to: "#02A7F0",//默认颜色
    interVal: null,//清除周期函数使用
    width: "",//进度百分比
    fill: "#F2F2F2",//精度条填充颜色
    radius: 0 //圆角边框值
  },
  detached() {
    //摧毁倒计时
    if (this.data.interVal !== null) clearInterval(this.data.interVal);
  },
  methods: {
    _change(val, oldVal) {
      //实现进度条动画效果
      let interVal = setInterval(() => {
        let begin = this.data.begin;
        let max = val;
        if (max == 0) {
          this.setData({
            width: "0%"
          });
        }
        if (begin < max) {
          let increment = 1;
          if (max > 20 && max <= 40) {
            increment = 2;
          } else if (max > 40 && max <= 60) {
            increment = 3;
          } else if (max > 60 && max <= 100) {
            increment = 4;
          }

          let now = begin + increment;

          this.setData({
            begin: now,
            width: (now > max ? max : now) + "%",
            interVal: interVal
          });
        } else {
          clearInterval(this.data.interVal);
        }
      }, 30);
    }
  }
});