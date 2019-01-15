// super_card/pages/report/report.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sign_in_bouns: 0,
    cardNum : 0,
  },


  //签到
  signIn: function (e){
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }
    if(this.data.cardNum < 1){
        wx.showModal({
          title: '系统提示',
          content: '您还没有创建名片，只有创建名片后才可以签到哦',
          showCancel: false,
          confirmColor: '#f90',
          confirmText: '去创建',
          success: function (res) {
            wx.redirectTo({
              url: '../../pages/basic/basic',
            })
          }
        });
        return false
    }

    app.util.request({
      'url': 'entry/wxapp/userSignIn',
      success(res) {

        app.freshHome = true
        wx.showModal({
          title: '签到提示',
          content: res.data.message,
          showCancel: false,
          confirmColor: '#f90',
          confirmText: '好的',
          success: function (res) {
            wx.navigateBack()
          }
        });

      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    var cardNum = parseInt(prevPage.data.uInfo.card_num)

    this.setData({
      sign_in_bouns: app.config.getConf('sign_in_bouns'),
      cardNum: cardNum
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
  // onShareAppMessage: function () {
  
  // }
})