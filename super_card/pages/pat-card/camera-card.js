// super_card/pages/pat-card/camera-card.js
const device = wx.getSystemInfoSync()
//console.log(device)
const width = device.windowWidth
const height = device.screenHeight - (device.statusBarHeight * 2) - (device.model.indexOf('iPhone X') > -1 ? 70 : 90 )

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width: width,
    height:height,
    cxt : {},
    src: false,
    btnDisabled: false,
  },

  /**
   * 返回上一页
   */
  chooseBackPre:function(){
    wx.navigateBack()
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    var that = this
    that.data.ctx = wx.createCameraContext()
  },

  error(e) {
    console.log(e)
  },

  takePhoto: function (){

    var that = this
    that.data.ctx.takePhoto({
      quality: 'normal',
      success: (res) => {

        that.setData({
          src: res.tempImagePath,
          btnDisabled: true,
        })

        wx.getImageInfo({
          src: that.data.src,
          success: function (res) {

            const ctx = wx.createCanvasContext('myCanvas')
            ctx.drawImage(that.data.src, 0, 0, that.data.width, that.data.height)
            ctx.draw()
            
            that.identifyCard()
          }
        })
     
      }

    })

  },

  chooseAlbumPic: function (){
    
      var that = this
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          //console.log(res)
          var src = res.tempFilePaths[0]

          that.setData({
            src: src,
            btnDisabled: true,
          })

          wx.getImageInfo({
            src: that.data.src,
            success: function (res) {

              const ctx = wx.createCanvasContext('myCanvas')
              ctx.drawImage(that.data.src, 0, 0, that.data.width, that.data.height)
              ctx.draw()

              that.identifyCard()
            }
          })
        }
      })

  },

  identifyCard: function (){

    wx.showLoading({
      title: '识别中...',
    })

    var that = this

    wx.uploadFile({
      url: app.util.url('entry/wxapp/uploadTempPic'),
      filePath: that.data.src,
      name: 'pic',
      header: {
        'content-type': 'multipart/form-data' // 默认值
      },
      success: function (res) {

        //console.log(res)
        res = JSON.parse(res.data)

        if (res.errno == 0) {
          //console.log(res.data.path)

          wx.request({
            'url': app.util.url('entry/wxapp/IdentifyCard'),
            'data': { 'path': res.data.path },
            success: function (res) {
              wx.hideLoading()
              if (res.data.errno == 0) {

                console.log(res)
                wx.redirectTo({
                  url: '../../pages/recognition/recognition?identify_id=' + res.data.data.identify_id,
                })

              } else {

                that.setData({
                  src: false,
                  btnDisabled: false,
                })
                
                wx.showToast({
                  title: res.data.message,
                  icon: 'none',
                  duration: 2000
                })

              }
            },
            fail: function (res) {
              wx.hideLoading()
              wx.showToast({
                title: '识别名片发生网络错误',
                icon: 'none',
                duration: 2000
              })

            },

          })

        } else {

          wx.hideLoading()
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000
          })

        }

      },
      fail: function (res) {
        wx.hideLoading()
        wx.showToast({
          title: '上传名片图片发生网络错误',
          icon: 'none',
          duration: 2000
        })

      },

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
  onShareAppMessage: function () {

  }
})