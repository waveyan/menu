var common = require('../../util/util.js');

var app = getApp();
// 创建页面实例对象
Page({
  data: {
    showCart: true,
    showCartDetail: false,
    getCount: false, //是否已选规格
    number: 1,//规格中数量
    goods:null,
  },
  postData: {},

  onLoad: function(option) {
    // 获取到加入购物车选项信息
    var that = this;
    var postId = option.id;
    console.log(that.data.goods);
    var item = app.globalData.goods[postId];
    if (item.isSpec.code == 1) {
      item.property = common.Tap(item.standard);
    }
    that.setData({
      item: item,
      imgUrls: common.strToArray(item.imgBanner),
      goods: app.globalData.goods
    })
  },
  onShow: function() {
    var that = this;
    that.refresh();
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
    var price, that = this,
      haveCheckedProp = "",
      name = e.currentTarget.dataset.property,
      value = e.currentTarget.dataset.value,
      length, objLength;
    if (name == 'cm') {
      price = that.data.item.property[0].price[e.currentTarget.dataset.code];
      that.data.item.price = price;
      that.setData({
        item: that.data.item
      });
    }
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
      postData: that.postData, //已选，dict
      haveCheckedProp: haveCheckedProp //已选
    })
  },

  addNum: function() {
    var that = this,
      num = that.data.number;
      num += 1;
      that.setData({
        number: num,
      })
  },

  minusNum: function() {
    var that = this,
      num = that.data.number;
    if (num - 1 < 1) {
      // common.alert.call(that, "购买份数最少为1");
    } else {
      num -= 1;
      that.setData({
        number: num,
      })
    }
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
  // 同步全局购物车数据
  refresh: function () {
    this.setData({
      cart: app.globalData.cart,
      showCartDetail: app.globalData.showCartDetail,
      showCart: app.globalData.showCart,
    })
  },
  // 添加购物车
  tapAddCart: function (e) {
    var that = this;
    app.tapAddCart(e);
    that.refresh();
  },
  //购物车详情栏--从购物车中删除
  tapReduceCart: function (e) {
    var that = this
    app.tapReduceCart(e);
    that.refresh();
  },
  // 购物车结算按钮事件
  submit: function (e) {
    wx.navigateTo({
      url: '../orderConfirm/orderConfirm',
    })
  },
})