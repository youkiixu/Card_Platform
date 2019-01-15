// super_card/pages/dynamic-details/dynamic-details.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    card_id : 0,
    dy_index: 0,

    dynamic:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    if (!options.card_id) {
      wx.navigateBack()
      return false
    }
    that.setData({ card_id: options.card_id, dy_index: options.dy_index })
    
    var pages = getCurrentPages();
    that.data.prevPage = pages[pages.length - 2]; // 上一级页
    
    that.setData({
      dynamic: that.data.prevPage.data.dyList[that.data.dy_index]
         })

    app.config.cardTrack(that.data.card_id, 7, 'view', that.data.dynamic.id)
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
  onShareAppMessage: function () {
    
    var title = this.data.dynamic.content.substr(0, 20)
    var path = '/super_card/pages/overt/overt?card_id=' + this.data.card_id + '&from_act=other'
    var imgUrl = ''

    app.config.cardTrack(this.data.card_id, 4, 'praise')

    return {
      title: title,
      path: path,
      imageUrl: imgUrl
    }

  }
})