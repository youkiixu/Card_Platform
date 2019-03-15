// super_card/pages/company-login/company-login.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    errtips:'',
    total:0,
    customer_tel:'',
    address: '',
    latitude:'',
    longitude:'',
    province:'',
    city:'',
    area:'',

  },

  //跳到推荐记录页面
  toRecommendRecord: function () {
    wx.navigateTo({
      url: '../recommend-record/recommend-record'
    })
  },  

  //选择地址信息
  getCurrentLocation: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        var regex = /^(北京市|天津市|重庆市|上海市|香港特别行政区|澳门特别行政区)/;
        var REGION_PROVINCE = [];
        var addressBean = {
          REGION_PROVINCE: null,
          REGION_COUNTRY: null,
          REGION_CITY: null,
          ADDRESS: null
        };
        function regexAddressBean(address, addressBean) {
          regex = /^(.*?[市州]|.*?地区|.*?特别行政区)(.*?[市区县])(.*?)$/g;
          var addxress = regex.exec(address);
          addressBean.REGION_CITY = addxress[1];
          addressBean.REGION_COUNTRY = addxress[2];
          addressBean.ADDRESS = addxress[3] + "(" + res.name + ")";
          //console.log(addxress);
        }
        if (!(REGION_PROVINCE = regex.exec(res.address))) {
          regex = /^(.*?(省|自治区))(.*?)$/;
          REGION_PROVINCE = regex.exec(res.address);
          addressBean.REGION_PROVINCE = REGION_PROVINCE[1];
          regexAddressBean(REGION_PROVINCE[3], addressBean);
        } else {
          addressBean.REGION_PROVINCE = REGION_PROVINCE[1];
          regexAddressBean(res.address, addressBean);
        }
        that.setData({ address: res.address, latitude: res.latitude, longitude: res.longitude, city: addressBean.REGION_CITY, province: addressBean.REGION_PROVINCE, area: addressBean.REGION_COUNTRY})
        //  console.log(addressBean);
      }
    })
  },

  //拨打客服热线
  callMobile: function (e) {

    var mobile = this.data.customer_tel

    wx.makePhoneCall({
      phoneNumber: mobile
    })

  },

  //报错提示
  errTips: function () {
    wx.showToast({
      title: '请输入' + this.data.errtips,
      icon: 'none',
      duration: 2000
    })
  },

  //提交信息
  companyApply:function(e){
    
    //提交姓名判断
    if (e.detail.value.name.length == 0) {
      this.setData({ errtips: '姓名' })
      this.errTips()
      return false
    }

    if (e.detail.value.name.length < 2) {
      wx.showToast({
        title: '姓名不能少于2个字',
        icon: 'none',
        duration: 2000
      })
      return false
    }

    //提交手机判断
    if (e.detail.value.phone.length == 0) {
      this.setData({ errtips: '手机号码' })
      this.errTips()
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


    var that = this
    var con = e.detail.value
    var data = {
      address: that.data.address,
      latitude: that.data.latitude,
      longitude: that.data.longitude,
      province: that.data.province,
      city: that.data.city,
      area: that.data.area,
      name:con.name,
      phone: con.phone,
      industry: con.industry,
    }

    app.util.request({
      'url': 'entry/wxapp/saveCompanyLogin',
      'method': 'POST',
      'data': data,
      success(res) {
        console.log('提交成功',res)
        wx.showToast({
          title: '提交成功,'+res.data.message,
          icon: 'none',
          duration: 2000
        })
      },
      fail:function(res){
        console.log('提交失败', res)
      },
    })


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    this.setData({
      customer_tel: app.config.getConf('customer_tel')
    })
    app.util.request({
      'url': 'entry/wxapp/getCompanySum',
      'method': 'POST',
      success(res) {
        console.log(res)
        that.setData({
          total: res.data
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