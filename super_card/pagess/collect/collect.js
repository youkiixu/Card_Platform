// super_card/pages/collect/collect.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    card_id: 0,
    cardList: [],

    page: 1,
    show_goTop: false,
  },

  // 一键回到顶部
  goTop: function (e) {
    if (wx.pageScrollTo) {
      this.setData({ show_goTop: false })
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    } else {
      wx.showToast({
        title: '暂不支持',
      })
    }
  },

  //监听页面滚动
  onPageScroll: function (e) {
    // Do something when page scroll
    if (this.data.show_goTop === false && e.scrollTop >= 200) this.setData({ show_goTop: true })

    if (this.data.show_goTop === true && e.scrollTop < 200) this.setData({ show_goTop: false })

  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
      if(options.card_id < 1){
        wx.navigateBack()
        return false
      }

      this.setData({ card_id: options.card_id })

      this.getCollectMe()

  },

  getCollectMe: function (cb){

    var that = this
    app.util.request({
      'url': 'entry/wxapp/collectMeList',
      //'cachetime': '30',
      'data': { 'card_id': that.data.card_id, 'page': that.data.page },
      success(res) {

        typeof cb == `function` && cb()

        console.log(res)

        if (res.data.message == 'over'){
          that.data.page = 'over'
          return false
        }

        if (that.data.page > 1) {  
          that.data.cardList.push(res.data.data)
        } else {
          that.data.cardList = res.data.data
        }

        that.setData({
          cardList: that.data.cardList,
        })

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
    
    this.data.page = 1
    this.getCollectMe(function (){

        wx.stopPullDownRefresh()

    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

      if(this.data.page != 'over'){

        this.data.page++
        this.getCollectMe()

      }
     
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // }
})