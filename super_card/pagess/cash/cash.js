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
    withdrawal_qrcode: false
  },

  setMoney: function (e){
    this.data.money = e.detail.value
  },

  choosePic: function (e) {

    var field = e.currentTarget.dataset.field
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var src = res.tempFilePaths[0]
        wx.compressImage({
          src: src, // 图片路径
          quality: 80, // 压缩质量
          complete: function () {

            wx.uploadFile({
              url: app.util.url('entry/wxapp/uploadTempPic'),
              filePath: src,
              name: 'pic',
              header: {
                'content-type': 'multipart/form-data' // 默认值
              },
              success: function (res) {

                console.log(res)
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



          }
        })

      }
    })

  },

  toWithDrawal: function (e){
    
    var formId = e.detail.formId

    var that = this

    if (!that.data.money) {
      wx.showToast({
        title: '请输入您要提现的金额',
        icon: 'none'
      })
      return
    }

    if (!that.data.agent_balance){
      wx.showToast({
        title: '您的可提现余额为0',
        icon:'none'
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
    
    if (that.data.money < parseFloat(that.data.min_withdrawal_money)){
      wx.showToast({
        title: '您的提现金额小于最低可提现金额',
        icon: 'none'
      })
      return
    }

    if (that.data.withdrawal_method == 1 && !that.data.withdrawal_qrcode) {
      wx.showToast({
        title: '请上传您的微信收款吗，以便为您的提现转账',
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
                  withdrawal_qrcode: that.data.withdrawal_qrcode ? that.data.withdrawal_qrcode : '',
                  formId: formId
                },
                success: function (res) {

                  if (that.data.withdrawal_apply_open == 0 && that.data.withdrawal_method == 2){
                    var content = '提现成功，稍候系统自动会为您处理提现请求，请注意查看收款通知'
                  }else{
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
                complete: function (){
                  that.setData({ btnDis: false })
                }
            
              })

          }

      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; // 上一级页
    //console.log(prevPage.data)
    this.setData({ agent_balance: prevPage.data.uInfo.agent_balance })
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