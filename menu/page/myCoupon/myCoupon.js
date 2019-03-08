var api = require('../../util/api.js');
const app = getApp()
Page({
  data: {
    coupon: null,
    cart: null, //购物车
  },
  onLoad: function(options) {
    var that = this;
    var total=options.total;
    //从订单页来
    if(total)
      that.setData({
        total: options.total
      });
    //从我的优惠券来
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

  //从订单页来使用优惠券
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
  },
  //从我的优惠券来使用优惠券
  clickToGo:function(){
    wx.switchTab({
      url: '/page/category/category',
    })
  },
})
