// super_card/pages/return-record/return-record.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    sendlList: [], //发送
    receiveList: [], //接收
    catalogSelect:1,  //选项卡

    page: 1,
    lastPage: false,
    show_search: false, //搜索
    search_key:'',  
    examine: true,


    sliderOffset: 0,
    sliderLeft: 0,
  
  },

  /**
   * 谁给我发了消息控制
   */
  droptRetract: function (event){
    var that = this
    var Key = "receiveList["+event.currentTarget.dataset.replyType+"].show_hide"
    if (that.data.receiveList[event.currentTarget.dataset.replyType].show_hide === 1) {
      that.setData({ [Key]: 2 })
    } else {
      that.setData({ [Key]: 1 })
    }

  },

  /**
   * 发给了谁消息控制群
   */
  droptRetracts: function (event) {
    var that = this
    var Key = "sendlList["+event.currentTarget.dataset.replyType+"].show_hide"
    if (that.data.sendlList[event.currentTarget.dataset.replyType].show_hide === 1) {
      that.setData({ [Key]: 2 })
    } else {
      that.setData({ [Key]: 1 })
    }

  },

  /**
   * 设置搜索关键字开始搜索
   */
  setSearchKey: function (e) {
    var that = this
    var key = e.detail.value
    that.setData({ search_key: key, lastPage: false, page: 1 })
    //console.log(this.data.catalogSelect)
    if (that.data.catalogSelect == 1){
      this.getCardSendRecord()
    }
    if (that.data.catalogSelect == 2){
      this.getCardReceiveRecord()
    }
  },

  /**
   * 切换搜索状态
   */
  toggleSearchInput:function(){
    var that = this
    if (this.data.show_search) {
      that.setData({ show_search: false, search_key: '', lastPage: false, page: 1 })
      if (this.data.catalogSelect == 1) {
        this.getCardSendRecord()
      } else {
        this.getCardReceiveRecord()
      }
    } else {
      that.setData({ show_search: true})
    }
  },

  /**
   * 选项卡转换-发送
   */
  selectSend:function(){
    var that = this
    that.setData({
      catalogSelect: 1,
      search_key: '', 
      examine: true,
      show_search: false,
      page:1,
      sliderOffset: 0,
      sliderLeft: 0,
    })
    this.getCardSendRecord()
  },

  /**
   * 选项卡-接收
   */
   selectReceive:function(){
    var that = this
    that.setData({
      catalogSelect: 2,
      search_key: '',
      examine: true,
      show_search: false,
      page: 1,
      sliderOffset:50,
      sliderLeft: 0,
    })
    this.getCardReceiveRecord()
  },

  /**
   * 获取发送名片记录
   */
   getCardSendRecord: function (callback = false, mode = 'cover'){

    var that = this
    app.util.request({
      'url':'entry/wxapp/getCardSendRecord',
      'method':'post',
      'data': { 'search_key': that.data.search_key, page: that.data.page},
      success(res){
        typeof callback === `function` && callback()
        if (mode == 'append') {
          if (!res.data.data.length) {
            that.data.lastPage = true
            return false
          }
          // console.log(res.data.data)
          that.data.sendlList = that.data.sendlList.concat(res.data.data)
          console.log(that.data.sendlList)
          that.setData({
            sendlList: that.data.sendlList,
          })
          return false
        }
        for (var i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].card_info.picture == '') {
            res.data.data.splice(i, 1);
            i--;
          }     
        }
        that.setData({
          sendlList: res.data.data,
        })
      }
    })

  },
  /**
   * 获取接收名片记录
   */
  getCardReceiveRecord: function (callback = false, mode = 'cover') {

    var that = this
    app.util.request({
      'url': 'entry/wxapp/getCardReceiveRecord',
      'method': 'post',
      'data': { 'search_key': that.data.search_key, page: that.data.page },
      success(res) {
        typeof callback === `function` && callback()
        if (mode == 'append') {
          if (!res.data.data.length) {
            that.data.lastPage = true
            return false
          }

          that.data.receiveList = that.data.receiveList.concat(res.data.data)
          console.log(that.data.receiveList)
          that.setData({
            sendlreceiveListList: that.data.receiveList,
          })
          return false

        }
        console.log(res)
        for (var i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].card_info.picture == '') {
            res.data.data.splice(i, 1);
            i--;
          }
        }
        that.setData({
          receiveList: res.data.data,
        })
      }
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCardSendRecord()
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
    this.data.page = 1
    this.data.lastPage = false
    
    if (this.data.catalogSelect == 1) {
      this.getCardSendRecord(function () {
        wx.stopPullDownRefresh()
      })
    } else {
      this.getCardReceiveRecord(function () {
        wx.stopPullDownRefresh()
      })
    }
  
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
    if (this.data.catalogSelect == 1) {
      that.getCardSendRecord(function () {
        wx.hideLoading();
      }, 'append')
    } else {
      that.getCardReceiveRecord(function () {
        wx.hideLoading();
      }, 'append')
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})