// var detail = require('../../data/posts-data.js');
var common = require('../../util/util.js');

var app = getApp();
// 创建页面实例对象
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    isShow: false,
    warning: false,
    warnDes: "",
    number: 1,
    postData: {},
    showCart: true,
    showCartDetail: false,
    goods: app.globalData.goods,
  },
  postData: {},

  onLoad: function(option) {
    // 获取到加入购物车选项信息
    var that = this;
    var postId = option.id;
    // var postId = 0;
    var item = that.data.goods[postId];
    if (item.ismode == 0) {
      item.property = common.Tap(item.standard);
    }
    that.setData({
      storeTotal: item.storeTotal,
      item: item,
      imgUrls: common.strToArray(item.imgBanner),
    })
  },
  onShow: function() {
    var that = this;
    that.refresh();
  },

  // 同步全局购物车数据
  refresh: function() {
    this.setData({
      cart: app.globalData.cart,
      showCartDetail: app.globalData.showCartDetail,
      showCart: app.globalData.showCart,
    })
  },
  // 添加购物车
  tapAddCart: function(e) {
    var that = this;
    console.log(e);
    app.tapAddCart(e);
    that.refresh();
  },
  //购物车详情栏--从购物车中删除
  tapReduceCart: function(e) {
    var that = this
    app.tapReduceCart(e);
    that.refresh();
  },
  // 显示购物车详情栏
  showCartDetail: function() {
    app.showCartDetail()
    this.setData({
      showCartDetail: app.globalData.showCartDetail
    });
  },
  // 隐藏购物车详情栏
  hideCartDetail: function() {
    app.hideCartDetail();
    console.log(app.globalData.showCartDetail)
    this.setData({
      showCartDetail: app.globalData.showCartDetail
    });
  },

  // 抽屉显示和隐藏
  setModalStatus: function(e) {
    console.log("设置显示状态，1显示0不显示", e.currentTarget.dataset.status);
    var animation = wx.createAnimation({
      duration: 388,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export()
    })
    if (e.currentTarget.dataset.status == 1) {
      this.setData({
        showModalStatus: true
      });
    }
    /* 抽屉弹出动画 */
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation
      })
      if (e.currentTarget.dataset.status == 0) {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 200)
  },

  // 抽屉弹出信息的属性值
  getChecked: function(e) {
    var that = this,
      haveCheckedProp = "",
      name = e.currentTarget.dataset.property,
      value = e.currentTarget.dataset.value,
      length, objLength;
    that.postData[name] = value;
    length = that.data.item.property.length;
    objLength = common.objLength(that.postData);
    for (var key in that.postData) {
      haveCheckedProp += " " + that.postData[key];
    }
    if (length == objLength) {
      that.setData({
        getCount: true,
      });
    }
    this.setData({
      postData: that.postData,
      haveCheckedProp: haveCheckedProp
    })
  },

  goToCounter: function() {
    var that = this,
      length = that.data.item.property.length, //属性num
      objLength = common.objLength(that.data.postData); //已选择属性num
    if (that.data.item.storeTotal == 0) {
      common.alert.call(that, "供应不足");
    } else {
      if (length === objLength) {
        var number = that.data.number,
          title = that.data.item.title,
          tagline = that.data.item.tagline,
          price = that.data.item.sellPrice,
          image = that.data.imgUrls[0];
        wx.navigateTo({
          url: "counter?number=" + number + "&title=" + title + "&tagline=" + tagline + "&price=" + price + "&image=" + image,
          success: function(res) {}
        })
      } else {
        common.alert.call(that, "请选择菜品属性");
      }
    }
  },

  addNum: function() {
    var that = this,
      num = that.data.number;
    if (num + 1 > that.data.item.storeTotal) {
      common.alert.call(that, "超过最大供应量");
    } else {
      num += 1;
      that.setData({
        number: num,
      })
    }
  },

  minusNum: function() {
    var that = this,
      num = that.data.number;
    if (num - 1 < 1) {
      common.alert.call(that, "购买份数最少为1");
    } else {
      num -= 1;
      that.setData({
        number: num,
      })
    }
  },

  // 微信支付实现
  wxpay: function() {
    var code = app.code;
    var url = 'https://www.xxy1978.com/wxpay/example/jsapi.php';
    wx.request({
      url: url,
      data: {
        code: code,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: 'MD5',
          paySign: res.data.paySign,
          success: function(res) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 3000
            });
          },
          fail: function(res) {
            console.log("支付失败")
          },
        })
      }
    })
  },
  // 添加购物车
  tapAddCart: function(e) {
    var that = this
    app.tapAddCart(e);
    that.refresh();
  },
  //购物车详情栏--从购物车中删除
  tapReduceCart: function(e) {
    var that = this
    app.tapReduceCart(e);
    that.refresh();
  },
  // 显示购物车详情栏
  showCartDetail: function() {
    app.showCartDetail()
    this.setData({
      showCartDetail: app.globalData.showCartDetail
    });
  },
  // 隐藏购物车详情栏
  hideCartDetail: function() {
    app.hideCartDetail();
    console.log(app.globalData.showCartDetail)
    this.setData({
      showCartDetail: app.globalData.showCartDetail
    });
  },


})