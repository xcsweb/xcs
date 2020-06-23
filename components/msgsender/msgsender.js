let util = require('../../utils/util.js')
let network = require('../../utils/network.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    students: {
      type: Array,
      value: []
    },
    //简化模式  用来发送短信 没有消息类型选择  没有短信勾选
    simple: {
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    title: "",
    content: "",
    noticeType: [],
    isSms:0,
    noticeTypeIndex: 0,
  },
  ready: function() {
    this._getNoticeType();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _show: function() {
      this.setData({
        show: !this.data.show
      })
    },
    c: function() {

    },
    //获取消息类型
    _getNoticeType: function() {
      network.requestLoading('/manage/notice_add', {
        "type": "0"
      }, "", res => {
        if (res.status == 1) {
          this.setData({
            noticeType: res.data.noticeType
          })
        } else {
          wx.showToast({
            title: '获取消息类型失败',
          })
        }
      }, error => {
        wx.showToast({
          title: '获取消息类型失败',
        })
      })
    },
    _bindNoticeTypeChange: function(e) {
      this.setData({
        noticeTypeIndex: e.detail.value
      })
    },
    //监听输入框并保存值
    bindinput: function(e) {
      let data = {};
      data[e.currentTarget.dataset.name] = e.detail.value;
      this.setData(data);
    },
    isUseConfirm: function(e) {
      let val = 1;
      if (e.detail.value.length == 0) {
        val = 0;
      }
      this.setData({
        isSms: 0
      });
      if (val) {
        console.log("进来了")
        console.log(val)
        this.setData({
          isSms:val
        });
      }
    },
    //发通知
    _notice_add_sub: function() {
      let params = {
        "title": "",
        "content": "",
        "noticeType": "2",
        "sendDt": "",
        "noticeRecords": [],
        "isSms": this.data.isSms
      };
      if (!this.data.title && !this.data.simple) {
        util.toast("请输入标题");
        return;
      }
      if (!this.data.content) {
        util.toast("请输入内容");
        return;
      }
      this.data.students.forEach(student => {
        params.noticeRecords.push({
          studentId: student.studentId,
          userId: student.userId,
          tel:student.tel
        })
      });
      if (params.noticeRecords.length == 0) {
        this.triggerEvent("nouser")
        this.setData({
          show: false
        });
        util.toast("请选择接收人");
        return;
      }
      params.title = this.data.title;
      params.content = this.data.content;
      params.noticeType = this.data.noticeType[this.data.noticeTypeIndex].codeValue;
      //如果是简化模式 只用来发短信  修改参数
      if(this.data.simple){
        params.isSms=1;
        params.noticeType=0;
        delete params.title;
        delete params.sendDt;
      }
      console.log(params)
      network.requestLoading('/manage/notice_add_sub', params, "正在发送...", res => {
        if (res.status == 1) {
          wx.showToast({
            title: '发送成功',
          });
          this.setData({
            title: "",
            content: "",
            show: false
          })
        } else {
          wx.showToast({
            title: '操作失败，请重试',
          })
        }
      }, error => {
        wx.showToast({
          title: '操作失败',
        })
      })
    },
  }
})