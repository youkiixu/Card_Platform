var app = getApp()
// var windowHeight = wx.getSystemInfoSync().windowHeight
// console.log(windowHeight)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect_list: [],
    search_key: '',
    show_search: false,
    search_list: [],
    sort: '',
    sort_mode: '',
    page: 1,
    collect_page: 0,
    show_goTop: false,

    app_name: '',

    comebacks:[],

    identify_card_switch:0,
    lastPage: false,

    showCreateCardBtn: false,

    animationData:{},
    isShowHide:true,
    
    // scrollTop: 0,
    // hideScrollTop: 0,
    // hideInterVal : '',
  },

  
  
  // 滑动显示
  // slideEventShowHide:function(){
  //   var that = this
  //   //隐藏时执行
  //   if (that.data.isShowHide === true) {

  //     var animation = wx.createAnimation({
  //       duration: 1000,
  //       timingFunction: 'ease',
  //       delay: 0,
  //     })
  //     that.animation = animation
  //     that.animation.right(-110 + 'rpx').step()
  //     that.setData({
  //       animationData: animation.export(),
  //       isShowHide: false
  //     })
      
  //     that.data.hideScrollTop = that.data.scrollTop

  //     that.data.hideInterVal = setInterval(function () {
  //       console.log(that.data.hideScrollTop)
  //       console.log(that.data.scrollTop)
  //       if (that.data.scrollTop < that.data.hideScrollTop && that.data.hideScrollTop < (that.data.scrollTop + windowHeight)){
  //         that.slideEventHide()
  //         clearInterval(that.data.hideInterVal)
  //       }
        
  //     }, 3000)

  //   }
  // },

  // saveStop:function(){
  //   console.log('4')
  //   clearTimeout(t)
  // },

  // startMmove:function(){
  //   var that=this 
                                                                                                                         
    // var t = setTimeout(function () {
    //   console.log('111')
    //   that.slideEventHide()
    //   that.setData({ isnumber: 2})
    // }, 10000)
    // if (that.data.isnumber == 2 ){
    //   console.log('000')
    //   clearTimeout(t)
    //   setTimeout(function () {
    //     that.slideEventHide()
    //   }, 10000)
    //   that.setData({ isnumber: 1 })
    // }
    // console.log('2')

  //   setTimeout(function () {
  //     console.log('111')
  //     that.slideEventHide()
  //     // that.setData({ isnumber: 2})
  //   }, 10000)
  // },
  

  //隐藏拍名片按钮
  // slideEventHide: function(){
  //   var animation = wx.createAnimation({
  //     duration:1000,
  //     timingFunction: 'ease',
  //     delay:0,
  //   })
  //   console.log('3')
  //   this.animation = animation
  //   this.animation.right(50+'rpx').step()
  //   this.setData({
  //     animationData:animation.export(),
  //     isShowHide: true
  //   })

  //   this.data.hideScrollTop = this.data.scrollTop
  // },

  //获取回传的名片
  getUserComeback: function (){
    var that = this
    var comebacks = wx.getStorageSync('comebacks')
    //if (comebacks.length < 1) wx.hideTabBarRedDot({ index: 1 })
    that.setData({ comebacks: comebacks })
    //console.log(that.data.comebacks)
  },
  
  //显示拍名片选项
  showTakeCard:function (e){

    var that = this;
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }
    
    //ios系统判断是否可用
    var iosPay = app.config.iosPay(that)

    //判断是否为会员，非会员不能拍名片
    var getUserInfo = wx.getStorageSync('getUserInfo');
    var isVip = getUserInfo.vip;
    if (isVip == 0) {
      wx.showModal({
        title: '系统提示',
        content: iosPay ? '您还不是会员，请先开通会员' : '不可服务',
        cancelText: '返回',
        confirmColor: '#f90',
        confirmText: iosPay ? '去开通' : '知道了',
        success: function (res) {
          if (res.confirm) {
            iosPay ? wx.navigateTo({ url: '../opt-version/opt-version' }) : wx.navigateBack()
          } else if (res.cancel) {
            wx.navigateBack()
          }          
        }
      });
      return
    } else {
        // if (typeof e.detail.formId != 'undefined') {
        //   console.log(e.detail.formId)
        //   app.formIds.push(e.detail.formId)
        // }
        /*var that = this
        wx.showActionSheet({
            itemList: ['拍照', '从手机相册选择'],
            success: function (res) {
              console.log(res)
              var index = res.tapIndex
              switch(index){
                case 0:*/
              wx.navigateTo({
                url: '../pat-card/camera-card',
              })
                /*break;
              case 1:
                that.identifyCard()
                break;
            }
          }
      })*/
    }  
  },

  //点击回传名片处理
  toViewComeback: function (e) {
    //console.log(e)
    var that = this
    var card_id = e.currentTarget.dataset.card_id;
 
    if(card_id < 1) return 

    //console.log('form发生了submit事件，推送码为：', formId)
    app.util.request({
      'url': 'entry/wxapp/updateComeBack',
      'method': 'POST',
      'data': { 'card_id': card_id},
      success(res) {

        wx.navigateTo({
          url: '../overt/overt?card_id=' + card_id,
        })
        //console.log(that.data.comebacks)

        for(var x in that.data.comebacks)
          if (that.data.comebacks[x].card_id == card_id) that.data.comebacks.splice(x, 1)
        
        //console.log(that.data.comebacks)

        //if (that.data.comebacks.length < 1) wx.hideTabBarRedDot({ index: 1 })

        wx.setStorageSync('comebacks', that.data.comebacks)
        that.setData({ comebacks: that.data.comebacks })

        /*wx.showModal({
          title: 'test',
          content: res.data,
        })*/

      }
    })

  },


  // 一键回到顶部
  goTop: function (e) {
    if (wx.pageScrollTo) {
      this.setData({ show_goTop: false })
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    } else {
      wx.showToast({
        title: '暂不支持',
      })
    }
  },

  //监听页面滚动
  onPageScroll: function (e) {

    // this.data.scrollTop = e.scrollTop
    // Do something when page scroll
    if(this.data.show_goTop === false && e.scrollTop >= 200) this.setData({ show_goTop: true })

    if(this.data.show_goTop === true && e.scrollTop < 200) this.setData({ show_goTop: false })

    // this.slideEventShowHide()
  },

  //设置搜索关键字开始搜索
  setSearchKey: function (e){

    //console.log(e)
    var key = e.detail.value
    //this.data.collect_page = this.data.page
    this.setData({ search_key: key })
    this.data.lastPage = false
    this.data.page = 1
    this.getCollectList()

  },

  //切换搜索状态
  toggleSearchInput: function (e){
    var that = this

    if(this.data.show_search){

      that.setData({ show_search: false, search_key: '', search_list: [] })
      this.data.page = Math.ceil(that.data.collect_list.length / 10)
      this.data.lastPage = false

    }else{

      that.setData({ show_search: true })
      
    }
    
  },

  //设置排序条件
  setSort: function (e){
    //console.log(e)
    var sort = e.target.dataset.name
    var sort_mode = this.data.sort_mode == 'desc' ? 'asc' : 'desc'
    //console.log(sort, sort_mode)
    this.setData({ sort: sort, sort_mode: sort_mode })
    this.getCollectList()
  },

  //识别纸质名片
  identifyCard: function (){

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        
        wx.showLoading({
          title: '正在识别中...',
        })

        //console.log(res)
        var src = res.tempFilePaths[0]

        wx.uploadFile({
          url: app.util.url('entry/wxapp/uploadTempPic'),
          filePath: src,
          name: 'pic',
          header: {
            'content-type': 'multipart/form-data' // 默认值
          },
          success: function (res) {
            //console.log(res)
            res = JSON.parse(res.data)

            if (res.errno == 0) {

              //console.log(res.data.path)
              wx.request({
                'url': app.util.url('entry/wxapp/IdentifyCard'),
                'data': { 'path': res.data.path },
                success: function (res) {
                  wx.hideLoading()
                  if (res.data.errno == 0) {
                    //console.log(res)
                    wx.navigateTo({
                      url: '../../pages/recognition/recognition?identify_id=' + res.data.data.identify_id,
                    })

                  } else {

                    wx.showToast({
                      title: res.data.message,
                      icon: 'none',
                      duration: 2000
                    })

                  }
                },
                fail: function (res) {
                  wx.hideLoading()
                  wx.showToast({
                    title: '识别名片发生网络错误',
                    icon: 'none',
                    duration: 2000
                  })

                },

              })

            } else {
              wx.hideLoading()
              wx.showToast({
                title: res.message,
                icon: 'none',
                duration: 2000
              })

            }

          },
          fail: function (res) {
            wx.hideLoading()
            wx.showToast({
              title: '上传名片图片发生网络错误',
              icon: 'none',
              duration: 2000
            })

          },
        })

       
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //app.config.footer(this)

    this.getCollectList()

  },

  getCollectList:function (){

    var that = this
    app.util.request({
      'url': 'entry/wxapp/getUserCollect',
      'method': 'POST',
      'data': { 'page': that.data.page, 'sort': that.data.sort, 'sort_mode': that.data.sort_mode, 'search_key': that.data.search_key },
      success(res) {

        //console.log(res)
        if (that.data.search_key) {
          that.setData({ search_list: res.data.data })
        } else {
          that.setData({ collect_list: res.data.data })
        }

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
    
    var that = this
    that.getUserComeback()
    if(app.freshHolder){
      that.setData({ sort: '', sort_mode: '' , search_key: '' })
      this.getCollectList()
      app.freshHolder = false
      that.data.lastPage = false
    }
    this.setData({ app_name: app.config.getConf('app_name'), identify_card_switch: app.config.getConf('identify_card_switch') })
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

    app.config.comebackUpdate()

    var that = this
    that.data.page = 1
    app.util.request({
      'url': 'entry/wxapp/getUserCollect',
      'method': 'POST',
      //'cachetime': 30,
      'data': { 'page': that.data.page, 'sort': that.data.sort, 'sort_mode': that.data.sort_mode, 'search_key': that.data.search_key },
      success(res) {
        //console.log(res)

        if (that.data.search_key) {
          that.setData({ search_list: res.data.data })
        } else {
          that.setData({ collect_list: res.data.data })
        }

        that.data.lastPage = false
        wx.stopPullDownRefresh()

      }

    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    
    if(that.data.lastPage === true) return false

    wx.showLoading({
      title: '加载中',
    })
    
    that.data.page++
    
    app.util.request({
      'url': 'entry/wxapp/getUserCollect',
      'method': 'POST',
      'data': { 'page': that.data.page, 'sort': that.data.sort, 'sort_mode': that.data.sort_mode, 'search_key': that.data.search_key },
      success(res) {
        //console.log(res)
        if(res.data.data.length > 1){

          if (that.data.search_key){

            that.data.search_list = that.data.search_list.concat(res.data.data)
            that.setData({ search_list: that.data.search_list })

          }else{

            that.data.collect_list = that.data.collect_list.concat(res.data.data)
            that.setData({ collect_list: that.data.collect_list })

          }
        

        }else{

          that.data.lastPage = true

        }
        // 隐藏加载框  
        wx.hideLoading();

      }

    })

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // }
})