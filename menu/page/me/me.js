//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo:{},
  },
  onShow: function() {
    var that = this;
    console.log(app.globalData.userInfo);
    that.setData({
      userInfo: app.globalData.userInfo,
    });
    // wx.login({
    //   success(res) {
    //     if (res.code) {
    //       console.log(res);
    //     } else {
    //       console.log('登录失败！' + res.errMsg)
    //     }
    //   }
    // })
  },

  detail: function () {
    wx.navigateTo({
      url: '../orderTotal/orderTotal'
    })
  },
  goToCoponMarket:function(e){
    wx.navigateTo({
      url: '../coupon/coupon',
    })
  }
});