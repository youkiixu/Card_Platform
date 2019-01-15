// super_card/pages/details/details.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sid: 0,
    index: false,
    

    info: false,

    app_name: '',
   
    commentsContent: '',

    showCommentsModal: false,

    uid:0,

    showBackIndex: false
    
  },

  //返回首页
  backIndex: function (e) {

    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }

    wx.switchTab({
      url: '../index/index',
    });

  },

  zanSquare: function (e) {

    var that = this

    var id = that.data.info.id

    var that = this
    app.util.request({
      'url': 'entry/wxapp/toggleSquareZan',
      'method': 'POST',
      'data': { sid: id, show: 'detail' },
      success(res) {
        var data = res.data.data
        that.setData({ 'info.likes': data.total, 'info.zans': data.list })
        that.setPrevListFresh()
      }
    })

  },

  setCommentsContent: function (e) {

    this.data.commentsContent = e.detail.value

  },

  pingSquare: function (e) {
    var that = this
    console.log(e)

    var id = that.data.info.id
    var content = that.data.commentsContent

    if (!content) {
      wx.showToast({
        title: '请输入要发送的消息内容',
        icon: 'none'
      })
      return
    }

    app.util.request({
      'url': 'entry/wxapp/postSquareComments',
      'method': 'POST',
      'data': { sid: id, content: encodeURIComponent(content), show: 'detail' },
      success(res) {

        console.log(res)
        if (res.data.message == 'noWay') {
          that.setData({ commentsContent: '', showCommentsModal: false })
          wx.showToast({
            title: '评论太频繁啦',
            icon: 'none'
          })
          return
        }

        var data = res.data.data
        that.setData({ 'info.commentss': data.total, 'info.comments': data.list, commentsContent: '', showCommentsModal: false })
        that.setPrevListFresh()

      }
    })

  },


  setPrevListFresh: function (){
    if(this.data.index !== false){
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; // 上一级页
      prevPage.data.indexFresh = this.data.index
    } 
  },

  togglePingModal: function () {

    var that = this

    var isShow = that.data.showCommentsModal ? false : true

    that.setData({ showCommentsModal: isShow, commentsContent: '' })

  },


  /**
   * 举报内容
   */
  reportContent: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['需求过度重复发布', '内容涉嫌欺诈、虚假', '内容涉嫌违法犯罪', '内容或图片涉嫌低俗色情', '其他'],
      success: function (res) {
        var index = res.tapIndex;
        switch (index) {
          case 0:
            app.util.request({
              'url': 'entry/wxapp/getReportContent',
              'method': 'post',
              'data': { content: '需求过度重复发布', square_id: that.data.info.id },
              success(res) {
                //console.log(res)
                wx.showToast({
                  title: '举报成功',
                  icon: 'success',
                  duration: 2000
                })
              }
            })
            break;
          case 1:
            app.util.request({
              'url': 'entry/wxapp/getReportContent',
              'method': 'post',
              'data': { content: '内容涉嫌欺诈、虚假', square_id: that.data.info.id },
              success(res) {
                //console.log(res)
                wx.showToast({
                  title: '举报成功',
                  icon: 'success',
                  duration: 2000
                })
              }
            })
            break;
          case 2:
            app.util.request({
              'url': 'entry/wxapp/getReportContent',
              'method': 'post',
              'data': { content: '内容涉嫌违法犯罪', square_id: that.data.info.id },
              success(res) {
                //console.log(res)
                wx.showToast({
                  title: '举报成功',
                  icon: 'success',
                  duration: 2000
                })
              }
            })
            break;
          case 3:
            app.util.request({
              'url': 'entry/wxapp/getReportContent',
              'method': 'post',
              'data': { content: '内容或图片涉嫌低俗色情', square_id: that.data.info.id },
              success(res) {
                //console.log(res)
                wx.showToast({
                  title: '举报成功',
                  icon: 'success',
                  duration: 2000
                })
              }
            })
            break;
          case 4:
            app.util.request({
              'url': 'entry/wxapp/getReportContent',
              'method': 'post',
              'data': { content: '其他', square_id: that.data.info.id },
              success(res) {
                //console.log(res)
                wx.showToast({
                  title: '举报成功',
                  icon: 'success',
                  duration: 2000
                })
              }
            })
            break;
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this

    //获取当前用户ID
    app.util.getUserInfo(function (response) {
      //console.log(response)
      that.setData({ uid: response.memberInfo.uid })
      if(options.sid > 0){

         if(typeof options.from_act !== 'undefined')
           that.setData({ showBackIndex: true })

          that.data.sid = options.sid
          that.data.index = typeof options.index != 'undefined' ? options.index : false
          app.util.request({
              'url': 'entry/wxapp/getSquareInfo',
              'method': 'POST',
              'data': { sid: that.data.sid, watch_detail: 1 },
              success(res) {
                console.log(res)
                var data = res.data.data
                if(data.label.length > 0) data.label = data.label.split(',')
                that.setData({ info: data, app_name: app.config.getConf('app_name') })
              }
          })


      }

    })
  },

  goBack:function (){
    wx.navigateBack()
  },

  toCardPage: function (e) {
    //console.log('CARD')
    //console.log(e)
    var card_id = e.currentTarget.dataset.card_id
    wx.navigateTo({
      url: '../overt/overt?card_id=' + card_id
    })
  },

  previewImage: function (e) {
    console.log(e)
    var pics = this.data.info.pics
    var idx = e.currentTarget.dataset.index
    wx.previewImage({
      current: pics[idx],
      urls: pics
    })
  },

  callPhone: function (e) {
    console.log(e)
    var m = e.currentTarget.dataset.mobile
    wx.makePhoneCall({
      phoneNumber: m,
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

    var that = this

    var square_forward_title = app.config.getConf('square_forward_title')
    var square_forward_pic = app.config.getConf('square_forward_pic')

    var title = square_forward_title ? square_forward_title : that.data.info.content
    var imageUrl = square_forward_pic ? square_forward_pic : ''
    var path = 'super_card/pages/square/square?sid=' + that.data.sid + '&from_act=share'

    return {
      title: title,
      path: path,
      imageUrl: imageUrl,
      success: function (res) {

        if (res.errMsg == 'shareAppMessage:ok')
          wx.showToast({
            title: '分享成功',
            icon: 'success'
          })
        else
          wx.showToast({
            title: '分享失败',
            icon: 'none'
          })

      },
      fail: function (res) {

        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
        wx.showToast({
          title: '分享失败',
          icon: 'none'
        })

      },
    }
  }
})