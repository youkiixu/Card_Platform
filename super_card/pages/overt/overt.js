// super_card/pages/overt/overt.js
import { $wuxDialog } from '../../components/wux'
var app = getApp()
let animationShowHeight = -500;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    card_id: 0,
    card:{},
    is_collect: false,
    is_collect_edit: false,
    check_name: 1,
    showLine: true,
    collect_name: '',
    allow_collect: 1,

    tipTop: '0',   //高
    tipLeft: '-500px',    //左偏移 
    showTip: false,
    showTipObj: {},
    plate: '',

    my_card_id: 0,
    my_card: {},
    my_userCards: [],
    cardPickerShow: { visible: false, animateCss: 'wux-animate--fade-out' },

    showRmBtn: false,
    fromGroupId: 0,

    isComeBack: false,
    comeBackMsg: '您好，很高兴认识您！',

     cardVideo:[], //存放用户视频信息

    from_act: '',
    showBackIndex: false,
    
    showHouseIndex: true,

    noOpen:false,

    uid: '',
    
    show_goTop: false,

    qrcodePicIsDesign: '',

    isFresh: false,

    showCreateBtn: false,

    viewsUser:[],
    viewsUserCount:0,
  
    playAudio: false,
    playMusic: false,
    audioCtx: {},


    loadingDone:false,


    isChat: false,
    
    //guideHide:false,

    plate_id: '',
    // shownc:false,
    shownc: true,

    recordingSec: 0,
    recordingSecIntval: false,

    func_arr: [{ 'img': false, txt: false }, { 'img': false, txt: false }, { 'img': false, txt: false }, { 'img': false, txt: false }, { 'img': false, txt: false }],

    show_top_frame: false, 
    animationData: "",

    animationXX:"",
    showecp:true,
    isAnimationIng:false,
    showWebBtn:false, //显示红点
    openWeb:true, //判断是否显示商城在名片信息上

    showbtn: false,
    showText:false,
    showFilter:false,

    agent_id: 0,


  },

  //防止弹窗穿透
  stopPageScroll() {
    return
  },


  // 创建名片滑块宽度变小
  changeBigSetup: function () {
    var that = this

    if (that.data.showCreateBtn === false || this.data.isAnimationIng === true || that.data.showecp === false) return

    that.data.isAnimationIng = true
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation;
    animation.width("88rpx").step();

    this.setData({
        animationXX: animation.export(),
        showecp:false
    }, function (){
        console.log('here')
        that.data.isAnimationIng = false
    })

  },
 
  // 创建名片滑块宽度变大
  changeBigSetups: function () {
    var that = this

    if(that.data.showCreateBtn === false || this.data.isAnimationIng === true || that.data.showecp === true) return

    that.data.isAnimationIng = true
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation;
    animation.width("88vw").step();

    this.setData({
        animationXX: animation.export(),
        showecp: true
    }, function () {
        that.data.isAnimationIng = false
    })
    
  },
  // 创建名片
  // toCreateCard: function(){
  //   wx.navigateTo({
  //     url: '../basic/basic',
  //   })
  // },


  //跳到视频播放页面
  toPlay: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var msg = that.data.card.video[index]
    msg = JSON.stringify(msg)
    wx.navigateTo({
      url: '../video-watch/video-watch?card_id=' + that.data.card_id + '&Msgs=' + msg + '&forwarding=' + 1
    })
  },
  
  getChatNum: function () {
    var that = this
    wx.request({
      url: app.util.url('entry/wxapp/ChatMsgNum'),
      data: { 'f_card_id': that.data.card_id },
      success: function (res) {
        //console.log(res)
        that.setData({ msgNum: res.data.data })
      }
    })
  },


  //获取微信绑定的手机号
  getPhoneNumber: function (e) {

    var that = this
    //console.log(e.detail)
    if(e.detail.iv){
      
        app.util.request({
          url: 'entry/wxapp/updateCardMobile',
          data: {
            card_id: that.data.my_userCards[0].id,
            iv: e.detail.iv,
            encryptedData: e.detail.encryptedData
          },
          method: 'POST',
          cachetime: 0,
          success: function (res) {
            console.log(res)
            if(res.data.data.phoneNumber){
                that.data.my_userCards[0].mobile = res.data.data.phoneNumber
                that.setData({ my_userCards: that.data.my_userCards })
            }
            that.toChat()
          },
          fail: function (){
            that.toChat()
          }
        });

    }else{
      that.toChat()
    }
  },

  /**
   * 名片内容复制的值
   */
  copyThis:function(e){
    var that = this
    var key = e.currentTarget.dataset.copytent 
    var id = e.currentTarget.dataset.id 
    console.log(e)
    that.setData({ plate_id:id  })
    if (wx.setClipboardData) {
      wx.setClipboardData({
        data: key,
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              //console.log(res.data) // data
              wx.showToast({
                title: '复制成功',
              })
              if (that.data.plate_id == 'card-Tips-wx')
                app.config.cardTrack(that.data.card_id, 4, 'copy')
              else if (that.data.plate_id == 'card-Tips-email')
                app.config.cardTrack(that.data.card_id, 5, 'copy')
              else if (that.data.plate_id == 'card-Tips-company')
                app.config.cardTrack(that.data.card_id, 6, 'copy')
            }
          })
        }
      })
    } else {
      console.log('当前微信版本不支持setClipboardData');
    }
  },

  /**
   * 显示/隐藏名片信息
   */
  showNewCard:function(){
    var that = this
    if ( that.data.shownc ===false ){
      that.setData({ shownc:true  })
    }else{
      that.setData({ shownc: false })
    }
  },

  /**
   * 去掉提示遮罩层
   */
  /*goChcangeGuide:function(){
    this.setData({
      guideHide: true
    })
  },*/


  toChat: function (e){
    var that = this;

    if (that.checkUserIsCreate('和她/他聊天') === false) return

    if (that.data.my_userCards.length > 1){
      that.setData({ isChat: true })
      that.openCardSelect(e)
    }else{
      that.startChat('')
    }
 
    /*wx.navigateTo({
      url: '../chat/chat',
    })*/

  },

  playMusicAct: function () {

    var that = this
  
    that.data.audioCtx.src = that.data.card.bg_music
    that.setData({ playAudio: false, playMusic: true })
    that.data.audioCtx.play()

  },

  stopMusicAct: function () {
    var that = this
    that.setData({ playMusic: false })
    that.data.audioCtx.stop()
  },

  playAudioAct: function () {
    var that = this

    that.data.audioCtx.src = that.data.card.audio.path
    that.setData({ playAudio: true, playMusic: false })
    that.data.audioCtx.play()

    app.config.cardTrack(that.data.card_id, 9, 'copy')
  },

  stopAudioAct: function () {
    var that = this
    that.setData({ playAudio: false })
    that.data.audioCtx.stop()
  },

  //获取查看过该名片的微信用户
  showViewsCardUser: function (){

    var that = this
    app.util.request({
      'url': 'entry/wxapp/viewsCardUser',
      'method': 'post',
      'data': { card_id: that.data.card_id },
      success(res) {
        console.log(res)
        that.setData({ viewsUser: res.data.data.list,  viewsUserCount: res.data.data.total})
      }
    })

  },

  //名片码图
  getQrcodePic: function () {

    if (this.data.card.public > 1 && this.checkUserIsCreate('获取该名片码图') === false) return

    app.util.request({
      'url': 'entry/wxapp/cardQrcodePic',
      'method': 'post',
      'data': { card_id: this.data.card_id },
      success(res) {
        var src = res.data.data
        wx.previewImage({
          current: src,
          urls: [src],
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
  showAlbumPics: function (e) {
    var that = this


    var pic_id = e.target.dataset.pic_id
    var album_id = e.target.dataset.album_id
    var albums = that.data.card.albums
    var pics = []
    var cur_pic = ''
    for (var x in albums) {
      for (var y in albums[x].pic_list) {
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

    app.util.request({
      'url': 'entry/wxapp/getCardAlbumPics',
      'method': 'POST',
      'data': { 'card_id': that.data.card_id, 'album_id': album_id, 'pic_id': pic_id, 'watch': 1 },
      success(res) {
      }
    })


  },

  //预览名片头像
  previewCardPic:function (){
    
    wx.previewImage({
      current: this.data.card.picture, // 当前显示图片的http链接
      urls: [this.data.card.picture]
    })

  },


  //小房子返回首页
  backIndex:function (e){
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }

    wx.switchTab({
      url: '../index/index',
    });

  },

  //+号返回首页
  toReturnIndex: function () {
    wx.switchTab({
      url: '../index/index',
    });
  },

  //未开通商城/官网
  noOpenReturn: function () {
    wx.switchTab({
      url: '../index/index',
    });
  },

  //设置回传消息
  setComeBackMsg: function (e){
    this.setData({ comeBackMsg: e.detail.value })
  },

  //检查是否给当前名片用户回传过
  checkIsComeback: function (watch){

    var that = this
    app.util.request({
      'url': 'entry/wxapp/isComeBack',
      //'cachetime': '30',
      'data': { t_uid: that.data.card.uid },
      success(res) {
        if(watch == 2){
          that.setData({ isComeBack: true })
          return 
        }
        var isComeBack = res.data.data
        that.setData({ isComeBack: isComeBack })
        //if (isComeBack === false) 
        that.getMyUserCards()    
      }
    })

  },


  toCreateCard: function (e) {

    if (typeof e.detail.formId != 'undefined') app.formIds.push(e.detail.formId)
    
    if (this.data.my_userCards[0].no_perfect == 1){
      wx.navigateTo({
        url: '../basic/basic?card_id=' + this.data.my_userCards[0].id
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
  


  //从名片组中移除
  rmCardGroup: function (e){

    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }

    var that = this
    if(that.data.fromGroupId < 1) return 
    $wuxDialog.confirm({
      title: '',
      content: '确认要移除该名片吗？',
      onConfirm(e) {

        app.util.request({
          'url': 'entry/wxapp/removeCardGroup',
          //'cachetime': '30',
          'data': { card_id: that.data.card_id, group_id: that.data.fromGroupId },
          success(res) {

            wx.showToast({
              title: res.data.message,
              icon: 'success'
            })
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2]; // 上一级页
            prevPage.setData({ isFresh: true })
            setTimeout(function () { wx.navigateBack() }, 2000)

          }

        })

      },
      onCancel(e) {

      },
    })
   

  },


  //选择名片处理
  cardChange: function (e) {

    this.setData({ my_card_id: e.detail.value })
  },

  //确认名片选择
  openCardSelect: function (e) {

    var that = this;

    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }

    if (this.checkUserIsCreate('回传') === false) return

    if (that.data.my_userCards[0].no_perfect == 1) {
      wx.showModal({
        title: '系统提示',
        content: '请先完善您的名片',
        showCancel: false,
        confirmColor: that.data.themeColor,
        confirmText: '去完善',
        success: function (res) {
          wx.navigateTo({
            url: '../basic/basic?card_id=' + that.data.my_userCards[0].id,
          })
        }
      });
      return false
    }

    this.toggleCardPicker()

  },


  //确认名片选择
  confirmCardChat: function (e) {
    
    this.toggleCardPicker()

    var formId = e.detail.formId;
    //console.log(formId)
  
    this.startChat(formId)

  },

  startChat: function (formId){

    var that = this
    app.util.request({
      'url': 'entry/wxapp/startChat',
      //'cachetime': '30',
      'data': { t_uid: that.data.card.uid, t_card_id: that.data.card.id, card_id: that.data.my_card_id, form_id: formId },
      success(res) {

        app.config.cardTrack(that.data.card_id, 5, 'praise')

        wx.navigateTo({
          url: '../chat/chat?chat_id='+ res.data.data + '&from=overt'
        })

      }
    })

  },


  //确认名片选择
  confirmCardSelect: function (e) {
    this.toggleCardPicker()
    
    
    var formId = e.detail.formId;
    console.log(formId)
    /*wx.showModal({
      title: 'test',
      content:formId,
    })
    return*/
    var that = this
    //回传开始
    app.util.request({
      'url': 'entry/wxapp/comeBackCard',
      //'cachetime': '30',
      'data': { t_uid: that.data.card.uid, t_card_id: that.data.card.id , card_id: that.data.my_card_id, msg: that.data.comeBackMsg , form_id : formId},
      success(res) {

        wx.showToast({
          title: res.data.message,
          icon:'success'
        })
        if(that.data.card.public > 1){
          if(that.data.card.uid < 1)
            that.freshCurrentPage(false, 2)
          else
            that.freshCurrentPage(false)
        }else{
          that.setData({ isComeBack: true })
        }
      }
    })
  },

  //确认名片选择
  cancelCardSelect: function () {

    //this.setData({ card_id: this.data.card_id_copy })
    this.toggleCardPicker()

  },


  //显示/隐藏名片选择器
  toggleCardPicker: function () {
    this.data.cardPickerShow = this.data.cardPickerShow.visible === true ? { visible: false, animateCss: 'wux-animate--fade-out' } : { visible: true, animateCss: 'wux-animate--fade-in' }
    this.setData({ cardPickerShow: this.data.cardPickerShow })
  },

  //获取当前用户名片
  getMyUserCards:function (){

    var that = this
    app.util.request({
      'url': 'entry/wxapp/getUserCard',
      'data': { 'no_need_whole': 1 },
      success(res) {

        var data = res.data.data
        if (data.length < 1) {
          that.setData({ showCreateBtn: true })
          return false
        }

        if(data[0].no_perfect == 1)
          that.setData({ showCreateBtn: true })
        

        that.setData({ my_userCards: data, my_card_id: data[0].id })
        
      }
    })

  },



  //添加到手机通讯路
  addPhoneContact:function (e){

    var that = this;
    
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }


    //if (that.checkUserIsCreate('存入手机') === false) return

    wx.addPhoneContact({
      photoFilePath: this.data.card.picture, //头像
      firstName: this.data.card.name,    //姓名
      nickName: this.data.card.intro_title,  //昵称
      mobilePhoneNumber: this.data.card.mobile,  //手机
      organization: this.data.card.company,  //公司
      title: this.data.card.title,   //职位
      addressState: this.data.card.province, //省
      addressCity: this.data.card.city,   //城市
      addressStreet: this.data.card.dict+this.data.card.address,  //地址
      url: this.data.card.www,  //网址
      weChatNumber: this.data.card.wx, //微信
      email: this.data.card.email,   //邮箱
      hostNumber: this.data.card.tel,  //公司电话
      workFaxNumber: this.data.card.fax, //工作传真
      remark: this.data.card.intro_content,  //备注
      success: function (res){
        console.log(res)
      },
    })

    app.config.cardTrack(that.data.card_id, 1, 'copy')

  },
  //确认修改收藏名称
  confirmCollectName: function (){

    this.toggleEditInput()
    if (this.data.collect_name && this.data.collect_name !== this.data.card.name) this.setData({ 'card.name': this.data.collect_name })


  },

  //设置收藏名称
  setCollectName: function (e){

    this.setData({ collect_name : e.detail.value })

  },

  //相册图片展示形式切换
  togglePicShow: function () {
    var temp = this.data.showLine ? false : true
    this.setData({ showLine: temp })
  },


  //显示/隐藏收藏名称编辑输入框
  toggleEditInput:function (){

    this.data.is_collect_edit = this.data.is_collect_edit === false ? true : false

    this.setData({ is_collect_edit: this.data.is_collect_edit })

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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log('options', options)
    var that = this

    //控制返回按钮样式改变 进去页面2秒钟显示，又过了3秒隐藏
    setTimeout(function () {
      that.setData({  
        showbtn: true,
        showText:true
      })
    }, 2000)

    setTimeout(function () {
      that.setData({
        showbtn: true,
        showText: false,
        showFilter:true
      })
    }, 5000)

    setTimeout(function () {
      that.playAudioAct() //语音播放
    }, 2000)

    
    
    if (typeof options.scene !== 'undefined') options = app.util.urlToJson(decodeURIComponent(options.scene))
    if(!options.card_id){
       wx.navigateBack()
       return false
    }

    //agent_id为扫码进入到该页面所解析返回的数据
    if (typeof options.agent_id != 'undefined') {
      that.setData({
        agent_id: options.agent_id
      })
    }

    
    that.setData({ card_id: options.card_id })

      //获取当前用户ID
      app.util.getUserInfo(function (response) {

        that.setData({ uid: response.memberInfo.uid })

        //that.getChatNum()

        if (typeof options.allow_collect !== 'undefined') {
          var showRmBtn = options.allow_remove == 1 ? true : false
          that.setData({
            allow_collect: options.allow_collect,
            showRmBtn: showRmBtn,
            fromGroupId: options.from_group_id,
          })
        }

        // console.log('allow_collect', that.data.allow_collect)
        // console.log('showRmBtn', that.data.showRmBtn)
        // console.log('fromGroupId', that.data.fromGroupId)

        if (typeof options.from_act !== 'undefined') {
         
          if (app.shareOrScanIsValide === true)
            that.setData({ from_act: options.from_act })
        }
        

        that.freshCurrentPage(false, 1) 

        that.getChatNum()

      })
    

  },

  //信息卡片显示
  showTopFrame: function (e) {

    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY(animationShowHeight).step()
    this.setData({
      animationData: animation.export(),
      show_top_frame: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
      wx.vibrateLong()
    }.bind(this), 1)
  },
  //信息卡片隐藏
  hideTopFrame: function () {
    var animation = wx.createAnimation({
      duration: 3000,
      timingFunction: "linear",
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
        show_top_frame: false
      })
    }.bind(this), 200)
  },


  //检查用户是否有创建名片，如果没有提示创建
  checkUserIsCreate: function (act){

    if (this.data.my_userCards.length < 1) {
      wx.showModal({
        title: '系统提示',
        content: '您还没有创建名片，只有创建名片后才可以' + (act ? act : '操作') +'哦',
        showCancel: false,
        confirmColor: '#f90',
        confirmText: '去创建',
        success: function (res) {
          wx.navigateTo({
            url: '../basic/basic',
          })
        }
      });
      return false
    }

    return true
  },

  //收藏/取消收藏
  toggleCollectStatus: function (e) {
    var that = this;
    
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }


    //if(that.checkUserIsCreate('收藏') === false) return

    app.util.request({
      'url': 'entry/wxapp/toggleCollectCard',
      'method': 'POST',
      'data': { 'card_id': that.data.card_id, 'check_name': that.data.check_name },
      success(res) {

        if (res.data.data == 'promat') {

          $wuxDialog.confirm({
            title: '',
            content: res.data.message,
            onConfirm(e) {

              that.setData({ check_name: 0 })

              that.toggleCollectStatus(e)

            },
            onCancel(e) {


            },
          })
        } else {

          if(that.data.is_collect === true){
            that.data.card.collected--
            that.data.is_collect =  false
            wx.showToast({
              title: '已取消收藏',
              icon:'success'
            })
          }else{
            that.data.card.collected++
            that.data.is_collect =  true
            wx.showToast({
              title: '收藏成功',
              icon: 'success'
            })
          }
          app.freshHolder = true
          that.setData({ 'card.collected': that.data.card.collected, is_collect: that.data.is_collect})


          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2]; // 上一级页
          if (typeof prevPage != 'undefined'){
            var cardList = prevPage.data.cardList
            for (var x in cardList) {
              if (cardList[x].id == that.data.card_id) {
                cardList[x].is_collect = that.data.is_collect
                break
              }
            }
            var cardListCopy = prevPage.data.cardListCopy
            for (var x in cardListCopy) {
              if (cardListCopy[x].id == that.data.card_id){
                cardListCopy[x].is_collect = that.data.is_collect
                break
              } 
            }
            prevPage.setData({
              cardList: cardList,
              cardListCopy: cardListCopy,
            });
          }

        }


      }
    })

  },

  //刷新当前页面
  freshCurrentPage: function (cb, watch){
    var that = this
    if (typeof that.data.audioCtx.destroy != 'undefined')
      that.data.audioCtx.destroy()

    app.util.request({
        'url': 'entry/wxapp/getCardItem',
        //'cachetime': '30',
      'data': { card_id: that.data.card_id, watch: watch, from_act: that.data.from_act, agent_id: that.data.agent_id},//, state:false
        success(res) {
           console.log('getCardItem.res',res)

           //未开通商城或已开通商城但把商城屏蔽后需要显示的按钮
          if (res.data.data.agent_status == 0 || res.data.data.store_status == 0){
            that.setData({ 
              noOpen: true ,
              openWeb: false  //已开通商城需要显示的内容
            })
          }
         
          that.data.isFresh = false
          //判断是否是进入到自己的名片页面
          // if(res.data.message == 'myself'){
          //   wx.setStorageSync('index_card_id', that.data.card_id)
          //   wx.switchTab({
          //     url: '../index/index',
          //   });
          //   return
          // }

          //console.log(res)
          typeof cb == "function" && cb()
          that.setData({ card: res.data.data, from_act: '' })
               
          that.setData({ cardVideo: that.data.card.video })

          // that.playAudioAct() //语音播放

          var getItemFlag = res.data.message
          

          //判断用户是否是第一次浏览该名片
          if (getItemFlag == 'first_view'){
            that.setData({ showWebBtn: true })
          }else{
            that.setData({ showWebBtn: false })
          }
          
        //判断是否显示商城、动态、官网等底部tabBar
          var have_card_store = parseInt(that.data.card.store)
          var have_card_dynamic = parseInt(that.data.card.dynamic)
          var have_card_website = parseInt(that.data.card.website)
          if (have_card_store || have_card_dynamic || have_card_website){
            app.overtHaveBar = [1, have_card_store, have_card_dynamic, have_card_website]
          }else{
            app.overtHaveBar = false
          }
          // that.setData({loadingDone: true })
          // return
          
          app.config.init(function () {

            app.config.set(that)
            that.setData({ qrcodePicIsDesign: app.config.getConf('card_qrcode_design') })
            app.util.footer(that, that.data.card_id);
            wx.setNavigationBarTitle({
              //title: that.data.card.name //+ ' - ' + app.config.getConf('app_name')
              title:'名片'
            })
            var func_arr = app.config.getConf('custom_function_nav')
            if (func_arr.length == 5){
              for(var x in func_arr){
                that.data.func_arr[x].img = func_arr[x].iconPath
                that.data.func_arr[x].txt = func_arr[x].text
              }
              that.setData({ func_arr : that.data.func_arr })
            }

          })
          
          if(that.data.card.forwarding != 1 || that.data.card.no_perfect == 1) 
            wx.hideShareMenu()
          else
            wx.showShareMenu()
          
          that.checkIsComeback(watch)
          
          app.util.request({
            'url': 'entry/wxapp/getIsCollect',
            'method': 'POST',
            'data': { 'card_id': that.data.card_id },
            success(res) {
              //console.log(res)
              that.setData({ is_collect: res.data.data, loadingDone: true })

              
              if(getItemFlag == 'first_view' && that.data.card.no_perfect != 1){
                
                that.setData({ msgNum: 1 })
                that.showTopFrame()
                setTimeout(function () {
                  that.hideTopFrame()
                }, 4000)

              }
                          
            }

          })
        
          that.showViewsCardUser()

          that.data.audioCtx = wx.createInnerAudioContext()
          that.data.audioCtx.autoplay = false
          that.data.audioCtx.onPlay(() => {
            if (that.data.playAudio)
              that.startSecondsCount()
          })
          that.data.audioCtx.onStop(() => {
            console.log('停止播放')
            clearInterval(that.data.recordingSecIntval)
            that.setData({ recordingSec: 0, playMusic: false, playAudio: false })
          }),
          that.data.audioCtx.onEnded(() => {
              console.log('自然结束播放')
              clearInterval(that.data.recordingSecIntval)
              that.setData({ recordingSec: 0, playMusic: false, playAudio: false })
          })
          if(that.data.card.bg_music && that.data.card.style == 1) that.playMusicAct()
          
          app.config.cardTrack(that.data.card_id, 2, 'praise')

        }

    });

  },

  //拨打名片手机号
  callMobile: function (e) {

    var mobile = this.data.card.mobile

    wx.makePhoneCall({
      phoneNumber: mobile
    })

    app.config.cardTrack(this.data.card_id, 2, 'copy')

  },

  //显示名片地址在地图中的位置
  showMapLocation: function () {
    var that = this
    var name = this.data.card.company
    var address = this.data.card.address
    var latitude = parseFloat(this.data.card.latitude)
    var longitude = parseFloat(this.data.card.longitude)
    //console.log(latitude)
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      name: name,
      address: address,
      scale: 28
    })
    app.config.cardTrack(that.data.card_id, 7, 'copy')

  },


  showTips: function (e) {
    var that = this;

    that.setData({ showTip: false })

    var id = e.target.id;

    //console.log(e);
    var query = wx.createSelectorQuery()
    query.select('#' + e.target.id).boundingClientRect()
    query.exec(function (res) {

      //console.log(res);

      var tops = (res[0].top - 36) + 'px';
      if (id == 'card-Tips-mobile') {
        var lefts = (res[0].left + res[0].width / 2 - 72) + 'px';  //俩个按钮
        var showTipObj = { tapFun: 'callMobile', tapText: '拨打电话' }
      } else if (id == 'card-Tips-address') {
        var lefts = (res[0].left + res[0].width / 2 - 72) + 'px';  //俩个按钮
        var showTipObj = { tapFun: 'showMapLocation', tapText: '地图显示' }
      } else {
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

      that.data.plate_id = id

    })

  },

  // 复制剪切板的内容
  copyShare: function () {
    var that = this;
    if (wx.setClipboardData) {
      wx.setClipboardData({
        data: this.data.plate,
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              //console.log(res.data) // data
              wx.showToast({
                title: '复制成功',
              })

              if (that.data.plate_id == 'card-Tips-wx')
                app.config.cardTrack(that.data.card_id, 4, 'copy')
              else if (that.data.plate_id == 'card-Tips-email') 
                app.config.cardTrack(that.data.card_id, 5, 'copy')
              else if (that.data.plate_id == 'card-Tips-company')
                app.config.cardTrack(that.data.card_id, 6, 'copy')


            }
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
    //if (this.data.show_goTop === false && e.scrollTop >= 200) this.setData({ show_goTop: true })
    //if (this.data.show_goTop === true && e.scrollTop < 200) this.setData({ show_goTop: false })
    if(e.scrollTop == 0){
      this.changeBigSetups()
    } else{
      this.changeBigSetup()
    }

    if (this.data.showTip) this.toggleShowTip()
  },
  //切换tip状态
  toggleShowTip: function () {

    this.data.showTip = this.data.showTip ? false : true
    this.setData({ showTip: this.data.showTip })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
    this.audioCtx = wx.createAudioContext('myAudio')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    var that = this
    if(that.data.isFresh === true) that.freshCurrentPage(false)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
 
    if(typeof this.data.audioCtx.stop != 'undefined')
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
    this.freshCurrentPage(function (){

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
  onShareAppMessage: function (res) {
    console.log(res)
    if (res.from != 'menu' && res.target.id != 'sendCardBtn') {

      var title = '点击查看全图'
      var path = '/super_card/pages/pic-watch/pic-watchphoto-watch/photo-watch?card_id=' + this.data.card_id + '&album_id=' + res.target.dataset.album_id + '&pic_id=' + res.target.dataset.pic_id + '&from_act=share'
      var imgUrl = res.target.dataset.src
      
    }else{

      //var app_name = app.config.getConf('app_name')
      //var title = '这是 "' + this.data.card.name + '" 的' + (app_name ? app_name : '名片') +'，请惠存'
      
      var title = '您好，这是 "' + this.data.card.name + '" 的名片，请惠存'
      var path = '/super_card/pages/overt/overt?card_id=' + this.data.card_id + '&from_act=other'
      var imgUrl = ''

      app.config.cardTrack(this.data.card_id, 4, 'praise')
      console.log('分享路径path:', path)
    }
    
    return {
      title: title,
      path: path,
      imageUrl: imgUrl
    }

  }
})
