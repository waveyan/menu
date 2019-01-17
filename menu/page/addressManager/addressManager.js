Page({
  data: {
    addressData: [{
        trueName: 'xxxx1',
        mobPhone: '13xxxxxxxxxxxxxxxxx',
        areaInfo: '广东省',
        address: '四会市东海明珠豪庭',
        addressId: 1
      },
      {
        addressId: 2,
        trueName: 'xxxx2',
        mobPhone: '13xxxxxxxxxxxxxxxxx',
        areaInfo: '广东省',
        address: '四会市东海明珠豪庭'
      },
      {
        addressId: 3,
        trueName: 'xxxx3',
        mobPhone: '13xxxxxxxxxxxxxxxxx',
        areaInfo: '广东省',
        address: '四会市东海明珠豪庭'
      },
      {
        addressId: 4,
        trueName: 'xxxx4',
        mobPhone: '13xxxxxxxxxxxxxxxxx',
        areaInfo: '广东省',
        address: '四会市东海明珠豪庭'
      },
    ],
  },
  addressClick: function(e) {
    var that = this;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      addressInfo: e.currentTarget.dataset.item,
    });
    wx.navigateBack({
      delta: 1
    })
  },
  addrEdit: function(e) {
    wx.navigateTo({
      url: '../addressAdd/addressAdd?addressId=' + e.currentTarget.dataset.id,
    })
  },
  addrDelete: function(e) {
    wx.showModal({
      title: '提示',
      content: '是否删除该地址？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  addressAdd: function() {
    wx.navigateTo({
      url: '../addressAdd/addressAdd',
    })
  },
  onLoad: function(options) {},
  onReady: function() {
    // Do something when page ready.
  },
  onShow: function() {
    var that = this;
  },
})