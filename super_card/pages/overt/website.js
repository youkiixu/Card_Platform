// super_card/pages/website/website.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    card_id: 0,
    website:{},
    card:{},

    prevPage: false,
    preview: false,
  },

  showPic:function (e){
    console.log(e)
    var pic = e.target.dataset.pic
    if (typeof pic == 'string')
      wx.previewImage({
        current: pic,
        urls: [pic],
        success: function (res) { },
      })
    else
      wx.previewImage({
        current: pic[0],
        urls: pic,
        success: function(res) {},
      })
  },

  showPics: function (e) {
    var pics = e.target.dataset.pics
    var index = e.target.dataset.index
    wx.previewImage({
      current: pics[index],
      urls: pics,
      success: function (res) { },
    })
  },

  callMobile: function (){
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.card.mobile,
      complete:function (){
        app.config.cardTrack(that.data.card_id, 2, 'copy')
      }
    })
  },

  copyInfo: function (e){
    //console.log(e)
    var plate = e.target.dataset.plate
    var id = e.target.dataset.id

    wx.setClipboardData({
      data: plate,
      success(res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success'
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options', options)
    var that = this


    if (typeof options.card_id != 'undefined') {

      that.setData({ card_id: options.card_id })
      app.util.footer(that, that.data.card_id);
      that.getWebSite()

    }else{

      var pages = getCurrentPages();
      that.data.prevPage = pages[pages.length - 2]; // 上一级页

      var website = {
        website_name: that.data.prevPage.data.website_name,
        website_logo: that.data.prevPage.data.website_logo,
        company_name: that.data.prevPage.data.company_name,
        contact: that.data.prevPage.data.contact,
        owner: that.data.prevPage.data.owner,
        banner: that.data.prevPage.data.banner,
        data: that.data.prevPage.data.pageData,
      }
      
      that.setData({ website: website, card: that.data.prevPage.data.card, preview: true })
      wx.hideShareMenu()
    }
    
  },

  getWebSite: function (callback = false){
    var that = this
    app.util.request({
      'url': 'entry/wxapp/getCardWebsite',
      'method': 'post',
      'data': { card_id: that.data.card_id },
      success(res) {
        typeof callback === `function` && callback()
        var data = res.data.data
        app.config.cardTrack(that.data.card_id, 6, 'view')
        that.setData({ website: data.website, card:data.card })
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
    if(this.data.preview === false)
      this.getWebSite(function (){
        wx.stopPullDownRefresh()
      })
    else
      wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  backCard: function (e) {

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

    var title = '欢迎查看"' + this.data.website.website_name +'"的名片官网'
    var path = '/super_card/pages/overt/website?card_id=' + this.data.card_id
    var imgUrl = ''

    app.config.cardTrack(this.data.card_id, 4, 'praise')
    return {
      title: title,
      path: path,
      imageUrl: imgUrl
    }

  }
})