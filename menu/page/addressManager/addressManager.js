var app = getApp();
var api = require('../../util/api.js');
Page({
  data: {
    addressList: null,
  },
  addressClick: function(e) {
    var that = this;
    //若选择地址则清除桌号
    app.globalData.deskNum = null;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      addressInfo: e.currentTarget.dataset.item,
    });
    wx.navigateBack({
      delta: 1
    })
  },
  addrEdit: function(e) {
    wx.navigateTo({
      url: '../addressAdd/addressAdd?id=' + e.currentTarget.dataset.id + '&name=' + e.currentTarget.dataset.name + '&phone=' + e.currentTarget.dataset.phone + '&province=' + e.currentTarget.dataset.province + '&city=' + e.currentTarget.dataset.city + '&address=' + e.currentTarget.dataset.address + '&isDefault=' + e.currentTarget.dataset.isdefault,
    })
  },
  addrDelete: function(e) {
    var that=this;
    wx.showModal({
      title: '提示',
      content: '是否删除该地址？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          wx.request({
            method: "POST",
            url: api.apiPath + 'userapi/deleteAddress',
            data:{'addressId':e.currentTarget.dataset.id},
            header: {
              'access-token': api.getAccessToken()
            },
            success(res) {
              var data = res.data;
              if (data.code == 0) {
                that.onShow();
              }
              else{
                wx.showToast({
                  title: data.msg,
                  icon:'none',
                  duration:2000
                });
              }
            }
          })

        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })
  },
  addressAdd: function() {
    wx.navigateTo({
      url: '../addressAdd/addressAdd',
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
            addressList: data.data
          })
        }
      }
    })
  },
  onLoad: function(options) {},
  onReady: function() {},
  onShow: function() {
    this.getMyAddressList();
    //若选择地址清除桌号
  },
})