var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    provideMethod: { visible: false, animateCss: 'wux-animate--fade-out' },
    uMoney: '0.00',
    fee: '0.00',
    money: '0.00',
    total_fee: '0.00',
    pay_method: 0,
    style_name : '',
    choiceAgentGrade:0,
    account_intro: '',

    prevPage:false,
    agent_id:0
  },

  //返回首页
  backIndex: function (e) {

    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }

    wx.switchTab({
      url: '../../pages/index/index',
    });

  },

  //确认支付
  confirmPay: function (e){
    var formId = e.detail.formId;
    var that  = this
    app.util.request({
      'url': 'entry/wxapp/openUserAgent',
      data: {
        choiceAgentGrade: that.data.choiceAgentGrade,
        price: that.data.price,
        money: that.data.money,
        fee: that.data.fee,
        pay_method: that.data.pay_method,
        form_id: formId,
      },
      success(res) {
        app.freshHome = true
        //console.log(that.data.pay_method)
        if (that.data.pay_method == 1) {

          if(res.data.message == 'ok')
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
                that.failPayAfter('')
                //支付失败后，
              }
            })

          else
            that.failPayAfter('')

        }else{

          if(res.data.message == 'accountPayOk'){
                            
              that.successPayAfter()
            
          }else if (res.data.message == 'ok') {

            wx.requestPayment({
              'timeStamp': res.data.data.timeStamp,
              'nonceStr': res.data.data.nonceStr,
              'package': res.data.data.package,
              'signType': 'MD5',
              'paySign': res.data.data.paySign,
              'success': function (res) {
                that.successPayAfter()
                //支付成功后，系统将会调用payResult() 方法，此处不做支付成功验证，只负责提示用户
              },
              'fail': function (res) {
                console.log('fail:');
                console.log(res);
                that.failPayAfter('已取消')
                //支付失败后，
              }
            })

          }else{

            that.failPayAfter('')

          }


        }


      },
      fail(err) {
        console.log('errNO:');
        console.log(err);
        that.failPayAfter(err.data.message)
      }
    })

  },

  //跳转创建新名片
  successPayAfter: function () {
    //console.log('here')
    var that = this
    app.freshHome = true

    wx.showModal({
      title: '开通代理通知',
      content: '恭喜您，成功开通了“' + that.data.agent_name + '”，马上开始赚收益吧！！！',
      showCancel: false,
      confirmColor: '#4752e8',
      confirmText: '朕知道啦',
      success: function (res) {
        wx.redirectTo({
          url: '../agent/agent?agent_id=' + that.data.agent_id,
        })
      }
    })

  },
 
  failPayAfter: function (msg){

    wx.showToast({
      title: '支付失败' + msg,
      icon: 'none'
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    if (typeof options.umoney == 'undefined' || typeof options.choiceAgentGrade == 'undefined' || options.price == 'undefined'){
      wx.navigateBack({ delta: 1 })
      return
    }
    var agentGrade = app.config.getConf('agent_grade')
    //for(var x in vipSet)
    var agent_name = agentGrade[parseInt(options.choiceAgentGrade) - 1].name

    var uMoney = parseFloat(options.umoney)

    this.setData({ uMoney: uMoney, agent_name: agent_name, choiceAgentGrade: options.choiceAgentGrade, price: parseFloat(options.price), account_intro: app.config.getConf('account_intro') })

    if(this.data.uMoney > 0)
      this.showMoneyPay(1)
    else
      this.showMoneyPay(0)


    var pages = getCurrentPages();
    this.data.prevPage = pages[pages.length - 2]; // 上一级页

    if(options.agent_id > 0)
      this.setData({ showBackIndex: true, agent_id: options.agent_id })
  },

  changeMoneyPay: function (e){

      var isCheck = e.detail.value.length 
      this.showMoneyPay(isCheck)

  },

  showMoneyPay: function (isCheck){

    var fee = Math.round(this.data.price * 100) / 100
    fee = parseFloat(fee.toFixed(2))

    var money = this.data.uMoney
    if(isCheck){
      if (money >= fee) {
        this.setData({ money: fee, fee: '0.00', total_fee: fee, pay_method: 0 })
      } else {

        this.setData({ money: money, fee: Math.round((fee - money) * 100) / 100, total_fee: fee, pay_method: 0 })

      }
    }else{

      this.setData({ money: '0.00', fee: fee, total_fee: fee, pay_method: 1})

    }

  },



  //如何增长账户余额
  //显示/隐藏
  CardPicker: function () {
    this.data.provideMethod = this.data.provideMethod.visible === true ? { visible: false, animateCss: 'wux-animate--fade-out' } : { visible: true, animateCss: 'wux-animate--fade-in' }
    this.setData({ provideMethod: this.data.provideMethod })
  },
  cancelSelect: function () {
    this.CardPicker()
  },
  openCardSelect: function () {
    this.CardPicker()
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
    //app.config.set(this)
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