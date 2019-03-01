// super_card/pages/index/index.js
import { $wuxPicker } from '../../components/wux'
var app = getApp()

const device = wx.getSystemInfoSync()
const dWidth = device.windowWidth

let animationShowHeight = 500;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    card_id : 0,
    uid : 0,
    cardDefBg: '',
    cardDefColor: '#6d6b6b',
    bgColorSelectIds: [],
    bgColorSelectK: ['红色', '黄色', '蓝色', '黑色'], 
    bgColorSelectV: ['red', 'yellow', 'blue', 'black'],
    textColorSelectV: ['', '', '', ''],
    bgMusicSelectV: ['', '', '', ''],
    bgPickValue: [0],
    cardLists: [],
    tabWidth: 0,
    showLine: true,
    provideMethod: { visible: false, animateCss: 'wux-animate--fade-out' },
    
    tipTop: '0',   //高
    tipLeft: '-500px',    //左偏移 
    showTip: false,
    showTipObj:{},
    plate:'',

    send_card_intro: '',

    app_name: '',
    identify_card_switch: 0,

    show_goTop: false,

    qrcodePicIsDesign: '',

    playAudio: false,
    audioCtx: {},

    playMusic: false,

    setDone:false,

    holiday_wishes_pic: '',

    msgNum: 0,

    arrvideo:[],//存放视频信息
    videoInfo:{}, //存放跳转到播放页面的视频信息


    show_card_cut:false,
    animationData: "",
    share_card_link:false,
    tempPoster: false,
    imgShow: 1,

    funcBtnArr: [
      { func: 'toShowCardQr', 'img': false, 'txt': '名片码', icon: 'icon-saoma', 'bgcolor': '#629ef8' },
      { func: 'showFmpShare', 'img': false, 'txt': '发名片', icon: 'icon-zhongxinfasong', 'bgcolor': '#8d6ff0' },
      { func: 'toWallpaperPage', 'img': false, 'txt': '每日海报', icon: 'icon-tupianweijihuo', 'bgcolor': '#eb9470' },
      { func: 'modifyCard', 'img': false, 'txt': '修改名片', icon: 'icon-fankuiyijian', 'bgcolor': '#58c187' },
      { func: 'toManageMall', 'img': false, 'txt': '商城管理', icon: 'icon-jifenshangcheng', 'bgcolor': '#6cbae5' },
      { func: 'toPostDynamic', 'img': false, 'txt': '发布动态', icon: 'icon-pengyouquan', 'bgcolor': '#f4b665'},
      { func: 'toEditWebsite', 'img': false, 'txt': '官网编辑', icon: 'icon-wangzhanshezhi', 'bgcolor': '#ab8df8' },
      { func: 'goRadar', 'img': false, 'txt': 'AI雷达', icon: 'icon-winfo-icon-quyusaomiao', 'bgcolor': '#6dbce6' },
    ],

    hideSwitchCard : true,
    hideSwitchStyle: true,

    shownc: false,
    plate_id: '',

    cardStyle: 1,
    recordingSec:0,
    recordingSecIntval:false
  },

  toPerfectCard:function (){
    wx.navigateTo({
      url: '../basic/basic?card_id=' + this.data.card_id
    })
  },

  editAvatar: function (){
    wx.navigateTo({
      url: '../avatar/avatar?card_id='+ this.data.card_id + '&from_index=1',
    })
  },

  /**
  * 显示/隐藏名片信息
  */
  showNewCard: function () {
    var that = this
    if (that.data.shownc === false) {
      that.setData({ shownc: true })
    } else {
      that.setData({ shownc: false })
    }
  },

  /**
   * 名片内容复制的值
   */
  copyThis: function (e) {
    var that = this
    var key = e.currentTarget.dataset.copytent
    var id = e.currentTarget.dataset.id
    console.log(e)
    that.setData({ plate_id: id })
    if (wx.setClipboardData) {
      wx.setClipboardData({
        data: key,
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              wx.showToast({
                title: '复制成功',
              })
            }
          })
        }
      })
    } else {
      console.log('当前微信版本不支持setClipboardData');
    }
  },

  showSwitchStyle: function () {
    var temp = this.data.hideSwitchStyle ? false : true
    this.setData({ hideSwitchStyle: temp })
    
  },

  cardTypeChange:function(){

    wx.navigateTo({
      url: '../../pagess/style-opt/style-opt?card_id='+ this.data.card_id +'&card_style=' + this.data.cardStyle,
    })

  },

  showSwitchCard: function (){
    var temp = this.data.hideSwitchCard ? false : true
    this.setData({ hideSwitchCard: temp })
  },

  //发名片显示
  showFmpShare:function(e){
    
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }

    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY(animationShowHeight).step()
    this.setData({
      animationData: animation.export(),
      share_card_link: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 1)
  },
  //发名片隐藏
  hideFmpShare:function(){
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
        share_card_link: false
      })
    }.bind(this), 200)
  },
  //拍名片
  showTakeCard:function(){
    wx.navigateTo({
      url: '../pat-card/camera-card',
    })
    this.hideModal()
  },

  // 显示遮罩层  
  showModal: function () {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY(animationShowHeight).step()
    this.setData({
      animationData: animation.export(),
      show_card_cut: true
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
        show_card_cut: false
      })
    }.bind(this), 200)

  },
  //显示切换名片
  showCardCut:function(){
    var that = this
    that.setData({ show_card_cut: true }, this.showModal())
  },
  //隐藏切换名片
  hideCardCut:function(){
    var that = this
    this.hideModal()
  },
  

  toChatPage: function (e) {
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }
    wx.navigateTo({
      url: '../chat/list',
    })
  },

  //官网编辑
  toEditWebsite:function(e){
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }
    wx.navigateTo({
      url: '../website-edit/website-edit?card_id=' + this.data.card_id
    })
  },

  //商城管理
  toManageMall: function (e) {
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }
    wx.navigateTo({
      url: '../mall-manage/mall-manage?card_id=' + this.data.card_id
    })
  },

  //发布动态
  toPostDynamic: function (e) {
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }
    wx.navigateTo({
      url: '../issue-dynamic/manage-dynamic?card_id=' + this.data.card_id
    })
  },

  //获客雷达
  goRadar: function (e) {
    
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    } 
    wx.navigateTo({
      url: '../../pagess/radar/radar?card_id=' + this.data.card_id
    })

  },

  /*// 图片
  goToImages:function(e){
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    } 
    wx.navigateTo({
      url: '../album/album?card_id=' + this.data.card_id
    })
  },
  //语音介绍
  speechRecording: function (e){
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    } 
    var that = this
    app.util.request({
      'url': 'entry/wxapp/isCanUploadAudio',
      'method': 'post',
      'data': { card_id: that.data.card_id },
      success(res) {
        //console.log(res)
        if (res.data.message === 'ok') {
          wx.navigateTo({
            url: '../sound-recording/sound-recording?card_id=' + that.data.card_id
          })
        } else {

          var uInfo = res.data.data
          console.log(uInfo)
          wx.navigateTo({
            url: '../payment/payment-audio?umoney=' + uInfo.money + '&card_id=' + that.data.card_id
          })

        }
      }
    })
  },
  //视频
  videoRecording: function (e){
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    } 
    var that = this
    app.util.request({
      'url': 'entry/wxapp/isCanUploadVideo',
      'method': 'post',
      'data': { card_id: that.data.card_id },
      success(res) {
        //console.log(res)
        if (res.data.message === 'ok') {
          wx.navigateTo({
            url: '../video/video?card_id=' + that.data.card_id
          })
        } else {

          var uInfo = res.data.data
          console.log(uInfo)
          wx.navigateTo({
            url: '../../pages/payment/payment-video?umoney=' + uInfo.money + '&card_id=' + that.data.card_id
          })

        }
      }
    })
  },*/

  playMusicAct: function () {

    var that = this
    var temp = {}
    for (var x in that.data.cardLists) {
      if (that.data.cardLists[x].id == that.data.card_id) {
        temp = that.data.cardLists[x]
        break
      }
    }
    //console.log(temp)
    that.data.audioCtx.src = temp.bg_music

    that.setData({ playAudio:false, playMusic: true })
    that.data.audioCtx.play()

  },

  stopMusicAct: function () {
    var that = this
    that.setData({ playMusic: false })
    that.data.audioCtx.stop()
  },


  playAudioAct:function(){

    var that = this
    var temp = {}
    for (var x in that.data.cardLists) {
      if (that.data.cardLists[x].id == that.data.card_id) {
        temp = that.data.cardLists[x]
        break
      }
    }
    //console.log(temp)
    that.data.audioCtx.src = temp.audio.path
    that.setData({ playAudio: true, playMusic: false })
    that.data.audioCtx.play()

  },

  stopAudioAct: function () { 
    var that = this
    that.setData({ playAudio: false })
    that.data.audioCtx.stop()
  },


  getQrcodePic:function (){
    // this.hideFmpShare()
    // app.util.request({
    //   'url': 'entry/wxapp/cardQrcodePic',
    //   'method': 'post',
    //   'data': {card_id: this.data.card_id},
    //   success(res) {
    //     var src = res.data.data
    //     wx.previewImage({
    //       current: src,
    //       urls: [src],
    //     })
    //   }
    // })
    var that = this
    that.hideFmpShare()
    app.util.request({
      'url': 'entry/wxapp/cardQrcodePic',
      'method': 'post',
      'data': { card_id: that.data.card_id },
      success(res) {
        that.setData({ tempPoster: res.data.data, imgShow: 2 })
      }
    })   

  },
  hidePoster: function () {
    this.setData({ imgShow: 1 })
  },
  savePosterPic: function () {
    var that = this

    if (!that.data.tempPoster) return
 
    wx.getImageInfo({
      src: this.data.tempPoster,
      success(res) {
        console.log(res.path)
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success(res) {
            wx.showToast({
              title: '保存至相册成功',
              icon: 'success'
            })
            that.setData({ imgShow: 1 })
          }
        })
      }
    })

  },

  // 一键回到顶部
  goTop: function (e) {
    if (wx.pageScrollTo) {
      this.setData({ show_goTop: false })
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    } else {

      wx.showToast({
        title: '暂不支持',
      })

    }
  },


  //预览相册下图片列表
  showAlbumPics:function (e){
    
    var pic_id = e.target.dataset.pic_id
    var albums = []
    for (var x in this.data.cardLists) {
      if (this.data.cardLists[x].id == this.data.card_id) {
        albums = this.data.cardLists[x].albums
        break
      }
    }
    //console.log(albums)
    var pics = []
    var cur_pic = ''
    for(var x in albums){
      for(var y in albums[x].pic_list){
        if (albums[x].pic_list[y].id == pic_id) cur_pic = albums[x].pic_list[y].path
        pics.push(albums[x].pic_list[y].path)
      }
    }
    
    //console.log(cur_pic)
    //console.log(pics)
  
    wx.previewImage({
      current: cur_pic,
      urls: pics
    })

  },

  //初始化小程序配置
  initAppConf: function (){
    wx.removeStorageSync('appConfig')
    var that = this
    app.config.init(function () {

      wx.setNavigationBarTitle({
       // title: app.config.getConf('app_name')
        title:'我的名片'
      })
      that.setData({ 
        send_card_intro: app.config.getConf('send_card_intro'), 
        app_name: app.config.getConf('app_name'), 
        identify_card_switch: app.config.getConf('identify_card_switch'),
        qrcodePicIsDesign: app.config.getConf('card_qrcode_design'),
        holiday_wishes_pic: app.config.getConf('holiday_wishes_pic'),
      })


      var funbtn = app.config.getConf('home_func_pic')
      if(funbtn.length == 8){
        for(var x in that.data.funcBtnArr){
          that.data.funcBtnArr[x].img = funbtn[x].iconPath
          that.data.funcBtnArr[x].txt = funbtn[x].text
        }
        that.setData({ funcBtnArr: that.data.funcBtnArr  })
      }
      console.log(that.data.funcBtnArr)
      
      
      app.config.footer(that)
      app.config.set(that)
    
    })
  },
  //检查用户是否被回传名片
  checkHaveComeback: function () {
    app.util.request({
      'url': 'entry/wxapp/checkHaveComeback',
      success(res) {
        //console.log(res)
        //if (res.data.data === true) wx.showTabBarRedDot({ index: 1 })
      }
    })
  },


  toShowCardQr:function (e){

    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    } 
    wx.navigateTo({
      url: '../conserve-card/conserve-card?card_id=' + this.data.card_id,
    })

  },

  



  //跳转至谁收藏了我页面
  toCollectPage: function (){
    wx.navigateTo({
      url: '../../pagess/collect/collect?card_id=' + this.data.card_id
    })
  },

  //跳转至制作壁纸页面
  toWallpaperPage: function (e) {
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }
    wx.navigateTo({
      url: '../../pages/wallpaper/wallpaper?card_id=' + this.data.card_id
    })
  },
  
  //刷新当前名片
  freshCurrCard: function (cb){

    var that = this

    //获取当前用户ID
    app.util.getUserInfo(function (response) {

      //console.log(response)
      app.UID = response.memberInfo.uid
      that.setData({ uid: response.memberInfo.uid })
      app.util.request({
        'url': 'entry/wxapp/bgLists',
        //'cachetime': '30',
        success(res) {
         
          app.freshIndex = false

          var data = res.data.data;
          var listLen = data.length;
          var ids = ['custom', '0'];
          var names = ['创建自定义背景', '白色(默认)'];
          var urls = ['custom', ''];
          var colors = ['custom', ''];
          var music = ['custom', ''];
          for (var i = 0; i < listLen; i++) {
            ids.push(data[i].id)
            names.push(data[i].name + (data[i].bg_music ? '♫' : ''))
            urls.push(data[i].bg_url);
            colors.push(data[i].text_color)
            music.push(data[i].bg_music)
          }
          that.setData({
            bgColorSelectIds: ids,
            bgColorSelectK: names,
            bgColorSelectV: urls,
            textColorSelectV: colors,
            bgMusicSelectV: music,
          });
          //console.log(names)
          //展示用户所有名片
          if(that.data.card_id > 0)
            wx.setStorageSync('index_card_id', that.data.card_id)
            
          that.showUserCard(cb)

          that.initAppConf()

        }
      })

    });


  },

  //相册图片展示形式切换
  togglePicShow: function (){
    var temp = this.data.showLine ? false : true
    this.setData({ showLine: temp })
  },


  //拨打名片手机号
  callMobile: function (e){
    
    var temp = {}
    for (var x in this.data.cardLists) {
      if (this.data.cardLists[x].id == this.data.card_id) {
        temp = this.data.cardLists[x]
        break
      }
    }
    //console.log(this.data.cardLists)
    var mobile = temp.mobile
   
    wx.makePhoneCall({
      phoneNumber: mobile
    })

  },

  //显示名片地址在地图中的位置
  showMapLocation: function (){

    var temp = {}
    for (var x in this.data.cardLists) {
      if (this.data.cardLists[x].id == this.data.card_id) {
        temp = this.data.cardLists[x]
        break
      }
    }

    var name = temp.company
    var address = temp.address
    var latitude = parseFloat(temp.latitude)
    var longitude = parseFloat(temp.longitude)
    console.log(latitude)
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      name : name,
      address: address,
      scale: 28
    })

  },

  //判断是否在数组中
  inArray: function (val, arr) {
    // 遍历是否在数组中
    for (var i = 0, k = arr.length; i < k; i++) {
      if (val == arr[i]) {
        return i + 1;
      }
    }
    // 如果不在数组中就会返回false
    return false;
  },

  //切换BgPicker的默认值
  toggleCardBgPickerV: function (){
    
    var temp = {}
    for (var x in this.data.cardLists) {
      if (this.data.cardLists[x].id == this.data.card_id) {
        temp = this.data.cardLists[x]
       
        break
      }
    }

    //console.log(temp.bg_id)
    //console.log(this.data.bgColorSelectIds)
    var flag = this.inArray(temp.bg_id, this.data.bgColorSelectIds)
    //console.log(flag)
    var bgV = flag !== false ? [flag - 1] : ['custom']
    //console.log(bgV)
    this.setData({ bgPickValue: bgV })

  },

  //切换用户名片显示
  toggleCard: function (e){
      console.log(e)
      
      var card_id = e.currentTarget.dataset.value
      if(this.data.card_id !== card_id){

        this.setData({ card_id : card_id})

        //this.showViewsCardUser();

        this.toggleCardBgPickerV()

        this.hideCardCut()
      }

      wx.request({
        url: app.util.url('entry/wxapp/setDefaultCard'),
        data: { 'card_id': card_id },
        success: function () {

        },
      })
  },

  getChatNum:function (){
    var that = this
    wx.request({
      url: app.util.url('entry/wxapp/ChatMsgNum'),
      success: function (res) {
        console.log(res)
        that.setData({ msgNum: res.data.data })
      }
    })
  },
  
  //显示用户所有名片
  showUserCard: function (cb){

    var that = this
   
    app.util.request({
      'url': 'entry/wxapp/getUserCard',
      //'cachetime': '30',
      success(res) {

        typeof cb == "function" && cb()

        var len = res.data.data.length
        if (len < 1) return

        wx.showShareMenu()
      
        if(len > 1){

          that.data.tabWidth  = ((dWidth - 20) / len) - 5
          that.setData({ tabWidth: that.data.tabWidth})

        }
  
        that.setData({ cardLists: res.data.data })

        console.log(that.data.cardLists)

        if (that.data.cardLists.length < 1){
          wx.hideShareMenu()
        }else{
          if (that.data.cardLists[0].no_perfect == 1)
            wx.hideShareMenu()
          else
            wx.showShareMenu()
        }
           
        
        var index_card_id = wx.getStorageSync('index_card_id')
        if (index_card_id > 0){

          for(var x in that.data.cardLists)
            if (index_card_id == that.data.cardLists[x].id)
              var card = that.data.cardLists[x]

          that.setData({ card_id: card.id , cardStyle: card.style })

          wx.removeStorageSync('index_card_id')

        }else{
          if (len > 0) that.setData({ card_id: res.data.data[0].id, cardStyle: res.data.data[0].style })
        }
        //that.showViewsCardUser();

        that.toggleCardBgPickerV()

   

      }

    })


  },


  //跳到视频播放页面
  toPlay: function (e) {
    var that = this

    //判断是哪张名片的信息
    var temp = {}
    for (var x in this.data.cardLists) {
      if (this.data.cardLists[x].id == this.data.card_id) {
        temp = this.data.cardLists[x]
        break
      }
    }

    var index = e.currentTarget.dataset.index
    console.log(that.data.cardLists)
    var msg = temp.video[index]
    msg = JSON.stringify(msg)
    wx.navigateTo({
      url: '../video-watch/video-watch?card_id=' + that.data.card_id + '&Msgs=' + msg + '&forwarding=' + 1  
    })

  },
 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

    
    var that = this;


    //console.log(options)


    //获取当前用户ID
    app.util.getUserInfo(function (response) {

      app.UID = response.memberInfo.uid
      that.setData({ uid : response.memberInfo.uid })
      app.util.request({
        'url': 'entry/wxapp/bgLists',
        //'cachetime': '30',
        success(res) {
          var data = res.data.data;
          var listLen = data.length;
          var ids = ['custom', '0'];
          var names = ['创建自定义背景', '白色(默认)'];
          var urls = ['custom', ''];
          var colors = ['custom', ''];
          var music = ['custom', ''];
          for (var i = 0; i < listLen; i++) {
            ids.push(data[i].id)
            names.push(data[i].name + (data[i].bg_music ? '♫' : ''))
            urls.push(data[i].bg_url);
            colors.push(data[i].text_color)
            music.push(data[i].bg_music)
          }
          that.setData({
            bgColorSelectIds: ids,
            bgColorSelectK: names,
            bgColorSelectV: urls,
            textColorSelectV: colors,
            bgMusicSelectV: music,
          });
          //console.log(names)
          //展示用户所有名片
          that.showUserCard()
        
          //that.checkHaveComeback()
          that.initAppConf()


          that.data.audioCtx = wx.createInnerAudioContext()
          that.data.audioCtx.autoplay = true
          that.data.audioCtx.onPlay(() => {
            if(that.data.playAudio)
                that.startSecondsCount()
          })
          that.data.audioCtx.onStop(() => {
            console.log('停止播放')
            clearInterval(that.data.recordingSecIntval)
            that.setData({ recordingSec: 0 })
          }),             
          that.data.audioCtx.onEnded(() => {
            console.log('自然结束播放')
            clearInterval(that.data.recordingSecIntval)
            that.setData({ recordingSec: 0, playMusic: false, playAudio: false })
          })

          that.playWelcomeAudio()

        }
      })
      
    });

    
  },

  startSecondsCount: function () {

    var that = this
    that.setData({ recordingSec: 0 })
    that.data.recordingSecIntval = setInterval(function () {
      that.data.recordingSec++
      that.setData({ recordingSec: that.data.recordingSec })
    }, 1000)

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

    //保证一进去首页，就能实时获取到最新的用户信息
    app.util.request({
      url: 'entry/wxapp/getUserInfo',
      success: function (res) {
        var getUserInfo = res.data.data;
        wx.setStorageSync('getUserInfo', getUserInfo);
      }
    });

    if(app.freshIndex === true) this.freshCurrCard()

    if (this.data.cardLists.length < 1) {
      wx.hideShareMenu()
    } else {
      if (this.data.cardLists[0].no_perfect == 1){
        wx.hideShareMenu()
      }else{
        wx.showShareMenu()
        app.config.setUserComeback()
      }
    }

    this.getChatNum()
  },

  //播放欢迎语
  playWelcomeAudio: function (){
    var that = this
    app.util.request({
      'url': 'entry/wxapp/getWelcomMp3',
      //'cachetime': '30',
      success(res) {

        console.log(res)
        if(res.data.message == 'ok'){
          that.data.audioCtx.src = res.data.data
          that.data.audioCtx.play()
        }

      }
    })

  },

  /**
    * 生命周期函数--监听页面隐藏
    */
  onHide: function () {
    if (typeof this.data.audioCtx.stop != 'undefined')
      this.data.audioCtx.stop()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (typeof this.data.audioCtx.destroy != 'undefined')
      this.data.audioCtx.destroy()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
    if(this.data.cardLists.length > 0){

      this.freshCurrCard(function () {
        wx.stopPullDownRefresh()
      })

    }else{

      wx.showToast({
        title: '赶快创建名片吧',
        icon: 'none'
      })
      this.initAppConf()
      wx.stopPullDownRefresh()

    }

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  toPatCardPage: function (e) {
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }
    wx.navigateTo({
      url: '../pat-card/pat-card'
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    //console.log(res)
    this.hideFmpShare()
    
    if (res.from != 'menu' && res.target.id != 'sendCardBtn') {

      var title = '点击查看全图'
      var path = '/super_card/pages/photo-watch/photo-watch?card_id=' + this.data.card_id + '&album_id=' + res.target.dataset.album_id + '&pic_id=' + res.target.dataset.pic_id + '&from_act=share'
      var imgUrl = res.target.dataset.src


    }else{

      if(this.data.card_id < 1){
        wx.showToast({
          title: '请先创建名片',
          icon: 'none',
          duration: 2000
        })
        return false
        
      }

      //var title = '我的'+ this.data.app_name +'，请惠存'
      var item_forward_title = app.config.getConf('item_forward_title')
      var item_forward_pic = app.config.getConf('item_forward_pic')

      var title = item_forward_title ? item_forward_title : '您好，这是我的名片，请惠存'
      var path = '/super_card/pages/overt/overt?card_id=' + this.data.card_id +'&from_act=share'
      var imgUrl = item_forward_pic ? item_forward_pic : ''

    }
    console.log(path)
    return {
      title: title,
      path: path,
      imageUrl: imgUrl,
      success: function (res) {

        if (res.errMsg == 'shareAppMessage:ok')　　　　
          wx.showToast({
            title: '分享成功',
            icon:'success'
          })
        else
          wx.showToast({
            title: '分享失败',
            icon: 'none'
          })
        console.log('分享路径：', path)
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

  },

  
  /**
   * 修改名片
   */
  modifyCard: function (e){
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }
    var that = this;
    wx.showActionSheet({
      itemList: ['基本信息', '更多信息', '图片', '语音介绍', '视频', '隐私设置'],
      success: function (res) {
        //console.log(res.tapIndex)
        var index = res.tapIndex;
        switch(index){
          case 0:
            console.log('基本信息')
            wx.navigateTo({
              url: '../basic/basic?card_id=' + that.data.card_id
            })
          break;
          case 1:
            console.log('更多信息')
            wx.navigateTo({
              url: '../more-info/more-info?card_id=' + that.data.card_id
            })
          break;
          case 2:
            console.log('图片')
            wx.navigateTo({
              url: '../album/album?card_id=' + that.data.card_id
            })
          break;

          case 3:
            app.util.request({
              'url': 'entry/wxapp/isCanUploadAudio',
              'method': 'post',
              'data': { card_id: that.data.card_id },
              success(res) {
                //console.log(res)
                if (res.data.message === 'ok') {
                  wx.navigateTo({
                    url: '../sound-recording/sound-recording?card_id=' + that.data.card_id
                  })
                } else {
                  var uInfo = res.data.data
                  console.log(uInfo)
                  
                  wx.navigateTo({
                    url: '../../pagess/payment/payment-audio?umoney=' + (uInfo == null ? 0 : uInfo.money ) + '&card_id=' + that.data.card_id
                  })

                }
              }
            })
          break;
          
          case 4:
            console.log('视频')
            app.util.request({
              'url': 'entry/wxapp/isCanUploadVideo',
              'method': 'post',
              'data': { card_id: that.data.card_id },
              success(res) {
                if (res.data.message === 'ok') {
                  wx.navigateTo({
                    url: '../video/video?card_id=' + that.data.card_id
                  })
                } else {

                  var uInfo = res.data.data
                  console.log(uInfo)
                  wx.navigateTo({
                    url: '../../pagess/payment/payment-video?umoney=' + (uInfo == null ? 0 : uInfo.money) + '&card_id=' + that.data.card_id
                  })

                }
              }
            })
            break;

          case 5:
            console.log('隐私设置')
            wx.navigateTo({
              url: '../secret-fit/secret-fit?card_id=' + that.data.card_id
            })
          break;
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    });

  },

  toCreateCard: function (e){
    console.log(e)
    this.hideModal()
    if(typeof e.detail.formId != 'undefined') app.formIds.push(e.detail.formId)
    app.util.request({
      'url': 'entry/wxapp/isCanCreate',
      success(res) {

        //console.log(res)
        if (res.data.message === 'ok'){
          wx.navigateTo({
            url: '../basic/basic'
          })
        }else{
          var uInfo = res.data.data
          console.log(uInfo)
          wx.navigateTo({
            url: '../../pagess/payment/payment?umoney=' + uInfo.money + '&cardnum=' + uInfo.card_num
          })
        }

      }
    })
  },
  
  /*
   * 展示背景变色选择器
   */
  showBgChangeOption: function (){
    var that = this;
    wx.showActionSheet({
      itemList: that.data.bgColorSelectK,
      success: function (res) {
        that.changeCardBg(that.data.bgColorSelectIds[res.tapIndex], that.data.bgColorSelectV[res.tapIndex], that.data.textColorSelectV[res.tapIndex], that.data.bgMusicSelectV[res.tapIndex])
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  
  /*
   *修改名片背景   
   */
  changeCardBg: function (bg_id, bgColor, textColor, bgMusic) {
    
    var that = this;

    var data = {
                card_id : that.data.card_id,
                bg_id : bg_id,
                bg_img: bgColor,
                bg_color: textColor,
                bg_music: bgMusic
              }
    app.util.request({
      'url': 'entry/wxapp/saveCardBg',
      'method': 'post',
      'data': data,
      success(res) {

        for (var x in that.data.cardLists) {
          if (that.data.cardLists[x].id == that.data.card_id)
            that.data.cardLists[x] = res.data.data
        }
        //console.log(cardLists)
        that.setData({
          card_id: that.data.card_id,
          cardLists: that.data.cardLists,
        });
        that.toggleCardBgPickerV()
      }

    })

   
    that.setData({
      cardDefBg: bgColor,
      cardDefColor: textColor
    });
  
  },  

  showBgPick : function () {

    wx.pageScrollTo({
      scrollTop: 10
    })

    var that = this;
    $wuxPicker.init('bglist', {
      title: "请选择名片背景",
      cols: [
        {
          textAlign: 'center',
          values: that.data.bgColorSelectK,
          //displayValues: [1, 2, 3, 4, 5, 6]
        }
      ],
      value: that.data.bgPickValue,
      onChange(p) {
        //console.log(p) 
      },
      onDone(p) {
        if(that.data.textColorSelectV[p.valueIndex] == 'custom'){
           
          app.util.request({
            'url': 'entry/wxapp/isCanCreateBg',
            success(res) {
              //console.log(res)
              if (res.data.message === 'ok'){
                wx.navigateTo({
                  url: '../../pages/custom/custom?card_id=' + that.data.card_id
                })
              }else{
                var uInfo = res.data.data
                console.log(uInfo)
                wx.navigateTo({
                  url: '../../pagess/payment/payment-custom?umoney='+ uInfo.money +'&bgnum='+ uInfo.bg_num +'&card_id=' + that.data.card_id
                })
              }
              return
            }
          })
           
        }else{
          that.changeCardBg(that.data.bgColorSelectIds[p.valueIndex], that.data.bgColorSelectV[p.valueIndex], that.data.textColorSelectV[p.valueIndex], that.data.bgMusicSelectV[p.valueIndex])
        }
       
        //console.log(p)
      },
      onCancel(p){
        //console.log('cancel')
      }
    })
  },

  showIntro: function (){
    /*app.util.message({
      title: '活动不存在或是已经被删除',
      type : 'error'
    });
    return false*/
    wx.showModal({
      title: '发名片步骤',
      content: '我不知道，是不是好',
      showCancel: false,
      confirmText: '我知道了'
    })

  },
  
  

  //如何发名片
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

  
  showTips: function (e) {
    var that = this;

    that.setData({ showTip:false })

    var id = e.target.id;

    //console.log(e);
    var query = wx.createSelectorQuery()
    query.select('#' + e.target.id).boundingClientRect()
    query.exec(function (res) {

      //console.log(res);

      var tops = (res[0].top - 36) + 'px';
      if (id == 'card-Tips-mobile' ){     
        var lefts = (res[0].left + res[0].width / 2 - 72) + 'px';  //俩个按钮
        var showTipObj = { tapFun: 'callMobile', tapText:'拨打电话'}
      } else if (id == 'card-Tips-address'){     
        var lefts = (res[0].left + res[0].width / 2 - 72) + 'px';  //俩个按钮
        var showTipObj = { tapFun: 'showMapLocation', tapText: '地图显示' }
      }else{
        var lefts = (res[0].left + res[0].width / 2 - 36) + 'px';  //一个按钮
        var showTipObj = false
      }
      
      //console.log(showTipObj);

      that.setData({
        tipTop: tops,
        tipLeft: lefts,
        showTip: true,
        showTipObj: showTipObj,
        plate: e.target.dataset.plate
      })

    })

  },

  // 复制剪切板的内容
  copyShare: function(){
    var that = this;
    if (wx.setClipboardData) {
      wx.setClipboardData({
        data: this.data.plate,
        success: function (res) {
          wx.showToast({
            title: '复制成功',
          })
        }
      })
    } else {
      console.log('当前微信版本不支持setClipboardData');
    }
  },

  tapPage: function () {
    if (this.data.showTip) this.toggleShowTip()
  },
  onPageScroll: function (e) {

    if (this.data.show_goTop === false && e.scrollTop >= 200) this.setData({ show_goTop: true })
    if (this.data.show_goTop === true && e.scrollTop < 200) this.setData({ show_goTop: false })

    if (this.data.showTip) this.toggleShowTip()

    if (this.data.hideSwitchCard === false) this.showSwitchCard() 
    if (this.data.hideSwitchStyle === false) this.showSwitchStyle() 
  },
  //切换tip状态
  toggleShowTip: function () {

    this.data.showTip = this.data.showTip ? false : true
    this.setData({ showTip: this.data.showTip })

  },

})