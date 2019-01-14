Page({
  data: {
    orderData: {},
    addressInfo: {},
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this;
  },
  onShow: function () {
  },
  paynow: function () { //先跳转到支付成功界面界面  拿到code
  },
  addressClick: function () {
    wx.navigateTo({
      url: '../addressManager/addressManager',
    })
  },
  saveOrder: function (e) {
  },
})