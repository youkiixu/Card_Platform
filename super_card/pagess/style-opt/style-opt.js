// super_card/pages/style-opt/style-opt.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    styles: [],
    card_id: 0,
    card_style:false,

    btnDis:false,
    choiceCardStyle: 1,
    uInfo:false,

    currentStyle : 0,
    price: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this

    if (typeof options.card_id != 'undefined' && typeof options.card_style != 'undefined')
      that.setData({ card_id: options.card_id, card_style: options.card_style })

    app.util.request({
      'url': 'entry/wxapp/getUserInfo',
      success(res) {

        that.data.uInfo = res.data.data
        var styles = app.config.getConf('card_style')
        for(var x in styles){
            
            if(x == 0){
              styles[x].price = false
              styles[x].buy  = 1
            }

            if (x == 1){
              if(that.data.uInfo.style2 == 1)
                styles[x].buy = 1
              else
                styles[x].buy = (styles[x].free == 1 && that.data.uInfo.vip > 0) ? 1 : 0
            }

            if (x == 2) {
              if (that.data.uInfo.style3 == 1)
                styles[x].buy = 1
              else
                styles[x].buy = (styles[x].free == 1 && that.data.uInfo.vip > 0) ? 1 : 0
            }

        }
        console.log(styles)
        that.setData({ styles: styles })
        //console.log(that.data.styles)

      }
    })

  },


  switchStyle: function (e){

    console.log(e)
    var currentStyle = e.detail.current
    this.setData({ currentStyle: currentStyle })
    this.data.price = this.data.styles[currentStyle].price
    this.data.choiceCardStyle = this.data.styles[currentStyle].id

  },

  useCardStyle: function (e){
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }
    var that = this
    app.util.request({
      'url': 'entry/wxapp/useCardStyle',
      data: {
        card_id: that.data.card_id,
        choiceCardStyle: that.data.choiceCardStyle
      },
      success(res) {

        app.freshIndex = true
        that.setData({ card_style: that.data.choiceCardStyle })
        wx.showToast({
          title: '切换成功',
          icon: 'success'
        })
        setTimeout(function (){
          wx.navigateBack()
        }, 1500)

      }
    })

  },


  //确认支付
  buyCardStyle: function (e) {

    var that = this

    var iosPay = app.config.iosPay(that)
    if(iosPay === false) return

    if (app.config.getConf('style_open_balance') == 1) {

      wx.navigateTo({
        url: '../payment/payment-style?umoney=' + that.data.uInfo.money + '&choiceCardStyle=' + that.data.choiceCardStyle + '&price=' + that.data.price,

      })

    } else {

      var formId = e.detail.formId;
      that.setData({ btnDis: true })
      app.util.request({
        'url': 'entry/wxapp/buyCardStyle',
        data: {
          choiceCardStyle: that.data.choiceCardStyle,
          price: that.data.price,
          form_id: formId
        },
        success(res) {

          if (res.data.message == 'ok')
            wx.requestPayment({
              'timeStamp': res.data.data.timeStamp,
              'nonceStr': res.data.data.nonceStr,
              'package': res.data.data.package,
              'signType': 'MD5',
              'paySign': res.data.data.paySign,
              'success': function (res) {
                console.log('succ:');
                console.log(res);
                that.successPayAfter()
                //支付成功后，系统将会调用payResult() 方法，此处不做支付成功验证，只负责提示用户
              },
              'fail': function (res) {
                console.log('fail:');
                console.log(res);
                that.failPayAfter('支付失败')
                //支付失败后，
              }
            })

          else
            that.failPayAfter('')


        },
        fail(err) {
          console.log('errNO:');
          console.log(err);
          that.failPayAfter(err.data.message)
        }
      })

    }

  },


  successPayAfter: function () {

    wx.showToast({
      title: '支付成功',
      icon: 'success'
    })

    var that = this
    for(var x in that.data.styles)
      if(that.data.styles[x].id == that.data.choiceCardStyle)
        that.data.styles[x].buy = 1
    
    that.setData({ styles: that.data.styles })

  },

  failPayAfter: function (msg) {

    this.setData({ btnDis: false })
    wx.showToast({
      title: (msg ? msg : '支付失败'),
      icon: 'none'
    })
    return

    wx.showModal({
      title: '系统提示',
      content: msg,
      showCancel: false,
      confirmColor: '#f90',
      confirmText: '朕知道了',
      success: function (res) {
      }
    });

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