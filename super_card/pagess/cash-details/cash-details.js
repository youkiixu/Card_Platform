// super_card/pagess/cash-details/cash-details.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemChioce:1,
    
    sliderOffset: 0,
    sliderLeft: 2.5,

    list: false,
    page: 1,
    lastPage: false,
  },

  // 级别选择
  goChangeTeam: function (event) {
    var cic = event.currentTarget.dataset.replyType
    var that = this
    if (cic == that.data.itemChioce) {
      return
    } else {
      that.setData({ itemChioce: cic })
      console.log(cic)
      if (that.data.itemChioce == 1) {
        that.setData({
          sliderOffset: 0,
          sliderLeft: 2.5,
        });
      }
      if (that.data.itemChioce == 2) {
        that.setData({
          sliderOffset: 19,
          sliderLeft: 2.5,
        });
      }
      if (that.data.itemChioce == 3) {
        that.setData({
          sliderOffset: 38,
          sliderLeft: 2.5,
        });
      }
      if (that.data.itemChioce == 4) {
        that.setData({
          sliderOffset: 57,
          sliderLeft: 2.5,
        });
      }
      if (that.data.itemChioce == 5) {
        that.setData({
          sliderOffset: 76,
          sliderLeft: 2.5,
        });
      }

      that.data.page = 1
      that.data.lastPage = false
      this.getWithdrawalLog()

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getWithdrawalLog()

  },

  getWithdrawalLog: function (cb, mode = 'cover') {
    var that = this
    var data = that.data.itemChioce == 1 ? {page: that.data.page } : { page: that.data.page, status: (that.data.itemChioce - 2) }
    app.util.request({
      'url': 'entry/wxapp/getAgentWithdrawal',
      'data': data,
      success(res) {
        typeof cb == "function" && cb()

        if (mode == 'append') {
          if (!res.data.data.length) {
            that.data.lastPage = true
            return false
          }
          that.data.list = that.data.list.concat(res.data.data)

        } else {
          that.data.list = res.data.data
        }

        that.setData({ list: that.data.list })

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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
  onPullDownRefresh: function () {

    this.data.page = 1
    this.data.lastPage = false
    var that = this
    this.getWithdrawalLog(function () {

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

    that.getWithdrawalLog(function () {

      wx.hideLoading();

    }, 'append')

  },

  
})