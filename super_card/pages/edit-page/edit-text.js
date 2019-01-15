// super_card/pages/follow-record/follow-record.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    length:0,
    max: -1,
    dis:false,

    info: '',

    index: 0,
    type: '',
    is_edit: false
  },

  length:function(e) {
    var that = this
    var value = e.detail.value; //输入的内容
    var len = parseInt(value.length);
    if ( len > 0 ){
      that.setData({ dis: false })
    }else{
      that.setData({ dis: true })
    }
    if (len > that.data.max) return;
    that.setData({
      length: len
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
   
    if (typeof options.type == 'undefined' || typeof options.index == 'undefined'){
      wx.navigateBack()
      return
    }
    that.data.type = options.type
    that.data.index = options.index

    if(that.data.type == 'title')
      that.setData({max: 20})
 
    var pages = getCurrentPages();
    that.data.prevPage = pages[pages.length - 2]; // 上一级页
    //console.log(options.is_edit)
    if (typeof options.is_edit != 'undefined') {
      that.data.is_edit = options.is_edit
      //console.log(that.data.index)
      var obj = that.data.prevPage.data.pageData[that.data.index]
      //console.log(obj)
      that.setData({ info: obj.val })
    }

  },

  recordfollow: function (e){
    console.log(e)
    this.data.info = e.detail.value
  },

  savePageData:function (e){

    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }


    var that = this

    if(!that.data.info){
      return
    }

    var obj = { type: that.data.type, val: that.data.info}
    console.log(obj)
    if(that.data.is_edit !== false)
      that.data.prevPage.updatePageData(that.data.index, obj)
    else
      that.data.prevPage.addPageData(that.data.index, obj)

    wx.navigateBack()
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