// components/parent/parent.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    name:"",
    relation:"",
    tel:""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindinput: function (e) {
      let data = {};
      data[e.currentTarget.dataset.name] = e.detail.value;
      this.setData(data);
    },
  }
})
