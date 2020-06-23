// components/multichoice/multichoice.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    items: {
      type: Array,
      value: []
    }, 
    title: {
      type: String,
      value:"请选择"
    },
    name:{
      type: String,
      value: ""
    },
    value: {
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: true,
    values: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _dismiss: function () {
      this.triggerEvent('cancel');
    },
    _ok: function () {
      this.triggerEvent('ok', { value: this.data.values, values_: this.data.values_,
        checkedIndexs: this.data.checkedIndexs });
    },
    _checkboxChange: function (e) {
      let values_ = [];
      let checkedIndexs = [];
      this.data.items.forEach((item,index)=>{
        e.detail.value.forEach(value=>{
          if (item.value==value){
            item.checked=true;
            checkedIndexs.push(index)
            if(this.data.name){
              values_.push(item[this.data.name])
            }
          }else{
            item.checked = false;
          }
        })
      })
      this.setData({
        values: e.detail.value,
        values_: values_,
        checkedIndexs: checkedIndexs
      });
    },
    preventTouchMove: function (e) {
    }
  },
  ready: function () {
    if (this.data.name && this.data.value){
      let items = this.data.items;
      let values = [];
      let checkedIndexs = [];
      let values_ = [];
      items.forEach((item,index) => {
        item.name = item[this.data.name];
        item.value = item[this.data.value];
        if (item.checked){
          values.push(item.value);
          checkedIndexs.push(index);
          values_.push(item[this.data.name])
        }
      });
      this.setData({
        items: items,
        values: values,
        checkedIndexs: checkedIndexs,
        values_: values_
      })
    }
  }
})
