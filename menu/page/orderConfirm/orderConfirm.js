var api = require('../../util/api.js');
var app = getApp();
Page({
  data: {
    orderData: {},
    // 默认地址
    addressInfo: null,
    chos_array: ['不需要', '1人', '2人', '3人', '4人', '5人', '6人', '7人', '8人', '9人', '10人', '10人以上'], //餐具数量
    index: 0, //餐具默认数量
    distribution: 0, //配送费
    deskNum: null, //桌号
    coupon: null, //某一可用优惠券
    cart: null, //购物车
    coupon_price: 0, //优惠券优惠金额

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
    that.getMe();
  },
  onShow: function() {
    var that = this;
    that.setData({
      deskNum: app.globalData.deskNum,
    })
    //计算优惠券优惠金额
    that.caculateCoupon();
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
              console.log(deskNum)
              app.globalData.deskNum = deskNum[0];
              that.setData({
                deskNum: deskNum[0]
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
  //wo
  getMe: function() {
    var that = this;
    wx.request({
      method: "GET",
      url: api.apiPath + '/userapi/getMe',
      header: {
        'access-token': api.getAccessToken()
      },
      success(res) {
        var data = res.data;
        var coupon = data.data.coupon;
        for (var i = 0; i < coupon.length; i++) {
          if (that.data.cart.total >= coupon[i].useLimit) {
            console.log(coupon[i])
            that.setData({
              coupon: coupon[i]
            });
            break;
          }
        }
        //计算优惠券优惠金额
        that.caculateCoupon();
        //设置地址
        that.setData({
          addressInfo: data.data.address[0],
        })
      }
    })
  },

  //计算优惠券优惠金额
  caculateCoupon: function() {
    var that = this;
    //计算优惠券优惠金额
    if (that.data.coupon != null && that.data.coupon.couponType.code == 1)
      that.setData({
        coupon_price: that.data.coupon.cash
      })
    else if (that.data.coupon != null && that.data.coupon.couponType.code == 2) {
      var discount = that.data.coupon.discountRate
      var p = that.data.cart.total * discount / 10.0;
      that.setData({
        coupon_price: p,
      });
    }
  },
  //检查地址
  checkAddress: function() {
    var that = this;
    if (that.data.addressInfo != null || that.data.deskNum != null) return true;
    else {
      wx.showToast({
        title: "请填写收获地址或扫描桌面二维码",
        duration: 2000,
        icon:'none',
        mask: true,
      });
      return false;
    }
  },
  //确定支付
  paynow: function() {
    var that = this;
    var orderId=null;
    if (that.checkAddress()) {
      var standardCart = that.data.cart.standardCart;
      var cart = that.data.cart.list;
      var goodsId = '';
      //普通菜色
      for (var key in cart) {
        goodsId += key + "#" + cart[key] + ',';
      }
      //可选规格菜色
      for (var key in standardCart) {
        goodsId += standardCart[key].id + '#' + standardCart[key].num + '#' + standardCart[key].tasteId + '#' + standardCart[key].weightId + ','
      }
      //发票
      var bill = {};
      bill.type = that.data.bvalue;
      bill.up = that.data.up;
      bill.code = that.data.code;
      var data = {};
      if (that.data.addressInfo!=null)
        data.addressId = that.data.addressInfo.id;
      data.deskNo = that.data.deskNum;
      data.goodsId = goodsId;
      data.chosNum = parseInt(that.data.index);
      data.mark = that.data.mark;
      if (that.data.coupon)
        data.couponId = that.data.coupon.id;
      console.log(that.data.coupon)
      data.bill = JSON.stringify(bill);
      let str = JSON.stringify(data)
      console.log(str);
      wx.request({
        url: api.apiPath + '/userapi/saveOrder',
        method: "POST",
        header: {
          'access-token': api.getAccessToken()
        },
        data: data,
        success(res) {
          var data = res.data;
          if (data.code == 0) {
            orderId = data.data;
            //请求服务器下单
            wx.request({
              url: api.apiPath + '/userapi/toPay',
              method: "POST",
              header: {
                "access-token": api.getAccessToken()
              },
              data: {
                "orderId": orderId
              },
              success(res) {
                if (res.data.code == 0) {
                  const payParam = res.data.data;
                  console.log(payParam);
                  wx.requestPayment({
                    'timeStamp': payParam.timeStamp,
                    'nonceStr': payParam.nonceStr,
                    'package': payParam.package,
                    'signType': payParam.signType,
                    'paySign': payParam.paySign,
                    'success': function(res) {
                      console.log(res);
                      
                    },
                    'fail': function(res) {
                      console.log(res);
                      //删除订单
                      wx.request({
                        url: api.apiPath + '/userapi/toPay',
                        data:{'orderId':orderId},
                        header: { 'access-token': api.getAccessToken()},
                        method:'POST',
                        success(res){
                          console.log('删除订单成功！！');
                        }
                      })
                    }
                  });
                } else {
                  wx.showModal({
                    title: '提示',
                    content: "支付失败！",
                    showCancel: false,
                    success: function(rs) {}
                  })
                }
              }
            })
          }
        }
      })
    }
  }
})