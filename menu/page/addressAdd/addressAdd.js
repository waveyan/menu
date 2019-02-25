const app = getApp();
var api = require('../../util/api.js');
Page({
  data: {
    addressInfo: {},
  },
  onLoad: function(options) {
    var that = this;
    console.log(options);
    that.setData({
      addressInfo: options
    })
  },
  
  
  //保存
  formSubmit: function(e) {
    var that = this;
    var data = e.detail.value;
    console.log(e);
    if (data.name.length == 0) {
      wx.showToast({
        title: '收货人不能为空',
        icon: 'loading',
        mask: true
      })
    } else if (data.phone.length == 0) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'loading',
        mask: true
      })
    } else if (data.province.length == 0) {
      wx.showToast({
        title: '省份不能为空',
        icon: 'loading',
        mask: true
      })
    } else if (data.city.length == 0) {
      wx.showToast({
        title: '市不能为空',
        icon: 'loading',
        mask: true
      })
    } else if (data.address.length == 0) {
      wx.showToast({
        title: '地址不能为空',
        icon: 'loading',
        mask: true
      })
    } else {
      if(data.isDefault==false)
        data.isDefault=0;
      else
        data.isDefault=1;
      wx.request({
        method: "POST",
        url: api.apiPath + 'userapi/insertorupateaddress',
        header: {
          'access-token': api.getAccessToken()
        },
        data: data,
        success(res) {
          var data = res.data;
          if(data.code==0){
              wx.navigateBack({
                delta: 1
              })
          }
          else{
            wx.showToast({
              title: data.msg,
              icon: 'loading',
              mask: true
            })
          }
        }
      })
    }
  },
})