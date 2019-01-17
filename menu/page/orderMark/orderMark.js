Page({
  data: {
    value: '',
  },
  onLoad: function(options) {},
  onReady: function() {},
  onShow: function() {},
  add: function(e) {
    var that = this;
    that.setData({
      value: that.data.value + ' ' + e.currentTarget.dataset.value,
    });
  },
  input: function(e) {
    var that = this;
    console.log(e)
    that.setData({
      value: e.detail.value,
    });
  },
  ok: function(e) {
    var that = this;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      mark: that.data.value,
    });
    wx.navigateBack({
      delta: 1
    })
  }
})