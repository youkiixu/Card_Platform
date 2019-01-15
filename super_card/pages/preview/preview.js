// super_card/pages/preview/preview.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      card_id: 0,
      tempBgUrl: '',
      textColor: '',
      name: '',
  },

  //设置背景名称
  setBgName: function (e){

      var name = e.detail.value
      console.log(e)
      console.log(e.detail.value)
      this.setData({ name: name })

  },

  //确认生成自定义名片背景
  confirmCreateBg: function (){

    var that = this

    if(!this.data.name){

      wx.showToast({
        title: '请输入背景名称',
        icon: 'none'
      })
      return false
    }

    app.util.request({
      'url': 'entry/wxapp/createCustomBg',
      'method': 'POST',
      'data': {'card_id': that.data.card_id , 'bg_url' : that.data.tempBgUrl, 'text_color': that.data.textColor,'name': that.data.name},
      success(res) {

        //console.log(res)      
        wx.reLaunch({
          url: '../index/index',
        })

      }
    })


  },

  backModify: function (){

    wx.navigateBack({
      delta: 1,
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (options.card_id > 0 && options.tempBgUrl) {
        
      that.setData({ card_id: options.card_id})
      app.util.request({
        'url': 'entry/wxapp/GetCardItem',
        'cachetime': '30',
        'method': 'POST',
        'data': { 'card_id': that.data.card_id },
        success(res) {
          console.log(res)
          that.setData({ tempBgUrl: options.tempBgUrl, textColor: options.textColor, card: res.data.data })
        }
      })
      

    } else {

      wx.navigateBack({
        delta: 1,
      })

    }

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