import WeCropper from '../../components/we-cropper/we-cropper'
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 250 //250是三个选择按钮所占的高度--新修改
// const height = width //原来的代码

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: 0,
    card_id: 0,
    picture:'',
    fromIndex: false,

    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 200) / 2,
        y: (height - 200) / 2,
        width: 200,
        height: 200
      }
    },

    wxAvatar: '',

    src: false,
  },

  getWxAavatar:function (){
   
    var that = this
    var from_index = this.data.fromIndex ? 1 : 0

    app.util.getUserInfo(function (res) {

        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1]; // 当前页面
        var prevPage = pages[pages.length - 2]; // 上一级页面
        prevPage.setData({
          picture: res.wxInfo.avatarUrl,
        });
        //setTimeout(function () {
          wx.navigateBack()
        //}, 3000);
        return
 
        console.log(res)
        var avatar = res.wxInfo.avatarUrl

        that.setData({ wxAvatar: avatar })
        return false

        that.wecropper.pushOrign(avatar)
        return false
        wx.downloadFile({
          url: avatar,
          success: function (res) {

            console.log(res.tempFilePath)

            var ctx = wx.createCanvasContext('cropper')
            ctx.drawImage(res.tempFilePath, 87.5, 87.5, 200, 200)
            ctx.draw()
            return false

            wx.uploadFile({
              url: app.util.url('entry/wxapp/uploadTempPic'),
              filePath: res.tempFilePath,
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

                if(res.errno == 0){
                                  
                   that.wecropper.pushOrign(res.data.path)

                }else{

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

        

    })

  },

  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },
 
  getCropperImage() {
    
    var that = this
    var from_index = this.data.fromIndex ? 1 : 0

    that.wecropper.getCropperImage((src) => {
      if (that.data.src === false) {
        wx.showToast({
          title: '请选择图片',
        })
        return false
      }
      if (src) {
        wx.showLoading({
          title: '加载中',
        })
        wx.uploadFile({
          url: app.util.url('entry/wxapp/saveCardAvatar'), 
          filePath: src,          
          name: 'avatar',
          header: {
            'content-type': 'multipart/form-data' // 默认值
          },
          formData: {
            'card_id': this.data.card_id,
            'from_index' : from_index
          },
          success: function (res) {
            wx.hideLoading()
            console.log(res)
            res = JSON.parse(res.data);
            console.log(res)
            
            if(res.errno == 0){

              if (typeof res.data.path != 'undefined')
                  that.wecropper.pushOrign(res.data.path)

              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 5000
              })

              if (that.data.fromIndex === true) {
				        app.freshIndex = true
                //delete res.data.path
                setTimeout(function () {
                  wx.navigateBack()
                  /*var pages = getCurrentPages();
                  var prevPage = pages[pages.length - 2];
                  var cardLists = prevPage.data.cardLists
                  for (var x in cardLists) {
                    if (cardLists[x].id == that.data.card_id)
                      cardLists[x] = res.data
                  }
                  //console.log(cardLists)
                  prevPage.setData({
                    card_id: that.data.card_id,
                    cardLists: cardLists,
                  });*/
                }, 2000);

              } else {
              
                setTimeout(function () {
                
                  wx.navigateBack()
                
                  var pages = getCurrentPages();
                  var currPage = pages[pages.length - 1]; // 当前页面
                  var prevPage = pages[pages.length - 2]; // 上一级页面
                  prevPage.setData({
                    picture : res.data.path,
                  });

                }, 2000);

              }

            }else{

              wx.showToast({
                title: '保存失败',
                icon : 'none',
                duration: 2000 
              })

            }

            var data = res.data
            //do something
          }
        })
        console.log(src)
        
      } else {
        console.log('获取图片地址失败，请稍后重试')
      }
    })

  },



  //用于压缩图片
  /*prodImageOpt: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'attendCanvasId',
      success: function success(res) {
        that.setData({
          canvasImgUrl: res.tempFilePath
        });
        // 上传图片
        that.uploadFileOpt(that.data.canvasImgUrl);
      },
      complete: function complete(e) {
      }
    });
  },
  drawCanvas: function(){

    const ctx = wx.createCanvasContext('attendCanvasId');
    ctx.drawImage(tempFilePaths[0], 0, 0, 94, 96);
    ctx.draw();
    that.prodImageOpt();

  },*/

  //上传头像照片
  uploadPicture: function (){

    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)
        // that.setData({ src:true})
        var src = res.tempFilePaths[0]
        //console.log(src)
        that.data.src = src
        that.wecropper.pushOrign(src)
        /*wx.uploadFile({
          url: app.util.url('entry/wxapp/uploadPic', { 'm': 'super_card' }),
          filePath: src,
          name: 'avatar',
         
          formData: {
            'user': 'test'
          },
          success: function (res) {

            console.log('***************************')
            console.log(res)
            console.log('***************************')
            var data = res.data
            //do something
          }
        })*/

      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this;
    const { cropperOpt } = this.data
    new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        //console.log(`wecropper is ready for work!`)
        console.log(ctx)
      })
      .on('beforeImageLoad', (ctx) => {
        //console.log(`before picture loaded, i can do something`)
        //console.log(`current canvas context:`, ctx)
        wx.showLoading({
          title: '加载中',
        })

      })
      .on('imageLoad', (ctx) => {
        //console.log(`picture loaded`)
        //console.log(`current canvas context:`, ctx)
        wx.hideLoading()
      })
      .on('beforeDraw', (ctx, instance) => {
        //console.log(`before canvas draw,i can do something`)
        //console.log(`current canvas context:`, ctx)
      })
      .updateCanvas()

    if (options.card_id > 0) {


      if (options.from_index == 1) {
        that.setData({
          card_id: options.card_id,
          fromIndex: true,
        });
      } else {
        that.setData({
          card_id: options.card_id,
        });
      }

      app.util.request({
        'url': 'entry/wxapp/getCardAvatar',
        'method': 'POST',
        'data': { 'card_id': that.data.card_id },
        success(res) {
          console.log(res)
          var picture = res.data.data.picture
          if (picture !== ''){
            that.data.src = picture
          }
          that.wecropper.pushOrign(picture)
        }
      })

    }
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

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // },

})
