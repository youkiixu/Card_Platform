// super_card/pages/dynamic/dynamic.js
var app = getApp()
let animationShowWidth = 300;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    card_id: 0,

    dyList:[],

    page: 1,
    lastPage : false,

    animationData: "",

    pingInpunt:false,
    currentPingId:0,
    currentPingIndex:0,
    pingContent:'',
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this

    if (!options.card_id) {
      wx.navigateBack()
      return false
    }
    that.setData({ card_id: options.card_id })
    app.util.footer(that, that.data.card_id);

    app.config.cardTrack(that.data.card_id, 3, 'view')

    that.getCardDynamic();
    
  },

  //监听页面滚动
  /*onPageScroll: function (e) {
    this.hidePingZan()
  },*/
  hidePingZan(){
    for(var x in this.data.dyList)
      this.data.dyList[x].showPingZan = false

    this.setData({
      dyList: this.data.dyList,
    })
  },

  showPingZan: function (e){

    var animation = wx.createAnimation({
      duration: 500,         
      timingFunction: "ease",
      delay: 0              
    })
    this.animation = animation
    animation.translateX(animationShowWidth).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateX(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 1)

    var that = this
    var id = e.target.dataset.id
    var index = e.target.dataset.index

    that.hidePingZan()
    that.data.dyList[index].showPingZan = !that.data.dyList[index].showPingZan
    that.setData({
      dyList: that.data.dyList,
    })

  },

  zanDynamic: function (e) {

    //为了能调起授权--新加代码start
    var userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      app.util.getUserInfo(function (response) {
        app.config.init()
      });
      return
    }
    //为了能调起授权--新加代码end

    
    var that = this
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    
    app.util.request({
      'url': 'entry/wxapp/zanCardDynamic',
      'method': 'post',
      'data': { dynamic_id: id },
      success(res) {

        
        var data = res.data.data
        var msg = res.data.message

        var zan_data = that.data.dyList[index].zan_data
        
        if (msg == 'add'){

          zan_data.push(data)
          app.config.cardTrack(that.data.card_id, 4, 'view', id)
          that.data.dyList[index].is_zan = true

        }else{

          for (var x in zan_data) {
            if(data == zan_data[x]){
              zan_data.splice(x, 1)
              that.data.dyList[index].is_zan = false
              break;
            }
          }

        }

        that.data.dyList[index].zan_data = zan_data
        that.setData({ dyList: that.data.dyList })

      }
    })

  },


  setPingContent: function (e){
    this.data.pingContent = e.detail.value
  },
  showPingInput(e){
   
    //为了能调起授权--新加代码start
    var userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      app.util.getUserInfo(function (response) {
        app.config.init()
      });
      return
    }
    //为了能调起授权--新加代码end

    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index

    this.setData({ pingInput: true })
    this.data.currentPingId = id
    this.data.currentPingIndex = index

  }, 
  hidePingInput() {
    this.data.currentPingId = 0
    this.data.currentPingIndex = 0
    this.data.pingContent = ''
    this.setData({  pingInput: false })
  },

  pingDynamic: function (e) {
    var that = this
    if(!that.data.pingContent || !that.data.currentPingId) return

    app.util.request({
      'url': 'entry/wxapp/commentsCardDynamic',
      'method': 'post',
      'data': { dynamic_id: that.data.currentPingId, content: that.data.pingContent },
      success(res) {

        that.data.dyList[that.data.currentPingIndex].comments_data.push(res.data.data)
        that.hidePingInput()
        console.log(that.data.currentPingId)
        that.setData({ dyList: that.data.dyList })
        app.config.cardTrack(that.data.card_id, 5, 'view', that.data.currentPingId)

      }
    })
  },



  getCardDynamic: function (callback = false, mode = 'cover') {

    var that = this
    app.util.request({
      'url': 'entry/wxapp/getCardDynamic',
      'method': 'post',
      'data': { card_id: that.data.card_id, page: that.data.page },
      success(res) {
        
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
        })
        console.log('dyList', that.data.dyList)

      }
    })

  },
  toDetails:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id
    var dyList = that.data.dyList[id]
    dyList = JSON.stringify(dyList)
    wx.navigateTo({
      url: 'dynamic-details?card_id=' + that.data.card_id + '&dyList=' + dyList
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

  backCard: function (e) {

    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }

    wx.redirectTo({
      url: '/super_card/pages/overt/overt?card_id=' + this.data.card_id + '&from_act=other',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    var title = this.data.dyList.length > 0 ? '欢迎查看"' + this.data.dyList[0].company +'"的名片动态' : ''
    var path = '/super_card/pages/overt/dynamic?card_id=' + this.data.card_id 
    var imgUrl = ''
    

    app.config.cardTrack(this.data.card_id, 4, 'praise')
    
    return {
    title: title,
    path: path,
    imageUrl: imgUrl
    }
    
  }
})