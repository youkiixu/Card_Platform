import { $wuxPickerCity } from '../../components/wux'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    card_id: 0,
    uid: 0,
    name : '',
    picture: '../../resource/icon/group.png',
    mobile_type:1,
    mobile: '',
    company: '',
    title: '',
    industry: [],
    province: '',
    city: '',
    dict: '',
    pcd_value: [0, 0, 0],
    address: '',
    latitude: 0,
    longitude: 0,
    smscode: '',
    
    
    pcd: '',
    industrySelect: '',
    industryList: '',
    temp:[],
    showVcodeInput: false,
    showWxPhoneBtn: true,
    mobileInputHolder: '手机号 请点击微信获取',
    mobileInputDisable: true,
    sendBtnDisabled: false,
    sendBtnText: '发送验证码',
    showMobileTypeArrow: true,

    errtips:''
  },

  //返回首页
  backIndex: function (e) {
    wx.switchTab({
      url: '../index/index',
    });
  },



  //设置用户输入的短信验证码
  setSmscode: function (e) {
    //console.log(e.detail.value)
    this.setData({ smscode: e.detail.value })
  },

  //设置用户手动输入的手机号
  setUserMobile: function (e){
      //console.log(e.detail.value)
      this.setData({mobile: e.detail.value})
  },

  //获取公司名称
  getCompanyName: function (){
    var that = this
    wx.chooseInvoiceTitle({
      success(res) {
        console.log(res)
        that.setData({ company: res.title })
      }
    })

  },

  //发送短信验证码倒计时
  sendCountDown : function (){


     var that = this
     var seconds = 60
     
     var countDownInterval = setInterval(function (){
      
      if(seconds > 0){

        that.setData({
          sendBtnDisabled : true,
          sendBtnText: seconds +'s后重发'
        })
        seconds--

      }else{

        that.setData({
          sendBtnDisabled: false,
          sendBtnText: '发送验证码'
        })
        clearInterval(countDownInterval)

      }

     },1000)


  },

  //发送手机短信验证码
  sendMobileVcode: function (e){


    var mobile = this.data.mobile
    
    var myreg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    if (!myreg.test(mobile)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
      this.setData({ mobile: '' })
      return false
    }

    var that = this
    app.util.request({
      url: 'entry/wxapp/SendSmsCode',
      data: {
        mobile: mobile
      },
      method: 'POST',
      cachetime: 0,
      success: function (res) {
        
        console.log(res)
        res = res.data
        wx.showToast({
          title: res.message,
          icon: 'success',
          duration: 2000
        })

        that.sendCountDown()

      },
      fail: function (res){
        console.log(res)

        var msg = ''
        if (res.data.message.errno) 
          msg = res.data.message.message 
        else
          msg = res.data.message

        wx.showToast({
          title: msg,
          icon: 'none',
          duration: 2000
        })
       
      }
    });
    //console.log(this.data.mobile)

  },


  //获取微信绑定的手机号
  getPhoneNumber: function (e) {
    var that = this
    //console.log(e.detail)
    if(e.detail.iv){
      
        app.util.request({
          url: 'entry/wxapp/EncryptMobile',
          data: {
            iv: e.detail.iv,
            encryptedData: e.detail.encryptedData
          },
          method: 'POST',
          cachetime: 0,
          success: function (res) {
            console.log(res)
            that.setData({ mobile: res.data.data.phoneNumber, showWxPhoneBtn:true})
          }
        });

    }
  },

  //显示手机绑定类型选项
  // showTelType() {
  //  var that = this
  //  var itemList = []
   
  //  if (app.config.getConf('sms_validate_switch') == 1) itemList.push('输入手机号')
  //  if (app.config.getConf('wx_mobile_switch') == 1) itemList.push('绑定微信手机号')
   
  //  wx.showActionSheet({
  //     itemList: itemList,
  //     success: function (res) {
  //       console.log(res)
  //       var index = res.tapIndex;
  //       if(itemList[index] == '绑定微信手机号'){
  //         that.setData({
  //           showVcodeInput: false, showWxPhoneBtn: true, mobile: '', mobileInputHolder: '请点击下方按钮',
  //           mobileInputDisable: true, mobile_type: 1
  //         })
  //       }else if (itemList[index] == '输入手机号'){
  //         that.setData({
  //           showVcodeInput: true, showWxPhoneBtn: false, mobile: '', mobileInputHolder: '请输入手机号',
  //           mobileInputDisable: false, mobile_type: 2
  //         })
  //       }
  //       /*switch(index){
  //         case 0:
  //           console.log('绑定微信手机号')
  //           that.setData({
  //             showVcodeInput: false, showWxPhoneBtn: true, mobile: '', mobileInputHolder: '请点击下方按钮',
  //             mobileInputDisable: true , mobile_type: 1})
  //         break;
  //         case 1:
  //           console.log('输入手机号')
  //           that.setData({
  //             showVcodeInput: true, showWxPhoneBtn: false, mobile: '', mobileInputHolder: '请输入手机号',
  //             mobileInputDisable: false, mobile_type: 2})
  //         break;
  //       }*/
  //     },
  //     fail: function (res) {
  //       console.log(res.errMsg)
  //     }
  //   });
  // },

  //切换行业类型选项状态
  toggleIndustryItem: function (e){

     var index = e.target.dataset.index
     
     var item = this.data.industryList[index]

     var choosenIndex = this.inArray(item.name, this.data.industry)
     if(choosenIndex === false){
       
       if (this.data.industry.length > 2) {
         wx.showToast({
           title: '亲，只能选三个哦',
           icon: 'none',
           duration: 2000
         })
         return false
       }
       this.data.industry.push(item.name)
     
     }else{

       this.data.industry.splice(choosenIndex - 1, 1)

     }
     //console.log(this.data.temp)

     this.data.industryList[index].seleted = item.seleted ? false : true;

     this.setData({ industryList: this.data.industryList})
    
  },

  //判断是否在数组中
  inArray: function(val, arr) {
    // 遍历是否在数组中
    for (var i = 0, k = arr.length; i < k; i++) {
      if (val == arr[i]) {
        return i + 1;
      }
    }
    // 如果不在数组中就会返回false
    return false;
  },

  //确认行业类型选择
  confirmIndustrySelect: function (){

    this.setData({ industry: this.data.industry })
    this.hideIndustrySelect()

  },

  //取消行业类型选择
  cancelIndustrySelect: function () {
    //console.log(this.data.temp)
    var x = 0
    for(x in this.data.industryList){
      if(this.inArray(this.data.industryList[x].name, this.data.temp) === false)
        this.data.industryList[x].seleted = false
      else
        this.data.industryList[x].seleted = true
    }

    this.setData({ industryList:this.data.industryList, industry: this.data.temp })
    this.hideIndustrySelect()

  },

  //隐藏行业类型选择
  hideIndustrySelect: function (){

    var temp =  {
        visible: false,
        animateCss: 'wux-animate--fade-out',
    }
    this.setData({industrySelect:temp})

    this.data.temp = []
  },

  //显示行业类型选择
  showIndustrySelect: function () {
    var x = 0
    for (x in this.data.industry) {
        this.data.temp.push(this.data.industry[x])
    }

    var temp = {
      visible: true,
      animateCss: 'wux-animate--fade-in',
    }
    this.setData({ industrySelect: temp })

  },

  //省市区三级联动
  showDictPicker: function (){

    var that = this
    $wuxPickerCity.init('city', {
      title: '请选择省市区',
      toolbarCancelText: '清空',
      value: that.data.pcd_value,
      onChange(p) {
        //console.log(p)
        //console.log('Change')
      },
      onCancel(p){
        console.log('Cancel')
        this.setData({
          pcd: '',
          pcd_value: [0, 0, 0]
        })
      },
      onDone(p) {
        console.log('p',p)
        var pcd = p.value.join('-')
        console.log('pcd', pcd)
        this.setData({
          pcd: pcd,
          pcd_value: p.valueIndex
        })
      }
    })

  },

  //报错提示
  errTips: function (){
      wx.showToast({
        title: '请输入'+this.data.errtips,
        icon: 'none',
        duration: 2000
      })
  },

  //保存名片信息
  saveCard: function (e){
    console.log('保存名片信息-e:',e)
   
    //提交内容判断
    if (!this.data.picture || this.data.picture == '../../resource/icon/group.png'){
      wx.showToast({
        title: '请上传名片头像',
        icon: 'none',
        duration: 2000
      })
      return false
    }

    //提交内容判断
    if (e.detail.value.name.length == 0) {
      this.setData({ errtips: '姓名' })
      this.errTips()
      return false
    }

    if(e.detail.value.name.length < 2) {
      wx.showToast({
        title: '姓名不能少于2个字',
        icon: 'none',
        duration: 2000
      })
      return false
    }


    //手机判断
    var mobile = this.data.mobile
    if(mobile.length == 0){
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
      this.setData({ mobile: '' })
      return false
    }

    var myreg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    if (!myreg.test(mobile)) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        duration: 2000
      })
      this.setData({ mobile: '' })
      return false
    }

    //提交内容判断
    if ( e.detail.value.company.length == 0) {
      this.setData({errtips:'公司名称'})
      this.errTips()
      return false
    }

    if (e.detail.value.company.length < 4) {
      wx.showToast({
        title: '公司名称不能少于4个字',
        icon: 'none',
        duration: 2000
      })
      return false
    }

    /*if (e.detail.value.title.length == 0) {
      this.setData({ errtips: '职务' })
      this.errTips()
      return false
    }*/

    if (e.detail.value.industry.length == 0) {
      this.setData({errtips:'行业'})
      this.errTips()
      return false
    } 
    if (e.detail.value.pcd.length == 0) {
      this.setData({errtips:'省市区'})
      this.errTips()
      return false
    } 
    // if (e.detail.value.address.length > 0 && e.detail.value.address.length < 5) {
    //   this.setData({ errtips: '详细地址不能少于5个字且可为空' })
    //   this.errTips()
    //   return false
    // } 
    

    var values = e.detail.value
    var pcdArr = values.pcd.split('-')


    var data = {
      card_id: this.data.card_id,
      name : values.name,
      picture: this.data.picture,
      mobile_type: this.data.mobile_type,
      mobile: values.mobile,
      company: values.company,
      title: values.title,
      industry: values.industry,
      province: pcdArr[0],
      city: pcdArr[1],
      dict: pcdArr[2],
      pcd_value: this.data.pcd_value.join(','),
      address: values.address,
      latitude: this.data.latitude,
      longitude: this.data.longitude,  
      smscode: values.smscode,
      form_id: (e.detail.formId != 'undefined' ? e.detail.formId : '')
    }

    
    var that = this
    app.util.request({
        'url': 'entry/wxapp/saveUserCard',
        'method': 'post',
        'data':data,
        'cachetime': 0,
        success(res) {
          console.log('保存名片信息成功：',res)

            app.freshIndex = true
            app.freshHome = true
            console.log(res)
            
            if(that.data.card_id){
              wx.showToast({
                title: res.data.message,
                icon: 'success',
                duration: 2000
              })

              app.freshHome = true
              
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2]; // 上一级页              
              if(typeof prevPage.data.isFresh !== 'undefined') prevPage.data.isFresh = true

              setTimeout(function () {

                wx.navigateBack()

                /*var cardLists = prevPage.data.cardLists
                for (var x in cardLists) {

                  if (cardLists[x].id == that.data.card_id)
                    cardLists[x] = res.data.data

                }
                //console.log(cardLists)
                prevPage.setData({
                  card_id: that.data.card_id,
                  cardLists: cardLists,
                });*/

              }, 2000);



            }else{


              if (app.config.getConf('card_examine_switch') == 1) {

                wx.showModal({
                  title: '提交成功',
                  content: '您创建的名片已提交审核，请耐心等待...',
                  showCancel: false,
                  confirmText: '我知道了',
                  confirmColor: that.data.themeColorV,
                  success: function (res) {
                    wx.navigateBack()
                  },
                  fail: function () {
                    wx.navigateBack()
                  }
                })

              }else{

                wx.showToast({
                  title: res.data.message,
                  icon: 'success',
                  duration: 2000
                })
                setTimeout(function () {
                  wx.reLaunch({
                    url: '../index/index?card_id=' + res.data.data.card_id
                  })
                  //wx.navigateBack()
                }, 2000);

              }


            }

        },fail:function(res){
          console.log('保存失败：',res)
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
    })

    //console.log(data)
  },

  //选择地址信息 ---原始代码
  // getCurrentLocation: function () {
  //   var that = this;
  //   wx.chooseLocation({
  //     success: function (res) {
  //       console.log('地图信息:',res)
  //       var regex = /^(北京市|天津市|重庆市|上海市|香港特别行政区|澳门特别行政区)/;
  //       var REGION_PROVINCE = [];
  //       var addressBean = {
  //         REGION_PROVINCE: null,
  //         REGION_COUNTRY: null,
  //         REGION_CITY: null,
  //         ADDRESS: null
  //       };
  //       function regexAddressBean(address, addressBean) {
  //         regex = /^(.*?[市州]|.*?地区|.*?特别行政区)(.*?[市区县])(.*?)$/g;
  //         var addxress = regex.exec(address);
  //         addressBean.REGION_CITY = addxress[1];
  //         addressBean.REGION_COUNTRY = addxress[2];
  //         addressBean.ADDRESS = addxress[3] + "(" + res.name + ")";
  //         //console.log(addxress);
  //       }
  //       if (!(REGION_PROVINCE = regex.exec(res.address))) {
  //         regex = /^(.*?(省|自治区))(.*?)$/;
  //         REGION_PROVINCE = regex.exec(res.address);
  //         addressBean.REGION_PROVINCE = REGION_PROVINCE[1];
  //         regexAddressBean(REGION_PROVINCE[3], addressBean);
  //       } else {
  //         addressBean.REGION_PROVINCE = REGION_PROVINCE[1];
  //         regexAddressBean(res.address, addressBean);
  //       }
  //       that.setData({ address: addressBean.ADDRESS, latitude: res.latitude, longitude: res.longitude })
  //       //console.log(addressBean);
  //       console.log('addressBean.REGION_PROVINCE', addressBean.REGION_PROVINCE)
        
  //     }
  //   })
  // },


  //选择地址信息  ---修改后代码
  getCurrentLocation: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log('选择地址信息', res)
        // if (res.address)
        //  var address = res.address + '(' + res.name + ')'
        that.setData({ address: res.address,  latitude: res.latitude, longitude: res.longitude })
        console.log('address:', that.data.address)
      }
    })
  },


 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if(app.config.getConf('wx_mobile_switch') == 1)
      app.util.getUserInfo(function (res) {
        that.initPage(options)
      })    
    else
      that.initPage(options)
  },

  initPage: function (options){
    var that = this
    
    if(app.config.getConf('sms_validate_switch') == 0 && app.config.getConf('wx_mobile_switch') == 0)
      that.setData({ showMobileTypeArrow: false, showVcodeInput: false, showWxPhoneBtn: false, mobile: '', mobileInputHolder: '请输入手机号', mobileInputDisable: false, mobile_type: 1 })

    if (options.card_id > 0) {
      wx.setNavigationBarTitle({ title: '编辑我的名片' })
      that.setData({
        card_id: options.card_id,
      });

      app.util.request({
        'url': 'entry/wxapp/getCardBinfo',
        //'cachetime': '30',
        'method': 'POST',
        'data': { 'card_id': that.data.card_id },
        success(res) {
          console.log('加载名片信息：',res)
          console.log(res)
          var card = res.data.data
          var industry = card.industry.split(',')
          var industryList = card.industryLists

          var x = 0
          for (x in industryList) {
            if (that.inArray(industryList[x].name, industry) === false)
              industryList[x].seleted = false
            else
              industryList[x].seleted = true
          }
          if (industry[0] == '') {
            industry = []
          }

          that.setData({
            uid: card.uid,
            name: card.name,
            picture: card.picture,
            mobile_type: card.mobile_type,
            mobile: card.mobile,
            company: card.company,
            title: card.title,
            industry: industry,
            province: card.province,
            city: card.city,
            dict: card.dict,
            pcd_value: card.pcd_value.split(','),
            pcd: card.province + '-' + card.city + '-' + card.dict,
            address: card.address,
            latitude: card.latitude,
            longitude: card.longitude,  
            industryList: industryList
          })
         
        }

      })

    } else {


      app.util.request({
        'url': 'entry/wxapp/industryLists',
        'cachetime': '30',
        success(res) {
          var list = res.data.data;
          var len = list.length
          for (var i = 0; i < len; i++) {
            list[i].seleted = false
          }
          that.setData({ industryList: list })
        }
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
  
})