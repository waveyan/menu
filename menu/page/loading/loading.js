const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 获取用户信息接口后的处理逻辑
   */
  getUserInfo: function (e) {
    // 将获取的用户信息赋值给全局 userInfo 变量，再跳回之前页
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo;
      if(app.globalData.deskNum)
        wx.switchTab({
          url: '/page/category/category'
        })
      else
        wx.switchTab({
          url: '/page/index/index'
        })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 在没有 open-type=getUserInfo 版本的兼容处理
    if (!this.data.canIUse) {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
        }
      })
    }

  }
})