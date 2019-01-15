
// super_card/pages/more-info/more-info.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      card_id : 0,
      minfo:'',
      errtips:''
  },

  //报错提示
  errTips: function (){
      wx.showToast({
        title: '请输入正确的'+this.data.errtips,
        icon: 'none',
        duration: 2000
      })
  },

  //保存名片的更多信息
  saveCardMinfo: function (e){

    //邮箱判断
    if(e.detail.value.email.length != 0){
      var email = e.detail.value.email
      var myreg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!myreg.test(email)) {
        this.setData({errtips:'邮箱账号'})
        this.errTips()
        return false
      }
    }

    //手机判断
    if(e.detail.value.tel.length != 0){
      var mobile = e.detail.value.tel
      var myreg = /\d+/;
      if (!myreg.test(mobile)) {
        this.setData({errtips:'电话号码'})
        this.errTips()
        return false
      }
    }

    //网址判断
    if(e.detail.value.www.length != 0){
      console.log(e.detail.value.www)
      var www = e.detail.value.www
      var myreg = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*$/;
      if (!myreg.test(www)) {
        this.setData({errtips:'网址'})
        this.errTips()
        return false
      }
    }
    console.log(e)
    e.detail.value.intro_content = encodeURIComponent(e.detail.value.intro_content)
    var data = e.detail.value
    //验证数据Start
    var that = this
    data.card_id = that.data.card_id
    app.util.request({
      'url': 'entry/wxapp/saveCardMinfo',
      'method': 'POST',
      'data': data,
      success(res) {
        app.freshIndex = true
        console.log(res)
        
        wx.showToast({
          title: res.data.message,
          icon: 'success',
          duration: 2000
        })

        setTimeout(function () {
          wx.navigateBack()

          /*var pages = getCurrentPages();
          //var currPage = pages[pages.length - 1]; // 当前页面
          var prevPage = pages[pages.length - 2]; // 上一级页面

          var cardLists = prevPage.data.cardLists

          for(var x in cardLists){
            if(cardLists[x].id == that.data.card_id)
              cardLists[x] = res.data.data
          }
          //console.log(cardLists)
          prevPage.setData({
            card_id: that.data.card_id,
            cardLists: cardLists,
          });*/


        }, 2000);
        
        /*that.setData({
          minfo: res.data.data
        })*/

      }

    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    console.log(options)

    if (options.card_id > 0) {

      that.setData({
        card_id: options.card_id,
      });

      app.util.request({
        'url': 'entry/wxapp/getCardMinfo',
        'method': 'POST',
        'data': { 'card_id': that.data.card_id },
        success(res) {
          console.log(res)

          that.setData({
            minfo: res.data.data
          })

        }

      })

    }else{

      wx.navigateBack({
        delta: 1,
      })

    }

    

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

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // }
})