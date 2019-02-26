// super_card/pages/card-book/view-video.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',

    showVideo: false,
    videoSrc: '',

    muted: false,
    VqqId:0,
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (options.url){
      this.setData({
         videoSrc: decodeURIComponent(options.url) 
         })
    }

    //判断腾讯视频
    var linkReg = /v.qq.com\/x\/page/
    if (linkReg.test(this.data.videoSrc)) {
      var temp = this.data.videoSrc.match(/page\/(.*)\.html/)
      this.setData({ VqqId: temp[1] })
    }

  },

  //切换静音开关
  toggleMuted: function () {

    this.data.muted ? this.setData({ muted: false }) : this.setData({ muted: true })

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

})