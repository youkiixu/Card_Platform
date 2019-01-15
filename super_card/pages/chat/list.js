// super_card/pages/cose/cose.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    isFresh: false,
    
    currentX: 0,

    page: 1,
    lastPage:false,
  },

  handleMovableChange:function(e) {
    var that = this
    var di = e.currentTarget.dataset.index
    for (var ind in that.data.list){
      if (ind == di ){
        that.data.list[ind].x = 1
      }else{
        that.data.list[ind].x = 0
      }
    }
    that.data.currentX = e.detail.x;
    console.log(that.data.currentX)
  },
  handleTouchend: function (e) {  
    var cx = e.currentTarget.dataset.index
    if (this.data.currentX < -36) {
      this.data.list[cx].x = -92;
      this.setData({
        list: this.data.list
      });
    } else {
      this.data.list[cx].x = 0;
      this.setData({
        list: this.data.list
      });
    }
  },
  //删除
  handleDeleteProduct:function(e) {
    console.log('删除')
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getChatList()

  },

  getChatListSilence: function (cb) {
    
    this.data.page = 1
    this.data.lastPage = false
    var that = this
    wx.request({
      url: app.util.url('entry/wxapp/getChatList'),
      success: function (res) {
        typeof cb == "function" && cb()
        that.setData({ list: res.data.data })
        that.toPageTop()
      }
    })

  },

  getChatList: function (cb, mode = 'cover'){

    var that = this
    app.util.request({
      'url': 'entry/wxapp/getChatList',
      'data': { page: that.data.page },
      success(res) {
        typeof cb == "function" && cb()
        console.log(res.data.data)

        if (mode == 'append') {
          if (!res.data.data.length) {
            that.data.lastPage = true
            return false
          }
          console.log(res.data.data)
          that.data.list = that.data.list.concat(res.data.data)
          console.log(that.data.list)

        } else {
          that.data.list = res.data.data
        }

        /*for (var ind in res.data.data) {
          res.data.data[ind].x = 0
        }*/
        that.setData({ list: that.data.list })

      }
    })

  },

  toPageTop: function (){
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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

    that.getChatList(function () {

      wx.hideLoading();

    }, 'append')

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    var that = this
    app.config.init(function () {
      app.config.set(that)
    })

    if(that.data.isFresh !== false)
      this.getChatListSilence()
    
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
    this.data.lastPage = false
    var that = this
    this.getChatList(function () {

      wx.stopPullDownRefresh()

    })

  },



})