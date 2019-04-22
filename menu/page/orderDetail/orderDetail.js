var util = require('../../util/util.js')
var api = require('../../util/api.js')
const app = getApp();
Page({
  data: {
    orderData: {},
    bill:{}
  },
  // 生命周期函数--监听页面加载
  onLoad: function(options) {
    var that = this;
    var jsObj=JSON.parse(options.order);
    console.log(jsObj);
    that.setData({
      orderData:jsObj,
      bill:JSON.parse(jsObj.bill)
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
        // 编辑收货地址
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
})