// super_card/pagess/quick-editor/quick-editor.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    length: 0,
    max: 40,
    info:'',

    prevPage:false,
    card_id: false,
    index: false,
    msg: false,
  },

  //编辑内容
  recordfollow: function (e) {
    var that = this
    var value = e.detail.value;
    var len = parseInt(value.length);

    if (len > that.data.max) return;
    that.setData({ length: len, info: value })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    
    var that = this
    var pages = getCurrentPages();
    that.data.prevPage = pages[pages.length - 2]; // 上一级页
    if (typeof options.index != 'undefined') {
     var msg =  that.data.prevPage.data.list[options.index]
     that.setData({ index:options.index, msg: msg })
    }
    console.log(msg)
    
    that.setData({ card_id: that.data.prevPage.data.card_id })

  },

  saveQuickReplay:function (){
    var that = this
    if(!that.data.info) return
    app.util.request({
      'url': 'entry/wxapp/saveQuickReply',
      'method': 'post',
      'data': { card_id: that.data.card_id, id: (that.data.msg === false ? '' : that.data.msg.id ), msg: that.data.info },
      success(res) {
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        })
        
        if(that.data.index !== false){
          that.data.msg.msg = that.data.info
          that.data.prevPage.data.list[that.data.index] = that.data.msg
        }else{
          var id = res.data.data
          that.data.prevPage.data.list.unshift({id: id, msg: that.data.info})
        }
        that.data.prevPage.setData({ list: that.data.prevPage.data.list })
        setTimeout(function (){
          wx.navigateBack()
        }, 1500)
      }
    })
    
  },

  delQuickReplay: function () {
    var that = this
    app.util.request({
      'url': 'entry/wxapp/delQuickReply',
      'method': 'post',
      'data': { card_id: that.data.card_id, id: that.data.msg.id },
      success(res) {

        wx.showToast({
          title: '删除成功',
          icon: 'success'
        })
        that.data.prevPage.data.list.splice(that.data.index, 1)
        that.data.prevPage.setData({ list: that.data.prevPage.data.list })
        setTimeout(function () {
          wx.navigateBack()
        }, 1500)
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

  
})