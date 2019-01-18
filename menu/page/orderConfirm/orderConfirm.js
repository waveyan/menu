const app = getApp();
Page({
  data: {
    orderData: {},
    // 默认地址
    addressInfo: {
      trueName: 'xxxx1',
      mobPhone: '13xxxxxxxxxxxxxxxxx',
      areaInfo: '广东省',
      address: '四会市东海明珠豪庭',
      addressId: 1
    },
    chos_array: ['不需要', '1人', '2人', '3人', '4人', '5人', '6人', '7人', '8人', '9人', '10人', '10人以上'], //餐具数量
    index: 0, //餐具默认数量
    distribution: 5, //配送费
  },
  // 生命周期函数--监听页面加载
  onLoad: function(options) {
    var that = this;
    that.setData({
      goods: app.globalData.goods,
      cart: app.globalData.cart,
    })
  },
  onShow: function() {},
  //餐具
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  // 马上点餐
  addressClick: function() {
    const that = this
    wx.showActionSheet({
      itemList: ['编辑收货信息', '扫描桌面二维码'],
      success(e) {
        // 扫码
        if (e.tapIndex == 1) {
          wx.scanCode({
            success(res) {
              console.log(res)
              that.setData({
                result: res.result
              })
            },
            fail() {}
          })
        }
        // 外买点餐
        else {
          wx.navigateTo({
            url: '../addressManager/addressManager',
          })
        }
      }
    })
  },
  goToMark: function(e) {
    wx.navigateTo({
      url: '../orderMark/orderMark',
    })
  },
  goToBill: function(e) {
    var that = this;
    wx.navigateTo({
      url: '../orderBill/orderBill?up=' + that.data.up + '&code=' + that.data.code + '&value=' + that.data.bvalue,
    })
  },
  myCoupon:function(e){
    wx.navigateTo({
      url: '../myCoupon/myCoupon?total='+e.currentTarget.dataset.total,
    })
  }
})