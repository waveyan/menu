var util = require('../../util/util.js')
// var request = require('../../utils/https.js')
var uri = 'orderapi/orderlist'
Page({
  data: {
    navTab: ["全部订单", "进行中", "已完成"],
    currentNavtab: 0,
    pageNo: 1,
    hidden: false,
    list: [],
    newlist: [],
    tips: '', //无数据
    newlist: [{
        state: '进行中',
        orderTotalPrice: 200,
        button: '查看',
        goodsImage: 'http://img1.gtimg.com/health/pics/hv1/138/79/2068/134491983.jpg',
        goodsName: '牛肉',
        goodsNum: 1
      }, 
      {
        state: '进行中',
        orderTotalPrice: 200,
        button: '查看',
        goodsImage: 'http://img1.gtimg.com/health/pics/hv1/138/79/2068/134491983.jpg',
        goodsName: '牛肉',
        goodsNum: 1
      }
    ]
  },
  onLoad: function(options) {
    this.setData({
      currentNavtab: options.id
    })
    //刷新数据
    this.getData();
  },
  //切换tab刷新数据
  switchTab: function(o) {
    var that = this;
    var idx = o.currentTarget.dataset.idx;
    if (idx !== that.data.currentNavtab) {
      that.setData({
        currentNavtab: idx,
        list: [], //数据源清空
        newlist: [],
        pageNo: 1
      })
      //刷新数据
      that.getData();
    }
  },
  getData: function() {
    var that = this;
  },
  //点击到相应的页面
  orderbutton: function(options) {
    // var type = options.currentTarget.dataset.button;
    // console.log(type)
    // if (type == "去支付") {

    // } else if (type == "查看详情") {

    // } else if (type == "确认收货") {

    // }
  },

  //下滑加载更多
  lower: function() {
    console.log("下滑啦");
    var that = this;
    that.setData({
      pageNo: that.data.pageNo + 1
    })
    that.getData();
  },

})