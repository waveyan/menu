//index.js
//获取应用实例
var app = getApp()
Page({
  data:{
      btn: "",
      disabled: true,
      modalHidden: true,
    },
   modalTap: function(e) {
    this.setData({
      modalHidden: false
    })
  },
  modalChange: function(e) {
    this.setData({
      modalHidden: true
    })
  },
   bindTextAreaBlur: function(e){
      if(e.detail.value != ""){
            this.setData({
                btn: "save",
                introduction: e.detail.value,
                disabled: false
             })
      }else{
            this.setData({
                btn: "",
                disabled: true
             })
      }
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
