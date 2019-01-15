var common = require('../../util/util.js');
// 获取到小程序实例
const app = getApp();
Page({
  data: {
    showCartDetail:false,
    showCart:true,
    goods: app.globalData.goods,
    goodsList: app.globalData.goodsList, getCount: false, //是否已选规格
    number: 1, //规格中数量
  },
  postData: {},
  // 生命周期函数--监听页面加载
  // 一个页面只会调用一次。
  onLoad: function(options) {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      });
    });

  },
  // 每次打开页面都会调用一次
  onShow: function() {
    var that=this;
    that.setData({
      classifySeleted: app.globalData.goodsList[0].id
    });
    that.refresh();
  },
  onGoodsScroll: function(e) {
    if (e.detail.scrollTop > 10 && !this.data.scrollDown) {
      this.setData({
        scrollDown: true
      });
    } else if (e.detail.scrollTop < 10 && this.data.scrollDown) {
      this.setData({
        scrollDown: false
      });
    }
    var scale = e.detail.scrollWidth / 570,
      scrollTop = e.detail.scrollTop / scale,
      h = 0,
      classifySeleted,
      len = this.data.goodsList.length;
    this.data.goodsList.forEach(function(classify, i) {
      var _h = 70 + classify.goods.length * (46 * 3 + 20 * 2);
      if (scrollTop >= h - 100 / scale) {
        classifySeleted = classify.id;
      }
      h += _h;
    });
    this.setData({
      classifySeleted: classifySeleted
    });
  },
  tapClassify: function(e) {
    var id = e.target.dataset.id;
    this.setData({
      classifyViewed: id
    });
    var self = this;
    setTimeout(function() {
      self.setData({
        classifySeleted: id
      });
    }, 100);
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
    var that=this;
    app.tapAddCart(e);
    that.refresh();
  },
  //购物车详情栏--从购物车中删除
  tapReduceCart: function (e) {
    var that = this
    app.tapReduceCart(e);
    that.refresh();
  },
  // 显示购物车详情栏
  showCartDetail: function () {
    app.showCartDetail()
    this.setData({
      showCartDetail: app.globalData.showCartDetail
    });
  },
  // 隐藏购物车详情栏
  hideCartDetail: function () {
    app.hideCartDetail();
    console.log(app.globalData.showCartDetail)
    this.setData({
      showCartDetail: app.globalData.showCartDetail
    });
  },

  // drawer--------------------------------------------------------------------------------------
  // 抽屉显示和隐藏
  setModalStatus: function (e) {
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
      var item = this.data.goods[postId];
      if (item.ismode == 0) {
        item.property = common.Tap(item.standard);
      }
      this.setData({
        showModalStatus: true,
        storeTotal: item.storeTotal,
        item: item,
        imgUrls: common.strToArray(item.imgBanner),
      });
    }
    /* 抽屉弹出动画 */
    setTimeout(function () {
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
  getChecked: function (e) {
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
  addNum: function () {
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
  minusNum: function () {
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
  //以下为自定义点击事件
  menuTap: function(event) {
    var postId = event.currentTarget.dataset.id;
    console.log(postId);
    wx.navigateTo({
      url: '../Buy/Buy?id=' + postId
    })
  },
});