// super_card/pages/sound-recording/sound-recording.js
import { $wuxDialog } from '../../components/wux'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    card_id: 0,

    recorderManager :{},

    audioCtx: {},
    
    audioId: 0,
    audioPath: '',
    audioDuration: 0,
    audioSize: 0,

    recordingSec:0,
    recordingSecIntval: '',
    recordingTotal:0,

    showStartBtn: true,
    showStopBtn: false,
    showPlayBtn: false,
    showStopPlayBtn: false,

    catalogSelect: 2,  //选项卡


    spd:5,
    pit:5,
    vol:5,
    per:0,
    txt:'',

    disabledBtn: false,
    },

  //语音文本
  setAudioTxt:function (e){
    //console.log(e)
    this.data.txt = e.detail.value
  },

  //音色
  radioChange:function (e){
    //console.log(e)
    this.data.per = e.detail.value
  },
  //音量
  slider1change: function (e){
    //console.log(e)
    this.data.vol = e.detail.value
  },
  //语速
  slider2change: function (e) {
    //console.log(e)
    this.data.spd = e.detail.value
  },
  //音调
  slider3change: function (e) {
    //console.log(e)
    this.data.pit = e.detail.value
  },

  //合成语音
  syntheticAudio: function (){
    //SyntheticAudioIntro
    var that = this
    if(that.data.txt.length < 1){
      wx.showToast({
        title: '请输入语音文本介绍',
        icon: 'none'
      })
      return
    }

    if (that.data.txt.length > 512) {
      wx.showToast({
        title: '语音文本超过字数限制',
        icon: 'none'
      })
      return
    }

    that.setData({ disabledBtn: true })

    app.util.request({
      'url': 'entry/wxapp/syntheticAudioIntro',
      //'cachetime': '30',
      'data': { txt: that.data.txt, 
                per: that.data.per,
                vol: that.data.vol,
                spd: that.data.spd,
                pit: that.data.pit
              },
      success(res) {
        console.log('合成后')
        console.log(res)

        wx.downloadFile({
          url: res.data.data, //仅为示例，并非真实的资源
          success: function (res) {
            that.setData({ disabledBtn: false })
            console.log('下载后')
            console.log(res)
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (res.statusCode === 200){

               that.setData({
                audioPath: res.tempFilePath,
                showStartBtn: false,
                showStopBtn: false,
                showPlayBtn: true,
                showStopPlayBtn: false,
              })

            }

            //DelTempAudio
            app.util.request({
              'url': 'entry/wxapp/delTempAudio',              
              success(res) {
                console.log(res)
              }
            })


          }
        })

        
      }
    })

  },


  /**
   * 选项卡转换-发送
   */
  selectInstall: function () {
    var that = this
    that.setData({
      catalogSelect: 1,
      sliderOffset: 50,
      sliderLeft: 0,
    })
  },

  /**
   * 选项卡-接收
   */
  selectRecording: function () {
    var that = this
    that.setData({
      catalogSelect: 2,
      sliderOffset: 0,
      sliderLeft: 0,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    if(options.card_id) {
      console.log('here')
      that.setData({ card_id: options.card_id})
      
      app.util.request({
        'url': 'entry/wxapp/getCardAudio',
        //'cachetime': '30',
        'data': { card_id: that.data.card_id },
        success(res) {

          var data = res.data.data
          console.log(typeof data)
          if(data)
            that.setData({
              audioId: data.id,
              audioPath: data.path,
              audioDuration: data.duration,
              audioSize: data.size,
              showStartBtn: false,
              showStopBtn: false,
              showPlayBtn: true,
              showStopPlayBtn: false,
            })

        }

      })
      
      that.data.recorderManager = wx.getRecorderManager()
      that.data.recorderManager.onStart(() => {
        console.log('recorder start')

        that.setData({ 
          showStartBtn: false,
          showStopBtn: true,
          showPlayBtn: false,
          showStopPlayBtn: false,
        })
        that.startSecondsCount()

      })

      that.data.recorderManager.onStop((res) => {

        console.log('recorder stop', res)
        clearInterval(that.data.recordingSecIntval)

        if(res.duration < 5000){
          
          wx.showToast({
            title: '录音不能小于5秒哦',
            icon: 'none'
          })

          that.setData({
            showStartBtn: true,
            showStopBtn: false,
            showPlayBtn: false,
            showStopPlayBtn: false,
          })

        }else{

          that.data.audioDuration = res.duration
          that.data.audioSize = res.fileSize
          that.setData({
            audioPath: res.tempFilePath,
            showStartBtn: false,
            showStopBtn: false,
            showPlayBtn: true,
            showStopPlayBtn: false,
          })

        }

      
 
      })

      that.data.audioCtx = wx.createInnerAudioContext()
      that.data.audioCtx.autoplay = false
      that.data.audioCtx.loop = false
      that.data.audioCtx.onPlay(() => {
        console.log('开始播放')

        if(this.data.audioDuration > 0){
          that.setData({ recordingTotal: Math.floor(that.data.audioDuration/1000) })
        }
        that.startSecondsCount()

        that.setData({
          showStartBtn: false,
          showStopBtn: false,
          showPlayBtn: false,
          showStopPlayBtn: true,
        })

      }),
      that.data.audioCtx.onStop(() => {
          console.log('停止播放')
          clearInterval(that.data.recordingSecIntval)
          that.setData({
            showStartBtn: false,
            showStopBtn: false,
            showPlayBtn: true,
            showStopPlayBtn: false,
          })
      }),

      that.data.audioCtx.onEnded(() => {
          console.log('自然结束播放')
          clearInterval(that.data.recordingSecIntval)
          that.setData({
            showStartBtn: false,
            showStopBtn: false,
            showPlayBtn: true,
            showStopPlayBtn: false,
          })
        }),

      that.data.audioCtx.onError((res) => {
        console.log(res.errMsg)
        console.log(res.errCode)
      })

    }

  },

  startSecondsCount:function (){

    var that = this
    that.setData({ recordingSec: 0 })
    that.data.recordingSecIntval = setInterval(function (){
      that.data.recordingSec++
      that.setData({ recordingSec: that.data.recordingSec })      
    }, 1000)

  },

  startRecording:function (){
    var that = this
    const options = {
      duration: 60000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3',
      frameSize: 50
    }
    that.data.recorderManager.start(options)
  },

  stopRecording: function (){
    var that = this
    that.data.recorderManager.stop()
  },

  playRecording: function () {
    var that = this
    console.log(that.data.audioPath)
    if (that.data.audioPath != ''){
      that.data.audioCtx.src = that.data.audioPath
      that.data.audioCtx.play()
    }
  },

  stopPlayRecording: function () {
    var that = this
    if (typeof that.data.audioCtx.stop != 'undefined')
      that.data.audioCtx.stop()
  },


  reRcording: function (){

    var that = this
    that.data.audioCtx.src = ''
    that.setData({
      audioPath : '',
      showStartBtn: true,
      showStopBtn: false,
      showPlayBtn: false,
      showStopPlayBtn: false,
    })

  },

  saveCardAudio: function (){

      var that = this
      if (!that.data.audioPath) {
        wx.showToast({
          title: '请录制语音介绍',
          icon: 'none',
          duration: 2000
        })
        return false
      }
      wx.showLoading({
        title: '加载中',
      })
      that.setData({ disabledBtn: true })

      wx.uploadFile({
        url: app.util.url('entry/wxapp/saveCardAudio'),
        filePath: that.data.audioPath,
        name: 'audio',
        header: {
          'content-type': 'multipart/form-data' // 默认值
        },
        formData: {
          'card_id': that.data.card_id,
          'name': that.data.name,
          'duration': that.data.audioDuration,
          'size': that.data.audioSize
        },
        success: function (res) {
          app.freshIndex = true
          wx.hideLoading()
          that.setData({ disabledBtn: false })
          console.log(res)
          var data = JSON.parse(res.data)
          if (data.errno == 0) {

              wx.showToast({
                title: data.message,
                icon: 'success',
                duration: 2000
              })

              setTimeout(function () {
                wx.navigateBack()
              }, 2000)

          } else {

            wx.showModal({
              title: 'error',
              content: data.message,
              showCancel: false,
              confirmText: '我知道了'
            })

            that.setData({ res: {} })

          }



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
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (typeof this.data.audioCtx.stop != 'undefined')
      this.data.audioCtx.stop()
  },

  /**
   * 删除视频
   */
  delCardAudio: function () {
    var that = this
    $wuxDialog.confirm({
      title: '',
      content: '您确定要清空吗？',
      onConfirm(e) {

        var data = {
          card_id: that.data.card_id
        }

        app.util.request({
          'url': 'entry/wxapp/delCardAudio',
          //'cachetime': '30',
          'method': 'POST',
          'data': data,
          success(res) {
            app.freshIndex = true
            wx.showToast({
              title: res.data.message,
              icon: res.data.errno ? 'error' : 'success',
              duration: 2000
            })

            if (res.data.errno == 0)
              setTimeout(function () {
                wx.navigateBack()
              }, 2000)

          }
        })

      },
      onCancel(e) {
       
      }
    })

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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },


})