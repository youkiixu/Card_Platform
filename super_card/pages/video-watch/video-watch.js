// super_card/pages/video-watch/video-watch.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      card_id: 0,
      arrVideo:{},
      path: '',
      views: 0,
      data: {},
      muted: false,

      uid:0,
      from_act : '',
      showBackIndex: false,

      forwarding: 0,

      VqqId: 0,
  },

  //返回首页
  backIndex: function () {
    wx.switchTab({
      url: '../index/index',
    });
  },
  

  //切换静音开关
  toggleMuted: function (){

    this.data.muted ? this.setData({ muted: false }) : this.setData({ muted: true })

  },
  //视频显示错误回调
  videoErrorCallback: function (e) {
    console.log('视频错误信息:')
    console.log(e.detail.errMsg)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    var that = this
    if (typeof options.card_id == 'undefined' || options.card_id < 1){
      wx.navigateBack()
      return false
    }

    var info = JSON.parse(options.Msgs)
   
    that.setData({ 
       card_id: options.card_id ,
       forwarding: options.forwarding ,
        views: info.views,
        path: info.path,
        arrVideo: options.Msgs

       })

    console.log('path', that.data.path)

    if (typeof options.from_act !== 'undefined') {
      that.setData({ showBackIndex: true, from_act: options.from_act })
      
    }

  //判断腾讯视频
    var linkReg = /v.qq.com\/x\/page/
    if (linkReg.test(that.data.path)) {
      var temp = that.data.path.match(/page\/(.*)\.html/)
      that.setData({ VqqId: temp[1] })
    }


      //获取当前用户ID
    // app.util.getUserInfo(function (response) {

    //     //console.log(response)
    //   that.setData({ uid: response.memberInfo.uid })
      
    //   app.util.request({
    //     'url': 'entry/wxapp/getCardVideo',
    //     //'cachetime': '30',
    //     'data': { card_id: that.data.card_id, watch : 1},
    //     success(res) {

    //       var data = res.data.data
    //       console.log(data)
    //       if (data){
    //         that.setData({
    //           views: data.views,
    //           path: data.path,
    //           data: data
    //         })

    //         var linkReg = /v.qq.com\/x\/page/
    //         if (linkReg.test(data.path)) {
    //           var temp = data.path.match(/page\/(.*)\.html/)
    //           that.setData({ VqqId: temp[1] })
    //         }

    //       }
    //     }

    //   })

    // })

    app.config.cardTrack(that.data.card_id, 3, 'copy')
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
    var that = this
    app.config.init(function () {
      app.config.set(that)
    })
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

    var path = '/super_card/pages/video-watch/video-watch?card_id=' + this.data.card_id + '&Msgs=' + this.data.arrVideo + '&from_act=share' + '&forwarding=' + 1
    // console.log('path',path)
    return {
      title: '请点击看视频',
      path: path
    }
  }
})