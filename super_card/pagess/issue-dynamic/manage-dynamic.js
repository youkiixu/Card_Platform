// super_card/pages/issue-dynamic/manage-dynamic.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    isFresh: false,
    card_id: 0,

    dyList: [],

    page: 1,
    lastPage: false,

    currentPingId: 0,
    currentPingIndex: 0,
    marketingGroup: false,//判断是否加入营销群组，共用群主动态

  },
  
  //预览图片
  showDynamicPics: function (e) {
    var that = this
    var pic_id = e.target.dataset.pic_id
    var dl_index = e.target.dataset.index

    wx.previewImage({
      current: this.data.dyList[dl_index].pics[pic_id],
      urls: this.data.dyList[dl_index].pics
    })

  },

  //删除评论的标识
  delThis:function(e,m){
    var currentPingId = e
    var currentPingIndex = m
    this.setData({ currentPingId: currentPingId, currentPingIndex: currentPingIndex })
  },

  //删除动态
  delDynamic:function(e){

    var that = this
    var mic = e.target.dataset.id
    var ind = e.target.dataset.index

    that.delThis(mic,ind)
    // console.log(that.data.currentPingIndex)
    wx.showModal({
      title: '提示',
      content: '确认要删除该动态吗？',
      confirmColor: that.data.themeColor,
      success(res) {
        if (res.confirm) {
          app.util.request({
            'url': 'entry/wxapp/delCardDynamic',
            'method': 'post',
            'data': { id: that.data.currentPingId, card_id: that.data.card_id },
            success(res) {
              console.log(res)
              that.data.dyList.splice(that.data.currentPingIndex, 1)
              that.setData({ dyList: that.data.dyList })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },

  //删除评论
  delComment:function(e){

    var that = this
    var mic = e.target.dataset.id
    var ind = e.target.dataset.index
    var coda = e.target.dataset.coda

    that.data.dyList[ind].comments_data.splice(coda, 1)

    app.util.request({
      'url': 'entry/wxapp/delCardComment',
      'method': 'post',
      'data': { id: mic, comments_data_index: coda },
      success(res) {
        // console.log(res)
        that.setData({ dyList: that.data.dyList })
      }
    })

  },

  getCardDynamic: function (callback = false, mode = 'cover') {

    var that = this
    app.util.request({
      'url': 'entry/wxapp/getDelCardDynamic',
      'method': 'post',
      'data': { card_id: that.data.card_id, page: that.data.page },
      success(res) {
        console.log(res)
        if (that.data.isFresh === true) app.freshIndex = true
        typeof callback === `function` && callback()
        
        var data = res.data.data

        if (mode == 'append') {
          if (!res.data.data.length) {
            that.data.lastPage = true
            return false
          }
          that.data.dyList = that.data.dyList.concat(res.data.data)
        } else {
          that.data.dyList = res.data.data
        }

        that.setData({
          dyList: that.data.dyList,
          isFresh: false
        })

      },
      fail:function(res){
        if (res.data.errno == -10) {
          //表示加入了营销群组
          //that.setData({ marketingGroup: true })
          wx.showModal({
            title: '系统提示',
            content: '您已加入营销群组，共用群主动态',
            showCancel: false,
            confirmColor: '#f90',
            confirmText: '知道了',
            success: function (res) {
              wx.navigateBack()
            }
          });
          return
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    //ios系统判断是否可用
    var iosPay = app.config.iosPay(that)

    if (!options.card_id) {
      return false  
    }
    that.setData({ card_id: options.card_id })
    console.log(that.data.card_id)

    //判断是否为会员，非会员不能发布动态
    var getUserInfo = wx.getStorageSync('getUserInfo');
    var isVip = getUserInfo.vip;
    //判断是否加入了推广组 proGroup == 0,则表示未加入
    var proGroup = wx.getStorageSync('proGroup');

    
    if (isVip == 0 && proGroup == 0) {
      wx.showModal({
        title: '系统提示',
        content: iosPay ? '您还不是会员，请先开通会员' : '不可服务',
        cancelText: '返回',
        confirmColor: '#f90',
        confirmText: iosPay ? '去开通' : '知道了',
        success: function (res) {
          if (res.confirm) {
            iosPay ? wx.redirectTo({ url: '../../pages/opt-version/opt-version' }) : wx.navigateBack()
          } else if (res.cancel) {
            wx.navigateBack()
          }
        }
      });
      return
    } 

    //that.getUserInfo()

    //获取动态信息
    that.getCardDynamic()

    //判断是否共用群主动态

    // console.log('marketingGroup2222', that.data.marketingGroup)
    // if (that.data.marketingGroup == true) {
    //   wx.showModal({
    //     title: '系统提示',
    //     content: '您已加入营销群组，共用群主动态',
    //     showCancel: false,
    //     confirmColor: '#f90',
    //     confirmText: '知道了',
    //     success: function (res) {
    //       wx.navigateBack()
    //     }
    //   });
    //   return
    // }
  },

  getUserInfo: function () {
    var that = this
    app.util.request({
      'url': 'entry/wxapp/getUserInfo',
      success(res) {

        var data = res.data.data
        console.log(data)
        if (data.is_company != 1) {
          wx.showModal({
            title: '系统提示',
            content: '您还没有进行企业认证，暂无编辑权限',
            showCancel: false,
            confirmColor: '#f90',
            confirmText: '去认证',
            success: function (res) {
              wx.redirectTo({
                url: '../../pagess/certify-opt/certify-opt',
              })
            }
          });
          return
        } else {

          that.getCardDynamic();

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
    if (this.data.isFresh === true) this.getCardDynamic()
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
    that.data.page = 1
    that.data.lastPage = false
    that.getCardDynamic(function () {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this

    if (that.data.lastPage === true) return false
    that.data.page++
    that.getCardDynamic('', 'append')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    var title = '欢迎查看我的名片动态'
    var path = '/super_card/pages/overt/dynamic?card_id=' + this.data.card_id
    var imgUrl = ''

    console.log('path:', path)


    app.config.cardTrack(this.data.card_id, 4, 'praise')

    return {
      title: title,
      path: path,
      imageUrl: imgUrl
    }

  }
})