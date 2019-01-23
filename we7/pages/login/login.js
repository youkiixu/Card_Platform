// we7/pages/login/login.js
var app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    toPage: false,
  },
  onLoad: function (options) {

    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#49b82d',
    })
    wx.setNavigationBarTitle({
      title: '授权登录'
    })

    var that = this
    if (typeof options.path !== 'undefined') that.setData({ toPage: '/' + decodeURIComponent(options.path) })
    //查看是否授权
    wx.getSetting({
      success: function (res) {
        console.log('res.authSetting',res.authSetting['scope.userInfo'])
        console.log('res.', res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          if(that.data.toPage !== false)
            wx.reLaunch({ url: that.data.toPage })
          else
            wx.reLaunch({ url: "/super_card/pages/index/index" })
        }
      }
    })

  },
  bindGetUserInfo: function (e) {
    var that = this
    if (that.data.toPage !== false){
      wx.reLaunch({ url: that.data.toPage })
    }else
      wx.reLaunch({ url: "/super_card/pages/index/index" })

    console.log(e)
    console.log('jkg',e)
  }

})