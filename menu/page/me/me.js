//index.js
var api = require('../../util/api.js');
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo:{},
  },
  onShow: function() {
    var that = this;
    that.getIntegral();
  },
  //获取后台用户信息
  getIntegral:function(){
    var that=this;
    wx.request({
      url: api.apiPath+'/userapi/getMe',
      method:'GET',
      header: {
        'access-token': api.getAccessToken()
      },
      success(res) {
        var data = res.data;
        if (data.code == 0) {
          that.setData({
            userInfo: data.data.me
          })
        }
        else{
          wx.showToast({
            title: data.msg,
            duration:20000
          })
        }
      }
    });
  },

  orderDetail: function () {
    wx.navigateTo({
      url: '../orderTotal/orderTotal'
    })
  },
  goToCoponMarket:function(e){
    wx.navigateTo({
      url: '../couponMarket/couponMarket',
    })
  },
  myCoupon:function(e){
    wx.navigateTo({
      url: '../myCoupon/myCoupon',
    })
  }
});