let network = require('../../utils/network.js')
let util = require('../../utils/util.js')
// components/filterquery/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //判断是否有搜索框 serchBool
    searchBool:{
      type: String,
      value:'true'
    },
    //搜索框placeholder
    placeholder: {
      type: String,
      value: "输入客户姓名/电话"
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
    },
    filterParam: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    inputVal: "",
    inputShowed: false,
    filtershow: false,
    oldFilterParam: [],
    isLoad: 1,
    items:[
      { name: '1', value: '是' },
      { name: '0', value: '否', checked: 'true' },
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _clearInput: function() {
      this.setData({
        inputVal: ""
      });
      this.triggerEvent('clear');
      this._search();
    },
    _showInput: function() {
      this.setData({
        inputShowed: true,
        inputVal: "",
      });
      this.triggerEvent('show');
    },
    _hideInput: function() {
      this.setData({
        inputShowed: false
      });
      this.triggerEvent('hide');
      this._search();
    },
    _inputTyping: function(e) {
      this.setData({
        inputVal: e.detail.value
      });
    },
    _search: function (){
      this.triggerEvent('input', {
        value: this.data.inputVal
      });
    },
    _showFilter: function() {
      this.triggerEvent('filter');
    },
    bindfilter: function(e) { //点击筛选事件
      if (this.data.isLoad==1){
        let ed = { codeValue: "", codeDisplay: "全部" };
        this.data.filterParam.forEach(item => {
          if (item.type==1){
            item.index = 0;
            item.data.unshift(ed);
          }
          if (item.key == "isAllData" && wx.getStorageSync("isAllData")){
            item.val = wx.getStorageSync("isAllData")
            if (item.val==1){
              item.data = true;
            }
          }
        });
        this.setData({
          isLoad: 0,
          filterParam: this.data.filterParam
        })
      }
      if (!this.animation){
        var animation = wx.createAnimation({ //创建动画
          duration: 1000,
          timingFunction: 'ease',
          width: 300,
          height: 800,
          top: 0,
          bottom: 0,
          right: 0,
          backgroundColor: '#fff',
          opcity: 0.5
        })
        this.animation = animation
      }
      
      this.animation.translateX(-100 + 'vh').step() //动画效果向右滑动100vh

      let oldFilterParam = JSON.parse(JSON.stringify(this.data.filterParam));
      this.setData({
        animationData: this.animation.export(),
        filtershow: true,
        oldFilterParam: oldFilterParam,
      })
    },
    bindfilterCancel: function() {
      let filterParam = JSON.parse(JSON.stringify(this.data.oldFilterParam));
      this.animation.translateX('0vh').step()
      this.setData({
        animationData: this.animation.export(),
        filtershow: false,
        filterParam: filterParam,
      })
    },
    bindfilterSubmit: function() {
      this.animation.translateX('0vh').step()
      this.setData({
        animationData: this.animation.export(),
        filtershow: false
      })
      var searchParam = new Object();
      for (var i in this.data.filterParam){
        if (this.data.filterParam[i].type == 1 && this.data.filterParam[i].val && this.data.filterParam[i].val!=""){
          searchParam[this.data.filterParam[i].key] = this.data.filterParam[i].val;
        } else if (this.data.filterParam[i].type == 2) {
          if (this.data.filterParam[i].val1 && this.data.filterParam[i].val1 != ""){
            searchParam[this.data.filterParam[i].key1] = this.data.filterParam[i].val1;
          }
          if (this.data.filterParam[i].val2 && this.data.filterParam[i].val2 != "") {
            searchParam[this.data.filterParam[i].key2] = this.data.filterParam[i].val2;
          }
        } else if (this.data.filterParam[i].type == 3) {
          if (this.data.filterParam[i].val1 && this.data.filterParam[i].val1 != "") {
            searchParam[this.data.filterParam[i].key1] = util.dateToStamp(this.data.filterParam[i].val1 + " 0:0:0");
          }
          if (this.data.filterParam[i].val2 && this.data.filterParam[i].val2 != "") {
            searchParam[this.data.filterParam[i].key2] = util.dateToStamp(this.data.filterParam[i].val2 + " 23:59:59");
          }
        } else if (this.data.filterParam[i].type ==5 ) {
          if (this.data.filterParam[i].val == 0 || this.data.filterParam[i].val == 1){
            searchParam[this.data.filterParam[i].key] = this.data.filterParam[i].val;
            if (this.data.filterParam[i].key=="isAllData"){
              wx.setStorageSync('isAllData', this.data.filterParam[i].val);
            }
          }
        }
      }
      this.triggerEvent('input', {
        filterParam: this.data.filterParam,
        searchParam: searchParam,
      });
    },
    bindDateChange: function(e) {
      if (e.target.dataset.num == "1") {
        this.data.filterParam[e.target.dataset.index].val1 = e.detail.value.replace(/-/g, '/');
      } else if (e.target.dataset.num == "2") {
        this.data.filterParam[e.target.dataset.index].val2 = e.detail.value.replace(/-/g, '/');
      } else {
        this.data.filterParam[e.target.dataset.index].val = e.detail.value;
      }
      this.setData({
        filterParam: this.data.filterParam
      });
    },
    bindSelectChange: function(e) {
      console.log(this.data)
      let thisKey = this.data.filterParam[e.target.dataset.index].key;
      let thisVal = this.data.filterParam[e.target.dataset.index].data[e.detail.value].codeValue;
      this.data.filterParam[e.target.dataset.index].val = thisVal;
      this.data.filterParam[e.target.dataset.index].index = e.detail.value;
      
      this.data.filterParam.forEach(item => {
        if ((thisKey == "areaNum" && item.key == "campusId") || (thisKey == "campusId" && item.key == "classesId")){
          let relaData = JSON.parse(JSON.stringify(item.data));
          if (item.dataOld) {
            relaData = JSON.parse(JSON.stringify(item.dataOld));
          }
          let relaDataNew = [{ codeValue: "", codeDisplay: "全部" }];
          if (thisVal == '') {
            relaDataNew = relaData;
          } else {
            for (var i in relaData) {
              if (relaData[i].codeGroup == thisVal) {
                relaDataNew.push(relaData[i]);
              }
            }
          }
          item.data = relaDataNew;
          item.dataOld = relaData;
          item.val = "";
          item.index = "";
        }
      })
      this.setData({
        filterParam: this.data.filterParam
      });
    },
    bindKeyInput: function(e) {
      if (e.target.dataset.num == "1") {
        this.data.filterParam[e.target.dataset.index].val1 = e.detail.value;
      } else if (e.target.dataset.num == "2") {
        this.data.filterParam[e.target.dataset.index].val2 = e.detail.value;
      } else {
        this.data.filterParam[e.target.dataset.index].val = e.detail.value;
      }
      this.setData({
        filterParam: this.data.filterParam
      });
    },
    bindIsSend:function(e){
      this.data.filterParam[e.target.dataset.index].data = e.detail.value;
      if (e.detail.value){
        this.data.filterParam[e.target.dataset.index].val = 1;
      }else{
        this.data.filterParam[e.target.dataset.index].val = 0;
      }
      this.setData({
        filterParam: this.data.filterParam
      });
    },
    choosebtn: function(e) {
      var y = this.data.filterParam[e.target.dataset.index].data[e.target.dataset.i].type
      var x = 'filterParam[' + e.target.dataset.index + '].data[' + e.target.dataset.i + '].type'
      this.setData({
        [x]: !y
      })

    }
  }
})