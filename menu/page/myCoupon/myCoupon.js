var api = require('../../util/api.js');
const app = getApp()
Page({
  data: {
    coupon: null,
    cart: null, //购物车
  },
  onLoad: function(options) {
    var that = this;
    that.setData({
      cart: app.globalData.cart
    });
    wx.request({
      url: api.apiPath + '/userapi/getMyCoupon',
      header: {
        'access-token': api.getAccessToken()
      },
      success(res) {
        var data = res.data.data;
        that.setData({
          coupon: data,
        });
        console.log(that.data.coupon);
      }
    })
  },
  onShow: function() {},

  clickUse: function(e) {
    var coupon=e.currentTarget.dataset.item;
    var that = this;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    var id = e.currentTarget
    prevPage.setData({
      coupon: coupon,
    });
    wx.navigateBack({
      delta: 1
    })
  }
})