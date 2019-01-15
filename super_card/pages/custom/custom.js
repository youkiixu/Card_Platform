// super_card/pages/custom/custom.js
import { $wuxPicker } from '../../components/wux'
import WeCropper from '../../components/we-cropper/we-cropper'
const device = wx.getSystemInfoSync()
const width = device.windowWidth
var height = width

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      card_id:0,
      card: {},

      cropperOpt: {
        id: 'cropper',
        width,
        height,
        scale: 2.5,
        zoom: 8,
        cut: {
          x: (width - 200) / 2,
          y: (height - 200) / 2,
          width: 200,
          height: 200
        }
      },

      textColor: '',
      cardColorDefV:[0],
      cardColorSelectK:['黑', '白', '黄', '黑蓝'],
      cardColorSelectV: ['#6d6b6b', '#fff', 'yellow', ''],

      showCanvas: true,

      tempSrc: '',

      Uploading : false
  },
 
 

  touchStart(e) {
    if(this.wecropper)
      this.wecropper.touchStart(e)
  },
  touchMove(e) {
    if(this.wecropper)
      this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    if(this.wecropper)
      this.wecropper.touchEnd(e)
  },

  chooseBgImg: function (){

    var that = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        //console.log(res)
        var src = res.tempFilePaths[0]
        that.data.tempSrc = src
        const { cropperOpt } = that.data
        new WeCropper(cropperOpt)
          .on('ready', (ctx) => {
            //console.log(`wecropper is ready for work!`)
            //console.log(ctx)
            that.wecropper.pushOrign(src)
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

       
      }

    })

  },

  showColorPick: function () {

    var that = this;
    that.setData({ showCanvas: false })
    $wuxPicker.init('colorlist', {
      title: "请选择字体颜色",
      cols: [
        {
          textAlign: 'center',
          values: that.data.cardColorSelectK,
        }
      ],
      value: that.data.cardColorDefV,
      onChange(p) {
        //console.log(p) 
      },
      onDone(p) {

          //console.log(p)
          var color = that.data.cardColorSelectV[p.valueIndex]
          that.setData({ showCanvas:true, textColor: color })
          if(that.wecropper) that.wecropper.pushOrign(that.data.tempSrc)
       
      },
      onCancel(p) {
        //console.log('cancel')
        that.setData({ showCanvas: true })
        if(that.wecropper) that.wecropper.pushOrign(that.data.tempSrc)

      }
    })
  },

  previewCardBg() {

    

    var that = this
    if (that.data.Uploading === true) return false

    wx.showLoading({
      title: '加载中',
    })
    if (this.wecropper){
      that.data.Uploading = true
      that.wecropper.getCropperImage((src) => {
        console.log(src)
        /*wx.previewImage({
          current: src,
          urls: [src]
        })
        return false*/

        wx.uploadFile({
          url: app.util.url('entry/wxapp/uploadTempPic'),
          filePath: src,
          name: 'pic',
          header: {
            'content-type': 'multipart/form-data' // 默认值
          },
          formData: {
            'card_id': that.data.card_id
          },
          success: function (res) {
            
            wx.hideLoading()

            that.data.Uploading = false
            console.log(res)
            res = JSON.parse(res.data)
            if (res.errno == 0) {

              wx.navigateTo({
                url: '../../pages/preview/preview?card_id=' + that.data.card_id + '&tempBgUrl=' + res.data.path + '&textColor=' + that.data.textColor
              })

            } else {

              wx.showToast({
                title: res.message,
                icon: 'none',
                duration: 2000
              })

            }


          }


        })
      

      })

    }else{

      wx.showToast({
        title: '请先上传背景图',
        icon:'none',
        duration: 3000
      })

    }
  },

  queryNodeHeight: function (){
    var that = this
    var query = wx.createSelectorQuery()
    query.select('#card').boundingClientRect()
    query.select('#bottom').boundingClientRect()
    query.exec(function (res) {
      console.log(res)
      that.setData({
        'cropperOpt.cut.x': res[0].left,
        'cropperOpt.cut.y': res[0].top,
        'cropperOpt.cut.width': res[0].width,
        'cropperOpt.cut.height': res[0].height,
        'cropperOpt.height': device.windowHeight - res[1].height,
      })
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log('**********')
    var that = this
    if(options.card_id > 0){

      that.setData({ card_id: options.card_id })

      app.util.request({
        'url': 'entry/wxapp/GetCardItem',
        'cachetime': '30',
        'method': 'POST',
        'data': { 'card_id': that.data.card_id },
        success(res) {
          console.log(res)
          that.setData({ card: res.data.data })
          that.queryNodeHeight()
        }
      })

    }else{

      wx.navigateBack({
        delta: 1,
      })
    }
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