Page({  
    data: {  
      type1:'取号',
      type2:'收藏',
      imgUrls: [  
        '../img/Store_photos.png',  
        '../img/Store_photos.png',    
        '../img/Store_photos.png'
      ],  
      indicatorDots: true,  
      autoplay: true,  
      interval: 5000,  
      duration: 1000,  

      latitude:'',
      longitude:''
     
  }, 


  
    ditu:function(){
      wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
      var latitude = res.latitude
      var longitude = res.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28
        })
      }
    })
  },
   toggle1:function(){
    var that = this;
    console.log("1")
    var type1=that.data.type1==='取号'?'已取号':'取号';
    that.setData({
      type1:type1
    })
  },
  toggle2:function(){
    var that = this;
    console.log("2")
    var type2=that.data.type2==='收藏'?'已收藏':'收藏';
    that.setData({
      type2:type2
    })
  },
  
 onLoad: function (options) {
　　console.log('onLoad')

   var that=this;
   var markers;
   var covers ;
    wx.getLocation({
      type: 'gcj02',
      scale: 18,
      success: function(res) {
        markers = [{ 
          latitude:res.latitude, 
          longitude:res.longitude, 
          iconPath: '../res/images/car.png',
        }],
        covers = [{ 
          latitude:res.latitude, 
          longitude:res.longitude, 
          iconPath: '../res/images/car.png', 
        }] ,
        that.setData({
          latitude:res.latitude,
          longitude:res.longitude,
          markers: markers, 
          covers: covers, 
          scale: 50,
          accuracy:50
        })
      }
    })
  }
})