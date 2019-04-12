// super_card/pages/photo-edit/photo-edit.js
import { $wuxDialog } from '../../components/wux'
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
      
      currIndex :'',
      swiperHeight: 0,
      imgHeights: [],
      pic_name: '',
      currPic: {},

      isFresh: false,
      tisFresh: false,

      sort: '',
  },

  changePic: function (e){
      
      //console.log(e)
      var index = e.detail.current
     
      var height = this.data.imgHeights[index]
      var pic_name = this.data.pics[index].name
      var pic_view = this.data.pics[index].view
      //console.log(this.data.imgHeights)
      //console.log('%c' + height, 'font-size:30px;color:red')
      this.setData({ pic_id: this.data.pics[index].id, currIndex: index, pic_name: pic_name, swiperHeight: height })

  },

  imageLoad: function (e) {
    //console.log(e)

    var viewHeight = this.getViewHeight(e.detail.width, e.detail.height)

    this.data.imgHeights[e.target.dataset.index] = viewHeight
    //console.log('%c' + e.target.dataset.index+ '**'+ viewHeight, 'font-size:30px;color:green')
    if(this.data.currIndex == e.target.dataset.index){
       //console.log('%c' + viewHeight, 'font-size:30px;color:red')
       this.setData({ swiperHeight: viewHeight })
    }
    
  },

  getViewHeight: function (width, height){
    
    var ratio = width / height;
    //计算的高度值  
    var viewHeight = dWidth / ratio;

    return viewHeight

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (!options.card_id || !options.album_id || !options.pic_id)
        wx.navigateBack()
  
    that.setData({ card_id: options.card_id, album_id: options.album_id, pic_id: options.pic_id })

    that.freshThePage()

  },

  freshThePage: function (){
    var that = this
    app.util.request({
      'url': 'entry/wxapp/getCardAlbumPics',
      //'cachetime': '30',
      'method': 'POST',
      'data': { 'card_id': that.data.card_id, 'album_id': that.data.album_id },
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
        that.setData({ pic_id: pic_list[currIndex].id, currIndex: parseInt(currIndex), pic_name: pic_list[currIndex].name, sort: pic_list[currIndex].sort,pic_views: pic_list[currIndex].views, pics: pic_list, isFresh: false })

      }
    })

  },

 /**
 * 删除相册
 */
  delCardPic: function () {
    var that = this
    $wuxDialog.confirm({
      title: '',
      content: '您确定要删除该图片吗？',
      onConfirm(e) {

        var data = {
          card_id: that.data.card_id,
          album_id: that.data.album_id,
          pic_id: that.data.pic_id
        }

        app.util.request({
          'url': 'entry/wxapp/delCardPic',
          //'cachetime': '30',
          'method': 'POST',
          'data': data,
          success(res) {

            app.freshIndex = true
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2]; // 上一级页
            prevPage.setData({ isFresh: true })

            var tprevPage = pages[pages.length - 3]; // 上上一级页
            tprevPage.setData({ isFresh: true })

            wx.showToast({
              title: res.data.message,
              icon: res.data.errno ? 'error' : 'success',
              duration: 2000
            })

            if(res.data.errno == 0)
              setTimeout(function () {
                wx.navigateBack()
              }, 2000)


          }
        })

      },
      onCancel(e) {

      },
    })

  },

  /**
     * 设置用户输入的相片排序
     */
  // setPicSort: function (e) {
  //   console.log('e排序', e)
  //   var that = this
  //   var order_sort = e.detail.value
  //   that.setData({ order_sort: order_sort })
  // },

  /**
 * 修改图片排序--接口未有
 */
  updatePicSort: function () {
    //console.log($wuxDialog)
    var that = this

    $wuxDialog.prompt({
      title: '',
      content: '图片排序为',
      fieldtype: 'text',
      password: false,
      defaultText: that.data.sort,
      placeholder: '请输入整数值(数值越大越靠前)：',
      maxlength: 12,
      onConfirm(e) {
        var sort = that.data.$wux.dialog.prompt.response
        var data = {
          card_id: that.data.card_id,
          album_id: that.data.album_id,
          pic_id: that.data.pic_id,
          sort: sort
        }

        app.util.request({
          'url': 'entry/wxapp/saveCardPicSort',
          //'cachetime': '30',
          'method': 'POST',
          'data': data,
          success(res) {

            console.log('修改排序成功',res)

            app.freshIndex = true
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2]; // 上一级页
            prevPage.setData({ isFresh: true })

            //console.log(res)
            that.setData({ sort: sort })
          }

        })

      },
    })

  },


  /**
 * 修改图片名称
 */
  updatePicName: function () {
    //console.log($wuxDialog)
    var that = this

    $wuxDialog.prompt({
      title: '',
      content: '图片名称为',
      fieldtype: 'text',
      password: false,
      defaultText: that.data.pic_name,
      placeholder: '0~12字符',
      maxlength: 12,
      onConfirm(e) {
        var name = that.data.$wux.dialog.prompt.response
        var data = {
          card_id: that.data.card_id,
          album_id: that.data.album_id,
          pic_id: that.data.pic_id,
          name: name
        }

        app.util.request({
          'url': 'entry/wxapp/saveCardPicName',
          //'cachetime': '30',
          'method': 'POST',
          'data': data,
          success(res) {

            app.freshIndex = true
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2]; // 上一级页
            prevPage.setData({ isFresh: true })

            //console.log(res)
            that.setData({ pic_name: name })
          }

        })

      },
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
    if(this.data.isFresh === true) this.freshThePage()
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
  // onShareAppMessage: function () {
  
  // }
})