var common = require('../../util/util.js');
var api = require('../../util/api.js');
// 获取到小程序实例
var app = getApp();
Page({
  data: {
    showCartDetail:false,
    showCart:true,
    goods: null,
    goodsList: null, 
    getCount: false, //是否已选规格
    number: 1, //规格中数量
    //动态加入购物车
    hide_good_box: true,
    bus_x: 0,
    bus_y: 0
  },
  postData: {},
  // 生命周期函数--监听页面加载
  // 一个页面只会调用一次。
  onLoad: function(options) {
    var that = this;
    var _windowHeight = wx.getSystemInfoSync().windowHeight;
    // 目标终点元素 - 购物车的位置坐标
    this.busPos = {};
    this.busPos['x'] = 45; // x坐标暂写死，自己可根据UI来修改
    this.busPos['y'] = _windowHeight - 30; // y坐标，也可以根据自己需要来修改
    if (options.q) {
      var scan_url = decodeURIComponent(options.q);
      var deskNum = scan_url.match(/\d+/);
      app.globalData.deskNum=deskNum;
    } 
  },
  // 每次打开页面都会调用一次
  onShow: function() {
    var that=this;
    that.setData({
      classifySeleted: app.globalData.goodsList[0].id,
      goods:app.globalData.goods,
      goodsList:app.globalData.goodsList,
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
  // 动态加入购物车
  touchOnGoods: function (e) {
    // 如果good_box正在运动，不能重复点击
    if (!this.data.hide_good_box) return;
    this.finger = {};
    var topPoint = {};
    //点击点的坐标
    this.finger['x'] = e.touches["0"].clientX;
    this.finger['y'] = e.touches["0"].clientY;

    //控制点的y值定在低的点的上方150处
    if (this.finger['y'] < this.busPos['y']) {
      topPoint['y'] = this.finger['y'] - 150;
    } else {
      topPoint['y'] = this.busPos['y'] - 150;
    }

    //控制点的x值在点击点和购物车之间
    if (this.finger['x' > this.busPos['x']]) {
      topPoint['x'] = (this.finger['x'] - this.busPos['x']) / 2 + this.busPos['x'];
    } else {
      topPoint['x'] = (this.busPos['x'] - this.finger['x']) / 2 + this.finger['x'];
    }

    this.linePos = app.bezier([this.busPos, topPoint, this.finger], 30);
    this.startAnimation(e);
  },
  startAnimation: function (e) {
    var index = 0,
      that = this,
      bezier_points = that.linePos['bezier_points'];
    this.setData({
      hide_good_box: false,
      bus_x: that.finger['x'],
      bus_y: that.finger['y']
    })
    index = bezier_points.length;
    this.timer = setInterval(function () {
      index--;
      // 设置球的位置
      that.setData({
        bus_x: bezier_points[index]['x'],
        bus_y: bezier_points[index]['y']
      })
      // 到最后一个点的时候，开始购物车的一系列变化，并清除定时器，隐藏小球
      if (index < 1) {
        clearInterval(that.timer);
        that.setData({
          hide_good_box: true
        });
        that.tapAddCart(e);
      }
    }, 33);
  },
  // 添加购物车
  tapAddCart: function (e) {
    var that = this;
    app.tapAddCart(e);
    that.refresh();
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
      if (item.isSpec.code == 1) {
        item.property = common.Tap(item.standard);
      }
      console.log(item.property);
      this.setData({
        showModalStatus: true,
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
      key = that.data.item.property[0].key[e.currentTarget.dataset.code]
      that.data.item.price = price;
      that.data.item.weightId = key;
    }
    else {
      key = that.data.item.property[1].key[e.currentTarget.dataset.code]
      that.data.item.tasteId = key;
    }
    that.setData({
      item: that.data.item
    });
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
      num += 1;
      that.setData({
        number: num,
      })
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
      url: '../foodDetail/foodDetail?id=' + postId
    })
  },
  // 购物车结算按钮事件
  submit: function (e) {
    wx.navigateTo({
      url: '../orderConfirm/orderConfirm',
    })
  },
});