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
    showModalRecommend: false,
    animationDatasi: "",
    showImg: false,
    qrPic: '',
    hiddenMask: true,
    buyNumber: 1,
    buyNumMin: 1,
    price: 2.00,
    memberPrice: 0.00, //会员码价格
    fivePrice: 0.00, //5人营销码价格
    tenPrice: 0.00, //10人营销码价格
    agentPrice: 0.00,//代理码价格
    qrType: '',
    agent: '',
    codeCategory: [
      { id: 1, name: "会员码" },
      { id: 2, name: "5人营销码" },
      { id: 3, name: "10人营销码" },
    ],
    activeCategoryId: 1,
    itemChioce: 1,
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

  // 点击会员码分类标题切换
  codeTabClick: function (e) {
    var id = e.target.dataset.id
    this.setData({
      activeCategoryId: id,
      itemChioce: id
    });
  },


  //跳到推荐小程序商机页面
  toRecommend: function () {
    wx.navigateTo({
      url: '../company-login/company-login'
    })
  },


  //跳到生成会员码页面
  toSpreadPage: function (params) {
    var that = this
    var qrType = params.currentTarget.dataset.qrtype
    var uInfo = that.data.uInfo

    uInfo.agent_limit == uInfo.team_num ? wx.showModal({ title: '系统提示', content: '次数不足，请点击+号购买会员码', showCancel: false, confirmText: '知道了' }) : wx.navigateTo({ url: '../spread/spread?qrType= ' + qrType })
  },

  //跳到生成5人营销员码页面
  toFiveSpreadPage: function (params) {
    var that = this
    var qrType = params.currentTarget.dataset.qrtype
    var uInfo = that.data.uInfo

    uInfo.five_peo_limit == uInfo.five_team_num ? wx.showModal({ title: '系统提示', content: '次数不足，请点击+号购买会员码', showCancel: false, confirmText: '知道了' }) : wx.navigateTo({ url: '../spread/spread?qrType= ' + qrType })
  },

  //跳到生成10人营销员码页面
  toTenSpreadPage: function (params) {
    var that = this
    var qrType = params.currentTarget.dataset.qrtype
    var uInfo = that.data.uInfo

    uInfo.ten_peo_limit == uInfo.ten_team_num ? wx.showModal({ title: '系统提示', content: '次数不足，请点击+号购买会员码', showCancel: false, confirmText: '知道了' }) : wx.navigateTo({ url: '../spread/spread?qrType= ' + qrType })
  },

  //跳到生成代理码页面
  toSpreadPageAgent: function (params) {
    var that = this
    var qrType = params.currentTarget.dataset.qrtype
    var uInfo = that.data.uInfo

    uInfo.high_agent_limit == uInfo.high_team_num ? wx.showModal({ title: '系统提示', content: '次数不足，请点击+号购买代理码', showCancel: false, confirmText: '知道了' }) : wx.navigateTo({ url: '../spread/spread?qrType= ' + qrType })


  },

  //显示会员码购买弹框
  memberShowMask: function (e) {
    var qrType = e.target.dataset.type
    this.setData({
      hiddenMask: false,
      qrType: qrType
    })
  },


  //显示代理码购买弹框
  agentShowMask: function (e) {
    var qrType = e.target.dataset.type
    this.setData({
      hiddenMask: false,
      qrType: qrType
    })
  },


  //关闭购买弹框
  boxClose: function () {
    this.setData({
      hiddenMask: true
    })
  },

  numJianTap: function () {
    if (this.data.buyNumber > this.data.buyNumMin) {
      var currentNum = this.data.buyNumber;
      currentNum--;
      this.setData({
        buyNumber: currentNum
      })
    }
    this.totalPrice()
  },
  numJiaTap: function () {
    var currentNum = this.data.buyNumber;
    currentNum++;
    this.setData({
      buyNumber: currentNum
    })
    this.totalPrice()
  },

  //确认支付
  confirmPay: function (e) {
    var that = this

    //ios支付判断
    var iosPay = app.config.iosPay(that)
    if (iosPay === false) return


    if (that.data.buyNumber < 1) {
      wx.showModal({
        title: '提示',
        content: '购买次数不能为0！',
        showCancel: false
      })
      return;
    }
    var formId = e.detail.formId;

    app.util.request({
      'url': 'entry/wxapp/buyNums',
      data: {
        choiceAgentGrade: that.data.agent,
        qrType: that.data.qrType,
        nums: that.data.buyNumber,
        pay_method: 1,
        form_id: formId,
      },
      success(res) {
        if (res.data.message == 'ok') {
          wx.requestPayment({
            'timeStamp': res.data.data.timeStamp,
            'nonceStr': res.data.data.nonceStr,
            'package': res.data.data.package,
            'signType': 'MD5',
            'paySign': res.data.data.paySign,
            success(res) {
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                success: function (res) {
                  wx.redirectTo({
                    url: '../agent/agent',
                  })
                }
              })
            },
            fail(res) {
              wx.showModal({
                title: '系统提示',
                content: '支付失败',
                showCancel: false,
                confirmColor: '#f90',
                confirmText: '知道了'
              });
            }

          })
        }
      },
      fail(err) {
        wx.showModal({
          title: '系统提示',
          content: err.data.message,
          showCancel: false,
          confirmColor: '#f90',
          confirmText: '知道了'
        });
      }
    })


  },

  //购买总价格
  totalPrice: function () {
    var statu = this.data.agent  //statu == 1表示"个人代理"，statu==2表示"渠道代理"，statu==3表示"至尊合伙人"
    var itemChioce = this.data.itemChioce
    var number = this.data.buyNumber
    var personalMemberPrice = 6.0 * number //个人代理的会员码价格，个人代理没有代理码购买权限
    var channelMenberPrice = 3.0 * number //渠道代理的会员码价格
    var channelAgentPrice = 280.0 * number //渠道代理的代理码价格
    var superPartnerMenberPrice = 2.0 * number //至尊合伙人的会员码价格
    var superPartnerAgentPrice = 180.0 * number //至尊合伙人的代理码价格

    var perFiveMarketing = 30.0 * number //个人代理的5人营销码价格
    var channelFiveMarketing = 15.0 * number //渠道代理的5人营销码价格
    var superFiveMarketing = 5.0 * number //至尊合伙人的5人营销码价格

    var perTenMarketing = 60.0 * number //个人代理的10人营销码价格
    var channelTenMarketing = 30.0 * number //渠道代理的10人营销码价格
    var superTenMarketing = 10.0 * number //至尊合伙人的10人营销码价格



    // price = price.toFixed(2) //js浮点计算bug，取两位小数精度
    var memberPrice = statu > 1 ? (statu > 2 ? superPartnerMenberPrice : channelMenberPrice) : personalMemberPrice //会员码价格
    var fivePrice = statu > 1 ? (statu > 2 ? superFiveMarketing : channelFiveMarketing) : perFiveMarketing //5人营销码价格
    var tenPrice = statu > 1 ? (statu > 2 ? superTenMarketing : channelTenMarketing) : perTenMarketing //5人营销码价格

    // var memberPriceAll = itemChioce > 1 ? (itemChioce > 2 ? (statu > 1 ? (statu > 2 ? superTenMarketing : channelTenMarketing) : perTenMarketing) : (statu > 1 ? (statu > 2 ? superFiveMarketing : channelFiveMarketing) : perFiveMarketing)) : (statu > 1 ? (statu > 2 ? superPartnerMenberPrice : channelMenberPrice) : personalMemberPrice) //会员码与5人和10人营销码的价格判断

    var agentPrice = statu > 2 ? superPartnerAgentPrice : channelAgentPrice //代理码价格
    memberPrice = memberPrice.toFixed(2)
    fivePrice = fivePrice.toFixed(2)
    tenPrice = tenPrice.toFixed(2)
    agentPrice = agentPrice.toFixed(2)

    this.setData({
      memberPrice: memberPrice,
      fivePrice: fivePrice,
      tenPrice: tenPrice,
      agentPrice: agentPrice,
      agentGrade: statu
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

  saveQrpic: function () {
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

  openAgent: function () {
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

    //延时获取价格，否则容易出现价格不对应（有些方法执行的速度比你获取的速度慢 就会有这个情况  ,因为是同时进行，就是执行你前面那个方法的同时  也继续往下执行 ）
    setTimeout(() => {
      this.totalPrice()
    }, 1000)



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

  getAgentQrcode: function () {
    var that = this
    app.util.request({
      'url': 'entry/wxapp/getAgentQrcode',
      //'cachetime': '30',
      success(res) {
        that.setData({ qrPic: res.data.data }, that.showModal())

      }
    })

  },

  toCashPage: function () {

    wx.navigateTo({
      url: '../cash/cash'
    })
  },


  //刷新代言人中心
  freshAgent: function (cb) {

    var that = this
    that.totalPrice()

    app.util.getUserInfo(function (res) {



      var wxInfo = res.wxInfo

      app.util.request({
        'url': 'entry/wxapp/initAgentCenter',
        //'cachetime': '30',
        success(res) {

          typeof cb == "function" && cb()

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

          if (uInfo.agent_status == 0) {
            wx.showModal({
              title: '系统通知',
              content: '您的代理资格暂时被冻结，请联系客服人员咨询详细情况',
              showCancel: false,
              confirmColor: '#4752e8',
              confirmText: '朕知道啦',
              success: function () {
                wx.navigateBack()
              }
            })
            return
          }

          var agentGrade = app.config.getConf('agent_grade')
          var agent_name = agentGrade[parseInt(uInfo.agent) - 1].name
          var agent = uInfo.agent



          that.setData({ wxInfo: wxInfo, agent_name: agent_name, agent: agent, uInfo: uInfo, agentGrade: agentGrade })

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
    console.log('share', res)

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