
Page({
  data:{
    addressData:[],
  },
  addressClick:function(e){
  },
  addrEdit:function(e){
  },
  addrDelete:function(e){
  },
  addressAdd:function(){
    wx.navigateTo({
      url: '../addressAdd/addressAdd',
    })
  },
  onLoad:function(options){
  },
  onReady: function() {
    // Do something when page ready.
  },
  onShow: function() {
    var that = this;
  },
})