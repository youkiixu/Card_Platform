// super_card/pages/album/album.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      card_id: 0,
      albums: [],

      isFresh : false,
  },

  /**
   * 跳转至新建相册页面
   */
  toCreateAlbum: function (e){
    var that = this
    app.util.request({
      'url': 'entry/wxapp/isCanCreateAlbum',
      'method': 'post',
      'data': {card_id : that.data.card_id},
      success(res) {
        //console.log(res)
        if (res.data.message === 'ok') {
          wx.navigateTo({
            url: '../album-edit/album-edit?card_id=' + that.data.card_id + '&album_id=0'
          })
        } else {

          var uInfo = res.data.data
          console.log(uInfo)
          wx.navigateTo({
            url: '../../pagess/payment/payment-album?umoney=' + uInfo.money + '&album_payed_times=' + uInfo.album_payed_times + '&albumnum=' + that.data.albums.length + '&card_id=' + that.data.card_id
          })

        }
        return
      }
    })
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    if (options.card_id > 0) {

      that.setData({
        card_id: options.card_id,
      });
      
      that.freshAlbumList()
     

    }    
  },

  freshAlbumList: function (cb){
    var that = this
    app.util.request({
      'url': 'entry/wxapp/getCardAlbums',
      //'cachetime': '30',
      'method': 'POST',
      'data': { 'card_id': that.data.card_id },
      success(res) {
        
        if(that.data.isFresh === true) app.freshIndex = true

        typeof cb == "function" && cb()
        var albums = res.data.data
        that.setData({ albums: albums, isFresh: false })

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
    if(this.data.isFresh === true) this.freshAlbumList()
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
    this.freshAlbumList(function (){

      wx.stopPullDownRefresh()

    })
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