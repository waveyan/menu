// page/detail/detail.js
Page({
  data: {},
onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo: userInfo,
        name: userInfo.nickName
      })
    })
  },
onShow:function(){
    var _this = this;
    wx.getStorage({
        key: 'introduction',
        success: function(res) {
            _this.setData({
                introduction: res.data
            })
        }
      })
    wx.getStorage({
        key: 'name',
        success: function(res) {
            _this.setData({
                name: res.data 
            })
        },
        fail: function() {
            _this.setData({
                name: _this.data.userInfo.nickName
            })
        }
      })
    }
  })