// super_card/pages/tab-setting/tab-setting.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type_array: [
      { name: '潜在客户', checked: false }, 
      { name: '一般客户', checked: false }, 
      { name: '重要客户', checked: false }
    ],
    state_array: [
      { name: '需长期跟进', checked: false },
      { name: '近期可成交', checked: false },
      { name: '已成交', checked: false },
      { name: '已丢单', checked: false }
    ],

    client_id: 0,
    type_val: '',
    state_val: '',

    prev_page: {},

    btnDisabled: false
  },

  //客户类型选中项
  typeChange: function (res) {
    var arrs = this.data.type_array;
    var that = this;
    for (const x in arrs) {
      if (arrs[x].name == res.detail.value) {
        arrs[x].checked = true;
        that.data.type = res.detail.value
      } else {
        arrs[x].checked = false;
      }
    }
    that.setData({
      type_array: arrs
    })
  },

  //客户状态选中项
  stateChange: function (res) {
    var arrs = this.data.state_array;
    var that = this;
    for (const x in arrs) {
      if (arrs[x].name == res.detail.value) {
        arrs[x].checked = true;
        that.data.status = res.detail.value
      } else {
        arrs[x].checked = false;
      }
    }
    that.setData({
      state_array: arrs
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    if (typeof options.client_id == 'undefined' || options.client_id < 1)
      wx.navigateBack()

    var pages = getCurrentPages();
    that.data.prevPage = pages[pages.length - 2]; // 上一级页

    that.data.client_id = that.data.prevPage.data.client_id
    that.data.type = that.data.prevPage.data.client_info.type
    that.data.status = that.data.prevPage.data.client_info.status

    for (var x in that.data.type_array){
      if(that.data.type_array[x].name == that.data.type)
        that.data.type_array[x].checked = true
    }

    for (var x in that.data.state_array) {
      if (that.data.state_array[x].name == that.data.status)
        that.data.state_array[x].checked = true
    }

    that.setData({ type_array: that.data.type_array, state_array:that.data.state_array })

  },

  updateClientStuff: function (){

    var that = this
    that.setData({ btnDisabled: true })
    app.util.request({
      'url': 'entry/wxapp/updateClientStuff',
      'data': { client_id: that.data.client_id, type: that.data.type, status: that.data.status },
      success(res) {
        //that.setData({ btnDisabled: false })
        that.data.prevPage.setData({ 'client_info.type': that.data.type, 'client_info.status': that.data.status })
        wx.navigateBack()

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