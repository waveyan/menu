var api = require("../../util/api.js")
Page({
  data: {
    noteMaxLen: 100, // 最多放多少字
    info: "",
    noteNowLen: 0, //备注当前字数
    how: "",
    //评论，key为dishId
    infos: {},
    //评分，key为dishId
    rate: {},
    //去重后的goods
    goods: {},
    //商品数
    goodsNum: 0,
    orderData: {},
  },
  _rate: {},
  _infos: {},
  // 监听字数
  bindTextAreaChange: function(e) {
    var that = this
    console.log(e);
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > that.data.noteMaxLen)
      return;
    that._infos['' + e.currentTarget.dataset.id] = {
      info: value,
      noteNowLen: len
    }
    that.setData({
      infos: that._infos
    })

  },
  // 提交评论
  bindSubmit: function() {
    var that = this;
    //星星是必填项
    var already = Object.getOwnPropertyNames(that.data.rate).length;
    if (already != that.data.goodsNum) {
      wx.showToast({
        title: '请点击星星为该商品打分！',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
      return;
    }
    var request_data = {}
    request_data['orderId'] = that.data.orderData.id;
    request_data['commentList'] = []
    for (var dishId in that.data.rate) {
      var temp = {}
      temp['dish'] = {
        'id': dishId
      };
      temp['rate'] = that.data.rate[dishId];
      if (that.data.infos[dishId] != null)
        temp['comment'] = that.data.infos[dishId].info;
      else
        temp['comment'] = "该用户暂无评价！"
      temp['order'] = {
        'id': that.data.orderData.id
      };
      request_data['commentList'].push(temp);
    }
    console.log(request_data);
    console.log(that.data.rate);
    //提交
    wx.request({
      url: api.apiPath + '/userapi/saveComment',
      method: "POST",
      data: request_data,
      header: {
        'access-token': api.getAccessToken()
      },
      success(res) {
        var data = res.data;
        if (data.code == 0) {
          wx.showToast({
            title: '发布成功!',
            icon: 'success',
            duration: 1500,
            mask: false,
          });
          //返回上一页,from来自orderTotal返回上一层，来自orderDetail返回上两层
          var delta = 1;
          if (that.data.from != 'orderTotal')
            delta = 2;
          wx.navigateBack({
            delta: delta
          });
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 1500,
            mask: false,
          });
        }
      }
    });
  },
  changeColor1: function(e) {
    var that = this;
    that._rate[e.currentTarget.dataset.id] = 1;
    that.setData({
      rate: that._rate
    });
  },
  changeColor2: function(e) {
    var that = this;
    that._rate[e.currentTarget.dataset.id] = 2;
    that.setData({
      rate: that._rate
    });
  },
  changeColor3: function(e) {
    var that = this;
    that._rate[e.currentTarget.dataset.id] = 3;
    that.setData({
      rate: that._rate
    });
  },
  changeColor4: function(e) {
    var that = this;
    that._rate[e.currentTarget.dataset.id] = 4;
    that.setData({
      rate: that._rate
    });
  },
  changeColor5: function(e) {
    var that = this;
    that._rate[e.currentTarget.dataset.id] = 5;
    that.setData({
      rate: that._rate
    });
  },
  onLoad: function(e) {
    var that = this;
    var obj = JSON.parse(e.order);
    var temp = {};
    //去重，口味不同分量不同的同一菜色
    for (var i = 0; i < obj.goods.length; i++) {
      temp[obj.goods[i].id] = obj.goods[i]
    }
    that.setData({
      goods: temp,
      orderData: obj,
      goodsNum: obj.goods.length,
      from: e.from,
    });
  }
})