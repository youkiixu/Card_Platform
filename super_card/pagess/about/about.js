// super_card/pages/about/about.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    app_logo: '',
    app_name: '',
    copyright: '',
    app_content:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      app_logo: app.config.getConf('app_logo'),
      app_name: app.config.getConf('app_name'),
      app_content: app.config.getConf('about_us'),
      copyright: app.config.getConf('copyright') 
    })
      console.log(this.data.app_logo)
      console.log(this.data.app_content)

    wx.setNavigationBarTitle({ 
      title: '关于我们' //this.data.app_name
       });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.config.set(this)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // }
})