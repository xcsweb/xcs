let util = require('../../utils/util.js')
let network = require('../../utils/network.js')
Component({

  properties: {
    src: {
      type: String,
      value: "",
      observer(newVal, oldVal, changedPath) {
        if (oldVal){
          this._initImg(util.filterLocalImgUrl(oldVal))
        } else if (newVal){
          this._initImg(util.filterLocalImgUrl(newVal))
        }
      }
    },
    qnsrc: {
      type: String,
      value: "",
      observer(newVal, oldVal, changedPath) {
        if (oldVal) {
          this._initImg(util.filterImgUrl(oldVal))
        } else if (newVal) {
          this._initImg(util.filterImgUrl(newVal))
        }
      }
    },
    mode:{
      type:String,
      value:""
    },
    classs:{
      type: String,
      value: ""
    },
    type: {
      type: String,
      value: ""
    },
    binderror:{
      type: String,
      value: ""
    }
  },
  ready: function () {
    if (!this.data.src && !this.data.qnsrc){
      this._initImg()
    }
  },
  methods:{
    _initImg(e){
      let src = "";
      if(e){
        src = e;
      }
      if (src.length==0){
        src = util.filterLocalImgUrl("common/104-104@2x.png")
        if (this.data.type){
          
        }
      }
      this.setData({
        src:src
      })
    },
    imgError: function(){
      let src = "";
      src = util.filterLocalImgUrl("common/104-104@2x.png")
      if (this.data.type) {
        
      }
      this.setData({
        src: src
      })
    }
  }
})