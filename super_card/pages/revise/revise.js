// super_card/pages/revise/revise.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    identify_id : 0,
    identify_data: {},
  },

  //修改识别的名片信息
  saveIdentify:function (e){
    console.log(e)
    var that = this
    var values = e.detail.value

    var data = {
      identify_id : that.data.identify_id,
      name: values.name,
      mobile: values.mobile,
      company: values.company,
      title: values.title,
      tel: values.tel,
      address: values.address,
      email: values.email,
      fax: values.fax,
      www: values.www,
    }
    app.util.request({
      'url': 'entry/wxapp/ModifyIdentifyCard',
      'method': 'POST',
      //'cachetime': 30,
      'data': data,
      success(res) {
        if(res.data.data) app.freshHolder = true

        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; // 上一级页
        prevPage.setData({ isFresh: true })

        console.log(res)

        wx.showToast({
          title: res.data.message,
          icon: 'success',
          duration: 2000
        })
        setTimeout(function () {
          wx.navigateBack()
        }, 2000)

      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({ identify_id: options.identify_id })

    app.util.request({
      'url': 'entry/wxapp/getIdentifyCard',
      'method': 'POST',
      //'cachetime': 30,
      'data': { 'identify_id': that.data.identify_id },
      success(res) {

        //console.log(res)
        that.setData({ identify_data: res.data.data })

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