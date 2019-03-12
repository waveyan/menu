var api = require('./util/api.js');

App({
  onLaunch: function(options) {
    //调用API从本地缓存中获取数据
    console.log(options)
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.getUserInfo();
    this.getDishs();
  },
  // 获取用户信息
  getUserInfo: function() {
    var that = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              that.globalData.userInfo = res.userInfo
              try {
                const value = wx.getStorageSync('accessToken')
                if (value) {
                  that.globalData.userInfo.accessToken = value;
                }
              } catch (e) {
                console.log(e);
              }
              api.backendLogin(that.globalData.userInfo);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          // 没有授权，重定向到 loading 启动页
          wx.redirectTo({
            url: '/page/loading/loading'
          })
        }
      }
    })
  },
  //获取菜单
  getDishs:function(){
    var that=this;
    wx.request({
      url: api.apiPath + '/otherapi/getDishs',
      success(res) {
        var data=res.data;
        that.globalData.goods=data.data.good;
        that.globalData.goodsList = data.data.classify;
      }
    })
  },
  // 全局变量
  globalData: {
    userInfo: null,
    showCartDetail: false,
    deskNum:null,//桌号，扫码获取
    goods:null,
    goodsList:null,
    cart: {
      count: 0, //商品总数量
      total: 0, //总价格
      list: {}, //key为商品id，value为该商品数量
      standardCart: {}, //可选规格商品，{'namefavour':{name:,favour:,num:,price:}}
    },
    showCartDetail: false,
    showCart: true
  },

  // 购物车操作全局函数
  standardAdd: function(e) {
    if (e.currentTarget.dataset.from == 'detail') {
      this.cartDetailAdd(e);
    } else {
      this.detailAdd(e);
    }
  },
  // 可选规格菜品---购物车详情栏加入购物车
  cartDetailAdd: function(e) {
    var count = this.globalData.cart.count || 0,
      key = e.currentTarget.dataset.name + e.currentTarget.dataset.favour,
      one = this.globalData.cart.standardCart[key];
    one.num++;
    count++;
    this.globalData.cart.standardCart[key] = one;
    this.globalData.cart.count = count;
    this.globalData.cart.total += one.price;
  },
  //可选规格菜品---菜品详情页加入购物车
  detailAdd: function(e) {
    var count = this.globalData.cart.count || 0,
      key = e.currentTarget.dataset.name + e.currentTarget.dataset.favour,
      one = this.globalData.cart.standardCart[key];
    if (one) {
      one.num += e.currentTarget.dataset.num;
    } else {
      one = {};
      one.name = e.currentTarget.dataset.name;
      one.price = e.currentTarget.dataset.price;
      one.favour = e.currentTarget.dataset.favour;
      one.num = e.currentTarget.dataset.num;
      one.id = e.currentTarget.dataset.id;
      one.weightId = e.currentTarget.dataset.weightid;
      one.tasteId = e.currentTarget.dataset.tasteid;
    }
    count += e.currentTarget.dataset.num;
    this.globalData.cart.standardCart[key] = one;
    this.globalData.cart.count = count;
    this.globalData.cart.total += one.num * one.price;
  },
  //加入购物车
  tapAddCart: function(e) {
    //选规格时
    if (e.currentTarget.dataset.name)
      this.standardAdd(e);
    else
      this.addCart(e.currentTarget.dataset.id);
  },
  // 可选规格菜品--- 购物车详情栏从购物车删除
  standardReduce: function(e) {
    var count = this.globalData.cart.count || 0,
      key = e.currentTarget.dataset.name + e.currentTarget.dataset.favour,
      one = this.globalData.cart.standardCart[key];
    one.num--;
    count--;
    if (one.num <= 0)
      delete this.globalData.cart.standardCart[key]
    else
      this.globalData.cart.standardCart[key] = one;
    this.globalData.cart.count = count;
    this.globalData.cart.total -= one.price;
  },

  //购物车详情栏--从购物车中删除
  tapReduceCart: function(e) {
    if (e.currentTarget.dataset.name)
      this.standardReduce(e)
    else
      this.reduceCart(e.target.dataset.id);
  },
  //显示购物车详情栏
  showCartDetail: function() {
    this.globalData.showCartDetail = !this.globalData.showCartDetail
  },
  // 当购物车空隐藏购物车详情栏
  hideCartDetail: function() {
    this.globalData.showCartDetail = false
  },
  //购物车详情栏--加入购物车
  addCart: function(id) {
    var num = this.globalData.cart.list[id] || 0;
    this.globalData.cart.list[id] = num + 1;
    this.globalData.cart.total += this.globalData.goods[id].price
    this.globalData.cart.count++;
  },

  reduceCart: function(id) {
    var num = this.globalData.cart.list[id] || 0;
    if (num <= 1) {
      delete this.globalData.cart.list[id];
    } else {
      this.globalData.cart.list[id] = num - 1;
    }
    this.globalData.cart.total -= this.globalData.goods[id].price
    this.globalData.cart.count--;
  },

  // 购物车动画特效算法
  bezier: function (pots, amount) {
    var pot;
    var lines;
    var ret = [];
    var points;
    for (var i = 0; i <= amount; i++) {
      points = pots.slice(0);
      lines = [];
      while (pot = points.shift()) {
        if (points.length) {
          lines.push(pointLine([pot, points[0]], i / amount));
        } else if (lines.length > 1) {
          points = lines;
          lines = [];
        } else {
          break;
        }
      }
      ret.push(lines[0]);
    }
    function pointLine(points, rate) {
      var pointA, pointB, pointDistance, xDistance, yDistance, tan, radian, tmpPointDistance;
      var ret = [];
      pointA = points[0];//点击
      pointB = points[1];//中间
      xDistance = pointB.x - pointA.x;
      yDistance = pointB.y - pointA.y;
      pointDistance = Math.pow(Math.pow(xDistance, 2) + Math.pow(yDistance, 2), 1 / 2);
      tan = yDistance / xDistance;
      radian = Math.atan(tan);
      tmpPointDistance = pointDistance * rate;
      ret = {
        x: pointA.x + tmpPointDistance * Math.cos(radian),
        y: pointA.y + tmpPointDistance * Math.sin(radian)
      };
      return ret;
    }
    return {
      'bezier_points': ret
    };
  }
})