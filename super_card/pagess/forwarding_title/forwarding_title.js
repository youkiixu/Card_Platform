// super_card/pagess/team/team.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    forwarding_title:'',
    card_id:'',


  },

  recordfollow: function (e) {
    this.data.forwarding_title = e.detail.value
  },

  saveTitle: function (e) {
    var that = this

    if (typeof e.detail.formId != 'undefined') {
      app.formIds.push(e.detail.formId)
    }
    
    var data = {
      card_id: that.data.card_id,
      share_title: that.data.forwarding_title
    }

    app.util.request({
      'url': 'entry/wxapp/setShareTitle',
      //'cachetime': '30',
      'method': 'POST',
      'data': data,
      success(res) {
        wx.showToast({
          title: res.data.message,
          icon: 'success',
          duration: 2000
        })
        app.freshIndex = true
        setTimeout(function () {
          wx.navigateBack()
        }, 2000)

      },fail(res){
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      }

    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({ card_id: options.card_id })

    var that = this

    app.util.request({
      'url': 'entry/wxapp/getShareTitle',
      //'cachetime': '30',
      'method': 'POST',
      'data': { card_id: options.card_id},
      success(res) {
        var share_title = res.data.data.share_title
        that.setData({ forwarding_title: share_title })
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

})