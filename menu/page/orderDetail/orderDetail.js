var util = require('../../util/util.js')
var api = require('../../util/api.js')
const app = getApp();
Page({
  data: {
    orderData: {},
    bill:{},
    orderJson:''
  },
  // 生命周期函数--监听页面加载
  onLoad: function(options) {
    var that = this;
    var jsObj=JSON.parse(options.order);
    console.log(jsObj);
    that.setData({
      orderData:jsObj,
      bill:JSON.parse(jsObj.bill),
      orderJson:options.order,
    })
  },
  goToComment: function (e) {
    var that=this;
    wx.navigateTo({
      url: '../comment/comment?order=' + that.data.orderJson,
    })
  }
})