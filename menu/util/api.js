// 服务器接口地址

wx.request({
  url: 'https://www.xxy1978.com/api/',
  data: '',
  header: {},
  method: '',
  dataType: '',
  success: function(res) {},
  fail: function(res) {},
  complete: function(res) {},
})

const getLogin = (params) => {
  wxRequest(params, `${apiURl}/customLogin.php`);
}


/* 导出全局方法提供给别的页面进行使用 */
module.exports = {
    getLogin
}
getLogin({"name":baolujia})