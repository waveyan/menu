Page({
  data: {
    navTab: ["可使用",'即将到期', "已过期"],
    currentNavtab: 0,
  },
  onLoad: function(options) {},
  onShow: function() {},
  //切换tab刷新数据
  switchTab: function(o) {
    var that = this;
    var idx = o.currentTarget.dataset.idx;
    console.log(idx)
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
})