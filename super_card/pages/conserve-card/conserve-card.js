// super_card/pages/conserve-card/conserve-card.js
var app = getApp()

var interval = "";//周期执行函数的对象
var time = 0;//滑动时间
var touchDot = 0;//触摸时的原点
var flag_hd = true;//判定是否可以滑动

let animationShowHeight = 300;//动画偏移高度

Page({

  /**
   * 页面的初始数据
   */
  data: {
      card_id : 0,
      card: {},
      qrcode : '',

      picCode:'',

      animationData: "",
      showModalStatus: false,

      diff:'8cm',

      confirmBtnDisabled: false,

      exPicsT: ['纸质名片示例', '宣传单、画册、杂志名片示例', '海报、易拉宝名片示例', '户外广告、高速立柱名片示例']
  },

  setDiffVal: function (e){
    //console.log(e)
   var diff = e.currentTarget.dataset.val
   this.setData({ diff: diff })
  },

  // 显示遮罩层  
  showModal: function () {
    //创建一个动画实例animation。调用实例的方法来描述动画。
    var animation = wx.createAnimation({
      duration: 500,         //动画持续时间500ms
      timingFunction: "ease",//动画以低速开始，然后加快，在结束前变慢
      delay: 0               //动画延迟时间0ms
    })
    this.animation = animation
    //调用动画操作方法后要调用 step() 来表示一组动画完成
    animation.translateY(animationShowHeight).step()//     在Y轴向上偏移300
    this.setData({
      //通过动画实例的export方法导出动画数据传递给组件的animation属性。
      animationData: animation.export(),
      showModalStatus: true //显示遮罩层
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 1)

  },


  getExPic:function (){
    var that = this
    wx.request({
      url: app.util.url('entry/wxapp/getFrontPics'),
      data: {
        page: 'qrcode',
      },
      success: function (res) {
        console.log(res)
        var data = res.data.data
        var expics = []
        for(var x in that.data.exPicsT)
          expics.push({ title: that.data.exPicsT[x], url: data[x] })
        that.setData({ exPics : expics })
      }
    })
  },

  // 隐藏遮罩层  
  hideModal: function () {

    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation;
    animation.translateY(animationShowHeight).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     console.log('options', options)
      if(options.card_id < 1){
        wx.navigateBack()
        return
      }

    var that = this

    app.util.request({
      'url': 'entry/wxapp/getCardQrcode',
      'method': 'POST',
      'data': { card_id: options.card_id },
      success(res) {
        var data = res.data.data
        that.setData({ picCode: data })
      }
    })

     that.getExPic()

     that.data.card_id = options.card_id
      var pages = getCurrentPages()
      var prevPage = pages[pages.length - 2]
      var cardLists = prevPage.data.cardLists

      for(var x in cardLists)
        if (cardLists[x].id == that.data.card_id)
          that.setData({ card: cardLists[x] })

    if (that.data.card.qrcode) 
        that.setData({ qrcode: that.data.card.qrcode })
      else
      that.getCardQr()
  },

  //获取名片小程序码
  getCardQr: function () {

    var that = this
    app.util.request({
      'url': 'entry/wxapp/getCardQrcode',
      'method': 'POST',
      'data': { card_id: that.data.card_id },
      success(res) {
        app.freshIndex = true
        console.log(res)
        that.setData({ qrcode: res.data.data })

      }
    })

  },

  previewQrcode: function (){

      wx.previewImage({
          current: this.data.qrcode, // 当前显示图片的http链接
          urls: [this.data.qrcode]
      })

  },

  //保存名片小程序码到相册
  saveQrcodeToPhotosAlbum: function (e) {

    var that = this
    that.setData({ confirmBtnDisabled: true })
    app.util.request({
      'url': 'entry/wxapp/getDiffCardQrcode',
      'method': 'POST',
      'data': { card_id: that.data.card_id,  diff: that.data.diff},
      success(res) {

        wx.showLoading({
          title: '加载中',
        })
        wx.downloadFile({
          url: res.data.data,
          success: function (res) {
            console.log(res)


            wx.hideLoading()
            that.setData({ confirmBtnDisabled: false })

            //console.log(res)
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function (res) {
                //console.log(res)



                wx.showToast({
                  title: '保存成功',
                  icon: 'success'
                })
              },
              fail: function (res) {
                console.log('fail')
              }
            })

          },
          fail: function (res) {
            console.log('fail')
          }
          
        })


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

    flag_hd = true;    //重新进入页面之后，可以再次执行滑动切换页面代码
    clearInterval(interval); // 清除setInterval
    time = 0;
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        animationShowHeight = res.windowHeight;
      }
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
  /*onShareAppMessage: function () {
  
  }*/
})