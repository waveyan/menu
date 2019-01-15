var rid = 33
var tid = 0
var menu = []
var apiPath = "https://www.xxy1978.com/api/"
var cosPath = "http://data-1252385075.cosgz.myqcloud.com/"

App({
  code: null,
  onLaunch: function(options) {
    //调用API从本地缓存中获取数据
    console.log(options)
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo: function(cb) {
    var that = this
  },

  getCoverUrl: function(did) {
    return cosPath + did + ".jpg"
  },
  getDetailObj: function(did) {
    var detail = wx.getStorageSync("detail-" + did)
    if (detail == undefined) {
      wx.request({
        url: cosPath + did + ".json",
        success: function(res) {
          wx.setStorageSync("detail-" + did, JSON.stringify(res.data))
          return res.data
        }
      })
    }
    return JSON.parse(detail)
  },
  // 全局变量
  globalData: {
    userInfo: null,
    showCartDetail: false,
    goods: {
      1: {
        id: 1,
        name: '果盘3',
        pic: 'http://img1.gtimg.com/health/pics/hv1/138/79/2068/134491983.jpg',
        standard: '[{"0":"小份","2":"大份","3":"超大份","name":"份量","code":"cm","price":[120,240,360]},{"1":"超辣","0":"微辣","2":"无辣","name":"口味","code":"ys"}]',
        sold: 1014,
        price: 120,
        ismode: 0,
      },
      2: {
        id: 2,
        name: '龙舌兰',
        pic: 'http://img1.gtimg.com/health/pics/hv1/138/79/2068/134491983.jpg',
        sold: 1029,
        price: 100
      },
      3: {
        id: 3,
        name: '方便面',
        pic: 'http://img1.gtimg.com/health/pics/hv1/138/79/2068/134491983.jpg',
        standard: '[{"0":"小份","2":"大份","3":"超大份","name":"份量","code":"cm","price":[5,10,15]},{"1":"超辣","0":"微辣","2":"无辣","name":"口味","code":"ys"}]',
        sold: 1030,
        price: 5,
        ismode: 0,
      },
      4: {
        id: 4,
        name: '粉丝',
        pic: 'http://img1.gtimg.com/health/pics/hv1/138/79/2068/134491983.jpg',
        sold: 1059,
        price: 5
      },
      5: {
        id: 5,
        name: '果盘1',
        pic: 'http://img1.gtimg.com/health/pics/hv1/138/79/2068/134491983.jpg',
        sold: 1029,
        price: 130
      },
      6: {
        id: 6,
        name: '果盘2',
        pic: 'http://img1.gtimg.com/health/pics/hv1/138/79/2068/134491983.jpg',
        sold: 1064,
        price: 150
      },
      7: {
        id: 7,
        name: '锐澳',
        pic: 'http://img1.gtimg.com/health/pics/hv1/138/79/2068/134491983.jpg',
        sold: 814,
        price: 200
      },
      8: {
        id: 8,
        name: '尊尼获加',
        pic: 'http://img1.gtimg.com/health/pics/hv1/138/79/2068/134491983.jpg',
        sold: 124,
        price: 220
      },
      9: {
        id: 9,
        name: '芝士华',
        pic: 'http://img1.gtimg.com/health/pics/hv1/138/79/2068/134491983.jpg',
        sold: 102,
        price: 300
      }
    },
    goodsList: [{
        id: 'hot',
        classifyName: '热销',
        goods: [1, 2, 3, 4, 5]
      },
      {
        id: 'new',
        classifyName: '小吃',
        goods: [1, 3]
      },
      {
        id: 'vegetable',
        classifyName: '果盘',
        goods: [1, 6, 5]
      },
      {
        id: 'mushroom',
        classifyName: '鸡尾酒',
        goods: [1, 7, 8, 9]
      },
      {
        id: 'food',
        classifyName: '主食',
        goods: [3, 4]
      }
    ],
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
    if(one.num<=0)
      delete this.globalData.cart.standardCart[key]
    else
      this.globalData.cart.standardCart[key] = one;
    this.globalData.cart.count = count;
    this.globalData.cart.total -=one.price;
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
})