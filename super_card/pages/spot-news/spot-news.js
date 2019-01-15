// super_card/pages/spot-news/spot-news.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    lastPage: false,

    msgList:[]
  },

  /**
   * 最新消息
   */
  goGetadalert: function (callback = false, mode = 'cover'){
    var that = this
    app.util.request({
      'url': 'entry/wxapp/goGetAdalert',
      'method': 'POST',
      'data': { page: this.data.page },
      success(res) {

        typeof callback === `function` && callback()
        console.log(res)
        
        if (mode == 'append') {
          
          if (!res.data.data.length) {
            that.data.lastPage = true
            return false
          }
          that.data.msgList = that.data.msgList.concat(res.data.data)

        }else{
          that.data.msgList = res.data.data
        }

        that.setData({
          msgList: that.data.msgList
        })

      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.goGetadalert()
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
    var that = this
    app.config.init(function () {
      app.config.set(that)
    })
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
    this.data.page = 1
    this.data.lastPage = false
    this.goGetadalert(function () {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this

    if (that.data.lastPage === true) return false

    wx.showLoading({
      title: '加载中',
    })
    that.data.page++

    that.goGetadalert(function () {

      wx.hideLoading();

    }, 'append')
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // }
})