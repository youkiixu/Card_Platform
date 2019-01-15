// super_card/pages/video/video.js
import { $wuxDialog } from '../../components/wux'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      card_id: 0,
      path: '',
      name: '',
      res : {},
      data: false,
      showVideo: true,

      disabledBtn: false,
      catalogSelect: 2,  //选项卡

      VqqLink: '',

      VqqId: 0,
  },

  /**
  * 选项卡转换-本地上传
  */
  selectInstall: function () {
    var that = this
    that.setData({
      catalogSelect: 1,
    })
  },

  setVqqLink: function (e){
      //console.log(e)
      var that = this
      that.data.VqqLink = e.detail.value

  },

  /**
   * 选项卡-网上链接
   */
  selectRecording: function () {
    var that = this
    that.setData({
      catalogSelect: 2,
    })
  },




  /**
   * 删除视频
   */
  delCardVideo: function () {
    var that = this
    that.setData({ showVideo: false })
    $wuxDialog.confirm({
      title: '',
      content: '您确定要删除吗？',
      onConfirm(e) {

        var data = {
          card_id: that.data.card_id
        }

        app.util.request({
          'url': 'entry/wxapp/delCardVideo',
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
        that.setData({ showVideo: true })
      }
    })

  },

  /**
 * 修改视频名称
 */
  updateVideoName: function () {
    //console.log($wuxDialog)
    var that = this
    that.setData({ showVideo: false })
    $wuxDialog.prompt({
      title: '',
      content: '视频名称为',
      fieldtype: 'text',
      password: false,
      defaultText: that.data.name,
      placeholder: '0~12字符',
      maxlength: 12,
      onConfirm(e) {
        var name = that.data.$wux.dialog.prompt.response
        var data = {
          card_id: that.data.card_id,
          name: name
        }
        app.util.request({
          'url': 'entry/wxapp/saveCardVname',
          //'cachetime': '30',
          'method': 'POST',
          'data': data,
          success(res) {
            app.freshIndex = true
            //console.log(res)
            that.setData({ name: name })

          }

        })

      },
      onCancel(e){
        that.setData({ showVideo: true })
      }
    })

  },

  //设置视频名称
  setVideoName: function (e){

    this.setData({ name: e.detail.value })

  },

  //选择短视频
  chooseCardVideo: function() {

    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        
        //console.log('%c' + that.data.card_id, 'font-size:30px;color:green')
        
        console.log(res)
        
        if (Math.floor(res.duration) < 10)
        {
            wx.showToast({
              title: '时长太小',
              icon : 'none',
              duration: 2000
            })
            return false
        }
        if(Math.floor(res.duration) > 600){
          wx.showToast({
            title: '时长太大',
            icon: 'none',
            duration: 2000
          })
          return false
        }
        
        that.setData({ path : res.tempFilePath, res : res })

      },
      fail: function (res){

        console.log(res)
        return
        wx.showToast({
          title: res.errMsg,
          icon: 'error',
          duration: 2000
        })

      },
    })

  },
  
  //保存名片视频
  saveCardVideo: function (){
    var that = this
    if(that.data.catalogSelect == 2){
      if(!that.data.res.tempFilePath){
        wx.showToast({
          title: '未选择视频',
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
        url: app.util.url('entry/wxapp/saveCardVideo'),
        filePath: that.data.res.tempFilePath,
        name: 'video',
        header: {
          'content-type': 'multipart/form-data' // 默认值
        },
        formData: {
          'card_id' : that.data.card_id,
          'name': that.data.name,
          'duration': that.data.res.duration,
          'size': that.data.res.size,
          'width': that.data.res.width,
          'height': that.data.res.height
        },
        success: function (res) {
          app.freshIndex = true
          wx.hideLoading()
          that.setData({ disabledBtn: false })
          console.log(res)
          var data = JSON.parse(res.data)
          if(data.errno == 0){

            if(!that.data.res.thumbTempFilePath){
              
              that.setData({ res: {} })

              wx.showToast({
                title: data.message,
                icon: 'success',
                duration: 2000
              })

                setTimeout(function () {
                  wx.navigateBack()
                }, 2000)


            }else{

              that.saveCardVthumb()

            }
              

          }else{

            wx.showModal({
              title: 'error',
              content: data.message,
              showCancel:false,
              confirmText:'我知道了'
            })

            that.setData({ res: {} })

          }

          

        }

      })
    }else if(that.data.catalogSelect == 1){

      if(!that.data.VqqLink){
          wx.showToast({
            title: '请粘贴腾讯视频链接',
            icon: 'none',
            duration: 2000
          })
          return false
        }

      var linkReg = /v.qq.com\/x\/page/
      if (!linkReg.test(that.data.VqqLink)){

          wx.showToast({
            title: '目前只支持腾讯视频的链接哦',
            icon: 'none',
            duration: 2000
          })
          return false
      }

      app.util.request({
        'url': 'entry/wxapp/saveCardVideo',
        //'cachetime': '30',
        'method': 'POST',
        'data': {
            'card_id': that.data.card_id,
            'name': that.data.name,
            'VqqLink': that.data.VqqLink
          },
        success(res) {

          app.freshIndex = true
         
          //that.setData({ res: {} })
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

    }

  },
  
  //保存名片截图
  saveCardVthumb: function () {
    wx.showLoading({
      title: '加载中',
    })
    
    var that = this
    that.setData({ disabledBtn: true })
    
    if (!that.data.res.thumbTempFilePath) return false

    wx.uploadFile({
      url: app.util.url('entry/wxapp/saveCardVthumb'),
      filePath: that.data.res.thumbTempFilePath,
      name: 'thumb',
      header: {
        'content-type': 'multipart/form-data' // 默认值
      },
      formData: {
        'card_id': that.data.card_id
      },
      success: function (res) {

        wx.hideLoading()
        that.setData({ disabledBtn: false })
        console.log(res)
        var data = JSON.parse(res.data)

        that.setData({ res: {} })

        wx.showToast({
          title: data.message,
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
    if(options.card_id){

       this.setData({ card_id: options.card_id })
       app.util.request({
         'url': 'entry/wxapp/getCardVideo',
         //'cachetime': '30',
         'data' : {card_id : that.data.card_id},
         success(res) {
           
           var data = res.data.data
           console.log(typeof data)
           if (data){

             that.setData({
               name: data.name,
               path: data.path,
               data: data
             })

             var linkReg = /v.qq.com\/x\/page/
             if (linkReg.test(data.path)){
                var temp = data.path.match(/page\/(.*)\.html/)
                that.setData({ VqqId : temp[1] })
              }


           }
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
  
  // }
})