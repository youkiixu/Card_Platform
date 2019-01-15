// super_card/pages/issue-dynamic/manage-dynamic.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    isFresh: false,
    card_id: 0,

    dyList: [],

    page: 1,
    lastPage: false,

    currentPingId: 0,
    currentPingIndex: 0,

  },
  
  //预览图片
  showDynamicPics: function (e) {
    var that = this
    var pic_id = e.target.dataset.pic_id
    var dl_index = e.target.dataset.index

    wx.previewImage({
      current: this.data.dyList[dl_index].pics[pic_id],
      urls: this.data.dyList[dl_index].pics
    })

  },

  //删除评论的标识
  delThis:function(e,m){
    var currentPingId = e
    var currentPingIndex = m
    this.setData({ currentPingId: currentPingId, currentPingIndex: currentPingIndex })
  },

  //删除动态
  delDynamic:function(e){

    var that = this
    var mic = e.target.dataset.id
    var ind = e.target.dataset.index

    that.delThis(mic,ind)
    // console.log(that.data.currentPingIndex)
    wx.showModal({
      title: '提示',
      content: '确认要删除该动态吗？',
      confirmColor: that.data.themeColor,
      success(res) {
        if (res.confirm) {
          app.util.request({
            'url': 'entry/wxapp/delCardDynamic',
            'method': 'post',
            'data': { id: that.data.currentPingId, card_id: that.data.card_id },
            success(res) {
              console.log(res)
              that.data.dyList.splice(that.data.currentPingIndex, 1)
              that.setData({ dyList: that.data.dyList })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },

  //删除评论
  delComment:function(e){

    var that = this
    var mic = e.target.dataset.id
    var ind = e.target.dataset.index
    var coda = e.target.dataset.coda

    that.data.dyList[ind].comments_data.splice(coda, 1)

    app.util.request({
      'url': 'entry/wxapp/delCardComment',
      'method': 'post',
      'data': { id: mic, comments_data_index: coda },
      success(res) {
        // console.log(res)
        that.setData({ dyList: that.data.dyList })
      }
    })

  },

  getCardDynamic: function (callback = false, mode = 'cover') {

    var that = this
    app.util.request({
      'url': 'entry/wxapp/getDelCardDynamic',
      'method': 'post',
      'data': { card_id: that.data.card_id, page: that.data.page },
      success(res) {
        console.log(res)
        if (that.data.isFresh === true) app.freshIndex = true
        typeof callback === `function` && callback()
        var data = res.data.data

        if (mode == 'append') {
          if (!res.data.data.length) {
            that.data.lastPage = true
            return false
          }
          that.data.dyList = that.data.dyList.concat(res.data.data)
        } else {
          that.data.dyList = res.data.data
        }

        that.setData({
          dyList: that.data.dyList,
          isFresh: false
        })

      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (!options.card_id) {
      return false  
    }
    that.setData({ card_id: options.card_id })
    console.log(that.data.card_id)

    that.getUserInfo()
  },

  getUserInfo: function () {
    var that = this
    app.util.request({
      'url': 'entry/wxapp/getUserInfo',
      success(res) {

        var data = res.data.data
        console.log(data)
        if (data.is_company != 1) {
          wx.showModal({
            title: '系统提示',
            content: '您还没有进行企业认证，暂无编辑权限',
            showCancel: false,
            confirmColor: '#f90',
            confirmText: '去认证',
            success: function (res) {
              wx.redirectTo({
                url: '../../pagess/certify-opt/certify-opt',
              })
            }
          });
          return
        } else {

          that.getCardDynamic();

        }

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
    if (this.data.isFresh === true) this.getCardDynamic()
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
    that.data.page = 1
    that.data.lastPage = false
    that.getCardDynamic(function () {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this

    if (that.data.lastPage === true) return false
    that.data.page++
    that.getCardDynamic('', 'append')
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})