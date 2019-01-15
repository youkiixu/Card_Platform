// super_card/pages/edit-page/croper-pic.js
import WeCropper from '../../components/we-cropper/we-cropper'

const device = wx.getSystemInfoSync()
//console.log(device)
const width = device.windowWidth
const height = device.screenHeight - (device.statusBarHeight * 2) -50

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cropperOpt : {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: width - (width - 10),
        y: (height - 200) / 2,
        width: width - 20,
        height: (width - 20) / 2
      }
    },
    src: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    /*wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        var width = res.windowWidth
        var height = res.windowHeight -50

        var cropperOpt = {
          id: 'cropper',
          width,
          height,
          scale: 2.5,
          zoom: 8,
          cut: {
            x: width - (width - 10),
            y: (height - 200) / 2,
            width: width - 20,
            height: (width - 20) / 2
          }
        }

        
        that.setData({ cropperOpt: cropperOpt })

      }
    })*/
    that.initCropper(options)

  },

  initCropper: function (options) {
    var that = this;
    const { cropperOpt } = this.data

    new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        //console.log(`wecropper is ready for work!`)
        console.log(ctx)
      })
      .on('beforeImageLoad', (ctx) => {
        //console.log(`before picture loaded, i can do something`)
        //console.log(`current canvas context:`, ctx)
        wx.showLoading({
          title: '加载中',
        })

      })
      .on('imageLoad', (ctx) => {
        //console.log(`picture loaded`)
        //console.log(`current canvas context:`, ctx)
        wx.hideLoading()
      })
      .on('beforeDraw', (ctx, instance) => {
        //console.log(`before canvas draw,i can do something`)
        //console.log(`current canvas context:`, ctx)
      })
      .updateCanvas()

    that.data.pic_index = options.pindex
    that.data.src = options.path
    that.wecropper.pushOrign(options.path)
  },


  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },
  goBack: function (){
    wx.navigateBack()
  },

  getCropperImage() {
    var that = this
    if(!that.data.src) return 

    that.wecropper.getCropperImage((src) => {
      if (src) {
        console.log(src)
        that.updateCardPic(src)
      } else {
        console.log('获取图片地址失败，请稍后重试')
      }
    })
  },


  updateCardPic: function (src) {
    var that = this
    wx.uploadFile({
      url: app.util.url('entry/wxapp/updateCardPic'),
      filePath: src,
      name: 'pic',
      header: {
        'content-type': 'multipart/form-data' // 默认值
      },
      success: function (res) {

        res = JSON.parse(res.data);

        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; // 上一级页

    
        if (res.errno == 0) {
          
          prevPage.data.pics[that.data.pic_index] = res.data
          prevPage.setData({ pics: prevPage.data.pics })
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function () {
            wx.navigateBack()
          }, 2000)

        } else {

          wx.showToast({
            title: '保存失败',
            icon: 'error',
            duration: 2000
          })

        }

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
  onShareAppMessage: function () {

  }
})