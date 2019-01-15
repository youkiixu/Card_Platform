// super_card/pages/group-fit/group-fit.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    group:{},
    groupTypes: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.group_id < 1) wx.navigateBack()
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; // 上一级页
    var group = prevPage.data.group

    this.setData({ group: group })

    this.getGroupType()

  },

  //获取名片组类型
  getGroupType: function () {
    var that = this
    app.util.request({
      'url': 'entry/wxapp/getGroupType',
      'method': 'POST',
      success(res) {

        //console.log(res)
        that.data.groupTypes = res.data.data
        that.setData({ groupTypes: that.data.groupTypes })

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
  
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // }
})