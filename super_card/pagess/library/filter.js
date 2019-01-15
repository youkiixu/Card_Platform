// super_card/pages/library/filter.js
import areaData from '../../components/picker-city/data.js';
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
    pcd: [0, 0, 0],
    industry: '',
    industryVal: [0],
    industryText: '全部行业',
    industryList: ['全部行业'],
    cardList: [],
    cardListCopy: [],
    sort: 'recommend',
    searchKey: '',
    showSearchInput: false,
    cardListPage: 1,
    page: 1,
    lastPage: false,
    show_goTop: false,

    showCreateBtn: false,

    userPosLat: 0,
    userPosLng: 0,

    showDistanceSort: true,

    pageLastId: 0,
    guideHide: false,

    lbpicture: [],

    popoup: {
      area: false,
      industry: [{ name: '全部行业', code: 0 }],
      order: false
    },
    popupKey: '',
    orderText: '推荐',
    isLoading: false,

    prevPage:false
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

  handerPopupChange: function (e) {
    var key = e.currentTarget.dataset.key;
    var popupKey = this.data.popupKey;

    if (popupKey == key) {
      this.setData({
        popupKey: ''
      })
    } else {
      this.setData({
        popupKey: key
      })
    }

  },

  filterCard: function (e) {
    console.log(e)
    var popupKey = this.data.popupKey;
    var that = this

    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    this.setData({
      popupKey: ''
    })
    switch (popupKey) {
      case 'area':
        var p = e.detail
        if (p[0].name == '全部地区') {
          that.setData({
            regionText: '全部地区',
            province: '',
            city: '',
            dict: ''
          })
        } else {
          var province = p[0].name
          var city = p[1].name
          var dict = p[2].name == '市辖区' ? '' : p[2].name
          var pcd = p.valueIndex
          that.setData({
            regionText: dict ? dict : city,
            province: province,
            city: city,
            dict: dict,
          })
        }
        that.data.lastPage = false
        that.data.page = 1
        that.getPulicCard()
        break;
      case 'industry':
        var val = e.detail[0].name
        that.setData({
          industryText: val,
          industry: val === '全部行业' ? '' : val,
        })
        that.data.lastPage = false
        that.data.page = 1
        that.getPulicCard()
        break;
      case 'order':
        var order = that.data.popoup.order[e.target.dataset.index]
        that.setData({ sort: order.value, orderText: order.name })
        that.data.page = 1
        that.data.lastPage = false
        that.getPulicCard()
        break;
    }
   
  },

  setPopupTop: function () {
    let that = this;
    let query = wx.createSelectorQuery();
    query.select('.sticky-in-relative-container').boundingClientRect()
    query.exec(function (res) {
      console.log(res)
      that.setData({
        top: res[0].top + res[0].height,
      })
      console.log(that.data.top)
    })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    
    var pages = getCurrentPages();
    that.data.prevPage = pages[pages.length - 2]; // 上一级页
    var prevPageData = that.data.prevPage.data

    if (areaData[0].name != '全部地区')
      areaData.unshift({ name: '全部地区', code: 0 })

    var industryLists = prevPageData.industryList
    for (var x in industryLists) {
          if (x == 0 ) continue
          that.data.popoup.industry.push({ name: industryLists[x].name, code: industryLists[x].id })
    }
    
    that.setPopupTop()
    that.setData({ 'popoup.industry': that.data.popoup.industry, 'popoup.area': areaData,'popoup.order': prevPageData.tabs, userPosLat: prevPageData.userPosLat, userPosLng: prevPageData.userPosLng })
  
    if (typeof options.industry != 'undefined'){
      var val = options.industry
      that.setData({
        industryText: val,
        industry: val === '全部行业' ? '' : val,
      })

    }

    that.data.lastPage = false
    that.data.page = 1
    that.getPulicCard()

  },


  /**
   * 获取公开库名片
  */
  getPulicCard: function (callback = false, mode = 'cover') {
    var that = this

    if (that.data.isLoading === true) return

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
        //console.log(res)
        that.data.isLoading = false

        typeof callback === `function` && callback()

        if (mode == 'append') {

          if (!res.data.data.length) {
            that.data.lastPage = true
            return false
          }
          console.log(res.data.data)
          that.data.cardList = that.data.cardList.concat(res.data.data)
          console.log(that.data.cardList)
          if (!that.data.searchKey) that.data.cardListCopy = that.data.cardList

        } else {
          that.data.cardList = res.data.data

          if (!that.data.searchKey) that.data.cardListCopy = res.data.data
        }

        that.setData({
          cardList: that.data.cardList,
        })

      }
    })

  },

  //确认搜索
  confirmSearchKey: function () {

    if (this.data.searchKey) {

      this.data.lastPage = false
      this.data.page = 1
      this.getPulicCard()

    } else {
      wx.showToast({
        title: '请输入搜索关键词',
        icon: 'none'
      })

    }
  },
  //设置搜索关键字
  setSearchKey: function (e) {
    //console.log(e)
    var key = e.detail.value
    this.setData({ searchKey: key })
    this.data.lastPage = false
    this.data.page = 1
  },
  //切换搜索状态
  toggleSearchInput: function (e) {
    var that = this

    if (this.data.showSearchInput) {

      that.setData({ showSearchInput: false, searchKey: '', cardList: that.data.cardListCopy })
      this.data.page = Math.ceil(that.data.cardList.length / that.data.cardList[0].page_size)
      this.data.lastPage = false

    } else {
      that.setData({ showSearchInput: true })
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
    var that = this
    app.config.set(that)
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
    this.data.page = 1
    this.data.lastPage = false
    this.getPulicCard(function () {
      wx.stopPullDownRefresh()
    })
  },

  //监听页面滚动
  onPageScroll: function (e) {

    if (this.data.show_goTop === false && e.scrollTop >= 200) this.setData({ show_goTop: true })

    if (this.data.show_goTop === true && e.scrollTop < 200) this.setData({ show_goTop: false })

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

    that.getPulicCard(function () {

      wx.hideLoading();

    }, 'append')

  },

})