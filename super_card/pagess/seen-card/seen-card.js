// super_card/pages/seen-card/seen-card.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lookList: [],
    show_search: false,
    search_key: '', 
    page: 1,
    lastPage: false,
    oldlookList:[],
    oldpage:'',
    oldlastPage:'',

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

  //设置搜索关键字开始搜索
  setSearchKey: function (e) {
    var that = this
    var key = e.detail.value
    that.setData({ search_key: key})
    this.mineLookCard()
    that.setData({ lastPage: false , page:1 })
  },

  // //切换搜索状态
  toggleSearchInput: function (e) {
    var that = this
    if (this.data.show_search) {
      that.setData({ show_search: false, search_key: '', lookList: this.data.oldlookList, page: this.data.oldpage, lastPage: this.data.oldlastPage})
    } else {
      that.setData({ oldlookList: this.data.lookList, oldpage: this.data.page, oldlastPage: this.data.lastPage})
      that.setData({ show_search: true })
    }
  },
  
  //查询我看过的名片
  mineLookCard: function (callback = false){
    var that = this
    app.util.request({
      'url':'entry/wxapp/getLookSeen',
      'method':'post',
      'data':{'search_key':that.data.search_key},
      success(res) {
        typeof callback === `function` && callback()
        console.log(res)
        that.setData({
          lookList:res.data.data,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    this.mineLookCard()
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
    this.data.lastPage = false
    this.mineLookCard(function () {
      wx.stopPullDownRefresh()
    })
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
    app.util.request({
      'url': 'entry/wxapp/getLookSeen',
      'method': 'POST',
      'data': { 'search_key': that.data.search_key, page: that.data.page},
      success(res) {
        wx.hideLoading();
        console.log(res)

        if(res.data.data.length < 1){
           that.data.lastPage = true
           return 
        }
        // 这一步实现了上拉加载更多
        for(var x in res.data.data) 
          that.data.lookList.push(res.data.data[x])

        console.log(that.data.lookList)
        that.setData({
          lookList: that.data.lookList,
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // }
})