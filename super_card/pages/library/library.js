import { $wuxPicker } from '../../components/wux'
import { $wuxPickerCity } from '../../components/wux'
//import areaData from '../../components/picker-city/data.js';
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    regionText: '全部地区',
    province: '',
    city: '',
    dict: '',
    pcd:[0,0,0],
    industry: '',
    industryVal: [0],
    industryText:'全部行业',
    industryList: ['全部行业'],
    cardList:[],
    cardListCopy: [],
    sort:'recommend',
    searchKey: '',
    showSearchInput:false,
    cardListPage: 1,
    page: 1,
    lastPage: false,
    show_goTop: false,

    showCreateBtn: false,


    userPosLat:0,
    userPosLng: 0,

    showDistanceSort:true,

    pageLastId: 0,
    guideHide: false,

    lbpicture: [],

    tabs: false,
    tabsTop: 0,
    tabfixed: '',
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    
    loadDone:false,

    filter_style: false,
    //hei: "",
  },  

  toFilterPage: function (e){
      
      var val = e.currentTarget.dataset.val
      wx.navigateTo({
        url: '../../pagess/library/filter?industry=' + val,
      })
  },

  toSearchPage: function (e) {
    wx.navigateTo({
      url: '../../pagess/library/search',
    })
  },

  /**
   * 获取轮播图片
   */
  toGetCarouselPicyure: function () {
    var that = this
    app.util.request({
      'url': 'entry/wxapp/overtSets',
      'method': 'POST',
      success(res) {
      
        that.setData({
          lbpicture: res.data.data
        })
        
      }
    })
  },

  makeLinkWork: function (e) {
    var that = this
    var data = e.currentTarget.dataset

    if (!data.type) return
    data.type = parseInt(data.type)

    switch (data.type) {
      //跳转其它页面
      case 6:
        that.toOtherPage(data.value)
        break
      //跳转网页
      case 1:
        that.toWebView(data.value)
        break
      //跳转小程序
      case 2:
        that.toNavigateMiniPro(data.value, data.appid)
        break
      //拨打电话
      case 3:
        that.toPhoneCall(data.value)
        break
      //播放视频
      case 5:
        that.toViewVideo(data.value)
        break
      //显示二维码图片
      case 7:
        that.showQrcodePic(data.value)
        break
    }

  },
  showQrcodePic: function (picUrl) {

    wx.previewImage({
      current: picUrl,
      urls: [picUrl],
    })

  },

  toPhoneCall: function (phoneNum) {
    //仅为示例，并非真实的电话号码
    wx.makePhoneCall({
      phoneNumber: phoneNum
    })

  },

  toNavigateMiniPro: function (path, appid) {

    wx.navigateToMiniProgram({
      appId: appid,
      path: path,
      envVersion: 'release',
      success(res) {
        console.log('打开小程序成功')
      }
    })
  },

  toViewVideo: function (url) {
    
    var that = this
    wx.navigateTo({
      url: '../card-book/view-video?url=' + encodeURIComponent(url),
    })
  },

  toOtherPage: function (path) {

    wx.navigateTo({
      url: path,
    })
  },

  toWebView: function (url) {
    wx.navigateTo({
      url: '../card-book/web-view?url=' + encodeURIComponent(url),
    })
  },


  /**
   * 去掉提示遮罩层
   */
  goChcangeGuide: function () {
    this.setData({
      guideHide: true
    })
  },

  toCreateCard: function (e) {
 

    if (typeof e.detail.formId != 'undefined') app.formIds.push(e.detail.formId)

    app.util.request({
      'url': 'entry/wxapp/isCanCreate',
      success(res) {

       
        if (res.data.message === 'ok') {
          wx.navigateTo({
            url: '../basic/basic'
          })
        } else {
          var uInfo = res.data.data
       
          wx.navigateTo({
            url: '../payment/payment?umoney=' + uInfo.money + '&cardnum=' + uInfo.card_num
          })
        }

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
    
    if (e.scrollTop >= this.data.tabsTop){
      if(this.tabfixed == 'tab-fixed') return
      this.setData({ tabfixed: 'tab-fixed' })
    }else{
      if(this.tabfixed == '') return
      this.setData({ tabfixed: '' })
    }
      

    if (this.data.show_goTop === false && e.scrollTop >= 200) this.setData({ show_goTop: true })

    if (this.data.show_goTop === true && e.scrollTop < 200) this.setData({ show_goTop: false })

  },

  //确认搜索
  confirmSearchKey:function (){
    
    if(this.data.searchKey){
      
      this.data.lastPage = false
      this.data.page = 1
      this.getPulicCard()

    }else{
      wx.showToast({ 
        title: '请输入搜索关键词',
        icon:'none'
      })
  
    }
  },

  //设置搜索关键字
  setSearchKey: function (e) {

    var key = e.detail.value
    this.setData({ searchKey: key })
    this.data.lastPage = false
    this.data.page = 1
  },


  //切换搜索状态
  toggleSearchInput: function (e) {
    var that = this

    if (this.data.showSearchInput) {

      that.setData({ showSearchInput: false, searchKey: '', cardList: that.data.cardListCopy})
      this.data.page = Math.ceil(that.data.cardList.length / that.data.cardList[0].page_size)
      this.data.lastPage = false
      
    } else {
      that.setData({ showSearchInput: true })
    }

  },

  //省市区三级联动
  showRegionPicker: function () {
    var that = this
    $wuxPickerCity.init('city', {
      title: '请选择地区',
      toolbarCancelText: '清空',
      value: that.data.pcd,
      onChange(p) {
      },
      onCancel(p) {

        that.setData({
          regionText: '全部地区',
          province: '',
          city: '',
          dict: '',
          pcd: [0, 0, 0],
        })
        that.data.lastPage = false
        that.data.page = 1
        that.getPulicCard()
      },
      onDone(p) {

      
        var province = p.value[0]
        var city = p.value[1]
        var dict = p.value[2] == '市辖区' ? '' : p.value[2]
        var pcd = p.valueIndex
        that.setData({
          regionText: dict ? dict : city,
          province: province,
          city: city,
          dict: dict,
          pcd: pcd,
        })
        that.data.lastPage = false
        that.data.page = 1
        that.getPulicCard()
        
      }
    })
  },
  

  //行业选择
  showIndustryPick: function () {
    var that = this;
    $wuxPicker.init('industryList', {
      title: "",
      cols: [
        {
          textAlign: 'center',
          values: that.data.industryList,
        }
      ],
      value: that.data.industryVal,
      onChange(p) {
        
      },
      onDone(p) {
        var val = p.value[0]
        if(that.data.industry == val) return
        that.setData({
          industryText: val,
          industry: val === '全部行业' ? '' : val,
          industryVal: p.valueIndex
        })
        that.data.lastPage = false
        that.data.page = 1
        that.getPulicCard()
      },
      onCancel(p) {
        //console.log(p)
        /*that.setData({
          industryText: '全部行业',
          industry: '',
        })*/

      }
    })
  },

  /**
   * 获取公开库名片
   */
  getPulicCard: function (callback = false, mode = 'cover') {
    var that = this

    if(that.data.isLoading === true) return

    var data = {
      page: that.data.page,
      sort: that.data.sort,
      province: that.data.province,
      city: that.data.city,
      dict: that.data.dict,
      industry: that.data.industry,
      search_key: that.data.searchKey,
      userLat: that.data.userPosLat,
      userLng: that.data.userPosLng,
    }
    that.data.isLoading = true
    app.util.request({
      'url': 'entry/wxapp/getPubCard',
      'method': 'POST',
      'data': data,
      success(res) {
       
        that.data.isLoading = false

        typeof callback === `function` && callback()

        if(mode == 'append'){

          if(!res.data.data.length){ 
            that.data.lastPage = true
            return false
          }
        
          that.data.cardList = that.data.cardList.concat(res.data.data)
         
          if (!that.data.searchKey) that.data.cardListCopy = that.data.cardList

        }else{
          that.data.cardList = res.data.data

          if(!that.data.searchKey) that.data.cardListCopy = res.data.data
        }

        that.setData({
          cardList: that.data.cardList,
        })

      }
    })

  },

  

  /**
   *radio 实时查询 
   */
  radiogroupBindchange: function (e) {
    var that = this
    var sort = e.detail.value
    that.setData({ sort: sort })

    that.data.page = 1
    that.data.lastPage = false

    that.getPulicCard()

  },

  //切换是否显示创建名片按钮
  toggleShowCreateBtn: function () {
    var that = this
    app.util.request({
      'url': 'entry/wxapp/getUserCard',
      'data': { 'no_need_whole': 1 },
      success(res) {
        if (res.data.data.length < 1)
          that.setData({ showCreateBtn: true })
        else
          that.setData({ showCreateBtn: false })
      }
    })
  },

  tabClick: function (e) {
    var that = this
    var order = that.data.tabs[e.currentTarget.id]
    if (order.value == that.data.sort) return

    that.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });

    that.setData({ sort: order.value, orderText: order.name })
    that.data.page = 1
    that.data.lastPage = false
    if(that.data.tabfixed != ''){
      wx.pageScrollTo({
        scrollTop: that.data.tabsTop,
        duration: 0
      })
    }
    that.getPulicCard()
  },

  //获取当前用户名片
  getMyUserCards: function () {
    var that = this
    app.util.request({
      'url': 'entry/wxapp/getUserCard',
      'data': { 'no_need_whole': 1 },
      success(res) {
        var data = res.data.data
        if (data.length < 1) {
          wx.showModal({
            title: '系统提示',
            content: '您还没有创建名片，只有创建名片后才可以浏览哦！',
            showCancel: false,
            confirmColor: '#f90',
            confirmText: '去创建',
            success: function (res) {
              wx.navigateTo({
                url: '../basic/basic',
              })
            }
          });
          return false
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    
    that.getMyUserCards()

   
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.data.userPosLat = latitude
        that.data.userPosLng = longitude
        that.data.page = 1
        that.data.sortType = 1
        //that.getPulicCard()
        that.initPubCard()
      },
      fail: function (){
        that.setData({ showDistanceSort: false })
        that.data.sortType = 0
        that.initPubCard()
        //that.getPulicCard()
      }
    })

  },

  showTabSort:function (){
    var that = this
    if(that.data.sortType == 1)
      that.setData({ tabs: [{ name: "推荐", value: 'recommend', code: 1 }, { name: "人气", value: 'views', code: 2 }, { name: '时间', value: 'create_time', code: 5 },{ name: "附近", value: 'distance', code: 3 }] })
    else
      that.setData({ tabs: [{ name: "推荐", value: 'recommend', code: 1 }, { name: "人气", value: 'views', code: 2 }, { name: '时间', value: 'create_time', code: 5 }] })

    wx.getSystemInfo({
      success: function (res) {

        var sliderWidth = res.windowWidth / that.data.tabs.length
        that.setData({
          sliderWidth: sliderWidth,
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });

        if(that.data.tabsTop == 0){
          let query = wx.createSelectorQuery();
          query.select('.weui-tab').boundingClientRect()
          query.exec(function (res) {
            that.data.tabsTop = res[0].top
          })
        }

        
      }
    });
   
 


  },

  initPubCard: function (cb) {

    var that = this

    var data = {
      type_id: this.data.type_id,
      page: that.data.page,
      sort: that.data.sort,
      userLat: that.data.userPosLat,
      userLng: that.data.userPosLng,
    }
    app.util.request({
      'url': 'entry/wxapp/initPubCard',
      'method': 'POST',
      'data': data,
      success(res) {

        var filter_style = app.config.getConf('library_screen_style')
        if (filter_style > 0) that.setData({ filter_style: filter_style })
        console.log(filter_style)

        typeof cb == "function" && cb()
        //app.initSquarePage = false

        var data = res.data.data

        //行业分类
        var industryLists = res.data.data.industryLists
        if (filter_style == 1){
          for (var x in industryLists) {
            that.data.industryList.push(industryLists[x].name)
          }
          that.setData({ loadDone: true, cardList: data.lists, lbpicture: data.lunbo, noticeList: data.notice })
        }else{

          for (var x in industryLists) {
            that.data.industryList.push({ name: industryLists[x].name, code: industryLists[x].id })
          }
          var industryListsArr = []
          for (var i = 0, len = industryLists.length; i < len; i += 10)
            industryListsArr.push(industryLists.slice(i, i + 10))
          
          that.setData({ loadDone: true, industryLists: industryListsArr, cardList: data.lists, lbpicture: data.lunbo, noticeList: data.notice }, that.showTabSort)
        }
       
        

        if (res.data.data.user_cards.length < 1)
          that.setData({ showCreateBtn: true })
        else
          that.setData({ showCreateBtn: false })

        /*var winWid = wx.getSystemInfoSync().windowWidth;
        wx.getImageInfo({
          src: that.data.lbpicture[0].pic,
          success(res) {
            var imgh = res.height;　　//图片高度
            var imgw = res.width;
            var swiperH = winWid * imgh / imgw + "px"
            that.setData({ hei: swiperH }, )
          }
        })*/

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
    var that = this
    app.config.set(that)
    app.config.footer(that)
    app.config.setAd(that)

    app.config.setUserComeback()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({ popupKey: '' })
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

    this.data.page = 1
    this.data.lastPage = false
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.data.userPosLat = latitude
        that.data.userPosLng = longitude
        that.setData({ showDistanceSort: true })
        that.data.sortType = 1
        that.initPubCard(function () {
          wx.stopPullDownRefresh()
        })
      },
      fail: function () {
        that.setData({ showDistanceSort: false })
        that.data.sortType = 0
        that.initPubCard(function () {
          wx.stopPullDownRefresh()
        })
      }
    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this

    if (that.data.lastPage === true) return false

    wx.showLoading({
      title: '加载中',
    })

    that.data.page++

    that.getPulicCard(function (){

      wx.hideLoading();

    }, 'append')

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // }
})