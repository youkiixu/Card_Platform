// super_card/pages/card-category/card-category.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectedNum:0,
    groupNum: 0,

    linkList: [],

    comebacksLen:0,

    link_show_pose: 1,
  },

  //获取回传的名片
  getUserComeback: function () {
    var that = this
    var comebacks = wx.getStorageSync('comebacks')
    that.setData({ comebacksLen: comebacks.length })
    //wx.hideTabBarRedDot({ index: 1 })    
  },


  toHolderPage: function (e) {
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }
    wx.navigateTo({
      url: '../holder/holder',
    })
  },

  toGroupPage: function (e) {
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }
    wx.navigateTo({
      url: '../group/group',
    })
  },

  toChatPage: function (e) {
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }
    wx.navigateTo({
      url: '../chat/list',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    
    that.getBookInfo()
  },

  getBookInfo: function (cb){
    var that = this
    app.util.request({
      'url': 'entry/wxapp/cardBookInfo',
      'method': 'POST',
      success(res) {
        typeof cb == `function` && cb()
        var data = res.data.data
        that.setData({ collectedNum: data.collected_num, groupNum: data.group_num, })
      }
    })


  },

  makeLinkWork: function (e){
    var that = this
    console.log(e)
    var data = e.currentTarget.dataset
    if(!data.type) return
    switch(data.type){
      //跳转其它页面
      case 6:
        that.toOtherPage(data.value)
        break
      //跳转网页
      case 1:
        that.toWebView(data.value)
        break
      //跳转小程序
      case 2:
        that.toNavigateMiniPro(data.value, data.appid)
        break
      //拨打电话
      case 3:
        that.toPhoneCall(data.value)
        break
      //播放视频
      case 5:
        that.toViewVideo(data.value)
        break
      //显示二维码图片
      case 7:
        that.showQrcodePic(data.value)
        break
    }

  },

  showQrcodePic: function (picUrl){

      wx.previewImage({
        current: picUrl,
        urls: [picUrl],
      })

  },

  toPhoneCall: function (phoneNum){
    //仅为示例，并非真实的电话号码
    wx.makePhoneCall({
      phoneNumber: phoneNum 
    })

  },

  toNavigateMiniPro: function (path, appid){

    wx.navigateToMiniProgram({
      appId: appid,
      path: path,
      envVersion: 'release',
      success(res) {
        console.log('打开小程序成功')
      }
    })
  },

  toViewVideo: function(url){
    var that = this
    wx.navigateTo({
      url: './view-video?url=' + encodeURIComponent(url),
    })
  },

  toOtherPage: function (path){
    console.log(path)
    wx.navigateTo({
      url: path,
    })
  },

  toWebView: function (url) {
    wx.navigateTo({
      url: './web-view?url=' + encodeURIComponent(url),
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
    app.config.footer(this)
    app.config.setAd(this)
    this.setData({ link_show_pose: app.config.getConf('link_show_pose'), linkList: app.config.getConf('app_link_list') })
    this.getUserComeback()
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

    this.getBookInfo(function (){
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

 
})