// super_card/pages/partner-index/partner-index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentAgent :0,
    agents: false,
    agent_intro: '',
    provideMethod: { visible: false, animateCss: 'wux-animate--fade-out' },
    btnDis:false,
    showBackIndex: false,
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

  showAgentIntro: function (e){

    var index = e.currentTarget.dataset.index
    var agent_intro = this.data.agents[index].agent_explain
    this.data.provideMethod = { visible: true, animateCss: 'wux-animate--fade-in' }
    this.setData({ agent_intro: agent_intro, provideMethod: this.data.provideMethod })

  },
  hideAgentIntro: function (){
    this.data.provideMethod = { visible: false, animateCss: 'wux-animate--fade-out' }
    this.setData({ provideMethod: this.data.provideMethod })
  },

  viewPoster: function (){
    var poster = this.data.poster
    wx.previewImage({
      current:poster,
      urls: [poster],
    })
  },

  toProPage: function (e) {
    var t = e.target.dataset.t
    wx.navigateTo({
      url: '../agent/protocol?t=' + t,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    
    var that = this

    app.util.getUserInfo(function (res) {

      var data = (typeof options.agent_id != 'undefined') ? {agent_id: options.agent_id} : {}
      
      //console.log(res)
      app.util.request({
        'url': 'entry/wxapp/getUserInfo',
        'data': data,
        success(res) {
          app.config.init(function () {

            that.setData({
              app_name: app.config.getConf('app_name'),
              poster: app.config.getConf('agent_introduct_pic'),
              open_pic: app.config.getConf('agent_open_pic'),
              agents: app.config.getConf('agent_grade')
            })

          })

          that.data.uInfo = res.data.data

          that.setData({ currentAgent: that.data.uInfo.agent })

          if (typeof options.agent_id !== 'undefined')
            that.setData({ showBackIndex: true, agent_id: options.agent_id })
          
         
        }
      })

    })

  },


  //确认支付
  openAgent: function (e) {

    var index = e.currentTarget.dataset.index
    var that = this

    var iosPay = app.config.iosPay(that)
    if (iosPay === false) return

    that.data.choiceAgentGrade = that.data.agents[index].id
    that.data.price = that.data.agents[index].price
    that.data.agent_name = that.data.agents[index].name

    if (app.config.getConf('agent_open_balance') == 1) {

      wx.navigateTo({
        url: '../payment/payment-agent?umoney=' + that.data.uInfo.money + '&choiceAgentGrade=' + that.data.choiceAgentGrade + '&price=' + that.data.price +'&agent_id=' + that.data.agent_id,
      })

    } else {

      var formId = e.detail.formId;
      that.setData({ btnDis: true })
      app.util.request({
        'url': 'entry/wxapp/openUserAgent',
        data: {
          choiceAgentGrade: that.data.choiceAgentGrade,
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

  failPayAfter: function (msg) {

    this.setData({ btnDis: false })
    wx.showToast({
      title: (msg ? msg : '支付失败'),
      icon: 'none'
    })
    return

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

})