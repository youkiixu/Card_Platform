// super_card/pagess/team/team.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password:'',
    defaultPWD: 'zzxx12345',
    
  },


  //提交信息
  accountApply: function (e) {

    var that = this
    var con = e.detail.value
    var data = ''

    if(that.data.phone == ''){
      //提交手机判断
      if (e.detail.value.phone.length == 0) {  // 或者 e.detail.value.phone == ''
        wx.showToast({
          title: '请输入手机号',
          icon: 'none',
          duration: 2000
        })
        return false
      }

      var myreg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
      if (!myreg.test(e.detail.value.phone)) {
        wx.showToast({
          title: '请输入正确的手机号码',
          icon: 'none',
          duration: 2000
        })
        return false
      }
      //密码判断
      if (e.detail.value.password.length == 0) {
        wx.showToast({
          title: '请输入密码',
          icon: 'none',
          duration: 2000
        })
        return false
      }
      data = {
        username: con.phone,
        password: con.password,
        formIds: e.detail.formId
      }
    }else{
      if (e.detail.value.phone != that.data.phone) { 
        wx.showToast({
          title: '账号不可更改',
          icon: 'none',
          duration: 2000
        })
        return false
      }

      if (e.detail.value.defaultPWD.length == 0) {
        wx.showToast({
          title: '请输入密码',
          icon: 'none',
          duration: 2000
        })
        return false
      }

      if (con.defaultPWD == 'zzxx12345') {
        data = { formIds: e.detail.formId }
      } else {
        data = {
          password: con.defaultPWD,
          formIds: e.detail.formId
        }
      }
    }

    app.util.request({
      'url': 'entry/wxapp/setAccount',
      'method': 'POST',
      'data': data,
      success(res) {
        wx.showToast({
          title: res.data.message,
          icon: 'success',
          duration: 2000
        })
        setTimeout(function () {
          wx.navigateBack()
        }, 2000)
      },
      fail: function (res) {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      },
    })

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    
    app.util.request({
      'url': 'entry/wxapp/getAccount',
      //'cachetime': '30',
      'method': 'POST',
      success(res) {
        var data = res.data.data  
        that.setData({
          phone: data.username    
        })
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