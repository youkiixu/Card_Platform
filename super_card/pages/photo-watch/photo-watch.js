// super_card/pages/photo-watch/photo-watch.js
var app = getApp()
const device = wx.getSystemInfoSync()
const dWidth = device.windowWidth
Page({

  /**
   * 页面的初始数据
   */
  data: {
    card_id: 0,
    album_id: 0,
    pic_id: 0,
    pics: [],

    currIndex: '',
    swiperHeight: 0,
    imgHeights: [],
    pic_name: '',
    pic_views: '',
    currPic: {},

    rotate: false,
    uid: 0,

    from_act: '',
    showBackIndex: false,
  },

  //切换图片横竖
  toggleRotate: function (){
    
      this.data.rotate = this.data.rotate === false ? true : false
      this.setData({ rotate: this.data.rotate })

  },

  changePic: function (e) {

    //console.log(e)
    var index = e.detail.current

    var height = this.data.imgHeights[index]
    var pic_name = this.data.pics[index].name
    var pic_views = this.data.pics[index].views
    //console.log(this.data.imgHeights)
    //console.log('%c' + height, 'font-size:30px;color:red')
    this.setData({ pic_id: this.data.pics[index].id, currIndex: index, pic_name: pic_name, pic_views: pic_views, swiperHeight: height })

  },

  imageLoad: function (e) {
    //console.log(e)

    var viewHeight = this.getViewHeight(e.detail.width, e.detail.height)

    this.data.imgHeights[e.target.dataset.index] = viewHeight
    //console.log('%c' + e.target.dataset.index+ '**'+ viewHeight, 'font-size:30px;color:green')
    if (this.data.currIndex == e.target.dataset.index) {
      //console.log('%c' + viewHeight, 'font-size:30px;color:red')
      this.setData({ swiperHeight: viewHeight })
    }

  },

  getViewHeight: function (width, height) {

    var ratio = width / height;
    //计算的高度值
    var viewHeight = dWidth / ratio;

    return viewHeight

  },

  //图片预览
  showBigWallpaper: function (event) {
    var that = this
    var evt = event.target.dataset.index
    //console.log(evt)
    var picList = []
    for(var x in that.data.pics)
      picList.push(that.data.pics[x].path)

    wx.previewImage({
          current: that.data.pics[evt].path,
          urls: picList
    })

  },

  freshThePage: function () {
    var that = this
    app.util.request({
      'url': 'entry/wxapp/getCardAlbumPics',
      //'cachetime': '30',
      'method': 'POST',
      'data': { 'card_id': that.data.card_id, 'album_id': that.data.album_id, 'pic_id': that.data.pic_id, 'watch': 1 },
      success(res) {
        //console.log(res)
        var pic_list = res.data.data.pic_list
        var currIndex = 0
        for (var x in pic_list) {
          if (pic_list[x].id == that.data.pic_id) {
            currIndex = x
            break
          }
        }
        //console.log('%c' + currIndex, 'font-size:30px;color:blue')
        that.setData({ pic_id: pic_list[currIndex].id, currIndex: parseInt(currIndex), pic_name: pic_list[currIndex].name, pic_views: pic_list[currIndex].views, pics: pic_list })

      }
    })

  },

  //返回首页
  backIndex: function () {
    wx.switchTab({
      url: '../index/index',
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (!options.card_id || !options.album_id || !options.pic_id){
      wx.navigateBack()
      return
    }
    that.setData({ card_id: options.card_id, album_id: options.album_id, pic_id: options.pic_id })
    if (typeof options.from_act !== 'undefined') {
      that.setData({ showBackIndex: true, from_act: options.from_act })
    }
    //获取当前用户ID
    app.util.getUserInfo(function (response) {

      //console.log(response)
      that.setData({ uid: response.memberInfo.uid })
      that.freshThePage()

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
  onShareAppMessage: function () {

    var title = '点击查看全图'
    var path = '/super_card/pages/photo-watch/photo-watch?card_id=' + this.data.card_id + '&album_id=' + this.data.album_id + '&pic_id=' + this.data.pic_id + '&from_act=share'
    var imgUrl = this.data.pics[this.data.currIndex].path

    return {
      title: title,
      path: path,
      imageUrl: imgUrl
    }

  }
})