// super_card/pages/suggestion/suggestion.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  //保存提交的建议
  proposeSugMinfo: function(e) {

    console.log(e)
    var that = this 
    e.detail.value.content_info = encodeURIComponent(e.detail.value.content_info)
    //console.log(e.detail.value.content_info)

    var data = e.detail.value
    if ( e.detail.value.content_info.length == 0 ) {
      wx.showToast({
        title: '提示：提交内容不能为空',
        icon: 'none',
        duration: 2000
      })
    }else{
      app.util.request({
        'url': 'entry/wxapp/proposeSugMinfo',
        'method': 'POST',
        'data': { 'content_info': e.detail.value.content_info },
        success(res) {
          wx.showToast({
            title: res.data.message,
            icon: 'success',
            duration: 2000
          })

          setTimeout(function () {
            wx.navigateBack()
          }, 2000);
          
        }
        

      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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