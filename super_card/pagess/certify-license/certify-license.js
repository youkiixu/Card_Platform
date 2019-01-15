// super_card/pages/certify-license/certify-license.js
import { $wuxDialog } from '../../components/wux'
var app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1,
    license_path: '/super_card/resource/images/cr-5.png',
    id_path: '/super_card/resource/images/cr-4.png',

    badge_path: '/super_card/resource/images/cr-3.png',
    disableBtn: true,
  },

  submitInfo: function (form_id){
    var that = this
    var data = {
      type: that.data.type,
      license_path: that.data.license_path,
      id_path: that.data.id_path,
      badge_path: that.data.badge_path,
      form_id: form_id,
    }
    app.util.request({
      'url': 'entry/wxapp/saveCertifyInfo',
      //'cachetime': '30',
      'method': 'POST',
      'data': data,
      success(res) {
        //console.log(res)      

        wx.showToast({
          title: res.data.message,
          icon: res.data.errno ? 'error' : 'success',
          duration: 2000
        })

        if (res.data.errno == 0)
          setTimeout(function () {
            app.freshHome = true
            wx.navigateBack({
              delta: 3,
            })
          }, 2000)


      }
    })


  }, 


  saveCertifyInfo: function (e) {

    var formId = e.detail.formId;

    var that = this

    $wuxDialog.confirm({
      title: '',
      content: '确定要提交申请吗？提交后不可修改',
      onConfirm(e) {
        
        that.setData({ disableBtn: true })

        var src = that.data.type == 2 ? that.data.badge_path : that.data.license_path
        var formdata = { 'noUrl' : 1 }

        wx.showLoading({
          title: '提交中...',
        })
        wx.uploadFile({
          url: app.util.url('entry/wxapp/uploadTempPic'),
          filePath: src,
          name: 'pic',
          header: {
            'content-type': 'multipart/form-data' // 默认值
          },
          formData: formdata,
          success: function (res) {
            wx.hideLoading()
            //console.log(res)

            res = JSON.parse(res.data)

            if (res.errno) {

              wx.showToast({
                title: res.message,
                icon: 'error',
                duration: 1000
              })

            } else {

                if(that.data.type == 2){

                  that.data.badge_path = res.data.path
                  that.submitInfo(formId)

                }else{

                  that.data.license_path = res.data.path

                  src = that.data.id_path

                  wx.showLoading({
                    title: '提交中...',
                  })
                  wx.uploadFile({
                    url: app.util.url('entry/wxapp/uploadTempPic'),
                    filePath: src,
                    name: 'pic',
                    header: {
                      'content-type': 'multipart/form-data' // 默认值
                    },
                    formData: formdata,
                    success: function (res) {
                      wx.hideLoading()

                      res = JSON.parse(res.data)

                      that.data.id_path = res.data.path

                      that.submitInfo(formId)
                      
                    }
                  })

                }

            }

          }
        })


      },
      onCancel(e) {

      },
    })

  },


  toggleSaveBtn: function () {

    this.data.disableBtn = this.data.type == 1 ? ((this.data.license_path != '/super_card/resource/images/cr-5.png' && this.data.id_path != '/super_card/resource/images/cr-4.png') ? false : true) : (this.data.badge_path == '/super_card/resource/images/cr-3.png' ? true : false)

    this.setData({ disableBtn: this.data.disableBtn })

  },

  chooseLicense: function () {

    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        //console.log(res)
        var src = res.tempFilePaths[0]
        that.setData({ license_path: src })
        that.toggleSaveBtn()

      }
    })

  },

  chooseId: function () {

    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        //console.log(res)
        var src = res.tempFilePaths[0]
        that.setData({ id_path: src })
        that.toggleSaveBtn()
      }
    })

  },

  chooseBadge: function () {

    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        //console.log(res)
        var src = res.tempFilePaths[0]
        that.setData({ badge_path: src })
        that.toggleSaveBtn()
      }
    })

  },

  navBack: function () {
    wx.navigateBack()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

      if(options.type < 1){
        wx.navigateBack()
        return false
      }

      this.setData({ type: options.type })

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