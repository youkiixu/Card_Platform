// super_card/pagess/agent/agent.js
var app = getApp()
let animationShowHeight = 300;//动画偏移高度
let animationShowHeights = 500;//动画偏移高度
Page({

  /**
   * 页面的初始数据
   */
  data: {
    center_pic: app.config.getConf('agent_center_pic'),
    wxInfo: '',
    uInfo: '',
    agent_name: '',

    animationData: "",
    showModalRecommend:false,
    animationDatasi: "",
    showImg:false,
    qrPic: '',
    memberCodeView:false,
  },

  //返回首页
  backIndex: function (e) {

    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }

    wx.switchTab({
      url: '../../pages/index/index',
    });

  },

  //生成会员码
  toMemberCode:function(){
    this.setData({
      memberCodeView: true
    })
  },

  //购买次数
  toBuyNum: function() {
    wx.showModal({
      title: '系统提示',
      content: '请选择购买次数',
      showCancel: false,
      confirmColor: '#f90',
      confirmText: '知道了',
      success: function (res) {
        // wx.redirectTo({
        //   url: '../../pages/opt-version/opt-version',
        // })
      }
    });
  },

//返回按钮
  codeViewReturn: function () {
    this.setData({
      memberCodeView: false
    })
  },





  // 显示需要保存图片  
  showKeepImg: function () {
    /*wx.playBackgroundAudio({
      dataUrl: this.data.pip3.o
    })*/
    var animation = wx.createAnimation({
      duration: 1500,
      timingFunction: "ease",
      delay: 700
    })
    this.animation = animation
    animation.translateY(animationShowHeights).step()
    this.setData({
      animationDatasi: animation.export(),
      showImg: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationDatasi: animation.export()
      })
    }.bind(this), 1)
  },
  // 隐藏遮罩层  
  hideKeepImg: function () {
    
    var animation = wx.createAnimation({
      duration: 1500,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation;
    animation.translateY(animationShowHeights).step()
    this.setData({
      animationDatasi: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationDatasi: animation.export(),
        showImg: false
      })
    }.bind(this), 200)
    this.hideModal()
  },

  // 显示遮罩层  
  showModal: function () {
    wx.playBackgroundAudio({
      dataUrl: this.data.pip3.t
    })
    var animation = wx.createAnimation({
      duration: 500,        
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY(animationShowHeight).step()
    this.setData({
      animationData: animation.export(),
      showModalRecommend: true 
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 1)

    this.showKeepImg()
  },
  // 隐藏遮罩层  
  hideModal: function () {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 1500
    })
    this.animation = animation;
    animation.translateY(animationShowHeight).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalRecommend: false
      })
    }.bind(this), 200)
  },

  saveQrpic: function (){
    var that = this
    wx.getImageInfo({
      src: that.data.qrPic,
      success(res) {

        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success(res) {
            wx.showToast({
              title: '保存至相册成功',
              icon: 'success'
            })
            that.hideKeepImg()
          },
          fail(res) {
            console.log(res)
          }
        })

      }
    })
  },

  openAgent: function (){
    wx.redirectTo({
      url: '../partner-index/partner-index',
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.freshAgent()
    this.getPip3()
    
    if (options.agent_id > 0)
      this.setData({ showBackIndex: true })
  },


  getPip3: function () {
    var that = this
    console.log(app.util.url('entry/wxapp/getFrontPics'));
    
    wx.request({
      url: app.util.url('entry/wxapp/getFrontPics'),
      data: {
        page: 'pip3',
      },
      success: function (res) {
        //console.log(res)
        var data = res.data.data
        that.data.pip3 = data
      }
    })
  },

  getAgentQrcode: function (){
    var that = this
    app.util.request({
      'url': 'entry/wxapp/getAgentQrcode',
      //'cachetime': '30',
      success(res) {
          that.setData({ qrPic: res.data.data }, that.showModal())

      }
    })

  },

  toCashPage: function (){

    wx.navigateTo({
      url: '../cash/cash'
    })
  },

  //调到生成会员码页面
  toSpreadPage: function (params) {
    wx.navigateTo({
        url:'../spread/spread'
    })  
  },   

  //刷新代言人中心
  freshAgent: function (cb) {

    var that = this

    app.util.getUserInfo(function (res) {

      //console.log(res)

      var wxInfo = res.wxInfo

      app.util.request({
        'url': 'entry/wxapp/initAgentCenter',
        //'cachetime': '30',
        success(res) {

          typeof cb == "function" && cb()
          //console.log(res)
          var uInfo = res.data.data


          if (uInfo.agent == 0) {
            wx.showModal({
              title: '系统通知',
              content: '您当前还未开通代言人权限，开通后才可以开始赚收益哦',
              showCancel: false,
              confirmColor: '#4752e8',
              confirmText: '去开通',
              success: function () {
                that.openAgent()
              }
            })
            return
          }

          if(uInfo.agent_status == 0){
            wx.showModal({
              title: '系统通知',
              content: '您的代理资格暂时被冻结，请联系客服人员咨询详细情况',
              showCancel: false,
              confirmColor: '#4752e8',
              confirmText: '朕知道啦',
              success: function (){
                wx.navigateBack()
              }
            })
            return
          }

          var agentGrade = app.config.getConf('agent_grade')
          var agent_name = agentGrade[parseInt(uInfo.agent) - 1].name

          that.setData({ wxInfo: wxInfo, agent_name: agent_name, uInfo: uInfo, agentGrade: agentGrade })
          
        }

      });
    });

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
    this.freshAgent(function () {

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
  onShareAppMessage: function (res) {
    console.log('share',res)

    // if (res.target.id != 'codeShareBtn') {

    //   var title = '点击查看全图'
    //   var path = '/super_card/pages/pic-watch/pic-watchphoto-watch/photo-watch?card_id=' + this.data.card_id + '&album_id=' + res.target.dataset.album_id + '&pic_id=' + res.target.dataset.pic_id + '&from_act=share'
    //   var imgUrl = res.target.dataset.src

    // } else {
      
      //点击按钮分享二维码

    //   var title = '您好，这是 "' + this.data.card.name + '" 的名片，请惠存'
    //   var path = '/super_card/pages/overt/overt?card_id=' + this.data.card_id + '&from_act=other'
    //   var imgUrl = ''

    //   console.log('分享路径path:', path)
    // }

    // return {
    //   title: title,
    //   path: path,
    //   imageUrl: imgUrl
    // }

  }

})