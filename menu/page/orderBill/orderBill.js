Page({
  data: {
    value: 0, //选择类型
    items: [{
        name: '不需发票',
      },
      {
        name: '公司',
      },
      {
        name: '个人',
      },
    ]
  },
  onLoad: function(options) {
    var that = this,
    items=that.data.items;
    console.log(options)

    if (options.value != "undefined") {
      items[options.value].checked='true';
      that.setData({
        value: options.value,
      })
    }
    else{
      items[0].checked = 'true';
    }
    if (options.code != "undefined") that.setData({
      code: options.code
    });
    if (options.up != "undefined") that.setData({
      up: options.up
    });
    that.setData({
      items:items,
    })
  },
  onReady: function() {},
  onShow: function() {},
  radioChange: function(e) {
    var that = this;
    that.setData({
      value: e.detail.value,
    })
  },
  bindUpInput: function(e) {
    var that = this;
    that.setData({
      up: e.detail.value,
    })
  },
  bindCodeInput: function(e) {
    var that = this;
    that.setData({
      code: e.detail.value,
    })
  },

  ok: function(e) {
    var that = this;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    if (that.data.value == 1)
      prevPage.setData({
        up: that.data.up,
        code: that.data.code,
        bvalue: that.data.value,
      });
    else if (that.data.value == 2)
      prevPage.setData({
        up: that.data.up,
        bvalue: that.data.value,
      });
    else
      prevPage.setData({
        bvalue: that.data.value,
      });
    wx.navigateBack({
      delta: 1
    })
  }
})