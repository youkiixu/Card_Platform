// super_card/pages/square/square.js
var app = getApp()

let animationShowHeight = 300;//动画偏移高度
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    types: [],
    type_id:0,

    uid:0,
    my_userCards: [],

    lists: [],
    indexFresh: false,
    isFresh:false,
    page: 1,
    lastPage: false,
    lbpicture:[],
    msgList: [],

    typeStyle: 2,

    sort: 'create_time',
    sortIndex: 0,

    sortArr:[
      { skey: 'create_time', txt: '最新发布' }, 
      { skey: 'views', txt: '热门' }, 
      { skey: 'distance', txt: '附近' },
      { skey: 'recommend', txt: '推荐' }
           ],

    userPosLat: 0,
    userPosLng: 0,

    showDistanceSort: true,

    user_cards:[],
    card_id:0,
    card_id_copy: 0,
    cardPickerShow: { visible: false, animateCss: 'wux-animate--fade-out' },

    showCommentsModal: false,

    pingName: '',
    commentsContent: '',

    commentsId: 0,
    commentsIndex: 0,
    show_square_notice: false,

    showModalStatus: false,
    releaseOptions:[],

    recommendedDisplay:false,  //推荐选中

    loadingDone:false,
    hei: "",
  },

 
  //显示or隐藏推荐
  toggleRecommendInfo:function(){
    
    var that= this
    var isShow = that.data.recommendedDisplay ? false : true
   
    that.setData({ recommendedDisplay: isShow })
 
  },  



  zanSquare: function (e){

    var that = this
    //console.log(e)
    var index = e.currentTarget.dataset.index
    var id = e.currentTarget.dataset.id

    var that = this
    app.util.request({
      'url': 'entry/wxapp/toggleSquareZan',
      'method': 'POST',
      'data': {sid: id, show: 'list'},
      success(res) {
        
        var data = res.data.data
        
        //that.updateSquareZan(id, index)
        that.data.lists[index].showzan = false
        that.data.lists[index].likes = data.total
        that.data.lists[index].zans = data.list
        that.setData({ lists: that.data.lists })
        
      }
    })

  },


  setCommentsContent: function (e){

    this.data.commentsContent = e.detail.value

  },

  pingSquare: function (e){
    var that = this
    console.log(e)
    var index = e.currentTarget.dataset.index
    var id = e.currentTarget.dataset.id
    var content = that.data.commentsContent

    if(!content){
      wx.showToast({
        title: '请输入要发送的消息内容',
        icon: 'none'
      })
      return
    }

    var id = that.data.commentsId
    var index = that.data.commentsIndex

    app.util.request({
      'url': 'entry/wxapp/postSquareComments',
      'method': 'POST',
      'data': { sid: id, content: encodeURIComponent(content), show: 'list'},
      success(res) {

        console.log(res)
        if(res.data.message == 'noWay'){
          that.setData({ commentsContent: '', showCommentsModal: false })
          wx.showToast({
            title: '评论太频繁啦',
            icon: 'none'
          })
          return
        }

        var data = res.data.data
        that.data.lists[index].commentss = data.total
        that.data.lists[index].comments = data.list
        that.setData({ lists: that.data.lists, commentsContent: '', showCommentsModal: false })
        //that.updateSquareComments()

      }
    })

  },

  updateSquareComments: function () {
    
    var that = this

    var id = that.data.commentsId
    var index = that.data.commentsIndex

    app.util.request({
      'url': 'entry/wxapp/getSquareComments',
      'method': 'POST',
      'data': { sid: id, show: 'list' },
      success(res) {

        console.log(res, index)
        that.data.lists[index].comments = res.data.data
        that.setData({ lists: that.data.lists })
        console.log(that.data.lists)

      }
    })

  },

  togglePingModal: function (e){

    var that = this
    console.log(e)
    var index = e.currentTarget.dataset.index
    var id = e.currentTarget.dataset.id

    var isShow = that.data.showCommentsModal ? false : true
    
    if(typeof index != 'undefined'){

      that.data.commentsId = id

      that.data.commentsIndex = index

      that.data.lists[index].showzan = false
      
      var pingName = that.data.lists[index].card.name

      that.setData({ pingName: pingName, lists: that.data.lists, showCommentsModal: isShow })

    }else{

      that.setData({ showCommentsModal: isShow, commentsContent: '' })

    }
   
  },

  toggleZan: function (e){
    
    var that = this
    //console.log(e)
    var index = e.currentTarget.dataset.index
    var id = e.currentTarget.dataset.id
    
    var temp = that.data.lists[index].showzan ? false : true

    for(var x in that.data.lists) 
      that.data.lists[x].showzan = false 

    that.data.lists[index].showzan = temp

    that.setData({ lists: that.data.lists })
    //console.log(that.data.lists)
  },


  makeLinkWork: function (e) {
    var that = this
    console.log(e)
    var data = e.currentTarget.dataset
    
    if (!data.type) return
    data.type = parseInt(data.type)

    switch (data.type) {
      //跳转其它页面
      case 6:
        that.toOtherPage(data.value)
        break
      //跳转网页
      case 1:
        that.toWebView(data.value)
        break
      //跳转小程序
      case 2:
        that.toNavigateMiniPro(data.value, data.appid)
        break
      //拨打电话
      case 3:
        that.toPhoneCall(data.value)
        break
      //播放视频
      case 5:
        that.toViewVideo(data.value)
        break
      //显示二维码图片
      case 7:
        that.showQrcodePic(data.value)
        break
    }

  },

  showQrcodePic: function (picUrl) {

    wx.previewImage({
      current: picUrl,
      urls: [picUrl],
    })

  },

  toPhoneCall: function (phoneNum) {
    //仅为示例，并非真实的电话号码
    wx.makePhoneCall({
      phoneNumber: phoneNum
    })

  },

  toNavigateMiniPro: function (path, appid) {

    wx.navigateToMiniProgram({
      appId: appid,
      path: path,
      envVersion: 'release',
      success(res) {
        console.log('打开小程序成功')
      }
    })
  },

  toViewVideo: function (url) {
    console.log(url)
    var that = this
    wx.navigateTo({
      url: '../card-book/view-video?url=' + encodeURIComponent(url),
    })
  },

  toOtherPage: function (path) {

    wx.navigateTo({
      url: path,
    })
  },

  toWebView: function (url) {
    wx.navigateTo({
      url: '../card-book/web-view?url=' + encodeURIComponent(url),
    })
  },

  /**
   * 获取轮播图片
   */
  toGetCarouselPicyure:function(){
    var that = this
    app.util.request({
      'url': 'entry/wxapp/recSets',
      'method': 'POST',
      success(res) {
        console.log(res)
        that.setData({
          lbpicture: res.data.data
        })
      }
    })
    
  },

  /**
   * 获取公告内容
   */
  toGetAdalert:function(){
    var that = this
    app.util.request({
      'url':'entry/wxapp/goGetAdalert',
      'method':'POST',
      success(res){
        console.log(res)
        that.setData({
          msgList:res.data.data
        })
      }
    })
  },


  toDetailPage:function (e){
    //console.log('DETAIL')
    //console.log(e)
    var sid = e.currentTarget.dataset.sid
    var index = e.currentTarget.dataset.index
    
    wx.navigateTo({
      url: 'details?sid=' + sid + '&index=' + index
    })
  },

  toCardPage: function (e){
    //console.log('CARD')
    //console.log(e)
    var card_id = e.currentTarget.dataset.card_id
    wx.navigateTo({
      url: '../overt/overt?card_id=' + card_id
    })
  },

  previewImage: function (e){
    //console.log('IMAGE')
    //console.log(e)
    var sid = e.currentTarget.dataset.sid
    for(var x in this.data.lists)
      if(this.data.lists[x].id == sid){
        var pics = this.data.lists[x].pics.slice(0, 2)
        break;
      }
    //var pics = this.data.info.pics
    var idx = e.currentTarget.dataset.idx
    wx.previewImage({
      current: pics[idx],
      urls: pics
    })
  },
  
  /**
   * 点击标题切换当前页时改变样式
   */
  switchNav: function (e) {
    this.setData({ recommendedDisplay: false, rdml:false })
    var cur = e.currentTarget.dataset.current;
    //console.log(cur)
    if(cur == 0){
      this.setData({
        currentTab: 0
      })
      this.data.type_id = 0
    }else{
      var type_id = this.data.types[cur].id
      if (this.data.type_id != type_id) {
        this.setData({
          currentTab: cur
        })
        this.data.type_id = type_id
      }
    }

    this.data.lastPage = false
    this.data.page = 1
    this.getSquareLists()
  },

  // callPhone: function (e){
  //   var m = e.target.dataset.mobile
  //   wx.makePhoneCall({
  //     phoneNumber: m,
  //   })
  // },


  //联系方式 start
  contactCarder: function (e) {
    var that = this
    var i = e.currentTarget.dataset.ii
    if (that.data.lists[i].card.wx != '') {
      wx.showActionSheet({
        itemList: ['发消息', '加微信', '拨打电话'],
        success: function (res) {
          //console.log(res.tapIndex)
          var index = res.tapIndex;
          switch (index) {
            case 0:
              console.log('发消息')

              if (that.data.my_userCards.length < 1) {
                wx.showModal({
                  title: '系统提示',
                  content: '您还没有创建名片，只有创建名片后才可以咨询哦',
                  showCancel: false,
                  confirmColor: '#f90',
                  confirmText: '去创建',
                  success: function (res) {
                    wx.redirectTo({
                      url: '../basic/basic',
                    })
                  }
                });
                return false
              }

              app.util.request({
                'url': 'entry/wxapp/startChat',
                //'cachetime': '30',
                'data': { t_uid: that.data.lists[i].card.uid, t_card_id: that.data.lists[i].card.id, card_id: that.data.my_userCards[0].id },
                success(res) {

                  wx.navigateTo({
                    url: '../chat/chat?chat_id=' + res.data.data + '&from=overt'
                  })

                }
              })

              break;
            case 1:
              console.log('加微信')
              console.log(that.data.lists[i].card.wx)
              wx.setClipboardData({
                data: that.data.lists[i].card.wx,
                success: function (res) {

                  wx.getClipboardData({
                    success: function (res) {

                      wx.showToast({
                        title: '微信复制成功',
                      })
                    }
                  })

                }
              })
              break;
            case 2:
              console.log('拨打电话')
              console.log(that.data.lists[i].card.mobile)
              wx.makePhoneCall({
                phoneNumber: that.data.lists[i].card.mobile,
              })
              break;

          }
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      });
    } else {
      wx.showActionSheet({
        itemList: ['发消息', '拨打电话'],
        success: function (res) {
          //console.log(res.tapIndex)
          var index = res.tapIndex;
          switch (index) {
            case 0:
              console.log('发消息')

              if (that.data.my_userCards.length < 1) {
                wx.showModal({
                  title: '系统提示',
                  content: '您还没有创建名片，只有创建名片后才可以咨询哦',
                  showCancel: false,
                  confirmColor: '#f90',
                  confirmText: '去创建',
                  success: function (res) {
                    wx.redirectTo({
                      url: '../basic/basic',
                    })
                  }
                });
                return false
              }

              app.util.request({
                'url': 'entry/wxapp/startChat',
                //'cachetime': '30',
                'data': { t_uid: that.data.lists[i].card.uid, t_card_id: that.data.lists[i].card.id, card_id: that.data.my_userCards[0].id },
                success(res) {

                  wx.navigateTo({
                    url: '../chat/chat?chat_id=' + res.data.data + '&from=overt'
                  })

                }
              })

              break;
            case 1:
              console.log('拨打电话')
              console.log(that.data.lists[i].card.mobile)
              wx.makePhoneCall({
                phoneNumber: that.data.lists[i].card.mobile,
              })
              break;

          }
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      });
    }
},

  //联系方式 end


  // //获取当前用户名片
  getMyUserCards: function () {

    var that = this
    app.util.request({
      'url': 'entry/wxapp/getUserCard',
      'data': { 'no_need_whole': 1 },
      success(res) {
        var data = res.data.data
        that.setData({ my_userCards: data })
      }
      
    })

  },




  swtichListSort: function(e){
    console.log(e)
    var skey = e.currentTarget.dataset.skey
    var index = e.currentTarget.dataset.index
    this.setData({ sort: skey, sortIndex: index })
    console.log(this.data.sort)
    this.data.page = 1
    this.data.lastPage = false
    this.getSquareLists()
    if(this.data.typeStyle != 1){
       this.toggleRecommendInfo()
    }
  },


  getSquareLists: function (cb, mode = 'cover'){

    var that = this
    app.util.request({
      'url': 'entry/wxapp/getSquareList',
      'method': 'POST',
      'data': {type_id: this.data.type_id, page : this.data.page, sort: this.data.sort},
      success(res) {
        typeof cb == "function" && cb()
        //console.log(res)
        if (mode == 'append') {

          if (!res.data.data.length) {
            that.data.lastPage = true
            return false
          }
          //console.log(res.data.data)
          that.data.lists = that.data.lists.concat(res.data.data)
          //console.log(that.data.cardList)
          //if (!that.data.searchKey) that.data.cardListCopy = that.data.cardList

        } else {
          that.data.lists = res.data.data

          //if (!that.data.searchKey) that.data.cardListCopy = res.data.data
        }
      
        for (var x in that.data.lists) {
          if(typeof that.data.lists[x].label == 'string' && that.data.lists[x].label)
            that.data.lists[x].label = that.data.lists[x].label.split(',')
        }
        that.setData({
          lists: that.data.lists,
        })
      
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
    }.bind(this), 300)

  },

  /**
   * 跳转发布信息页面
   */
  goReleaseInfoInterface:function(e){
    console.log(this.data.card_id)
    var type_id = e.target.dataset.typeid
    this.hideModal()
    wx.navigateTo({
      url: 'release?type_id=' + type_id + '&card_id=' + this.data.card_id,
    })

  },


  checkIsCanPost: function (){

    var that = this
    

    app.util.request({
      'url': 'entry/wxapp/isCanPostSquare',
      'method': 'post',
      'data': { card_id: that.data.card_id },
      success(res) {
       
        if (res.data.message === 'ok') {
          
          that.showModal()

        } else {

          var uInfo = res.data.data
          console.log(uInfo)
          wx.navigateTo({
            url: '../../pagess/payment/payment-square?umoney=' + uInfo.money + '&card_id=' + that.data.card_id
          })

        }
      }
    })

  },


  //选择名片处理
  cardChange: function (e) {

    this.setData({ card_id: e.detail.value })
  },

  //确认名片选择
  openCardSelect: function () {

    this.data.card_id_copy = this.data.card_id
    this.toggleCardPicker()

  },

  //确认名片选择
  confirmCardSelect: function () {
    
    //if (this.data.card_id_copy !== this.data.card_id) {
      //for (var x in this.data.user_cards) {
        //if (this.data.user_cards[x].id == this.data.card_id)
          //this.setData({ card: this.data.user_cards[x] })
      //}
    //}
    this.toggleCardPicker()
    this.checkIsCanPost()
  },

  //确认名片选择
  cancelCardSelect: function () {

    this.setData({ card_id: this.data.card_id_copy })
    this.toggleCardPicker()

  },


  //显示/隐藏名片选择器
  toggleCardPicker: function () {
    this.data.cardPickerShow = this.data.cardPickerShow.visible === true ? { visible: false, animateCss: 'wux-animate--fade-out' } : { visible: true, animateCss: 'wux-animate--fade-in' }
    this.setData({ cardPickerShow: this.data.cardPickerShow })
  },


  toPostPage: function (e){

    //判断是否为会员，非会员不能开通商城
    var getUserInfo = wx.getStorageSync('getUserInfo');
    var isVip = getUserInfo.vip;

    if (isVip == 0) {
      wx.showModal({
        title: '系统提示',
        content: '您还不是会员，请先开通会员',
        showCancel: false,
        confirmColor: '#f90',
        confirmText: '去开通',
        success: function (res) {
          wx.redirectTo({
            url: '../opt-version/opt-version',
          })
        }
      });
      return
    }

    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }
    var that = this

    if(that.data.user_cards.length  > 0){

      if (that.data.user_cards.length == 1)
        that.checkIsCanPost()
      else
        that.openCardSelect()

    }else{

        wx.showModal({
          title: '系统提示',
          content: '您还没有创建名片，只有创建名片后才可以发布哦',
          showCancel: false,
          confirmColor: '#f90',
          confirmText: '去创建',
          success: function (res) {
            wx.navigateTo
            ({
              url: '../basic/basic',
            })
          }
        });
        return false

    }
    
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this

    //console.log(response)
    that.setData({ uid: app.UID })
    wx.getLocation({
          type: 'wgs84',
          success: function (res) {
            var latitude = res.latitude
            var longitude = res.longitude
            console.log(latitude, longitude)
            that.data.userPosLat = latitude
            that.data.userPosLng = longitude
            that.data.page = 1
            that.data.lastPage = false
            that.initSquarePage()
          },
          fail: function () {
            that.setData({ showDistanceSort: false })
            that.initSquarePage()
          }
     })
     that.getMyUserCards()    

  },

  initSquarePage: function (cb){

   var that = this

   var data = {
      type_id: this.data.type_id,
      page: that.data.page,
      sort: that.data.sort,
      userLat: that.data.userPosLat,
      userLng: that.data.userPosLng,
    }
    app.util.request({
      'url': 'entry/wxapp/initSquareList',
      'method': 'POST',
      'data': data,
      success(res) {

        typeof cb == "function" && cb()
        app.initSquarePage = false
        console.log(res)
        var data = res.data.data
        for (var x in data.lists) {
          if (data.lists[x].label)
            data.lists[x].label = data.lists[x].label.split(',')
        }
        that.setData({ types: data.types, lists: data.lists, lbpicture: data.lunbo, msgList: data.notice, user_cards: data.user_cards, loadingDone: true })
        
        if (that.data.user_cards.length > 0) that.setData({ card_id: that.data.user_cards[0].id })

        var winWid = wx.getSystemInfoSync().windowWidth;
        wx.getImageInfo({
          src: that.data.lbpicture[0].pic,
          success(res) {
            var imgh = res.height;　　//图片高度
            var imgw = res.width;
            var swiperH = winWid * imgh / imgw + "px"
            that.setData({ hei: swiperH })
          }
        })
        console.log('2222', that.data.lists)
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

    var that = this
    app.config.init(function () {
      app.config.set(that)
      app.config.footer(that)
      app.config.setAd(that)
      that.setData({ typeStyle: app.config.getConf('app_demand_set'), show_square_notice: app.config.getConf('show_square_notice') })
    })

    if(that.data.isFresh === true){
      that.data.type_id = 0
      that.setData({ currentTab: 0 })
      that.onPullDownRefresh()
    }

    if (app.initSquarePage === true) {
      that.data.type_id = 0
      that.setData({ currentTab: 0 })
      that.initSquarePage()
    }
    
    if (that.data.indexFresh !== false) that.freshListByIndex()
  },

  freshListByIndex: function (){
    var that = this
    var index = that.data.indexFresh
    var sid = that.data.lists[index].id
    app.util.request({
      'url': 'entry/wxapp/getSquareInfo',
      'method': 'POST',
      'data': { sid: sid, show: 'list' },
      success(res) {
        console.log(res)
        var data = res.data.data
        if (data.label.length > 0) data.label = data.label.split(',')
        that.data.lists[index] = data
        that.setData({ lists: that.data.lists })
        that.data.indexFresh = false
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
    this.data.page = 1
    this.data.lastPage = false
  
    var that = this
    
    this.initSquarePage(function () {
      wx.stopPullDownRefresh();
    })
    return

    that.getSquareLists(function () {

      wx.stopPullDownRefresh();
      that.data.isFresh = false

    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this

    if (that.data.lastPage === true) return false

    wx.showLoading({
      title: '加载中',
    })

    that.data.page++

    that.getSquareLists(function () {

      wx.hideLoading();

    }, 'append')
  },

  /**
   * 用户点击右上角分享
   */
  /*onShareAppMessage: function (e) {
    console.log(e)
    
    if(typeof e.target != 'undefined'){
      var that = this
      var index = e.target.dataset.index
      var title = that.data.lists[index].content
      var imageUrl = that.data.lists[index].pics.length > 0 ? that.data.lists[index].pics[0] : app.config.getConf('app_logo')
      that.data.lists[index].showzan = false
      that.setData({ lists: that.data.lists })
    }else{
      var title = app.config.getConf('app_name') + '，在这里您想要的...'
      var imageUrl = app.config.getConf('app_logo')
    }
    
    var path = 'super_card/pages/index/index'
  
    return {
      title: title,
      path: path,
      imageUrl: imageUrl,
      success: function (res) {

        if (res.errMsg == 'shareAppMessage:ok')
          wx.showToast({
            title: '分享成功',
            icon: 'success'
          })
        else
          wx.showToast({
            title: '分享失败',
            icon: 'none'
          })

      },
      fail: function (res) {

        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
        wx.showToast({
          title: '分享失败',
          icon: 'none'
        })

      },
    }

  }*/
  
})