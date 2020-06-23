Page({
  data: {
    inputShowed: false,
    inputVal: "",
    tabIndex: 0,
    filter: false,
    fiterItems: [{
      name: "校区/分馆",
      selected: true
    }, {
      name: "天津市",
      selected: false
    }, {
      name: "三里屯",
      selected: false
    }, {
      name: "朝阳区",
      selected: false
    }, {
      name: "上海市",
      selected: false
    }, {
      name: "北京市",
      selected: true
    }, {
      name: "成都市",
      selected: false
    }, {
      name: "南京市",
      selected: false
    }, {
      name: "义乌市",
      selected: false
    }, {
      name: "浙江省",
      selected: false
    }]
  },
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  changeTab: function(event) {
    this.setData({
      tabIndex: event.currentTarget.dataset.index
    })
  },
  showFilter: function() {
    this.setData({
      filter: !this.data.filter
    })
  },
  filterSelect: function(event) {
    this.data.fiterItems[event.currentTarget.dataset.d].selected = !this.data.fiterItems[event.currentTarget.dataset.d].selected
    this.setData({
      fiterItems: this.data.fiterItems
    })
  },
  developing: function() {
    wx.showToast({
      title: '开发中...',
      icon: 'loading',
      duration: 500
    });
  },
  todetail2: function () {
    wx.navigateTo({
      url: '../notification_detail2/notification_detail2',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
});