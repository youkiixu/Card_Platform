// super_card/pages/recognition/recognition.js
import { $wuxDialog } from '../../components/wux'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    identify_id: 0,
    identify_data: '',
    is_collect: false,
    show_btn: true,
    check_name:1,

    tipTop: '0',   //高
    tipLeft: '-500px',    //左偏移 
    showTip: false,
    showTipObj: {},
    plate: '',

    isFresh: false    
  },

  //添加到手机通讯路
  addPhoneContact: function () {
    var that = this;
    wx.addPhoneContact({
      photoFilePath: this.data.identify_data.picture, //头像
      firstName: this.data.identify_data.name,    //姓名
      nickName: this.data.identify_data.intro_title,  //昵称
      mobilePhoneNumber: this.data.identify_data.mobile,  //手机
      organization: this.data.identify_data.company,  //公司
      title: this.data.identify_data.title,   //职位
      addressState: this.data.identify_data.province, //省
      addressCity: this.data.identify_data.city,   //城市
      addressStreet: this.data.identify_data.dict + this.data.identify_data.address,  //地址
      url: this.data.identify_data.www,  //网址
      weChatNumber: this.data.identify_data.wx, //微信
      email: this.data.identify_data.email,   //邮箱
      hostNumber: this.data.identify_data.tel,  //公司电话
      workFaxNumber: this.data.identify_data.fax, //工作传真
      remark: this.data.identify_data.intro_content,  //备注
      success: function (res) {
        console.log(res)
      },
    })
  },

  //显示拍名片选项
  showTakeCard: function () {
    /*var that = this
    wx.showActionSheet({
      itemList: ['拍照', '从手机相册选择'],
      success: function (res) {
        console.log(res)
        var index = res.tapIndex
        switch (index) {
          case 0:*/
            wx.redirectTo({
              url: '../pat-card/camera-card',
            })
            /*break;
          case 1:
            that.identifyCard()
            break;
        }
      }
    })*/
  },

  //拨打名片手机号
  callMobile: function (e) {

    var that = this;
    var mobile = this.data.identify_data.mobile

    wx.makePhoneCall({
      phoneNumber: mobile
    })

  },

  //显示名片地址在地图中的位置
  showMapLocation: function () {
    var that = this;
    var name = this.data.identify_data.company
    var address = this.data.identify_data.address
    var latitude = parseFloat(this.data.identify_data.latitude)
    var longitude = parseFloat(this.data.identify_data.longitude)
    console.log(latitude)
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      name: name,
      address: address,
      scale: 28
    })

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
                icon: 'success',
              })
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
    if (this.data.showTip) this.toggleShowTip()
  },
  //切换tip状态
  toggleShowTip: function () {

    this.data.showTip = this.data.showTip ? false : true
    this.setData({ showTip: this.data.showTip })

  },


  //识别纸质名片
  identifyCard: function () {

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {

        //console.log(res)
        wx.showLoading({
          title: '正在识别中...',
        })
        var src = res.tempFilePaths[0]

        wx.uploadFile({
          url: app.util.url('entry/wxapp/uploadTempPic'),
          filePath: src,
          name: 'pic',
          header: {
            'content-type': 'multipart/form-data' // 默认值
          },
          success: function (res) {

            //console.log(res)
            res = JSON.parse(res.data)

            if (res.errno == 0) {

              //console.log(res.data.path)
              wx.request({
                'url': app.util.url('entry/wxapp/IdentifyCard'),
                'data': { 'path': res.data.path },
                success: function (res) {
                  wx.hideLoading()
                  if (res.data.errno == 0) {
                    //console.log(res)
                    wx.navigateTo({
                      url: '../../pages/recognition/recognition?identify_id=' + res.data.data.identify_id,
                    })

                  } else {
    
                    wx.showToast({
                      title: res.data.message,
                      icon: 'none',
                      duration: 2000
                    })

                  }
                },
                fail: function (res) {
                  wx.hideLoading()
                  wx.showToast({
                    title: '识别名片发生网络错误',
                    icon: 'none',
                    duration: 2000
                  })

                },

              })

            } else {
              wx.hideLoading()
              wx.showToast({
                title: res.message,
                icon: 'none',
                duration: 2000
              })

            }

          },
          fail: function (res) {
            wx.hideLoading()
            wx.showToast({
              title: '上传名片图片发生网络错误',
              icon: 'none',
              duration: 2000
            })

          },
        })

      }
    })

  },

  //收藏/取消收藏
  toggleCollectStatus: function (){
    var that = this
    app.util.request({
      'url': 'entry/wxapp/toggleCollectCard',
      'method': 'POST',
      'data': { 'identify_id': that.data.identify_id, 'check_name' : that.data.check_name },
      success(res) {
        
        if(res.data.data == 'promat'){

          $wuxDialog.confirm({
            title: '',
            content: res.data.message,
            onConfirm(e) {

              that.setData({ check_name: 0 })
              
              that.toggleCollectStatus()

            },
            onCancel(e){

              wx.navigateBack()

            },
          })
        }else{
          
          if (that.data.is_collect === true) {
            that.data.is_collect = false
            wx.showToast({
              title: '已取消收藏',
              icon: 'success'
            })
          } else {
            that.data.is_collect = true
            wx.showToast({
              title: '收藏成功',
              icon: 'success'
            })
          }
          if(that.data.is_collect === false) app.freshHolder = true
          that.setData({ is_collect: that.data.is_collect })

        }
      

      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this
    if(!options.identify_id) wx.navigateBack({ delta: 1 })
    if(options.hide_identify_btn) that.data.show_btn = false
    that.setData({ identify_id: options.identify_id, show_btn: that.data.show_btn })

    app.util.request({
      'url': 'entry/wxapp/getIdentifyCard',
      'method': 'POST',
      'data': { 'identify_id': that.data.identify_id },
      success(res) {

        //console.log(res)
        that.setData({ identify_data : res.data.data })

        if(options.hide_identify_btn){

          app.util.request({
            'url': 'entry/wxapp/getIsCollect',
            'method': 'POST',
            'data': { 'identify_id': that.data.identify_id },
            success(res) {

              //console.log(res)
              that.setData({ is_collect: res.data.data })

            }

          })

        }else{

          //识别完成进入
          that.toggleCollectStatus()
          app.freshHolder = true

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
  onShow: function (options) {

    app.config.set(this)
    
    var that = this
    if(this.data.isFresh !== false)
    app.util.request({
        'url': 'entry/wxapp/getIdentifyCard',
        'method': 'POST',
        'data': { 'identify_id': that.data.identify_id },
        success(res) {

          //console.log(res)
          that.setData({ identify_data: res.data.data })

          app.util.request({
            'url': 'entry/wxapp/getIsCollect',
            'method': 'POST',
            'data': { 'identify_id': that.data.identify_id },
            success(res) {

              //console.log(res)
              that.setData({ is_collect: res.data.data })

            }

          })

        }
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
    var that = this
    app.util.request({
      'url': 'entry/wxapp/getIdentifyCard',
      'method': 'POST',
      'data': { 'identify_id': that.data.identify_id },
      success(res) {

        //console.log(res)
        that.setData({ identify_data: res.data.data })

        app.util.request({
          'url': 'entry/wxapp/getIsCollect',
          'method': 'POST',
          'data': { 'identify_id': that.data.identify_id },
          success(res) {

            //console.log(res)
            that.setData({ is_collect: res.data.data })
            wx.stopPullDownRefresh();
          }

        })

      }
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
  // onShareAppMessage: function () {
  
  // }
})