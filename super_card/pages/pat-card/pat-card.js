// super_card/pages/pat-card/pat-card.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  //识别纸质名片
  identifyCard: function (e) {
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }
    wx.redirectTo({
      url: './camera-card',
    })
    

  },

  getPaiPic: function () {
    var that = this
    wx.request({
      url: app.util.url('entry/wxapp/getFrontPics'),
      data: {
        page: 'pai',
      },
      success: function (res) {
        console.log(res)
        var data = res.data.data
        that.setData({ paiPic: data })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPaiPic()
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