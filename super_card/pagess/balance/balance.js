// super_card/pages/balance/balance.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: 0.00,
    account_list: [],
    provideMethod: { visible: false, animateCss: 'wux-animate--fade-out' },

    account_intro: '',
    page: 1,
    lastPage: false,
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
  
  //问号
  //显示/隐藏
  CardPicker: function () {
    this.data.provideMethod = this.data.provideMethod.visible === true ? { visible: false, animateCss: 'wux-animate--fade-out' } : { visible: true, animateCss: 'wux-animate--fade-in' }
    this.setData({ provideMethod: this.data.provideMethod })
  },
  cancelSelect: function () {
    this.CardPicker()
  },
  openCardSelect: function () {
    this.CardPicker()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; // 上一级页
    //console.log(prevPage.data)
    this.setData({ money: prevPage.data.uInfo.money, account_intro: app.config.getConf('account_intro')})

    var that = this
    app.util.request({
      'url': 'entry/wxapp/getAccountLog',
      success(res) {
        console.log(res)
        var data = res.data.data
        /*for(var x in data){
          data[x].change_desc = data[x].change_desc.substr(0, 12)
          //var unixTimestamp = new Date(data[x].create_time * 1000);
          // data[x].create_time = unixTimestamp.toLocaleString()
        }*/
        that.setData({ account_list:  data})
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
      'url': 'entry/wxapp/getAccountLog',
      'data': { 'page': that.data.page },
      success(res) {
        //console.log(res)
        if (res.data.data.length > 1) {


          console.log(res)
          var data = res.data.data
          for (var x in data) {
            data[x].change_desc = data[x].change_desc.substr(0, 12)
            that.data.account_list.push(data[x])
          }
          that.setData({ account_list: that.data.account_list })


        } else {

          that.data.lastPage = true

        }
        // 隐藏加载框  
        wx.hideLoading();

      }

    })

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // }
})
