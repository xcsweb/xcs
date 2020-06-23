//使用：<com-attachments title='' edit='{{false}}' attachments='{{attachments}}' bindchange='change'/>
//三种显示方式  其中1可编辑添加删除  2 3只做展示用
let network = require('../../utils/network.js')
let util = require('../../utils/util.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //标题
    title: {
      type: String,
      value: "添加图片/视频"
    },
    //保存到当前页面date中的名称
    name: {
      type: String,
      value: ""
    },
    //是否可以添加删除附件
    edit: {
      type: Boolean,
      value: true
    },
    //原附件
    attachments: {
      type: Array,
      value: []
    },
    //全选、图片（1）、视频（2）
    choosetype: {
      type: Number,
      value: 0
    },
    //显示方式 1  2 3
    mode: {
      type: Number,
      value: 1
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    addImg: util.filterLocalImgUrl("addAttachment.png"),
    videoImg: util.filterLocalImgUrl("video.png"),
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _showActionSheet: function () {
      if (this.data.choosetype == 0) {
        wx.showActionSheet({
          itemList: ['图片', '视频'],
          success: res => {
            if (res.tapIndex == 0) {
              util.chooseImgUpload(res => {
                this.data.attachments.push({
                  key: res.key,
                  img: res.imageURL
                })
                this.setData({
                  'attachments': this.data.attachments
                });
                this.triggerEvent("change", {
                  attachments: this.data.attachments
                })
              }, error => {
                util.toast("上传失败:" + JSON.stringify(error))
              });
            } else {
              util.chooseVodUpload(res => {
                this.data.attachments.push({
                  img: res.imageURL + "?vframe/jpg/offset/1/w/640",
                  key: res.key,
                  video: res.imageURL
                })
                this.setData({
                  'attachments': this.data.attachments
                });
                if (this.data.name){
                  getCurrentPages()[getCurrentPages().length - 1].setData({
                    [`${this.data.name}`]: this.data.attachments
                  })
                }
                this.triggerEvent("change", {
                  attachments: this.data.attachments
                })
              }, error => {
                util.toast("上传失败:" + JSON.stringify(error))
              });
            }
          },
          fail: function (res) {

          }
        })
      }
      if (this.data.choosetype == 1) {
        util.chooseImgUpload(res => {
          this.data.attachments.push({
            key: res.key,
            img: res.imageURL
          })
          this.setData({
            'attachments': this.data.attachments
          });
          if (this.data.name) {
            getCurrentPages()[getCurrentPages().length - 1].setData({
              [`${this.data.name}`]: this.data.attachments
            })
          }
          this.triggerEvent("change", {
            attachments: this.data.attachments
          })
        }, error => {
          util.toast("上传失败:" + JSON.stringify(error))
        });
      }
      if (this.data.choosetype == 2) {
        util.chooseVodUpload(res => {
          this.data.attachments.push({
            img: res.imageURL + "?vframe/jpg/offset/1/w/640",
            key: res.key,
            video: res.imageURL
          })
          this.setData({
            'attachments': this.data.attachments
          });
          if (this.data.name) {
            getCurrentPages()[getCurrentPages().length - 1].setData({
              [`${this.data.name}`]: this.data.attachments
            })
          }
          this.triggerEvent("change", {
            attachments: this.data.attachments
          })
        }, error => {
          util.toast("上传失败:" + JSON.stringify(error))
        });
      }

    },
    _delete: function (e) {
      let index = e.currentTarget.dataset.index;
      this.data.attachments.splice(index, 1);
      this.setData({
        attachments: this.data.attachments
      });
      this.triggerEvent("change", {
        attachments: this.data.attachments
      })
    },
    //查看已上传的附件 图片或视频
    _viewAttachment: function (e) {
      let attachment = e.currentTarget.dataset.attachment;
      console.log(attachment)
      if (attachment.video) {
        this.setData({
          videoSrc: encodeURI(attachment.video),
          showVideo: true
        })
      } else {
        let imgs = [];
        this.data.attachments.forEach((item)=>{
          if (!item.video){
            imgs.push(item.img);
          }
        });
        wx.previewImage({
          current: attachment.img, // 当前显示图片的http链接
          urls: imgs // 需要预览的图片http链接列表
        })
      }
    },
    _closeVideo: function () {
      this.setData({
        showVideo: false
      })
    },
    _binderror: function (e) {
      console.log(e)
      util.toast("播放出错：" + e.detail.errMsg, false, 3000)
    }
  }
})