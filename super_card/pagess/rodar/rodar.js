// super_card/pages/rodar/rodar.js
var app  = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radarBgH:0,
    audioCtx:{},

    userWxInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        
        that.setData({ radarBgH: res.windowHeight })
        
        that.playRodarAudio()
        //获取当前用户ID
        app.util.getUserInfo(function (res) {
          console.log(res)
          that.setData({ userWxInfo: res.wxInfo })
        })

      },
    })
    
  },

  //播放欢迎语
  playRodarAudio: function () {
    var that = this
    app.util.request({
      'url': 'entry/wxapp/getRadarAudio',
      //'cachetime': '30',
      success(res) {
        console.log(res)
        if (res.data.message == 'ok') {
          that.data.audioCtx = wx.createInnerAudioContext()
          that.data.audioCtx.autoplay = true
          that.data.audioCtx.loop = true
          that.data.audioCtx.src = res.data.data
          that.data.audioCtx.onPlay(() => {
            console.log('开始播放')
          })
          that.data.audioCtx.onError((res) => {
            console.log(res.errMsg)
            console.log(res.errCode)
          })
        }

      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //if (typeof this.data.audioCtx.play != 'undefined')
      //this.data.audioCtx.play()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.config.set(this)
    if(typeof this.data.audioCtx.play != 'undefined')
      this.data.audioCtx.play()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if(typeof this.data.audioCtx.stop != 'undefined')
      this.data.audioCtx.stop()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (typeof this.data.audioCtx.destroy != 'undefined')
      this.data.audioCtx.destroy()
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
  
  }
})