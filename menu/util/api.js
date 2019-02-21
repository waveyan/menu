// data:dict,method:POST/GET,head:dict,dst:xxx/xxx/
function login(data) {
  var apiPath = "http://127.0.0.1:8081/wxOrder/";
  wx.login({
    success(res) {
      if (res.code) {
        data.code = res.code;
        wx.request({
          method: "POST",
          url: apiPath + 'userapi/login',
          data: data,
          success(res) {
            var data = res.data;
            var accessToken = JSON.parse(data.data).accessToken;
            console.log(accessToken + '重新登陆')
            wx.setStorage({
              key: 'accessToken',
              data: accessToken,
            });
          }
        })
      } else {
        console.log('登录失败！' + res.errMsg)
      }
    }
  })
}

//后台登陆
function backendLogin(data) {
  wx.checkSession({
    success() {
      // session_key 未过期，并且在本生命周期一直有效
      console.log("未过期" + data.accessToken);
      if (!data.accessToken)
        login(data)
    },
    fail() {
      // session_key 已经失效，需要重新执行登录流程
     login(data)
    }
  })
}
module.exports = {
  backendLogin: backendLogin
}