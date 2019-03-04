var api = require('../../util/api.js');
var app = getApp();
Page({
  data: {
    orderData: {},
    // 默认地址
    addressInfo: null,
    chos_array: ['不需要', '1人', '2人', '3人', '4人', '5人', '6人', '7人', '8人', '9人', '10人', '10人以上'], //餐具数量
    index: 0, //餐具默认数量
    distribution: 5, //配送费
    deskNum: null, //桌号
  },
  // 生命周期函数--监听页面加载
  onLoad: function(options) {
    var that = this;
    console.log(that.data.deskNum);
    console.log(app.globalData.deskNum);
    that.setData({
      goods: app.globalData.goods,
      cart: app.globalData.cart,
    });
    //没有桌号就获取地址列表
    if (app.globalData.deskNum == null)
      //获取地址列表
      this.getMyAddressList();
  },
  onShow: function() {
    var that=this;
    that.setData({
      deskNum: app.globalData.deskNum,
    })
  },
  //餐具
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    });
  },
  // 马上点餐
  addressClick: function() {
    var that = this;
      wx.showActionSheet({
        itemList: ['编辑收货信息', '扫描桌面二维码'],
        success(e) {
          // 扫码
          if (e.tapIndex == 1) {
            wx.scanCode({
              success(res) {
                console.log(res.result)
                var scan_url = res.result
                var deskNum = scan_url.match(/\d+/);
                app.globalData.deskNum = deskNum;
                that.setData({
                  deskNum: deskNum
                })
              }
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
  //备注
  goToMark: function(e) {
    wx.navigateTo({
      url: '../orderMark/orderMark',
    })
  },
  //发票
  goToBill: function(e) {
    var that = this;
    wx.navigateTo({
      url: '../orderBill/orderBill?up=' + that.data.up + '&code=' + that.data.code + '&value=' + that.data.bvalue,
    })
  },
  //优惠券
  myCoupon: function(e) {
    wx.navigateTo({
      url: '../myCoupon/myCoupon?total=' + e.currentTarget.dataset.total,
    })
  },
  //地址
  getMyAddressList: function() {
    var that = this;
    wx.request({
      method: "GET",
      url: api.apiPath + 'userapi/getaddresslist',
      header: {
        'access-token': api.getAccessToken()
      },
      success(res) {
        var data = res.data;
        if (data.data.length > 0) {
          that.setData({
            addressInfo: data.data[0]
          })
        }
      }
    })
  }
})