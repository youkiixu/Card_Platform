// super_card/pagess/cash-record/cash-record.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    agent_profit: 0.00,
    account_list: [],
    page: 1,
    lastPage: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; // 上一级页
    //console.log(prevPage.data)
    this.setData({ agent_profit: prevPage.data.uInfo.agent_profit })

    var that = this
    app.util.request({
      'url': 'entry/wxapp/getProfitLog',
      success(res) {
        console.log(res)
        var data = res.data.data
        /*for(var x in data){
          data[x].change_desc = data[x].change_desc.substr(0, 12)
          //var unixTimestamp = new Date(data[x].create_time * 1000);
          // data[x].create_time = unixTimestamp.toLocaleString()
        }*/
        that.setData({ account_list: data })
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
    var that = this

    if (that.data.lastPage === true) return false

    wx.showLoading({
      title: '加载中',
    })

    that.data.page++

    app.util.request({
      'url': 'entry/wxapp/getProfitLog',
      'data': { 'page': that.data.page },
      success(res) {
        //console.log(res)
        if (res.data.data.length > 1) {


          console.log(res)
          var data = res.data.data
          for (var x in data) {
            data[x].change_desc = data[x].change_desc.substr(0, 12)
            that.data.account_list.push(data[x])
          }
          that.setData({ account_list: that.data.account_list })


        } else {

          that.data.lastPage = true

        }
        // 隐藏加载框  
        wx.hideLoading();

      }

    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})