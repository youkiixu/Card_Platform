// super_card/pagess/cash/cash.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    min_withdrawal_money: app.config.getConf('min_withdrawal_money'),
    withdrawal_apply_rate: app.config.getConf('withdrawal_apply_rate'),
    withdrawal_apply_open: app.config.getConf('withdrawal_apply_open'), 
    withdrawal_method: app.config.getConf('withdrawal_method'),
    agent_balance: false,
    btnDis:false,
    withdrawal_qrcode: false,
    withdrawal_qrcode_name:false,
    // money: '',
    // actual_money:'', //实际到账金额

    //per_money: '', //个人输入金额
    money: '',//个人输入金额
    per_actual_money: '', //个人实际到账金额

    enter_money: '', //企业输入金额
    enter_actual_money: '', //企业实际到账金额



    is_v:0, //个人认证
    is_company: 0, //企业认证
    activeTitleId: 1,
    type:1,
    name:'',
    account:'',
    openingBank:'',
  },

  titleClick: function (e) {
    var id = e.target.dataset.id
    if ((this.data.is_v == 0 && id == 1) || (this.data.is_company == 0 && id == 2) ){
      wx.showModal({
        title: '系统提示',
        content: '您还没有进行认证，暂无提现权限',
        cancelText:'知道了',
        cancelColor:'#333',
        confirmColor: '#f90',
        confirmText: '去认证',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../certify-opt/certify-opt'
            })
          } else if (res.cancel) {
            return
          }
        }
      });
      return
    }else{
      this.setData({
        activeTitleId: id,
        type: id

      });
    }
    
  },

  //个人提现输入
  setPerMoney: function(e) {
    var money = e.detail.value
    money = parseFloat(money)
    var rate = parseFloat(this.data.withdrawal_apply_rate / 100)
    var per_actual_money = parseFloat(money - money * rate)
    per_actual_money = per_actual_money.toFixed(2)
    this.setData({
      money: e.detail.value,
      per_actual_money: per_actual_money
    })
  },

  //企业提现输入
  setEnterMoney: function (e) {
    var money = e.detail.value
    money = parseFloat(money)
    this.setData({
      enter_money: e.detail.value,
      enter_actual_money: money.toFixed(2)
    })
  },

 
  setbankCardName: function(e){
    this.setData({
      name: e.detail.value
     })
  },

  setbankCardAccount: function (e) {
    this.setData({
      account: e.detail.value
    })
  },

  setbankCardOpening: function (e) {
    this.setData({
      openingBank: e.detail.value
    })
  },
  

  choosePic: function(e) {

    var field = e.currentTarget.dataset.field
    var that = this
    wx.chooseMessageFile({
      count: 1, // 默认9
      type: 'file',
      success: function (res) {
        var src = res.tempFiles[0].path
        that.setData({ withdrawal_qrcode_name: res.tempFiles[0].name })
        

        wx.uploadFile({
          url: app.util.url('entry/wxapp/uploadTempPic'),
          filePath: src,
          name: 'file',
          header: {
            'content-type': 'multipart/form-data' // 默认值
          },
          success: function (res) {    
            res = JSON.parse(res.data)
            if (res.errno == 0) {
              that.setData({ withdrawal_qrcode: res.data.path })

            } else {
              wx.showToast({
                title: res.message,
                icon: 'none',
                duration: 2000
              })

            }


          }

        })


        // wx.compressImage({
        //   src: src, // 图片路径
        //   quality: 80, // 压缩质量
        //   complete: function () {

        //     wx.uploadFile({
        //       url: app.util.url('entry/wxapp/uploadTempPic'),
        //       filePath: src,
        //       name: 'pic',
        //       header: {
        //         'content-type': 'multipart/form-data' // 默认值
        //       },
        //       success: function (res) {

        //         console.log(res)
        //         res = JSON.parse(res.data)
        //         if (res.errno == 0) {

        //           that.setData({ withdrawal_qrcode: res.data.path })

        //         } else {

        //           wx.showToast({
        //             title: res.message,
        //             icon: 'none',
        //             duration: 2000
        //           })

        //         }


        //       }

        //     })



        //   }
        // })

      }
    })

  },


  // choosePic: function (e) {

  //   var field = e.currentTarget.dataset.field
  //   var that = this
  //   wx.chooseImage({
  //     count: 1, // 默认9
  //     sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
  //     sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
  //     success: function (res) {
  //       var src = res.tempFilePaths[0]
  //       wx.compressImage({
  //         src: src, // 图片路径
  //         quality: 80, // 压缩质量
  //         complete: function () {

  //           wx.uploadFile({
  //             url: app.util.url('entry/wxapp/uploadTempPic'),
  //             filePath: src,
  //             name: 'pic',
  //             header: {
  //               'content-type': 'multipart/form-data' // 默认值
  //             },
  //             success: function (res) {

  //               console.log(res)
  //               res = JSON.parse(res.data)
  //               if (res.errno == 0) {

  //                 that.setData({ withdrawal_qrcode: res.data.path })

  //               } else {

  //                 wx.showToast({
  //                   title: res.message,
  //                   icon: 'none',
  //                   duration: 2000
  //                 })

  //               }


  //             }

  //           })



  //         }
  //       })

  //     }
  //   })

  // },


  //个人提现提交
  toWithDrawalPer: function (e) {

    var formId = e.detail.formId

    var that = this

    if (!that.data.money) {
      wx.showToast({
        title: '请输入您要提现的金额',
        icon: 'none'
      })
      return
    }

    if (!that.data.agent_balance) {
      wx.showToast({
        title: '您的可提现余额为0',
        icon: 'none'
      })
      return
    }


    if (that.data.agent_balance < that.data.money) {
      wx.showToast({
        title: '您的提现金额大于当前可提现余额',
        icon: 'none'
      })
      return
    }

    if (that.data.money < parseFloat(that.data.min_withdrawal_money)) {
      wx.showToast({
        title: '您的提现金额小于最低可提现金额',
        icon: 'none'
      })
      return
    }

    if (that.data.withdrawal_method == 1 && !that.data.name) {
      wx.showToast({
        title: '请输入账号姓名',
        icon: 'none'
      })
      return
    }
    if (that.data.withdrawal_method == 1 && !that.data.account) {
      wx.showToast({
        title: '请输入银行卡号',
        icon: 'none'
      })
      return
    }
    if (that.data.withdrawal_method == 1 && !that.data.openingBank) {
      wx.showToast({
        title: '请输入开户银行',
        icon: 'none'
      })
      return
    }

    wx.showModal({
      title: '系统提示',
      content: '确认要进行提现吗？该操作无法撤消',
      showCancel: true,
      cancelColor: '#4752e8',
      confirmColor: '#4752e8',
      confirmText: '确定',
      success: function (res) {

        if (res.confirm) {

          that.setData({ btnDis: true })
          app.util.request({
            url: app.util.url('entry/wxapp/withdrawalAgentBalance'),
            data: {
              money: that.data.money,
              card_realname: that.data.name ? that.data.name : '',
              card_no: that.data.account ? that.data.account : '',
              card_name: that.data.openingBank ? that.data.openingBank : '',
              withdrawal_qrcode: '',
              type: that.data.type,
              formId: formId
            },
            success: function (res) {

              if (that.data.withdrawal_apply_open == 0 && that.data.withdrawal_method == 2) {
                var content = '提现成功，稍候系统自动会为您处理提现请求，请注意查看收款通知'
              } else {
                var content = '您的提现申请已提交成功，我们会在1-3个工作日内处理您的提现请求'
              }

              wx.showModal({
                title: '系统通知',
                content: content,
                showCancel: false,
                confirmColor: '#4752e8',
                confirmText: '朕知道了',
                success: function () {
                  wx.navigateBack()
                }
              })


            },
            complete: function () {
              that.setData({ btnDis: false })
            }

          })

        }

      }
    })

  },


  //企业提现提交
  toWithDrawalEnter: function(e) {

    var formId = e.detail.formId

    var that = this

    if (!that.data.enter_money) {
      wx.showToast({
        title: '请输入您要提现的金额',
        icon: 'none'
      })
      return
    }

    if (!that.data.agent_balance) {
      wx.showToast({
        title: '您的可提现余额为0',
        icon: 'none'
      })
      return
    }


    if (that.data.agent_balance < that.data.enter_money) {
      wx.showToast({
        title: '您的提现金额大于当前可提现余额',
        icon: 'none'
      })
      return
    }

    if (that.data.enter_money < parseFloat(that.data.min_withdrawal_money)) {
      wx.showToast({
        title: '您的提现金额小于最低可提现金额',
        icon: 'none'
      })
      return
    }

    // if (that.data.withdrawal_method == 1 && !that.data.withdrawal_qrcode) {
    //   wx.showToast({
    //     title: '请上传电子发票凭证',
    //     icon: 'none'
    //   })
    //   return
    // }

    if (that.data.withdrawal_method == 1 && !that.data.name) {
      wx.showToast({
        title: '请输入账户姓名',
        icon: 'none'
      })
      return
    }
    if (that.data.withdrawal_method == 1 && !that.data.account) {
      wx.showToast({
        title: '请输入银行卡号',
        icon: 'none'
      })
      return
    }
    if (that.data.withdrawal_method == 1 && !that.data.openingBank) {
      wx.showToast({
        title: '请输入开户银行',
        icon: 'none'
      })
      return
    }

    wx.showModal({
      title: '系统提示',
      content: '确认要进行提现吗？该操作无法撤消',
      showCancel: true,
      cancelColor: '#4752e8',
      confirmColor: '#4752e8',
      confirmText: '确定',
      success: function (res) {

        if (res.confirm) {

          that.setData({ btnDis: true })
          app.util.request({
            url: app.util.url('entry/wxapp/withdrawalAgentBalance'),
            data: {
              money: that.data.enter_money,
              card_realname: that.data.name ? that.data.name : '',
              card_no: that.data.account ? that.data.account : '',
              card_name: that.data.openingBank ? that.data.openingBank : '',
              type: that.data.type,
              withdrawal_qrcode: that.data.withdrawal_qrcode ? that.data.withdrawal_qrcode : '',
              formId: formId
            },
            success: function (res) {

              if (that.data.withdrawal_apply_open == 0 && that.data.withdrawal_method == 2) {
                var content = '提现成功，稍候系统自动会为您处理提现请求，请注意查看收款通知'
              } else {
                var content = '您的提现申请已提交成功，我们会在1-3个工作日内处理您的提现请求'
              }

              wx.showModal({
                title: '系统通知',
                content: content,
                showCancel: false,
                confirmColor: '#4752e8',
                confirmText: '朕知道了',
                success: function () {
                  wx.navigateBack()
                }
              })


            },
            complete: function () {
              that.setData({ btnDis: false })
            }

          })

        }

      }
    })

  },

  // setMoney: function (e){
  //   this.data.money = e.detail.value
  //   var money = e.detail.value
  //   money = parseFloat(money)
  //   var rate = parseFloat(this.data.withdrawal_apply_rate / 100) 
  //   var actual_money = parseFloat(money - money * rate)
  //   actual_money = actual_money.toFixed(2)
  //   this.setData({ 
  //     money: money,
  //     actual_money: actual_money
  //    })

  // },


  // toWithDrawal: function (e){
    
  //   var formId = e.detail.formId

  //   var that = this

  //   if (!that.data.money) {
  //     wx.showToast({
  //       title: '请输入您要提现的金额',
  //       icon: 'none'
  //     })
  //     return
  //   }

  //   if (!that.data.agent_balance){
  //     wx.showToast({
  //       title: '您的可提现余额为0',
  //       icon:'none'
  //     })
  //     return
  //   }


  //   if (that.data.agent_balance < that.data.money) {
  //     wx.showToast({
  //       title: '您的提现金额大于当前可提现余额',
  //       icon: 'none'
  //     })
  //     return
  //   }
    
  //   if (that.data.money < parseFloat(that.data.min_withdrawal_money)){
  //     wx.showToast({
  //       title: '您的提现金额小于最低可提现金额',
  //       icon: 'none'
  //     })
  //     return
  //   }

  //   if (that.data.withdrawal_method == 1 && !that.data.withdrawal_qrcode) {
  //     wx.showToast({
  //       title: '请上传您的微信收款吗，以便为您的提现转账',
  //       icon: 'none'
  //     })
  //     return
  //   }
    
  //   wx.showModal({
  //     title: '系统提示',
  //     content: '确认要进行提现吗？该操作无法撤消',
  //     showCancel: true,
  //     cancelColor: '#4752e8',
  //     confirmColor: '#4752e8',
  //     confirmText: '确定',
  //     success: function (res) {

  //       if (res.confirm) {

  //             that.setData({ btnDis: true })
  //             app.util.request({
  //               url: app.util.url('entry/wxapp/withdrawalAgentBalance'),
  //               data: {
  //                 money: that.data.money,
  //                 withdrawal_qrcode: that.data.withdrawal_qrcode ? that.data.withdrawal_qrcode : '',
  //                 formId: formId
  //               },
  //               success: function (res) {

  //                 if (that.data.withdrawal_apply_open == 0 && that.data.withdrawal_method == 2){
  //                   var content = '提现成功，稍候系统自动会为您处理提现请求，请注意查看收款通知'
  //                 }else{
  //                   var content = '您的提现申请已提交成功，我们会在1-3个工作日内处理您的提现请求'
  //                 }
                  
  //                 wx.showModal({
  //                     title: '系统通知',
  //                     content: content,
  //                     showCancel: false,
  //                     confirmColor: '#4752e8',
  //                     confirmText: '朕知道了',
  //                     success: function () {
  //                       wx.navigateBack()            
  //                     }
  //                 })
                  

  //               },
  //               complete: function (){
  //                 that.setData({ btnDis: false })
  //               }
            
  //             })

  //         }

  //     }
  //   })

  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; // 上一级页
    //console.log(prevPage.data)
    this.setData({
       agent_balance: prevPage.data.uInfo.agent_balance,
       is_v: prevPage.data.uInfo.is_v,
       is_company: prevPage.data.uInfo.is_company
      })

    if ((prevPage.data.uInfo.is_v == 1 && prevPage.data.uInfo.is_company == 1) || (prevPage.data.uInfo.is_v == 1 && prevPage.data.uInfo.is_company == 0)){
      this.setData({
        activeTitleId:1,
        type:1
      })
    } else{
      this.setData({
        activeTitleId: 2,
        type: 2
      })
    }

  },
  
  toProPage: function (e) {
    var t = e.target.dataset.t
    wx.navigateTo({
      url: '../agent/protocol?t=' + t,
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