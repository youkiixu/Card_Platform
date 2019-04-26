// super_card/pages/secret-fit/secret-fit.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      card_id: 0,
      public: 0,
      forwarding: 0,

      libShowCollected: 0,


      is_relation:0,
  },

  saveCardSecret: function (){
  
    var that = this
    var data = {
      card_id: that.data.card_id,
      public: that.data.public,
      forwarding: that.data.forwarding,
    }

    app.util.request({
      'url': 'entry/wxapp/saveCardSecret',
      //'cachetime': '30',
      'data': data,
      success(res) {

        app.freshIndex = true
        console.log(res)

        wx.showToast({
          title: res.data.message,
          icon: 'success',
          duration: 2000
        })

        setTimeout(function () {

          wx.navigateBack()

          /*var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2]; // 上一级页
          var cardLists = prevPage.data.cardLists
          for (var x in cardLists) {

            if (cardLists[x].id == that.data.card_id)
              cardLists[x] = res.data.data

          }
          //console.log(cardLists)
          prevPage.setData({
            card_id: that.data.card_id,
            cardLists: cardLists,
          });*/


        }, 2000);

      }
    })
  },

  publicChange: function (e){
     this.setData({ public : e.detail.value})
  },

  forwardingChange: function (e){
     this.setData({ forwarding: e.detail.value })
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

      var data = {
                card_id: that.data.card_id,
              }

      
      app.util.request({
        'url': 'entry/wxapp/getCardSecret',
        //'cachetime': '30',
        'data': data,
        success(res) {
          //console.log(res)
          var res = res.data.data
         
          that.setData({
            public: res.public,
            forwarding: res.forwarding,
            is_relation: res.is_relation,
            libShowCollected: app.config.getConf('library_show_collected'),
          })
        }
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