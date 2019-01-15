// super_card/pages/radar/radar.js
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
    itemChioce:1,
    isTrajectory: 1,
    hdShow:false,

    card_id:0,

    chatList: [],

    animationData: "",
    showModalStatus: false,


    trackList:[],

    trackUser: [],
    trackUserDetail: [],
    trackUserC:{},

    scrollTop:0,
    scrollTopD:0,
    
    page: 1,
    pageCopy : 1,
    loadDone: false,
    
    currentPage : 0,

    isLoading : false,

    clientList: [],

    noticeNum : 0,

    noVipTip: false,
    provideMethod: { visible: false, animateCss: 'wux-animate--fade-out' },
    is_audit: false,

    msgNum: 0,

    sliderOffset: 0,
    sliderLeft: 2,
    currentX: 0
  },

  handleMovableChange: function (e) {
    var that = this
    var di = e.currentTarget.dataset.index
    for (var ind in that.data.chatList) {
      if (ind == di) {
        that.data.chatList[ind].x = 1
      } else {
        that.data.chatList[ind].x = 0
      }
    }
    that.data.currentX = e.detail.x;
    console.log(that.data.currentX)
  },
  handleTouchend: function (e) {
    console.log(e)
    var cx = e.currentTarget.dataset.index
    console.log(cx)
    if (this.data.currentX < -36) {
      this.data.chatList[cx].x = -92;
      this.setData({
        chatList: this.data.chatList
      });
    } else {
      this.data.chatList[cx].x = 0;
      this.setData({
        chatList: this.data.chatList
      });
    }
  },
  //删除
  handleDeleteProduct: function (e) {
    console.log('删除')
  },


  getChatNum: function () {
    var that = this
    wx.request({
      url: app.util.url('entry/wxapp/ChatMsgNum'),
      data: {'card_id': that.data.card_id},
      success: function (res) {
        console.log(res)
        that.setData({ msgNum: res.data.data })
      }
    })
  },

  startChat: function (e) {

    var data = e.currentTarget.dataset
    var that = this
    //回传开始
    app.util.request({
      'url': 'entry/wxapp/startChat',
      //'cachetime': '30',
      'data': { t_uid: data.t_uid, t_card_id: data.t_card_id, card_id: data.card_id },
      success(res) {
      
        wx.navigateTo({
          url: '../../pages/chat/chat?chat_id=' + res.data.data + '&from=radar'
        })

      }
    })

  },

  addNoticeNum : function (e){
    
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }
    this.data.noticeNum++
    this.setData({ noticeNum: this.data.noticeNum})

  },

  getNoticeNum: function(e){

    var that = this
    wx.request({
      url: app.util.url('entry/wxapp/getFidNum'),
      success(res) {
        console.log(res)
        that.setData({ noticeNum: res.data.data })
      }
    })

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

  // 隐藏遮罩层  
  hideModal: function () {

    var that = this
    that.data.currentPage = 1
    that.data.page = that.data.pageCopy
    that.data.loadDone = false

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


  getChatList: function (cb) {

    var that = this
    that.data.isLoading = true
    app.util.request({
      'url': 'entry/wxapp/getChatList',
      'data': {card_id : that.data.card_id, page: that.data.page},
      success(res) {
        typeof cb == "function" && cb()

        /*for (var ind in res.data.data) {
          res.data.data[ind].x = 0
        }*/

        that.data.isLoading = false
        var data = res.data.data
        if (data.length > 0) {
          that.data.chatList = that.data.chatList.concat(data)
          that.setData({ chatList: that.data.chatList })
        } else {
          that.data.loadDone = true
        }

      }
    })

  },

  getChatListSilence: function (cb) {
    
    this.data.page = 1
    this.data.loadDone = false
    var that = this
    wx.request({
      url: app.util.url('entry/wxapp/getChatList'),
      data: { 'card_id': that.data.card_id },
      success: function (res) {
        typeof cb == "function" && cb()
        that.setData({ scrollTop: 0, chatList: res.data.data })
      }
    })

  },

  getTrackCardByTime: function () {

    var that = this

    that.data.isLoading = true
    app.util.request({
      'url': 'entry/wxapp/getTrackByTime',
      'data': { page : that.data.page , to_card_id: that.data.card_id },
      success(res) {

        if(res.data.message == 'no'){
          that.noVipFun()
        }

        that.data.isLoading = false
        var data = res.data.data
        if(data.length > 0){
          that.data.trackList = that.data.trackList.concat(data)
          that.setData({ trackList: that.data.trackList })
        }else{
          that.data.loadDone = true
        }

      }
    })

  },

  getTrackCardUser: function (){

    var that = this

    that.data.isLoading = true
    app.util.request({
      'url': 'entry/wxapp/getTrackByCuser',
      'data': { page: that.data.page, to_card_id: that.data.card_id },
      success(res) {
        that.data.isLoading = false
        var data = res.data.data
        if (data.length > 0) {
          that.data.trackUser = that.data.trackUser.concat(data)
          that.setData({ trackUser: that.data.trackUser })
        } else {
          that.data.loadDone = true
        }

      }
    })

  },


  showTrackDetail: function (e){

    var card_id = e.target.dataset.card_id
    var card_id_index = e.target.dataset.card_id_index

    var that = this
    that.data.currentPage = 2
    that.data.pageCopy = that.data.page
    that.data.page = 1;
    that.data.loadDone = false
    that.setData({
      scrollTopD: 0,
      trackUserDetail: [],
    });

    that.setData({
      trackUserC: that.data.trackUser[card_id_index]
    }, that.showModal() )

    that.getTrackCardUserDtail()

  },

  noVipFun:function (){
    
    if(app.config.getConf('radar_trial') == 1){
      switch(app.config.getConf('radar_trial_time')){
        case '1':
          var t = '30分钟'
          break
        case '2':
          var t = '2小时'
          break
        case '3':
          var t = '24小时'
          break
      }
      var noVipTip = '您还不是会员或者会员权限不足，无法使用雷达功能，请先开通会员或可体验试用' + t;
      var showTrialBtn = true
    }
    else{
      var noVipTip = '您还不是会员者会员权限不足，暂时无法使用雷达功能，请先开通/升级会员';
      var showTrialBtn = false
    }

    if(app.config.getConf('wx_audit_switch') == 1){
      var is_audit = true
    }else{
      var is_audit = false
    }
    
    var provideMethod = { visible: true, animateCss: 'wux-animate--fade-in' }
    this.setData({ noVipTip: noVipTip, showTrialBtn: showTrialBtn, provideMethod: provideMethod, is_audit: is_audit})

  },


  bindToTrial:function (){
    var that = this
    app.util.request({
      'url': 'entry/wxapp/openRadarTrial',
      success(res) {
        wx.showToast({
          title: '开通成功',
          icon: 'success'
        })
        setTimeout(function () {
          wx.redirectTo({
            url: './radar?card_id=' + that.data.card_id,
          })
        }, 2000)
      }
    })
  },
  toOpenVip: function () {
    wx.redirectTo({
      url: '../../pages/opt-version/opt-version',
    })
  },

  getTrackCardUserDtail: function () {
    
    var that = this
    
    that.data.isLoading = true

    app.util.request({
      'url': 'entry/wxapp/getTrackCuserDetail',
      'data': { page: that.data.page, card_id: that.data.trackUserC.card_id, to_card_id: that.data.card_id },
      success(res) {

        that.data.isLoading = false

        var data = res.data.data
        if (data.length > 0) {
          that.data.trackUserDetail = that.data.trackUserDetail.concat(data)
          that.setData({ trackUserDetail: that.data.trackUserDetail })
        } else {
          that.data.loadDone = true
        }

      }
    })

  },

  getCardClients: function () {

    var that = this

    that.data.isLoading = true
    app.util.request({
      'url': 'entry/wxapp/getCardClients',
      'data': { page: that.data.page, to_card_id: that.data.card_id },
      success(res) {
        that.data.isLoading = false
        var data = res.data.data
        if (data.length > 0) {
          that.data.clientList = that.data.clientList.concat(data)
          that.setData({ clientList: that.data.clientList })
        } else {
          that.data.loadDone = true
        }

      }
    })

  },

  /**
   * 查看访客互动详情
   */
  hdLookShow:function(){
    this.setData({ hdShow: true, })
  },
  /**
  * 关闭访客互动详情
  */
  hdLookHide: function () {
    this.setData({ hdShow: false, })
  },

  /**
   *访客-聊天-客户 选择
   */
  goChangeItemChioce:function(event){
    var cic = event.currentTarget.dataset.replyType
    var that = this
    if (cic == that.data.itemChioce ){
        return
    }else{
      that.setData({itemChioce:cic})
      console.log(cic)

      if (that.data.itemChioce == 1){
        that.data.currentPage = 0
        that.data.page = 1;
        that.data.loadDone = false
        that.setData({
          scrollTop: 0,
          trackList: [],
          isTrajectory: 1,
          sliderOffset: 0,
          sliderLeft: 2,
        });
        that.getTrackCardByTime()
      }

      if(that.data.itemChioce == 2){
        that.data.currentPage = 5
        that.data.page = 1;
        that.data.loadDone = false
        that.setData({
          sliderOffset: 32,
          sliderLeft: 2,
          scrollTop: 0,
          chatList: [],
        });
        that.getChatList()
      }
      
      if(that.data.itemChioce == 3){

        that.data.currentPage = 3
        that.data.page = 1;
        that.data.loadDone = false
        that.setData({
          scrollTop: 0,
          clientList: [],
          sliderOffset: 64,
          sliderLeft: 2,
        });
        that.getCardClients()

      }

    }
  },
  /**
   * 按轨迹-按访客 选择
   */
  goChangeViewState: function (event){
    var cic = event.currentTarget.dataset.replyType
    var that = this
    if (cic == that.data.isTrajectory) {
      return
    } else {

      that.setData({ isTrajectory: cic })
      if (cic == 1){

        that.data.currentPage = 0
        that.data.page = 1;
        that.data.loadDone = false
        that.setData({
          scrollTop: 0,
          trackList: [],
        });
        that.getTrackCardByTime()

      }
        
      if(cic == 2){

        that.data.currentPage = 1
        that.data.page = 1
        that.data.pageCopy = 1
        that.data.loadDone = false
        that.setData({
          scrollTop: 0,
          trackUser: [],
        });
        that.getTrackCardUser()

      }
        
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(typeof options.card_id == 'undefined' || options.card_id < 1)
      wx.navigateBack()

    this.setData({ card_id: options.card_id})

    this.getNoticeNum()
    this.getTrackCardByTime()
    
  }, 


  bindDownLoad: function () {

    var that = this;

    if (that.data.noVipTip !== false || that.data.isLoading === true) return

    if(that.data.loadDone !== true){

      that.data.page = that.data.page + 1
      if (that.data.currentPage == 0) {
        that.getTrackCardByTime()
      }
      if (that.data.currentPage == 1) {
        that.getTrackCardUser()
      }
      if (that.data.currentPage == 2) {
        that.getTrackCardUserDtail()
      }
      if (that.data.currentPage == 3) {
        that.getTrackCardUserDtail()
      }
      if (that.data.currentPage == 5) {
        that.getChatList()
      }

    }

    console.log('上拉加载')

  },

  scroll: function (event) {
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },

  refresh: function (event) {

    var that = this

    if (that.data.noVipTip !== false || that.data.isLoading === true) return

    that.data.page = 1;
    that.data.loadDone = false

    if (that.data.currentPage == 2)
      that.setData({ scrollTopD: 0 });
    else
      that.setData({ scrollTop: 0 })

    if (that.data.currentPage == 0){
      that.data.trackList=[]
      that.getTrackCardByTime()
    }

    if (that.data.currentPage == 1) {
      that.data.trackUser = []
      that.getTrackCardUser()
    }

    if (that.data.currentPage == 2) {
      that.data.trackUserDetail = []
      that.getTrackCardUserDtail()
    }

    if (that.data.currentPage == 3) {
      that.data.clientList = []
      that.getCardClients()
    }
    if (that.data.currentPage == 5) {
      that.data.chatList = []
      that.getChatList()
    }

    console.log('下拉刷新')

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

    this.getChatNum()
    
    if(this.data.itemChioce == 2 && this.data.isFresh === true)
      this.getChatListSilence()
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