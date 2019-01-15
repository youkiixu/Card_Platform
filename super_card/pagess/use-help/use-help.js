// super_card/pages/use-help/use-help.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
  },

  //查看具体内容
  showcontent:function(event){
    var that =this
    var cos = "list[" + event.currentTarget.dataset.replyType + "].show"
    if (that.data.list[event.currentTarget.dataset.replyType].show == 1) {
      that.setData({ [cos]: 2 })
    } else {
      that.setData({ [cos]: 1 })
    }
  },

  showPic: function (e){
    var that = this
    var pindex =  e.target.dataset.pindex
    var index = e.target.dataset.index
    
    var pics = that.data.list[index].pics
    wx.previewImage({
      current: pics[pindex],
      urls: pics,
    })

  },

  //获取使用帮助信息
  getHelpInfo:function(){
    var that = this
    app.util.request({
      'url': 'entry/wxapp/getUseHelp',
      success(res) {
        console.log(res.data.data)
        that.setData({ list: res.data.data })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHelpInfo()
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
  onShareAppMessage: function () {

  }
})