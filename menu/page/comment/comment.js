// pages/evaluation/evaluation.js
Page({
  data: {
    rate:{},
    noteMaxLen: 100, // 最多放多少字
    info: "",
    noteNowLen: 0,//备注当前字数
    how:"",
    infos:{},
    goods:{},
    orderData:{},
  },
  _rate:{},
  _infos:{},
  // 监听字数
  bindTextAreaChange: function (e) {
    var that = this
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > that.data.noteMaxLen)
      return;
    that._infos['' + e.currentTarget.dataset.id] = { info: value, noteNowLen: len }
    that.setData({ infos:that._infos })

  },
  // 提交清空当前值
  bindSubmit: function () {
    var that = this;
    wx.showToast({
      title: '发布成功',
      icon: 'success',
      duration: 1500,
      mask: false,
      success: function () {
        that.setData({ info: '', noteNowLen: 0, flag: 0 })
      }
    })
  },
  changeColor1: function (e) {
    var that = this;
    that._rate[e.currentTarget.dataset.id]=1;
    that.setData({
      rate:that._rate
    });
  },
  changeColor2: function (e) {
    var that = this;
    that._rate[e.currentTarget.dataset.id] = 2;
    that.setData({
      rate: that._rate
    });
  },
  changeColor3: function (e) {
    var that = this;
    that._rate[e.currentTarget.dataset.id] = 3;
    that.setData({
      rate: that._rate
    });
  },
  changeColor4: function (e) {
    var that = this;
    that._rate[e.currentTarget.dataset.id] = 4;
    that.setData({
      rate: that._rate
    });
  },
  changeColor5: function (e) {
    var that = this;
    that._rate[e.currentTarget.dataset.id] = 5;
    that.setData({
      rate: that._rate
    });
  },
  onLoad:function(e){
    var that=this;
    console.log(e);
    var obj=JSON.parse(e.order);
    var temp={};
    //去重，口味不同分量不同的同一菜色
    for(var i=0;i<obj.goods.length;i++){
      temp[obj.goods[i].id]=obj.goods[i]
    }
    that.setData({
      goods:temp,
      orderData:obj
    });
  }
})