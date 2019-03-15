// super_card/pages/mall-details/mall-details.js
var app = getApp()
const device = wx.getSystemInfoSync()
const dWidth = device.windowWidth
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 500,
    index:1,

    card_id: 0,
    goods_id: 0,


    goods:{},

    my_userCards:[],

    card: {},

    prevPage: false,
    preview: false,
    swiperHeight: 0,
    currIndex: 0,
    imgHeights: [],
    iosPay:false,
    
  },


  showPic: function (e) {
    console.log(e)
    var pic = e.target.dataset.pic
    if (typeof pic == 'string')
      wx.previewImage({
        current: pic,
        urls: [pic],
        success: function (res) { },
      })
    else
      wx.previewImage({
        current: pic[0],
        urls: pic,
        success: function (res) { },
      })
  },
  
  showPics: function (e) {
    var pics = e.target.dataset.pics
    var index = e.target.dataset.index
    wx.previewImage({
      current: pics[index],
      urls: pics,
      success: function (res) { },
    })
  },

  /**
   * 获取轮播当前页数
   */
  onSlideChangeEnd:function(e){
    var that = this;

    var index = e.detail.current
    var height = this.data.imgHeights[index]
    this.setData({ swiperHeight: height, index: e.detail.current + 1 })
  },

  imageLoad: function (e) {

    var viewHeight = this.getViewHeight(e.detail.width, e.detail.height)
    this.data.imgHeights[e.target.dataset.index] = viewHeight
    if (e.target.dataset.index == 0)
      this.setData({ swiperHeight: viewHeight })
  },

  getViewHeight: function (width, height) {
    var ratio = width / height;
    //计算的高度值  
    var viewHeight = dWidth / ratio;
    return viewHeight
  },

  callMobile: function () {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.card.mobile,
      complete: function () {
        app.config.cardTrack(this.data.card_id, 2, 'copy')
      }
    })
  },

  copyInfo: function (e) {
    var plate = e.target.dataset.plate
    var id = e.target.dataset.id

    wx.setClipboardData({
      data: plate,
      success(res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success'
        })
      }
    })
  },

  contactCarder: function () {

    var that = this
    if(that.data.card.uid == 0){
      wx.makePhoneCall({
        phoneNumber: that.data.card.mobile,
      })
      return
    }

    app.config.cardTrack(that.data.card_id, 8, 'copy', that.data.goods_id)
    if (that.data.card.wx != '' ){
      wx.showActionSheet({
        itemList: ['发消息', '加微信', '拨打电话'],
        success: function (res) {
          //console.log(res.tapIndex)
          var index = res.tapIndex;
          switch (index) {
            case 0:
              console.log('发消息')

              if (that.data.my_userCards.length < 1) {
                wx.showModal({
                  title: '系统提示',
                  content: '您还没有创建名片，只有创建名片后才可以咨询哦',
                  showCancel: false,
                  confirmColor: '#f90',
                  confirmText: '去创建',
                  success: function (res) {
                    wx.redirectTo({
                      url: '../basic/basic',
                    })
                  }
                });
                return false
              }

              app.util.request({
                'url': 'entry/wxapp/startChat',
                //'cachetime': '30',
                'data': { t_uid: that.data.goods.uid, t_card_id: that.data.goods.card_id, card_id: that.data.my_userCards[0].id },
                success(res) {

                  wx.navigateTo({
                    url: '../chat/chat?chat_id=' + res.data.data + '&from=overt'
                  })

                }
              })

              break;
            case 1:
              console.log('加微信')
              console.log(that.data.card.wx)
              wx.setClipboardData({
                data: that.data.card.wx,
                success: function (res) {

                  wx.getClipboardData({
                    success: function (res) {

                      wx.showToast({
                        title: '微信复制成功',
                      })
                    }
                  })

                }
              })
              break;
            case 2:
              console.log('拨打电话')
              console.log(that.data.card.mobile)
              wx.makePhoneCall({
                phoneNumber: that.data.card.mobile,
              })
              break;

          }
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      });
    }else{
      wx.showActionSheet({
        itemList: ['发消息', '拨打电话'],
        success: function (res) {
          //console.log(res.tapIndex)
          var index = res.tapIndex;
          switch (index) {
            case 0:
              console.log('发消息')

              if (that.data.my_userCards.length < 1) {
                wx.showModal({
                  title: '系统提示',
                  content: '您还没有创建名片，只有创建名片后才可以咨询哦',
                  showCancel: false,
                  confirmColor: '#f90',
                  confirmText: '去创建',
                  success: function (res) {
                    wx.redirectTo({
                      url: '../basic/basic',
                    })
                  }
                });
                return false
              }

              app.util.request({
                'url': 'entry/wxapp/startChat',
                //'cachetime': '30',
                'data': { t_uid: that.data.goods.uid, t_card_id: that.data.goods.card_id, card_id: that.data.my_userCards[0].id },
                success(res) {

                  wx.navigateTo({
                    url: '../chat/chat?chat_id=' + res.data.data + '&from=overt'
                  })

                }
              })

              break;
            case 1:
              console.log('拨打电话')
              console.log(that.data.card.mobile)
              wx.makePhoneCall({
                phoneNumber: that.data.card.mobile,
              })
              break;

          }
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      });
    }
   

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    //ios支付判断
    var iosPay = app.config.iosPay(that)
    that.setData({ iosPay: iosPay })

    
    //为了能调起授权--新加代码start（bug：不在此页面调起授权，点击产品进这个详情页的时候就会报“非法进入”的错误，所以只能在这再调起一次授权）
    var userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      app.util.getUserInfo(function (response) {
        app.config.init()
      });
      return
    }
    //为了能调起授权--新加代码end

    if (typeof options.card_id != 'undefined') {
      
      that.setData({ card_id: options.card_id, goods_id: options.goods_id })
      app.config.cardTrack(that.data.card_id, 2, 'view', that.data.goods_id)
      that.getGoodsItem()
      that.getMyUserCards()

    }else{

      var pages = getCurrentPages();
      that.data.prevPage = pages[pages.length - 2]; // 上一级页
      var data =  that.data.prevPage.data
      console.log(data)

      that.setData({ goods: data.goodsList[options.goods_index], card: data.card ,preview: true })
      wx.hideShareMenu()
    }

  },

  getGoodsItem: function (callback = false){
    var that = this
    app.util.request({
      'url': 'entry/wxapp/getGoodsItem',
      'method': 'post',
      'data': { card_id : that.data.card_id, goods_id: that.data.goods_id },
      success(res) {

        typeof callback === `function` && callback()

        var data = res.data.data

        that.setData({ goods: data.goods, card: data.card })
        
        console.log(that.data.goodsList)
        wx.setNavigationBarTitle({
          title: that.data.goods.goods_name + ' - ' + app.config.getConf('app_name')
        })

      }
    })
  },


  //获取当前用户名片
  getMyUserCards: function () {

    var that = this
    app.util.request({
      'url': 'entry/wxapp/getUserCard',
      'data': { 'no_need_whole': 1 },
      success(res) {
        var data = res.data.data
        that.setData({ my_userCards: data })
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
    this.getGoodsItem(function () {
      wx.stopPullDownRefresh()
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
  onShareAppMessage: function () {

    var title = this.data.goods.goods_name
    var path = '/super_card/pages/overt/mall-details?card_id=' + this.data.card_id + '&goods_id=' + this.data.goods_id
    var imgUrl = ''
    
    app.config.cardTrack(this.data.card_id, 4, 'praise')

    return {
      title: title,
      path: path,
      imageUrl: imgUrl
    }

  }

})