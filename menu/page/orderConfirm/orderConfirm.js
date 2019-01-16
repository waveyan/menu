const app = getApp();
Page({
  data: {
    orderData: {},
    addressInfo: {},
    chos_array: ['不需要', '1人', '2人', '3人','4人', '5人', '6人', '7人', '8人', '9人', '10人','10人以上'],//餐具数量
    index: 0,//餐具默认数量
    distribution:5,//配送费
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this;
    that.setData({
      goods: app.globalData.goods,
      cart: app.globalData.cart,
    })
  },
  onShow: function () {
  },

  addressClick: function () {
    wx.navigateTo({
      url: '../addressManager/addressManager',
    })
  },
  saveOrder: function (e) {
  },
  //餐具
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
})