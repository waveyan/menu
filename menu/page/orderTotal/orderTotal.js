var util = require('../../util/util.js')
var api=require('../../util/api.js')
Page({
  data: {
    navTab: ["进行中", "已完成"],
    currentNavtab: 0,
    ordersList: null,
    list:null,
  },
  onShow:function(){
    var that=this;
    that.getMyOrders();
    console.log(that.data.ordersList)
  },
  //切换tab刷新数据
  switchTab: function(o) {
    var that = this;
    var idx = o.currentTarget.dataset.idx;
    if (idx !== that.data.currentNavtab) {
      that.setData({
        currentNavtab: idx,
        list: that.data.ordersList[idx], //数据源清空
      })
    }
  },
  //获取我的订单
  getMyOrders:function(){
    var that=this;
    wx.request({
      url: api.apiPath+'/userapi/getMyOrders',
      header:{'access-token':api.getAccessToken()},
      data:{'page':1,'start':0,'limit':1000},
      method:'POST',
      success(res){
        var data=res.data;
        console.log(data);
        if(data.code==0){
        that.setData({
          list:data.data[that.data.currentNavtab],
          ordersList:data.data,
        });
        }
      }
    })

  },
  goToComment:function(e){
    wx.navigateTo({
      url: '../comment/comment?order=' + e.currentTarget.dataset.order,
    })
  }

})