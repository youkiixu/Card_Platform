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
    //为了能重新调起授权--新加代码start 此处表示点击了授权登录就返回当前页面，而之前的授权方法是一进页面就加载授权了，所以要重新调起授权才能保证分享页面改的授权方法的正确调起
    app.util.getUserInfo(function (response) {
      if (that.data.toPage !== false) {
        wx.reLaunch({ url: that.data.toPage })
      } else{
        wx.reLaunch({ url: "/super_card/pages/index/index" })
      }
    },true);  
    //为了能重新调起授权--新加代码end
  }

})