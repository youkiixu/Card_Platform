// super_card/pages/opt-version/opt-version.js
var app = getApp()
let animationShowHeight = 500;
Page({

    /**
     * 页面的初始数据
     */
    data: {

        uid: 0,
        wxInfo: {},
        uInfo: {},
        vipSet: [],

        vipName: '',
        choiceVipLevel: 1,
        timeYear: 1,
        price: 0.00,

        //radListLtngth:3,
        current: 0,
        time_array: [{
                time: 1,
                price: 0,
                checked: true
            },
            {
                time: 2,
                price: 0,
                checked: false
            },
            {
                time: 3,
                price: 0,
                checked: false
            },
            {
                time: 5,
                price: 0,
                checked: false
            },
        ],

        animationData: "",
        showModalStatus: false,

        btnDis: false,

        type: 1,
        alreadyOpen: false,

        showBackIndex: false,

        vipSetOnly: '',
        agent_id: '',
        qrcode_sign: '',
        qrType:'',
        vipSetagent:[
          { id: 1, rule_name: "成为服务商即可免费开通VIP会员身份；"},
          { id: 2, rule_name: "可获得15次（VIP会员）、1次（5人推广VIP）、1次（10人推广VIP）免费开通权。价值1966元；" },
          { id: 3, rule_name: "可获得原价98元（VIP会员），8元低价开通权；" },
          { id: 4, rule_name: "可获得原价198元（5人推广VIP），30元低价开通权；" },
          { id: 5, rule_name: "可获得原价298元（10人推广VIP），60元低价开通权；" },
          { id: 6, rule_name: "可获得原价680元个人代理，380元低价开通权；" },
          { id: 7, rule_name: "通过您或者您开通的vip用户分享加入的新用户线上购买产品，绑定关系赚收益；" },
          { id: 8, rule_name: "小程序商机推荐返佣，商机成功返佣800元/个。" }
        ],

      vipSetChannel: [
        { id: 1, rule_name: "成为渠道商即可免费开通VIP会员身份；" },
        { id: 2, rule_name: "可获得原价98元（VIP会员），5元低价开通权；" },
        { id: 3, rule_name: "可获得原价198元（5人推广VIP），20元低价开通权；" },
        { id: 4, rule_name: "可获得原价298元（10人推广VIP），40元低价开通权；" },
        { id: 5, rule_name: "可获得原价680元个人代理，280元低价开通权；" },
        { id: 6, rule_name: "可获得原价3800元渠道商，2300元低价开通权；" },
        { id: 7, rule_name: "通过您或者您开通的vip用户与服务商分享加入的新用户线上购买产品，绑定关系赚收益；" },
        { id: 8, rule_name: "下级服务商购买产品与推荐商机差价收益；" },
        { id: 9, rule_name: "小程序商机推荐返佣，商机成功返佣900元/个。" }
      ],
     
    },

    toProPage: function (e) {

        var t = e.target.dataset.t

        wx.navigateTo({
            url: '../square/protocol?t=' + t,
        })
    },

    //确认开通会员
    confirmPay: function (e) {

        var that = this
        var formId = e.detail.formId;
        that.setData({
            btnDis: true
        })
        if(that.data.agent_id && that.data.qrcode_sign) {
            app.util.request({
                'url': 'entry/wxapp/agentOpenCardVip',
                data: {
                    agent_id: that.data.agent_id,
                    qrcode_sign: that.data.qrcode_sign,
                    form_id: formId
                },
                success(res) {
                  console.log('open-membership-res', res)
                    wx.showToast({
                        title: '会员开通成功',
                        icon: 'success'
                    })
                    setTimeout(() => {
                        app.freshHome = true
                        wx.switchTab({
                            url: '../../pages/index/index',
                        })
                    }, 2000);
                },
                fail(err) {
                    wx.showModal({
                        title: '系统提示',
                      content: err.data.message,
                        showCancel: false,
                        confirmText: '知道了',
                        success: function () {
                            
                        }
                    })
                    
                },
                complete () {
                    that.setData({
                        btnDis: false
                    })
                }
            })
            
        } else {
            wx.showModal({
                title: '系统提示',
                content: "当前页面无效,请重新扫描",
                showCancel: false,
                confirmText: '知道了',
                success: function () {
                    
                }
            })
        }

    },

  //确认开通代理
  confirmPayAgent: function (e) {

    var that = this
    var formId = e.detail.formId;
    that.setData({
      btnDis: true
    })
    if (that.data.agent_id && that.data.qrcode_sign) {
      app.util.request({
        'url': 'entry/wxapp/agentOpenCardAgent',
        data: {
          agent_id: that.data.agent_id,
          qrcode_sign: that.data.qrcode_sign,
          form_id: formId
        },
        success(res) {
          wx.showToast({
            title: '代理开通成功',
            icon: 'success'
          })
          setTimeout(() => {
            app.freshHome = true
            wx.switchTab({
              url: '../../pages/index/index',
            })
          }, 2000);
        },
        fail(err) {
          wx.showModal({
            title: '系统提示',
            content: err.data.message,
            showCancel: false,
            confirmText: '知道了',
            success: function () {

            }
          })

        },
        complete() {
          that.setData({
            btnDis: false
          })
        }
      })

    } else {
      wx.showModal({
        title: '系统提示',
        content: "当前页面无效,请重新扫描",
        showCancel: false,
        confirmText: '知道了',
        success: function () {

        }
      })
    }

  },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      console.log('options', options)

      if (typeof options.scene !== 'undefined'){
        const scene = decodeURIComponent(options.scene)
        var param = scene.split('_') //split() 方法用于把一个字符串分割成字符串数组,此处是根据字符串中的"_"来分割
        this.setData({
          agent_id: param[0],
          qrcode_sign: param[1], 
          qrType: param[2]
        })
      }else{
        // options : {agent_id: '' , sign: ''}
        if (typeof options.agent_id != 'undefined') {
          this.setData({
            agent_id: options.agent_id,
            qrcode_sign: options.sign,
            qrType: options.qrType
          })
        }
      } 

      
        


        //console.log(app.UID)
        var that = this
        app.util.getUserInfo(function (res) {
            var wxInfo = res.wxInfo
                app.util.request({
                    'url': 'entry/wxapp/initOpenVip',
                    //'cachetime': '30',
                    success(res) {
                        app.config.init(function () {
                            that.setData({
                              app_name: app.config.getConf('app_name'),
                              poster: app.config.getConf('agent_introduct_pic'),
                              open_pic: app.config.getConf('agent_open_pic'),
                              agents: app.config.getConf('agent_grade')
                            })
                          })
                        //typeof cb == "function" && cb()
                        //console.log(res)
                        var uInfo = res.data.data.uInfo
                        console.log('uInfo', uInfo)

                        //因为还有服务商码和渠道码需要开通，跟vip等级无关
                        // if (uInfo.vip == 3) {
                        //     wx.showModal({
                        //         title: '系统提示',
                        //         content: '您当前会员等级已经为最高等级，无须再次开通',
                        //         showCancel: false,
                        //         confirmColor: that.data.themeColor,
                        //         confirmText: '朕知道了',
                        //         success: function () {
                        //             wx.navigateBack()
                        //         }
                        //     })
                        //     return
                        // }
    
                        var vipSet = res.data.data.vipSet
    
                        /*for(var x in vipSet){
                          console.log(vipSet[x])
                          //vipSet[x].value = x + 1
                          //vipSet[x].checked = x == 0 ? true : false
                        }*/
                        var price = parseFloat(vipSet[0].price)
                        var current = parseInt(uInfo.vip)
                        that.setData({
                            wxInfo: wxInfo,
                            uInfo: uInfo,
                            vipSet: vipSet,
                            price: price.toFixed(2),
                            current: current,
                            vipSetOnly: vipSet[0],
                            showBackIndex: true
                        })

                      
                        //app.freshHome = false
                    }
                });

        });
      

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


})