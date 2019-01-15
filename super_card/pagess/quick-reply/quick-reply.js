// super_card/pagess/quick-reply/quick-reply.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    card_id: 0,
    list:[],
    length:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (typeof options.card_id == 'undefined' || options.card_id < 1)
    {
      wx.navigateBack()
      return
    }
    this.setData({ card_id: options.card_id })
    this.getQuickReply()
  },

  savePage: function (){
    wx.navigateBack({
      
    })
  },

  getQuickReply: function (callback){
    var that = this
    app.util.request({
      'url': 'entry/wxapp/getQuickReply',
      'method': 'post',
      'data': { card_id: that.data.card_id },
      success(res) {
        typeof callback === `function` && callback()
        var data = res.data.data
        that.setData({  list :data, length: data.length })
      }
    })
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
    this.getQuickReply(function () {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})