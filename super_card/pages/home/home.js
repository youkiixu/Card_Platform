var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      wxInfo:{},
      card_num: 0,
      is_v:0,
      uInfo: {},

      app_name: '',

      show_comeback_option: 1,

      extraData: {
        id: '32076',
        customData: {}
      },


      home_page_layout:0,
      vip:0,
      vip_last_time:0,
      vipSet:[],

      is_audit: false,

      member_entry_pic: false,

      isAdmin: false

  },


  toViewProfit:function (e){

    var that = this
    if (that.data.agent_switch == 0){
      that.toDeveloping(e)
      return
    }

    if(that.data.uInfo.agent == 0)
      wx.showModal({
        title: '系统通知',
        content: '您当前还未开通代言人权限，开通后才可以开始赚收益哦',
        showCancel: false,
        confirmColor: that.data.themeColor,
        confirmText: '去开通',
        success: function () {
          wx.navigateTo({
            url: '../../pagess/partner-index/partner-index',
          })
        }
      })
    else
      wx.navigateTo({
        url: '../../pagess/agent-revenue/agent-revenue',
      })

  },

  toAgentCenter:function (e){

    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }
   
    wx.navigateTo({
       url: '../../pagess/agent/agent',
    })

  },



  toDeveloping: function (e){

    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }

    wx.showToast({
      title: '正在开发中...',
      icon: 'none'
    })

  },

  toMemPage:function (e){

    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }

    if (this.data.uInfo.vip > 0) {

      wx.navigateTo({
        url: '../../pagess/member-core/member-core',
      })

    } else {
      this.toOpenVip()
    }
  },

  toOpenVip:function (){
    wx.navigateTo({
      url: '../opt-version/opt-version',
    })
  },

  toUseHelp: function (e) {
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }
    wx.navigateTo({
      url: '../../pagess/use-help/use-help'
    })
  },

  toBalancePage:function (e) {
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }
    wx.navigateTo({
      url: '../../pagess/balance/balance'
    })
  },

 //跳转加V认证申请页面
 toCertifyPage: function (e){
   if (typeof e.detail.formId != 'undefined') {
     console.log(e.detail.formId)
     app.formIds.push(e.detail.formId)
   }
   wx.navigateTo({
     url: '../../pagess/certify/certify'
   })

 },


  //创建新名片
  createNewCard:function (e){
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }
    console.log(this.data.uInfo.card_num, app.config.getConf('create_card_limit'))
    if(parseInt(this.data.uInfo.card_num) >= parseInt(app.config.getConf('create_card_limit'))){
      wx.showToast({
        title: '您拥有的名片数超过上限，无法再创建',
        icon:'none'
      })
      return
    }
    app.util.request({
      'url': 'entry/wxapp/isCanCreate',
      success(res) {

        //console.log(res)
        if (res.data.message === 'ok') {
          wx.navigateTo({
            url: '../basic/basic'
          })
        } else {
          var uInfo = res.data.data
          console.log(uInfo)
          wx.navigateTo({
            url: '../../pagess/payment/payment?umoney=' + uInfo.money + '&cardnum=' + uInfo.card_num
          })
        }
        
      }
    })

  },

  toAboutPage: function (e) {
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }
    wx.navigateTo({
      url: '../../pagess/about/about'
    })
  },

  toSuggestionPage: function (e) {
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }
    wx.navigateTo({
      url: '../../pagess/suggestion/suggestion'
    })
  },

  toReturnPage:function (e){
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }
    wx.navigateTo({
      url: '../return-record/return-record'
    })
  },

  toSeenCardPage: function (e) {
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }
    wx.navigateTo({
      url: '../../pagess/seen-card/seen-card'
    })
  },

  toMyDemandPage: function (e) {
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }
    wx.navigateTo({
      url: '../home/demand'
    })
  },

  //跳转签到页
  toSignInPage: function (e){
    console.log('签到')
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }
    app.util.request({
      'url': 'entry/wxapp/checkSignIn',
      success(res) {
        //console.log(res)
        if(res.data.message === 'ok')
          wx.navigateTo({
            url: '../../pagess/report/report'
          })
        else
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
      }
    })

  },

  toAdminPage: function (e) {
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }
    var url = app.siteInfo.siteroot + "?i=" + app.siteInfo.uniacid + '&c=entry&do=index&m=super_card_plugin_admin&uni=' + app.siteInfo.uniacid + '&admin=' + app.UID
    console.log(url)
    wx.navigateTo({
      url: '../card-book/web-view?url=' + encodeURIComponent(url),
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.freshHome()
    
  },

  //刷新个人主页
  freshHome: function (cb){

    var that = this

    if(app.config.getConf('wx_audit_switch') == 1)
        that.setData({ is_audit : true })
  
    //获取当前用户ID
    app.util.getUserInfo(function (res) {

      //console.log(res)

      var wxInfo = res.wxInfo
      
      app.util.request({
        'url': 'entry/wxapp/initOpenVip',
        //'cachetime': '30',
        success(res) {
          
          typeof cb == "function" && cb()
          //console.log(res)
          var uInfo = res.data.data.uInfo

          var isAdmin = uInfo.admin == 1 ? true : false

          var vipSet = res.data.data.vipSet


          that.setData({ vipSet: vipSet, wxInfo: wxInfo, card_num: parseInt(uInfo.card_num), is_v: uInfo.is_v, uInfo: uInfo, member_entry_pic: app.config.getConf('member_entry_pic'), isAdmin: isAdmin })

          app.freshHome = false


        }

      });
    });

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({ app_name: app.config.getConf('app_name'), show_comeback_option: app.config.getConf('show_comeback_switch') })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    app.config.set(this)
    app.config.footer(this)

    this.setData({
      home_page_layout: app.config.getConf('home_page_layout')
    })
    console.log(this.data.home_page_layout)

    if(app.freshHome === true) this.freshHome()
    app.config.setUserComeback()

    this.setData({ agent_switch: app.config.getConf('agent_switch') })
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
    this.freshHome(function (){

      wx.stopPullDownRefresh()

    })
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