var postsData = require('../../data/posts-data.js')

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  name: "index",
  data: {
    swiper: {
      imgUrls: [
        '/res/images/tooopen_sy_143912755726.jpg',
        '/res/images/tooopen_sy_175866434296.jpg',
        '/res/images/tooopen_sy_175833047715.jpg'
      ],
      indicatorDots: true,//是否显示面板指示点
      autoplay: true, //是否自动切换
      interval: 5000, //自动切换时间间隔
      duration: 1000, //滑动动画时长
      circular: true, //是否采用衔接滑动,
      hotimg1: "/res/images/1.jpg",
      hotimg2: "/res/images/2.jpg",
      hotimg3: "/res/images/3.jpg",
    },
    hotimg:{
    },
    goods: app.globalData.goods,
    showCartDetail: false,
    showCart:true
  },

  onLoad:function (options) {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo: userInfo,
        name: userInfo.nickName,
        posts_key: postsData.postList
      })
    })
    that.setData({
      posts_key: postsData.postList
    })
    
  },
  onShow: function () {
    var that = this
    that.refresh();
  },

  //以下为自定义点击事件
  menuTap: function (event) {
    //event(系统给的一个框架)、currentTarget(当前鼠标点击的一个组件)、dataset(所有自定义数据的集合)、  .（变量名）
    var postId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../Buy/Buy?id=' + postId
    })
  },

  // 关闭弹出界面
  closeTap: function () {
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
        if(e.tapIndex==0){
          wx.scanCode({
            success(res) {
              console.log(res)
              that.setData({
                result: res.result
              })
            },
            fail() { }
          })
        }
        // 外买点餐
        else{
          wx.switchTab({
            url: '../category/category'
          })
        }
      }
    })
  },
  //跳转页面
  openwin: function (event) { 
    var path = event.target.dataset.url;
    wx.navigateTo({
      url: '../' + path + '/' + path
    })
  },

  // 同步全局购物车数据
  refresh: function () {
    var that = this
    that.setData({
      cart: app.globalData.cart,
      showCartDetail: app.globalData.showCartDetail,
      showCart: app.globalData.showCart,
    })
  },

  // 添加购物车
  tapAddCart: function (e) {
    console.log(this)
    var that = this
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
})

