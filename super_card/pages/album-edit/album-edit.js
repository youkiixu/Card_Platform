// super_card/pages/album-edit/album-edit.js
import { $wuxDialog } from '../../components/wux'
var app = getApp()
const device = wx.getSystemInfoSync()
const dWidth = device.windowWidth
var x, y, x1, y1, x2, y2, currindex
Page({

  /**
   * 页面的初始数据
   */
  data: {
    card_id: 0,
    album_id: 0,
    album_name:'',
    pics:[],

    picAreaTop: 143,
    picColumnNum : 4,
    mainx: false,
    start: { x: 0, y: 0 },
    picArearHeight: 0,
    picWH: 0,
    picPos: 0,
    blankPicIndex:0,

    isFresh:false,

    album_pic_limit: 0,
    order_sort:'',
  },

  clickPic: function (e){
    var clickIndex = e.currentTarget.dataset.index
    var url = '../photo-edit/photo-edit?card_id=' + this.data.card_id + '&album_id=' + this.data.album_id + '&pic_id=' + this.data.pics[clickIndex].id
    //console.log(url)
    wx.navigateTo({
      url: url
    })
  },

  //获取图片区域高度和单个图片宽度，以及所有图片元素位置信息
  queryMultipleNodes: function () {

    var that = this

    //方法一
    /*var query = wx.createSelectorQuery()
    query.select('#picArea').boundingClientRect()
    query.selectAll('.picList').boundingClientRect()
    query.exec(function (res) {
      console.log(res)
      that.setData({ picArearHeight: res[0].height, picWH: res[1][0].width,  picPos: res[1] })
    })*/

    //方法二
    var columnNum = this.data.picColumnNum
    var picWH = dWidth / columnNum
    var lineNum = (this.data.pics.length % columnNum) > 0 ? Math.ceil(this.data.pics.length / columnNum) : (this.data.pics.length / columnNum)
    var picArearHeight = picWH * lineNum
    //console.log('%c' + columnNum + '*' + lineNum, 'font-size:30px;color:blue')
    var picPos = []
    var loopNum = 1
    for (var i = 0; i < lineNum; i++){
      for (var j = 0; j < columnNum; j++ ){
        if(loopNum > this.data.pics.length) break
        picPos.push({ 'left': j * picWH, 'top': i * picWH + this.data.picAreaTop })
        loopNum++
      }
    }
    //console.log(picPos)
    that.setData({ picArearHeight: picArearHeight, picWH: picWH, picPos: picPos })

  },

  //移动相册图片开始
  // moveStart: function (e) {

  //   console.log('拖动开始')
  //   //console.log(e)
  //   currindex = e.currentTarget.dataset.index
  //   x = e.touches[0].clientX
  //   y = e.touches[0].clientY
  //   x1 = e.currentTarget.offsetLeft
  //   y1 = e.currentTarget.offsetTop

  // },
  // //移动相册图片中
  // moveIng: function (e) {

  //   console.log('拖动进行中')
  //   //console.log(e)

  //   x2 = e.touches[0].clientX - x + x1;
  //   y2 = e.touches[0].clientY - y + y1;

  //   var xLimit = dWidth - this.data.picWH
  //   var yLimit = this.data.picArearHeight - this.data.picWH

  //   x2 = x2 < 0 ? 0 : (x2 > xLimit ? xLimit : x2) 
  //   y2 = y2 < 0 ? 0 : (y2 > yLimit ? yLimit : y2)
    
  //   this.setData({
  //     mainx: currindex,
  //     start: { x: x2, y: y2 }
  //   })

  // },

  // //移动相册图片结束
  // moveEnd: function (e){
  
  //   console.log('拖动结束')
  //   //console.log(e)   

  //   var posIndex = this.getPositionDomByXY({ x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY })
  //   //console.log('%c'+ currindex + '****' + posIndex, 'font-size:30px;color:blue')
  //   if (posIndex !== false && posIndex != currindex){
      
  //     var temp = this.data.pics.splice(currindex , 1)
  //     this.data.pics.splice(posIndex, 0, temp[0])
  //     this.savePicsSort()

  //   }

  //   this.setData({ 
  //       mainx: false,
  //       pics: this.data.pics,
  //   })
    
  // },

  //保存相册图片排序
  savePicsSort: function (){
    var len = this.data.pics.length
    var sorts = ''
    for(var x in this.data.pics){

      sorts += this.data.pics[x].id +':' + len-- + ';'

    }
    //console.log(sorts)
    var that = this

    app.util.request({
      'url': 'entry/wxapp/savePicsSort',
      'method': 'POST',
      'data': { 'card_id': that.data.card_id, 'album_id': that.data.album_id , 'sorts' : sorts},
      success(res) {

        app.freshIndex = true
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; // 上一级页
        prevPage.setData({ isFresh: true })

        //console.log(res)
        /*wx.showToast({
          title: res.data.message,
          icon: 'success',
          duration: 2000
        })*/
      }

    })

  },

  //根据用户拖动位置获取图片元素索引
  getPositionDomByXY: function (potions) {

    var x = potions.x;
    var y = potions.y;

    var picPos = this.data.picPos
    var picWH = this.data.picWH

    for (var i in picPos) {
        
      if ((picPos[i].left + picWH) > x && (picPos[i].top + picWH) > y)
          return i;

    }

    return false;

  },

 

  //图片队列上传
  uploadimg: function (data) {
      
    var that = this,
    i = data.i ? data.i : 0,//当前上传的哪张图片
    success = data.success ? data.success : 0,//上传成功的个数
    fail = data.fail ? data.fail : 0;//上传失败的个数

    var formData = {
                    card_id: that.data.card_id,
                    album_id: that.data.album_id,
                  }

    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'pic',//这里根据自己的实际情况改
      header: {
        'content-type': 'multipart/form-data' // 默认值
      },
      formData: formData,//这里是上传图片时一起上传的数据
      success: (res) => {
        
        console.log(res)
        
        res = JSON.parse(res.data)

        if(res.errno){

          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 3000
          })
          return

        }else{
           
          
          var album_id = parseInt(res.data.album_id)

          if(album_id > 0) that.setData({ album_id : album_id })

          delete res.data.album_id
          that.data.pics.push(res.data)
          that.setData({ pics: that.data.pics })

        }

      },
      fail: (res) => {
        //图片上传失败，图片上传失败的变量+1
        fail++
        //console.log('fail:' + i + "fail:" + fail)
      },
      complete: () => {

        //console.log(i);
        i++;//这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) {   //当图片传完时，停止调用          
          
          this.queryMultipleNodes()
          console.log('上传完毕');
          //console.log('成功：' + success + " 失败：" + fail);
          wx.showToast({
            title: '上传成功',
            icon: 'success',
          })
          app.freshIndex = true
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2]; // 上一级页
          prevPage.setData({ isFresh: true })

        } else {//若图片还没有传完，则继续调用函数
          //console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);

        }

      }
    });

  },

  /**
   * 上传相册图片
   */
  uploadAlbumPic: function (){
    
    var that = this
    var pics = []
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        //console.log(res)
        
        var imgsrc = res.tempFilePaths
        pics = pics.concat(imgsrc);
        that.uploadimg({
          url: app.util.url('entry/wxapp/uploadAlbumPic'),
          path: pics
        });
       
      }
    })
  },

  /**
   * 设置用户输入的相册名称
   */
  setAlbumName: function (e){
    //console.log(e)
    var that = this
    var album_name = e.detail.value
    that.setData({ album_name: album_name })
  },

  /**
     * 设置用户输入的相册排序
     */
  setOrderSort: function (e) {
    console.log('e排序',e)
    var that = this
    var order_sort = e.detail.value
    that.setData({ order_sort: order_sort })
  },

  /**
   * 删除相册
   */
  delCardAlbum: function (){
    var that = this
    $wuxDialog.confirm({
      title: '',
      content: '您确定要删除该相册吗？',
      onConfirm(e) {

        var data = {
          card_id: that.data.card_id,
          album_id: that.data.album_id        
          }

        app.util.request({
          'url': 'entry/wxapp/delCardAlbum',
          //'cachetime': '30',
          'method': 'POST',
          'data': data,
          success(res) {

            app.freshIndex = true
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2]; // 上一级页
            prevPage.setData({ isFresh: true })


            wx.showToast({
              title: res.data.message,
              icon: 'success',
              duration: 2000
            })
            setTimeout(function () {
              wx.navigateBack()
            },2000)

          }
        })

      },
      onCancel(e) {
        
      },
    })

  },

  /**
   * 修改相册名称
   */
  updateAlbumName: function (){
    //console.log($wuxDialog)
    var that = this
    $wuxDialog.prompt({
      title: '',
      content: '更改相册名称为',
      fieldtype: 'text',
      password: false,
      defaultText: that.data.album_name,
      placeholder: '0~12字符',
      maxlength: 25,
      onConfirm(e) {
        var name = that.data.$wux.dialog.prompt.response
        var data = {
                    card_id : that.data.card_id,
                    album_id : that.data.album_id,
                    name : name,
                    sort: that.data.order_sort
                   }

        app.util.request({
          'url': 'entry/wxapp/saveCardAlbum',
          //'cachetime': '30',
          'method': 'POST',
          'data': data,
          success(res) {

            app.freshIndex = true
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2]; // 上一级页
            prevPage.setData({ isFresh: true })

            //console.log(res)
            that.setData({ album_name: name })
          }

        })

      },
    })

  },
  
  /**
   * 保存用户相册
   */
  saveCardAlbum: function (){
    var that = this
    app.util.request({
      'url': 'entry/wxapp/saveCardAlbum',
      //'cachetime': '30',
      'method': 'POST',
      'data': { 'card_id': that.data.card_id, 'album_id': that.data.album_id, 'name': that.data.album_name, 'sort': that.data.order_sort},
      success(res) {
        console.log(res)

        app.freshIndex = true
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; // 上一级页
        prevPage.setData({ isFresh: true })

        var album = res.data.data
        
        wx.showToast({
          title: res.data.message,
          icon: 'success',
          duration: 2000
        })
        setTimeout(function () {
          wx.navigateBack()
        }, 2000)

      }

    })

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({ album_pic_limit: app.config.getConf('album_pic_limit') })
    console.log(options)
    if (options.card_id > 0) {
      

      if(options.album_id > 0){
        
        that.setData({
          card_id: options.card_id,
          album_id: options.album_id,
        });
        
        that.freshCurrentPage()

      }else{

        that.setData({
          card_id: options.card_id
        });

      }

    }
        
  },

  freshCurrentPage: function (){

    var that = this
    if(!that.data.album_id) return
    app.util.request({
      'url': 'entry/wxapp/getCardAlbumPics',
      //'cachetime': '30',
      'method': 'POST',
      'data': { 'card_id': that.data.card_id, 'album_id': that.data.album_id },
      success(res) {
        console.log(res)
        var album = res.data.data
        that.setData({ album_name: album.name, order_sort: album.sort, pics: album.pic_list, isFresh : false })
        wx.setNavigationBarTitle({
          title: album.name
        });
        that.queryMultipleNodes()
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
    if(this.data.isFresh === true) this.freshCurrentPage()
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