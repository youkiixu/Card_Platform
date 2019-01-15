// super_card/pages/release/release.js
var app = getApp()

let animationShowHeight = 300;//动画偏移高度
var QQMapWX = require('../../resource/js/qqmap-wx-jssdk.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDialog: false,
    showDialogRight: false,
    labels: [],
    card_id: 0,

    card: false,
    userCards: [],
    cardPickerShow: { visible: false, animateCss: 'wux-animate--fade-out' },
    card_id_copy:0,

    types: [],

    type_id:0,
    typeKey: '',

    pics:[],

    content: '',

    postBtnDisabled: false,


    address: '',
    latitude: 0,
    longitude: 0,

    uInfo:false,

    showModalStatus: false,

    top_square_checked: true

  },

  topSwitch:function (e){
    //console.log(e)
    this.data.top_square_checked = e.detail.value
  },


  //选择地址信息
  getCurrentLocation: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({ address: res.address, latitude: res.latitude, longitude: res.longitude })
        return

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
        that.setData({ address: addressBean.ADDRESS, latitude: res.latitude, longitude: res.longitude })
        //console.log(addressBean);
      }
    })
  },

  //图片队列上传
  uploadimg: function (data) {

    var that = this,
      i = data.i ? data.i : 0,//当前上传的哪张图片
      success = data.success ? data.success : 0,//上传成功的个数
      fail = data.fail ? data.fail : 0;//上传失败的个数

    /*var formData = {
      card_id: that.data.card_id,
      album_id: that.data.album_id,
    }*/

    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'pic',//这里根据自己的实际情况改
      header: {
        'content-type': 'multipart/form-data' // 默认值
      },
      //formData: formData,//这里是上传图片时一起上传的数据
      success: (res) => {

        console.log(res)

        res = JSON.parse(res.data)

        if (res.errno) {

          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 3000
          })
          return

        } else {


          //var album_id = parseInt(res.data.album_id)

          //if (album_id > 0) that.setData({ album_id: album_id })

          //delete res.data.album_id
          console.log(res.data)
          that.data.pics.push(res.data.path)
          that.setData({ pics: that.data.pics })

        }

      },
      fail: (res) => {
        //图片上传失败，图片上传失败的变量+1
        fail++
        //console.log('fail:' + i + "fail:" + fail)
      },
      complete: () => {

        //console.log(i);
        i++;//这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) {   //当图片传完时，停止调用          

          //this.queryMultipleNodes()
          console.log('上传完毕');
          //console.log('成功：' + success + " 失败：" + fail);
          wx.showToast({
            title: '上传成功',
            icon: 'success',
          })
          /*app.freshIndex = true
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2]; // 上一级页
          prevPage.setData({ isFresh: true })*/

        } else {//若图片还没有传完，则继续调用函数
          //console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);

        }

      }
    });

  },

  removePic:function (e){
    var index = e.target.dataset.index
    this.data.pics.splice(index, 1)
    this.setData({ pics: this.data.pics })
  },


  setPostContent: function (e){
    this.data.content = e.detail.value
  },



  postSquareInfo: function (e){
  
    var card_id = this.data.card_id
    if(card_id < 1){
      wx.showToast({
        title: '请先选择名片',
        icon: 'none'
      })
      return false
    }

    var type_id = this.data.type_id
    if (type_id < 1) {
      wx.showToast({
        title: '请选择发布类型',
        icon: 'none'
      })
      return false
    }

    var pics = this.data.pics.join(',')
    var labels = ''
    for(var x in this.data.labels){
      if (this.data.labels[x].checked === true){
        labels += this.data.labels[x].label + ','
      }
    }
    var content = this.data.content
    if(content.length < 1){
      wx.showToast({
        title: '请输入发布内容',
        icon: 'none'
      })
      return false
    }
    if (content.length < 20) {
      wx.showToast({
        title: '内容字数不能少于20字',
        icon: 'none'
      })
      return false
    }
    //var content = encodeURIComponent(this.data.content)

    var address = this.data.address
    if (address.length < 1) {
      wx.showToast({
        title: '请选择位置',
        icon: 'none'
      })
      return false
    }

    var that = this

    that.setData({ postBtnDisabled: true })
    
    app.util.request({
      'url': 'entry/wxapp/postSquareInfo',
      'method': 'POST',
      'data': {
        card_id: card_id, type_id: type_id, pics: pics, labels: labels, content: content, address: address, latitude: that.data.latitude, longitude: that.data.longitude, form_id: e.detail.formId, topChecked: (that.data.top_square_checked ? 1 : 0)},
      success(res) {
        
        console.log(res)
        app.initSquarePage = true

        if (app.config.getConf('pay_square_top') == 1 && that.data.top_square_checked === true) {

          var data = res.data.data
          wx.showModal({
            title: '提交成功',
            content: (app.config.getConf('app_demand_open') == 1 ? '您发布的信息已提交审核，如需置顶请点击去支付' : '您的信息已成功发布，如需置顶请点击去支付'),
            showCancel: false,
            confirmText: '去支付',
            confirmColor: that.data.themeColorV,
            success: function (res) {
              
              wx.redirectTo({
                url: '../../pagess/payment/payment-squaretop?umoney=' + data.uInfo.money + '&sid=' + data.sid,
              })

            },
            fail: function () {
              wx.navigateBack()
            }
          })


        }else{

          wx.showModal({
            title: '提交成功',
            content: (app.config.getConf('app_demand_open') == 1 ? '您发布的信息已提交审核，请耐心等待...' : '您的信息已成功发布，请查看'),
            showCancel: false,
            confirmText: '我知道了',
            confirmColor: that.data.themeColorV,
            success: function (res) {
                wx.navigateBack()
            },
            fail: function (){
              wx.navigateBack()
            }
          })

        }

      }
    })

  },


  paySuareTop:function(){

  },

  /**
   * 上传相册图片
   */
  uploadPostPic: function () {

    var that = this


    var pics = []
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        //console.log(res)

        var imgsrc = res.tempFilePaths
        pics = pics.concat(imgsrc);
        that.uploadimg({
          url: app.util.url('entry/wxapp/uploadTempPic'),
          path: pics
        });

      }
    })
  },


  /**
   * 标签选中事件
   */
  checkChange: function (e) {
    var that = this
    
    /*for(var x in this.data.labels){
      this.data.labels[x].checked = false
    }
    this.setData({
      labels: this.data.labels
    })*/    
    var items = this.data.labels
    var checkArr = e.detail.value;
    for (var i = 0; i < items.length; i++) {
      if (checkArr.indexOf(items[i].id + "") != -1) {
        items[i].checked = true;
      } else {
        items[i].checked = false;
      }
    }
    this.setData({
      labels: items
    })
  },

  //判断是否在数组中
  inArray: function (val, arr) {
    // 遍历是否在数组中
    for (var i = 0, k = arr.length; i < k; i++) {
      if (val == arr[i]) {
        return i + 1;
      }
    }
    // 如果不在数组中就会返回false
    return false;
  },

  //选择名片处理
  cardChange: function (e) {

    this.setData({ card_id: e.detail.value })
  },

  //确认名片选择
  openCardSelect: function () {

    this.data.card_id_copy = this.data.card_id
    this.toggleCardPicker()

  },

  //确认名片选择
  confirmCardSelect: function () {

    if (this.data.card_id_copy !== this.data.card_id) {
      for (var x in this.data.userCards) {
        if (this.data.userCards[x].id == this.data.card_id)
          this.setData({ card: this.data.userCards[x] })
      }
    }
    this.toggleCardPicker()

  },

  //确认名片选择
  cancelCardSelect: function () {

    this.setData({ card_id: this.data.card_id_copy })
    this.toggleCardPicker()

  },


  //显示/隐藏名片选择器
  toggleCardPicker: function () {
    this.data.cardPickerShow = this.data.cardPickerShow.visible === true ? { visible: false, animateCss: 'wux-animate--fade-out' } : { visible: true, animateCss: 'wux-animate--fade-in' }
    this.setData({ cardPickerShow: this.data.cardPickerShow })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    var type_id = 0
    if (typeof options.type_id !== 'undefined' && options.type_id > 0) 
       type_id = options.type_id

    app.util.request({
      'url': 'entry/wxapp/initPostPage',
      'method': 'POST',
      'data': { type_id : type_id },
      success(res) {
        console.log(res)

        var data = res.data.data

        if(data.user_cards.length < 1){
          wx.showModal({
            title: '系统提示',
            content: '您还没有创建名片，只有创建名片后才可以发布哦',
            showCancel: false,
            confirmColor: that.data.themeColor,
            confirmText: '去创建',
            success: function (res) {
              wx.redirectTo({
                url: '../basic/basic',
              })
            }
          });
          return false
        }

        var labels = data.labels
        for(var x in labels){
          labels[x].checked = false
        }
        
        var user_cards = data.user_cards

        if(user_cards[0].no_perfect == 1){
          wx.showModal({
            title: '系统提示',
            content: '请先完善您的名片信息',
            showCancel: false,
            confirmColor: that.data.themeColor,
            confirmText: '去完善',
            success: function (res) {
              wx.redirectTo({
                url: '../basic/basic?card_id=' + user_cards[0].id,
              })
            }
          });
          return false
        }

        if(typeof options.card_id !== 'undefined' && options.card_id > 0){
          
          var card_id = options.card_id
          console.log(user_cards)
          for(var x in user_cards)
            if(user_cards[x].id == card_id)
              var card = user_cards[x]

        }else{
          var card_id = user_cards[0].id
          var card = user_cards[0]
        }
       
        that.setData({ labels: labels, types: data.types, userCards: user_cards, card: card, card_id: card_id, pay_square_top: app.config.getConf('pay_square_top') })

        if(type_id > 0){
          that.data.type_id = type_id

          for (var x in that.data.types)
            if (that.data.types[x].id == type_id) var typeKey = that.data.types[x].type
          
          that.setData({ typeKey: typeKey })
        }


      }
    })


    var qqmapsdk = new QQMapWX({
      key: app.config.getConf('tencent_map_key') // 必填
    });
    //1、获取当前位置坐标
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (addressRes) {
            console.log(addressRes)
            //var address = addressRes.result.formatted_addresses.recommend;
            var address = addressRes.result.address
            that.setData({
              address: address,
              latitude: latitude, 
              longitude: longitude
            })

          }
        })
      }
    })

  },


  getLabelsByType: function(){

    var that = this
    var type_id = that.data.type_id
    that.setData({ labels: [] })

    app.util.request({
      'url': 'entry/wxapp/getSquareLabel',
      'method': 'POST',
      'data': { type_id: type_id },
      success(res) {
        console.log(res)
        var labels = res.data.data
        if (labels.length > 0){

          for (var x in labels) labels[x].checked = false

          that.setData({ labels: labels })
          
        }
      }
    })

  },

  // 显示遮罩层  
  showModal: function () {
    //创建一个动画实例animation。调用实例的方法来描述动画。
    var animation = wx.createAnimation({
      duration: 500,         //动画持续时间500ms
      timingFunction: "ease",//动画以低速开始，然后加快，在结束前变慢
      delay: 0               //动画延迟时间0ms
    })
    this.animation = animation
    //调用动画操作方法后要调用 step() 来表示一组动画完成
    animation.translateY(animationShowHeight).step()//     在Y轴向上偏移300
    this.setData({
      //通过动画实例的export方法导出动画数据传递给组件的animation属性。
      animationData: animation.export(),
      showModalStatus: true //显示遮罩层
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
    }.bind(this), 300)

  },

  showTypesSelection: function (){
    var that = this
    that.showModal()

    // var temp = []
    // for(var x in that.data.types){
    //   temp.push(that.data.types[x].type)
    // }
    // //console.log(temp)
    // wx.showActionSheet({
    //   itemList: temp,
    //   success:function (res){
    //     var index = res.tapIndex;
    //     if(that.data.type_id != that.data.types[index].id){
    //       that.data.type_id= that.data.types[index].id
    //       that.setData({ typeKey: that.data.types[index].type })
    //       that.getLabelsByType()
    //     }
    //   }
    // })
  },

  goReleaseInfoInterface: function (e) {
    var that = this
    console.log(e)
    var type = e.target.dataset.type
    var type_id = e.target.dataset.typeid
    
    that.hideModal()
    // if (that.data.type_id != that.data.types[index].id) {
    //   that.data.type_id= that.data.types[index].id
    that.setData({ typeKey: type, type_id: type_id})
    that.getLabelsByType()
    // }
    
  },

  toProtocolPage: function (){
    console.log('here')
    wx.navigateTo({
      url: 'protocol',
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
    var that = this
    app.config.init(function () {
      app.config.set(that)
    })
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
  
  }
})