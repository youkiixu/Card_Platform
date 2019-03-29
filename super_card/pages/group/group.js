var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      groups: false,

      isFresh: false,

      app_name: '',
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //app.config.footer(this)
    this.freshCurrPage()

  },

  //返回首页
  backIndex: function (e) {
    wx.switchTab({
      url: '../index/index',
    });
  },


  //刷新当前页
  freshCurrPage: function (cb){

    var that = this
    app.util.request({
      'url': 'entry/wxapp/getCardGroups',
      success(res) {

        typeof cb == "function" && cb()

        //console.log(res)
        var data = res.data.data
     
        for (var x in data) {

          data[x].icons = data[x].card_list.slice(0, 9)

          var len = data[x].icons.length
          if (len < 9)
            for (var i = len; i < 9; i++)
              data[x].icons.push({ picture: 'no' })
        }

        console.log(data)
        that.setData({ groups: data , isFresh: false})

      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({ app_name: app.config.getConf('app_name') })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.config.set(this)
    if (this.data.isFresh === true) this.freshCurrPage()

    app.config.setUserComeback()
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
    
    this.freshCurrPage(function (){

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
   
  // },

  toCreatePage: function () {
    var that = this
    app.util.request({
      'url': 'entry/wxapp/getUserCard',
      'data': { 'no_need_whole': 1 },
      success(res) {

        if (res.data.data.length < 1) {
            wx.showModal({
              title: '系统提示',
              content: '您还没有创建名片，只有创建名片后才可以创建名片组哦',
              showCancel: false,
              confirmColor: that.data.themeColor,
              confirmText: '去创建',
              success: function (res) {
                wx.navigateTo({
                  url: '../basic/basic',
                })
              }
            });
            return false
        }
        var cardLists = res.data.data
        if (cardLists[0].no_perfect == 1) {
          wx.showModal({
            title: '系统提示',
            content: '请先完善您的名片信息',
            showCancel: false,
            confirmColor: that.data.themeColor,
            confirmText: '去完善',
            success: function (res) {
              wx.navigateTo({
                url: '../basic/basic?card_id=' + cardLists[0].id,
              })
            }
          });
          return false
        }

        wx.navigateTo({
          url: '../group-modify/group-modify',
        })

      }
    })
   
  },

})