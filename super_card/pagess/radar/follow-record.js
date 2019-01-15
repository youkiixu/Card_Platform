// super_card/pages/follow-record/follow-record.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    length:0,
    max:200,
    dis:false,

    client_id: 0,
    info: '',
  },

  length:function(e) {
    var that = this
    var value = e.detail.value; //输入的内容
    var len = parseInt(value.length);
    if ( len > 0 ){
      that.setData({ dis: false })
    }else{
      that.setData({ dis: true })
    }
    if (len > that.data.max) return;
    that.setData({
      length: len
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (typeof options.client_id == 'undefined' || options.client_id < 1)
      wx.navigateBack()

    var pages = getCurrentPages();
    that.data.prevPage = pages[pages.length - 2]; // 上一级页

    that.data.client_id = that.data.prevPage.data.client_id

  },

  recordfollow: function (e){
    console.log(e)
    this.data.info = e.detail.value
  },

  recordCardClient: function () {

    var that = this

    if(!that.data.info) return

    that.setData({ dis: true })
    app.util.request({
      'url': 'entry/wxapp/recordCardClient',
      'data': { client_id: that.data.client_id, info: that.data.info },
      success(res) {

        //that.setData({ dis: false })
        //that.data.prevPage.setData({ 'client_info.f': that.data.type, 'client_info.status': that.data.status })
        wx.navigateBack()

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

  }
})