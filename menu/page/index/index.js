var postsData = require('../../data/posts-data.js')
var common = require('../../util/util.js');
var api = require('../../util/api.js');
// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  name: "index",
  data: {
    hotimg1: "/res/images/1.jpg",
    hotimg2: "/res/images/2.jpg",
    hotimg3: "/res/images/3.jpg",
    goods:null,
    showCartDetail: false,
    showCart: true,
    getCount: false, //是否已选规格
    number: 1, //规格中数量
  },
  postData: {},

  onLoad: function(options) {
    var that = this;
    wx.request({
      url: api.apiPath + "/otherapi/getAppPicture",
      method: "POST",
      success(res) {
        var data = res.data.data;
        console.log(data);
        that.setData({
          posts_key: data.hotDish,
          imgUrls: data.swiper,
          goods:app.globalData.goods
        })
      }
    })
  },
  onShow: function() {
    var that = this
    that.refresh();
    console.log(that.data.swiper)
  },

  //以下为自定义点击事件
  menuTap: function(event) {
    //event(系统给的一个框架)、currentTarget(当前鼠标点击的一个组件)、dataset(所有自定义数据的集合)、  .（变量名）
    var postId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../foodDetail/foodDetail?id=' + postId
    })
  },

  // 关闭弹出界面
  closeTap: function() {
    this.setData({
      showGoodsDetail: true
    });
  },
  // 马上点餐
  actionSheetTap() {
    const that = this
    wx.showActionSheet({
      itemList: ['扫码点餐', '外卖点餐'],
      success(e) {
        // 扫码
        if (e.tapIndex == 0) {
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
          wx.switchTab({
            url: '../category/category'
          })
        }
      }
    })
  },
  //跳转页面
  openwin: function(event) {
    var path = event.target.dataset.url;
    wx.navigateTo({
      url: '../' + path + '/' + path
    })
  },

  // 同步全局购物车数据
  refresh: function() {
    var that = this
    that.setData({
      cart: app.globalData.cart,
      showCartDetail: app.globalData.showCartDetail,
      showCart: app.globalData.showCart,
    })
  },

  // 添加购物车
  tapAddCart: function(e) {
    console.log(this)
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
  // drawer--------------------------------------------------------------------------------------
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
      var postId = e.currentTarget.dataset.id;
      var item = app.globalData.goods[postId];
      if (item.isSpec.code == 1) {
        item.property = common.Tap(item.standard);
      }
      this.setData({
        showModalStatus: true,
        item: item,
        imgUrls: common.strToArray(item.imgBanner),
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
  // end drawer---------------------------------------------------------------------------------
  // 购物车结算按钮事件
  submit: function(e) {
    wx.navigateTo({
      url: '../orderConfirm/orderConfirm',
    })
  },
})