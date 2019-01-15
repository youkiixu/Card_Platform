// super_card/pages/chat/chat.js
import { $wuxDialog } from '../../components/wux'

var app = getApp()
let systemInfo = wx.getSystemInfoSync();

let animationShowHeight = 300;//动画偏移高度

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    uid: 0,
    card_id: 0,

    chat_id: 0,

    t_uid: 0,
    t_card_id: 0,
    t_card_info:false,
    my_card_info: false,
    quick_reply: [],
    my_card_goods:[],

    msgList:[],

    msgContent:'',

    last_time: 0,

    fetchInterval: 0,

    pageHeight: systemInfo.windowHeight,

    first_time: '',

    prevPage: false,

    type_array: [
      { name: '潜在客户', checked: true },
      { name: '一般客户', checked: false },
      { name: '重要客户', checked: false }
    ],
    state_array: [
      { name: '需长期跟进', checked: true },
      { name: '近期可成交', checked: false },
      { name: '已成交', checked: false },
      { name: '已丢单', checked: false }
    ],
    rate_array: [
      { name: 10, checked: true },
      { name: 20, checked: false },
      { name: 30, checked: false },
      { name: 40, checked: false },
      { name: 50, checked: false },
      { name: 60, checked: false },
      { name: 70, checked: false },
      { name: 80, checked: false },
      { name: 90, checked: false },
      { name: 100, checked: false },
    ],

    from : 'list',
    is_client: false,
    animationData: "",
    showModalStatus: false,
    client_type: '潜在客户',
    client_status: '需长期跟进', 
    client_rate: 10,

    showQuickList:false,
    showEmojiView: false,

    msg_type: 0,
    adjust_p: true,

    showPushProduct:false,

    page: 1,
    lastPage: false,
  },

  blurInput: function (e){
    if(this.data.showEmojiView === true){
      this.setData({ showEmojiView: false })
      this.setData({ adjust_p: true })
    }
    this.setMsgContent(e)
  },

  delMsgCnt:function (){
    if(this.data.msgContent == '') return
    var msg = this.data.msgContent
    msg = msg.substr(0, msg.length - 1)
    this.setData({ msgContent: msg })
  },

  toggleShowEmoji: function (){
    var temp = this.data.showEmojiView ? false : true
    this.setData({ showEmojiView: temp })
  },

  inputEmoji: function (e){
    var that = this
    var name = e.currentTarget.dataset.name
    that.data.msgContent += '[' + name +']'
    that.setData({ msgContent: that.data.msgContent })
  },

  parseEmoji: function (msg){
    var that = this
    var emoji = app.emoji
    var nmsg = msg
    msg.replace(/\[[\u4e00-\u9fa5]+\]/g, function (str, index){
      str = str.replace('[', '')
      str = str.replace(']', '')
      for(var x in emoji)
        if(emoji[x].name == str){
          nmsg = nmsg.replace('['+str+']', '|&|'+ emoji[x].url + '.gif|&|')
          break
        }
    })

    var temp = nmsg.split('|&|')
    var nmsgArr = []

    var reg = /\d{5,}/g
    for(var x in temp){
      if(temp[x] == '') continue
      if(temp[x].indexOf('.gif') != -1){
        nmsgArr.push({ type:'emoji', url: temp[x]})
      }else{
        
        temp[x] = temp[x].replace(reg, function (str2, index2) {
            return '|$|'+ str2 + '|$|'
        })
        var temp2 = temp[x].split('|$|')

        for (var x in temp2) {
          if (temp2[x] == '') continue
          if(reg.test(temp2[x])){
            nmsgArr.push({ type: 'digital', txt: temp2[x] })
          }else{
            nmsgArr.push({ type: 'txt', txt: temp2[x] })
          }
        }
        
       
      }
    }
    console.log(nmsgArr)

    return nmsgArr
  },

  digitalFun: function (e){
    var number = e.currentTarget.dataset.number
    
    wx.showActionSheet({
      itemList: ['呼叫','复制','添加手机通讯录'],
      success:function (res){

        var index = res.tapIndex
        switch(index){
          case 0:
            wx.makePhoneCall({
              phoneNumber: number
            })
            break;
          case 1:
            wx.setClipboardData({
              data: number,
              success: function (res) {
                wx.showToast({
                  title: '复制成功',
                })
              }
            })
            break;
          case 2:
            wx.addPhoneContact({
              //手机
              mobilePhoneNumber: number,  
            })
            break;  
        }

      }
    })

  },

  // 推送名片
  goPushGoods: function (e){
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }

    if (this.data.my_card_goods.length < 1) {
      wx.showModal({
        title: '提示',
        content: '您还没有添加商品，请开通商城管理功能后添加商品再进行推送。',
        confirmColor: this.data.themeColor,
        showCancel: false
      })
      return
    }
    this.hideQuickReply()
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY(animationShowHeight).step()
    this.setData({
      animationData: animation.export(),
      showPushProduct: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 1)
  },

  hidePushGoods: function () {
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
        showPushProduct: false
      })
    }.bind(this), 200)
  },

  goPostCard: function (e) {
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }
  },

  //显示快捷回复
  goQuickReply:function(e){

    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }
    this.hidePushGoods()
    var animation = wx.createAnimation({
      duration: 500,         
      timingFunction: "ease",
      delay: 0    
    })
    this.animation = animation
    animation.translateY(animationShowHeight).step()
    this.setData({
      animationData: animation.export(),
      showQuickList: true 
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 1)
  },
  //隐藏快捷回复
  hideQuickReply:function(){
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
        showQuickList: false
      })
    }.bind(this), 200)
  },
  //编辑快捷回复
  quickReplyEdit:function(){
    wx.redirectTo({
      url: '../../pagess/quick-reply/quick-reply?card_id=' + this.data.my_card_info.id,
    })
    this.hideQuickReply()
  },

  copyMsg:function (e){
    var msg = e.currentTarget.dataset.msg
    wx.setClipboardData({
      data: msg,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  },

  updateMsgState: function (){

    var that = this
    wx.request({
      url: app.util.url('entry/wxapp/updateMsgState'),
      'data': { 'chat_id': that.data.chat_id },
      success: function (res) {
      }
    })
    
  },

  setNoteTip: function (){
      wx.showToast({
        title: '请先转为客户',
        icon: 'none'
      })
  },

  setClientNote: function () {

    var that = this
    $wuxDialog.prompt({
      title: '',
      content: '备注',
      fieldtype: 'text',
      password: false,
      defaultText: '',
      placeholder: '0~100字符',
      maxlength: 100,
      onConfirm(e) {

        var note = that.data.$wux.dialog.prompt.response

        if(!note) return

        var data = {
          client_id: that.data.is_client,
          note: note
        }
        app.util.request({
          'url': 'entry/wxapp/updateClientStuff',
          //'cachetime': '30',
          'method': 'POST',
          'data': data,
          success(res) {

           wx.showToast({
             title: '备注成功',
           })

          }

        })

      },
      onCancel(e) {
        
      }
    })

  },

  toClientPage: function (){

    wx.redirectTo({
      url: '../../pagess/radar/customer-details?client_id=' + this.data.is_client,
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
    }.bind(this), 200)

  },

  card2Client: function (){

    var that = this
    that.hideModal()
    app.util.request({
      'url': 'entry/wxapp/card2Client',
      'data': { chat_id: that.data.chat_id, type: that.data.client_type, status: that.data.client_status, rate: that.data.client_rate },
      success(res) {

          wx.showToast({
            title: '已转入客户',
            icon: 'success'
          })
          that.setData({ is_client: res.data.data.is_client })
      }
    })

  },

  //客户类型选中项
  typeChange: function (res) {
    var arrs = this.data.type_array;
    var that = this;
    for (const x in arrs) {
      if (arrs[x].name == res.detail.value) {
        arrs[x].checked = true;
        that.data.client_type = res.detail.value
      } else {
        arrs[x].checked = false;
      }
    }
    that.setData({
      type_array: arrs
    })
  },
  
  //客户状态选中项
  stateChange: function (res) {
    var arrs = this.data.state_array;
    var that = this;
    for (const x in arrs) {
      if (arrs[x].name == res.detail.value) {
        arrs[x].checked = true;
        that.data.client_status = res.detail.value
      } else {
        arrs[x].checked = false;
      }
    }
    that.setData({
      state_array: arrs
    })
  },

  //预计成交率选中项
  rateChange: function (res) {
    var arrs = this.data.rate_array;
    var that = this;
    for (const x in arrs) {
      if (arrs[x].name == res.detail.value) {
        arrs[x].checked = true;
        that.data.client_rate = res.detail.value
      } else {
        arrs[x].checked = false;
      }
    }
    that.setData({
      rate_array: arrs
    })
  },


  pageScrollToBottom: function () {
    var scrollTop = this.data.msgList.length * 999
    this.setData({ scrollTopVal: scrollTop })
    this.data.isLoading = false
  },

  pageScrollToTop: function () {
    this.setData({ scrollTopVal: 0 })
    this.data.isLoading = false
  },

  showPic: function (e){
    var pic = e.currentTarget.dataset.pic
    wx.previewImage({
      current:pic,
      urls: [pic]
    })
  },

  sendQuickReply: function (e){
    var that = this
    var index = e.currentTarget.dataset.index
    that.data.msgContent = that.data.quick_reply[index].msg
    that.sendMsg()
    that.hideQuickReply()
  },

  sendMyCard: function (e) {
  
    var that = this

    if (that.data.my_card_info.no_perfect == 1) {
      wx.showModal({
        title: '系统提示',
        content: '请先完善您的名片信息',
        showCancel: false,
        confirmColor: that.data.themeColor,
        confirmText: '去完善',
        success: function (res) {
          wx.redirectTo({
            url: '../basic/basic?card_id=' + that.data.my_card_info.id,
          })
        }
      });
      return false
    }

    wx.showModal({
      title: '提示',
      content: '确定要发送您的名片给对方吗？',
      confirmColor: that.data.themeColor,
      success(res) {
        if (res.confirm) {
          that.data.msg_type = 2
          that.data.msgContent = that.data.my_card_info.id
          that.sendMsg()
        }
      }
    })
  },

  sendCardGoods: function (e) {
    var that = this

    var index = e.currentTarget.dataset.index
    that.data.msg_type = 3

    var temp = that.data.my_card_goods[index]
    var goods = {
        goods_id: temp.id,
        goods_name: temp.goods_name,
        goods_pic: temp.goods_pics[0],
        goods_introduce: temp.goods_introduce,
        goods_price: temp.goods_price
    }
    that.data.msgContent = goods
    that.sendMsg()
    that.hidePushGoods()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (typeof options.chat_id == 'undefined'){
      wx.navigateBack()
      return
    }
    
    if(options.from == 'list'){
      var pages = getCurrentPages();
      this.data.prevPage = pages[pages.length - 2]; // 上一级页
    }

    this.setData({ chat_id: options.chat_id, from: options.from })

    this.getPageMsg()

  },

  getPageMsg: function (){

    var that = this
    that.data.isLoading = true
    app.util.request({
      'url': 'entry/wxapp/getChatMsg',
      'data': { chat_id: that.data.chat_id, from: that.data.from, page: that.data.page },
      success(res) {
        //console.log(res.data.data)

        if(that.data.page == 1){

          var list = res.data.data.list
          for (var x in list)
            if (list[x].type == 0 && list[x].msg != '::sayHi::') {
              list[x].o_msg = list[x].msg
              list[x].msg = that.parseEmoji(list[x].msg)
            }

          var t_card_info = res.data.data.t_card_info
          var my_card_info = res.data.data.my_card_info
          var my_card_goods = res.data.data.my_card_goods
          var quick_reply = res.data.data.quick_reply

          that.setData({ first_time: list[0].datetime, msgList: list, t_card_info: t_card_info, my_card_info: my_card_info, my_card_goods: my_card_goods, quick_reply: quick_reply }, function () { that.pageScrollToBottom() })
          that.data.last_time = that.data.msgList[that.data.msgList.length - 1].create_time

          if (that.data.from == 'radar') that.setData({ is_client: res.data.data.is_client })
          that.updateMsgState()
         

        }else{

          var list = res.data.data

          if (list.length > 0) {
            for(var x in list){
              
              if (list[x].type == 0 && list[x].msg != '::sayHi::') {
                list[x].o_msg = list[x].msg
                list[x].msg = that.parseEmoji(list[x].msg)
              }
              that.data.msgList.unshift(list[x])
            }
            //that.data.msgList = that.data.msgList.concat(data, that.data.msgList)
            that.setData({ msgList: that.data.msgList }, function (){
              that.pageScrollToTop()
            })

          } else {
            that.data.lastPage = true
          }

        }

        that.fetchMsgList()

      }
    })
  },

  refresh: function (event) {
    var that = this
    if (that.data.lastPage === true) {
      wx.showToast({
        title: '已经为您显示全部消息',
        icon: 'none'
      })
      return
    }

    if (that.data.isLoading === true) return

    that.data.page++
    clearInterval(that.data.fetchInterval)

    that.getPageMsg()

  },


  fetchMsgList: function (){
    var that = this
    
    that.data.fetchInterval = setInterval(function () {
      
      if(that.data.isLoading === true) return 

      that.data.isLoading = true
      wx.request({
        url: app.util.url('entry/wxapp/getChatMsg'),
        method: 'get',
        data: { chat_id: that.data.chat_id, last_time: that.data.last_time },
        success:function (res){

          var list = res.data.data
          for(var x in list)
            if (list[x].type == 0 && list[x].msg != '::sayHi::') {
              list[x].o_msg = list[x].msg
              list[x].msg = that.parseEmoji(list[x].msg)
            }

          //console.log(list.length)
          if(list.length > 0){
            that.data.msgList = that.data.msgList.concat(list)
            that.setData({ msgList: that.data.msgList }, function () { that.pageScrollToBottom() })
            that.data.last_time = that.data.msgList[that.data.msgList.length - 1].create_time

            if(that.data.prevPage) that.data.prevPage.data.isFresh = true
          }else{
            that.data.isLoading = false
          }

        },
      })

    }, 3000)

  },

  setMsgContent: function (e){

      //console.log(e)
      this.data.msgContent = e.detail.value

  },

  choosePic: function () {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var src = res.tempFilePaths[0]
        wx.compressImage({
          src: src, // 图片路径
          quality: 60, // 压缩质量
          complete: function () {

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

                console.log(res)
                res = JSON.parse(res.data)
                if (res.errno == 0) {

                  that.data.msg_type = 1
                  that.data.msgContent = res.data.path
                  that.sendMsg()

                } else {

                  wx.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 2000
                  })

                }


              }

            })



          }
        })

      }
    })

  },

  sendMsg: function (){

    var that = this
    
    //if(that.data.isLoading === true) return

    if(!that.data.msgContent){
      wx.showToast({
        title: '请输入要发送的消息内容',
        icon: 'none'
      })
      return
    }

    clearInterval(that.data.fetchInterval)

    if(that.data.showEmojiView === true) that.setData({ showEmojiView: false })
    //var msgContent = encodeURIComponent(that.data.msgContent)
    var msgContent = that.data.msgContent

    //that.data.isLoading = true
    app.util.request({
      'url': 'entry/wxapp/sendCardMsg',
      'data': { chat_id: that.data.chat_id, msgContent: msgContent, msg_type: that.data.msg_type },
      success(res) {

        console.log(res)
        var data = res.data.data

        if(data.type == 0 && data.msg != '::sayHi::'){
          data.o_msg = data.msg
          data.msg = that.parseEmoji(data.msg)
        }

        that.data.msgList.push(data)
        that.setData({ msgList: that.data.msgList, msgContent: '' }, function () { that.pageScrollToBottom() })
        that.data.last_time = that.data.msgList[that.data.msgList.length - 1].create_time

        if(that.data.prevPage) that.data.prevPage.data.isFresh = true

        that.data.msg_type = 0
        that.fetchMsgList()

      }
    })


  },

  toCardPage:function (){
    var that = this
    if(that.data.from == 'overt')
      wx.navigateBack({
        delta: 1,
      })
    else 
      wx.redirectTo({
        url: '../overt/overt?card_id=' + that.data.t_card_info.id,
      })
      
  },

  viewPosition:function (){

    var name = this.data.t_card_info.company
    var address = this.data.t_card_info.address
    var latitude = parseFloat(this.data.t_card_info.latitude)
    var longitude = parseFloat(this.data.t_card_info.longitude)
    //console.log(latitude)
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      name: name,
      address: address,
      scale: 28
    })

  },

  callPhone: function (){
    wx.makePhoneCall({
      phoneNumber: this.data.t_card_info.mobile,
    })
  },

  saveCardQr: function () {

    var that = this
    if(that.data.t_card_info.qrcode){

      wx.downloadFile({
        url: that.data.t_card_info.qrcode,
        success: function (res){
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function (res) {
              //console.log(res)
            },
            fail: function (res) {
              console.log(res)
            },
          })
        }
      })
      

    }else{

      app.util.request({
        'url': 'entry/wxapp/getCardQrcode',
        'data': { card_id: that.data.t_card_info.id },
        success(res) {


          wx.downloadFile({
            url: res.data.data,
            success: function (res) {
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: function (res) {
                  //console.log(res)
                },
                fail: function (res) {
                  console.log(res)
                },
              })
            }
          })


        }
      })

    }
      
  },

  addWxFriend: function () {

    wx.setClipboardData({
      data: this.data.t_card_info.wx,
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
    })

    if(app.emoji === false){

      wx.request({
        url: app.util.url('entry/wxapp/getEmojiPic'),
        success: function (res) {
          app.emoji = res.data.data
          var emoji = app.emoji
          var emojiArr = []
          for (var i = 0, len = emoji.length; i < len; i += 22)
            emojiArr.push(emoji.slice(i, i + 22))
          that.setData({ emoji: emojiArr })
        }
      })
      
    }else{
      var emoji = app.emoji
      var emojiArr = []
      for (var i = 0, len = emoji.length; i < len; i += 22)
        emojiArr.push(emoji.slice(i, i + 22))

      that.setData({ emoji: emojiArr })
    }
      
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
    clearInterval(this.data.fetchInterval)
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