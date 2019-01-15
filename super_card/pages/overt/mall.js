// super_card/pages/mall/mall.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    card_id: 0,

    storeInfo : {},
    goodsList: [],

    page: 1,
    lastPage: false,

    prevPage: false,
    preview: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    if (typeof options.card_id != 'undefined') {
      
        that.setData({ card_id: options.card_id })
        app.util.footer(that, that.data.card_id);

        app.config.cardTrack(that.data.card_id, 1, 'view')

        app.util.request({
          'url': 'entry/wxapp/getCardStore',
          'method': 'post',
          'data': { card_id: that.data.card_id },
          success(res) {

            var data = res.data.data

            that.setData({ storeInfo: data.store, goodsList: data.goods })
            console.log(that.data.goodsList)
            wx.setNavigationBarTitle({
              title: that.data.storeInfo.store_name + ' - ' + app.config.getConf('app_name')
            })

          }
        })

    }else{

      var pages = getCurrentPages();
      that.data.prevPage = pages[pages.length - 2]; // 上一级页
      var data = that.data.prevPage.data

      var store = {
        store_name: data.store_name,
        store_logo: data.store_logo,
        store_introduce: data.store_introduce,
        add_date: data.add_date,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        store_business: data.store_business,
        store_contact: data.store_contact,
        store_owner: data.store_owner,
        store_banner: data.store_banner ? data.store_banner : [],
       
      }

      that.setData({ storeInfo: store, goodsList: data.goods, card: data.card, preview: true })
      wx.hideShareMenu()
    }

  },

  getCardGoods: function (callback = false, mode = 'cover') {

    var that = this
    app.util.request({
      'url': 'entry/wxapp/getCardGoods',
      'method': 'post',
      'data': { card_id: that.data.card_id, page: that.data.page },
      success(res) {

        typeof callback === `function` && callback()
        var data = res.data.data

        if (mode == 'append') {
          if (!res.data.data.length) {
            that.data.lastPage = true
            return false
          }
          that.data.goodsList = that.data.goodsList.concat(res.data.data)
        } else {
          that.data.goodsList = res.data.data
        }

        that.setData({
          goodsList: that.data.goodsList,
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

    var that = this
    if(that.data.preview === false){
      that.data.page = 1
      that.data.lastPage = false
      that.getCardGoods(function () {
        wx.stopPullDownRefresh()
      })
    }else{
      wx.stopPullDownRefresh()
    }
   
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    var that = this
    if (that.data.preview === false) {
      if (that.data.lastPage === true) return false
      that.data.page++
      that.getCardGoods('', 'append')
    }

  },

  backCard:function (e){
  
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }

    wx.redirectTo({
      url: '/super_card/pages/overt/overt?card_id=' + this.data.card_id + '&from_act=other',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    var title = '欢迎查看 "' + this.data.storeInfo.store_name + '" 的名片商城'
    var path = '/super_card/pages/overt/overt?card_id=' + this.data.card_id + '&from_act=other'
    var imgUrl = ''
    app.config.cardTrack(this.data.card_id, 4, 'praise')

    return {
      title: title,
      path: path,
      imageUrl: imgUrl
    }

  }


})