Page({
  data: {
    contentFlag1: true,
    data: [{
      title: 'xxx',
      flag: true,
      content: 'xxx'
    },
    {
      title: 'x',
      flag: true,
      content: 'xxx'
    },
    {
      title: 'x',
      flag: true,
      content: 'xxx。x'
    },
    {
      title: 'xx',
      flag: true,
      content: 'xx'
    },
    {
      title: 'xx',
      flag: true,
      content: 'xxxx'
    },
    {
      title: '不在服务区可以下单吗？',
      flag: true,
      content: '可以的。加速度提供寄修服务，请联系客服获取邮寄地址。'
    },
    {
      title: 'xxxx',
      flag: true,
      content: 'xxxx'
    },]
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载

  },
  taggle: function (event) {
    var index = event.target.dataset.index;
    var data = this.data.data;
    for (var i = 0; i < data.length; i++) {
      if(index == i){
        data[i].flag = !data[i].flag;
      }
    }
    this.setData({
      data: data
    })
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示

  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: '', // 分享标题
      desc: '', // 分享描述
      path: '' // 分享路径
    }
  }
})