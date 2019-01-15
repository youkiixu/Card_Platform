// super_card/pages/opt-version/opt-version.js
var app = getApp()
let animationShowHeight = 500;
Page({

  /**
   * 页面的初始数据
   */
  data: {

    uid: 0,
    wxInfo:{},
    uInfo: {},
    vipSet:[],

    vipName: '',
    choiceVipLevel: 1,
    timeYear: 1,
    price: 0.00,

    //radListLtngth:3,
    current:0,
    time_array: [
      { time: 1, price: 0, checked: true},
      { time: 2, price: 0,  checked: false },
      { time: 3, price: 0,  checked: false },
      { time: 5, price: 0,  checked: false },
    ],

    animationData: "",
    showModalStatus: false,

    btnDis: false,

    type: 1,
    alreadyOpen: false
  },

  toProPage: function (e){

    var t = e.target.dataset.t
    wx.navigateTo({
      url: '../square/protocol?t=' + t,
    })
  },

  //确认支付
  confirmPay: function (e) {
    
    var that = this
    var iosPay = app.config.iosPay(that)
    if (iosPay === false) return

    if(app.config.getConf('member_open_balance') == 1){

      wx.redirectTo({
        url: '../../pagess/payment/payment-vip?umoney=' + that.data.uInfo.money + '&timeYear=' + that.data.timeYear + '&choiceVipLevel=' + that.data.choiceVipLevel + '&price=' + that.data.price,
      })
    
    }else{

    var formId = e.detail.formId;
    that.setData({ btnDis: true })
    app.util.request({
      'url': 'entry/wxapp/openCardVip',
      data: {
        choiceVipLevel: that.data.choiceVipLevel,
        price: that.data.price,
        timeYear: that.data.timeYear,
        form_id: formId
      },
      success(res) {

           
          if (res.data.message == 'ok')

            wx.requestPayment({
              'timeStamp': res.data.data.timeStamp,
              'nonceStr': res.data.data.nonceStr,
              'package': res.data.data.package,
              'signType': 'MD5',
              'paySign': res.data.data.paySign,
              'success': function (res) {
                console.log('succ:');
                console.log(res);

                that.successPayAfter()
                //支付成功后，系统将会调用payResult() 方法，此处不做支付成功验证，只负责提示用户
              },
              'fail': function (res) {
                console.log('fail:');
                console.log(res);
                that.failPayAfter('支付失败')
                //支付失败后，
              }
            })

          else
            that.failPayAfter('')


      },
      fail(err) {
        console.log('errNO:');
        console.log(err);
        that.failPayAfter(err.data.message)
      }
    })
    
    }

  },


  successPayAfter: function () {
    
    wx.showToast({
      title: '支付成功',
      icon: 'success'
    })

    var that = this
    setTimeout(function () {

      app.freshHome = true
      wx.reLaunch({
        url: '../home/home',
      })

    }, 2000)

  },

  failPayAfter: function (msg) {

    this.setData({ btnDis: false })
  
    wx.showModal({
      title: '系统提示',
      content: msg,
      showCancel: false,
      confirmColor: '#f90',
      confirmText: '朕知道了',
      success: function (res) {
      }
    });

  },


  chooseTime:function (){

     var cur_price = this.data.vipSet[this.data.choiceVipLevel - 1].price
     for(var x in this.data.time_array){
       var temp = this.data.time_array[x].time * cur_price
       this.data.time_array[x].price = temp.toFixed(2)
     }
         
    this.setData({ time_array: this.data.time_array }, this.showModal())

  },


  // 显示遮罩层  
  showModal: function () {
    var animation = wx.createAnimation({
      duration: 500,        
      timingFunction: "ease",
      delay: 0               
    })
    this.animation = animation
    animation.translateY(animationShowHeight).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true 
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 1)

  },

  // 隐藏遮罩层  
  hideModal: function () {

    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
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
        showModalStatus: false
      })
    }.bind(this), 200)

  },

  confirmTimeChoice: function(){
    console.log(this.data.type)
    
    for(var x in this.data.time_array){
      if (this.data.time_array[x].time == this.data.type){
        var obj = this.data.time_array[x]
        break
      }
    }
    console.log(obj)
    this.setData({ price: parseFloat(obj.price).toFixed(2), timeYear: obj.time }, this.hideModal())

  },

  cancelTimeChoice: function (){
    this.data.type = 1
    for (var x in this.data.time_array)
      this.data.time_array[x].checked = x == 0 ? true : false

    this.setData({ time_array: this.data.time_array }, this.hideModal())
  },

  //购买时间选择
  timeChange: function (res) {
    //console.log('here')
    var arrs = this.data.time_array;
    var that = this;
    for (const x in arrs) {
      if (arrs[x].time == res.detail.value) {
        arrs[x].checked = true;
        that.data.type = res.detail.value
      } else {
        arrs[x].checked = false;
      }
    }
    that.setData({
      time_array: arrs
    })
  },

  //滑动选择
  choiceSwiper: function (event){

    //console.log(event.detail.current)
    var cIndex = event.detail.current
    
    if(this.data.uInfo.vip > 0 && cIndex <= (this.data.uInfo.vip - 1)){
      this.setData({ btnDis: true, alreadyOpen: true })
      return
    }
     
    var price = parseFloat(this.data.vipSet[cIndex].price)

    this.data.type = 1
    for(var x in this.data.time_array)
      this.data.time_array[x].checked = x == 0 ? true : false

    this.setData({ btnDis: false, alreadyOpen:false, current: cIndex, choiceVipLevel: cIndex + 1, price: price.toFixed(2), timeYear: 1, time_array: this.data.time_array })



  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //console.log(app.UID)
    var that = this
    app.util.getUserInfo(function (res) {

      console.log(res)
      var wxInfo = res.wxInfo
      app.util.request({
        'url': 'entry/wxapp/initOpenVip',
        //'cachetime': '30',
        success(res) {

          //typeof cb == "function" && cb()
          //console.log(res)
          var uInfo = res.data.data.uInfo
          if (uInfo.vip == 3){
            wx.showModal({
              title: '系统提示',
              content: '您当前会员等级已经为最高等级，无须再次开通',
              showCancel: false,
              confirmColor: that.data.themeColor,
              confirmText: '朕知道了',
              success: function () {
                wx.navigateBack()
              }
            })
            return
          }

          var vipSet = res.data.data.vipSet
          
          /*for(var x in vipSet){
            console.log(vipSet[x])
            //vipSet[x].value = x + 1
            //vipSet[x].checked = x == 0 ? true : false
          }*/

          var price = parseFloat(vipSet[0].price)
          var current = parseInt(uInfo.vip)
          that.setData({ wxInfo: wxInfo, uInfo: uInfo, vipSet: vipSet, price: price.toFixed(2), current: current })
          
          //app.freshHome = false
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