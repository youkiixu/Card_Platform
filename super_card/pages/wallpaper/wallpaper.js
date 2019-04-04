// super_card/pages/wallpaper/wallpaper.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    app_name: '',
    card_id: 0,
    card: '',
    userCards: [],
    cardPickerShow: { visible: false, animateCss: 'wux-animate--fade-out' },
    card_id_copy: 0,

    wallPapers: [],
    curr_index:0,
    wp_id: 0,

    wp_w:0,
    wp_h:0,

    qrcodeTempPath :'',

    bgimg:'',

    btnDis: false,

    year: '',
    month:'',
    day:'',
  },

  /**
   * 切换展示背景图片
   */
  changeBackdrop:function(){
     this.getWallPaper()
     
    // wx.navigateTo({
    //   url: '../../pagess/choosewallpaper/choosewallpaper'
    // })
  }, 

  getPosterPic:function (){
    
    var that = this

    that.setData({ btnDis: true })
    app.util.request({
      'url': 'entry/wxapp/getQrWallpaper',
      'data': { card_id: that.data.card_id, wp_id: that.data.wp_id },
      success(res) {
        console.log(res.data.data)

        wx.showLoading({
          title: '加载中',
        })
        wx.downloadFile({
          url: res.data.data, //仅为示例，并非真实的资源
          success: function (res) {
            wx.hideLoading()       
            console.log('下载后:',res)
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (res.statusCode === 200) {
              that.setData({ btnDis: false })
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: function(res){
                  wx.showToast({
                    title: '已保存至相册',
                    icon: 'success'
                  })
                 }
              })
              console.log(res.tempFilePath)
            }
            app.util.request({
              'url': 'entry/wxapp/delTempAudio',
              success(res) {
                console.log(res)
              }
            })


          },
          fail: function (res){
            wx.showToast({
              title: '获取海报图失败',
              icon: 'none'
            })
          }
        })
       
      }
    })

  },

  getWallPaper: function (){
    
    var that = this
    app.util.request({
      'url': 'entry/wxapp/wallPaperLists',
      success(res) {
        console.log(res.data.data)
        var date = new Date();
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var year = date.getFullYear()
        var month = months[date.getMonth()]
        var day = date.getDate()
        if (day < 10) day = '0' + day
        //that.setData({ wp_id: res.data.data[0].id, wallPapers: res.data.data ,sort:res.data.data.length })
        that.setData({ wp_id: res.data.data.id, bgimg: res.data.data.path, year: year, month: month, day:day})
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var card_id = options.card_id
    var that = this
    app.util.request({
      'url': 'entry/wxapp/getUserCard',
      'data': { 'no_need_whole': 1 },
      success(res) {

        var data = res.data.data
        if (data.length < 1) {
          wx.showToast({
            title: '请先创建名片',
            icon: 'none'
          })
          wx.navigateBack()
          return false
        }

        if(card_id > 0){
            for(var x in data)
              if(data[x].id == card_id)
                that.setData({ userCards: data, card: data[x], card_id: data[x].id })
        }else
          that.setData({ userCards: data, card: data[0], card_id: data[0].id })

        that.getWallPaper()
      }
    })

    this.setData({ app_name: app.config.getConf('app_name') })

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

    if (this.data.card_id_copy !== this.data.card_id) {
      for (var x in this.data.userCards) {


        if (this.data.userCards[x].id == this.data.card_id){
          this.setData({ card: this.data.userCards[x] })
        }


      }
    }
    this.toggleCardPicker()

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

})