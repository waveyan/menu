var api = require('../../util/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTab: ["0-99", "100-199", "200-299"],
    currentNavtab: 0,
    coupon:null,
    all_coupon:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that=this;
    wx.request({
      url: api.apiPath +'/otherapi/getCoupon',
      success(res){
        var data=res.data;
        that.setData({
          coupon: data.data[that.data.currentNavtab],
          all_coupon:data.data
        })

      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //切换tab刷新数据
  switchTab: function(o) {
    var that = this;
    var idx = o.currentTarget.dataset.idx;
    if (idx !== that.data.currentNavtab) {
      that.setData({
        currentNavtab: idx,
        coupon: that.data.all_coupon[idx], //数据源清空
      })
    }
  },
  //领取优惠券
  getCoupon:function(e){
    console.log(e.currentTarget.dataset.id)
  }
})