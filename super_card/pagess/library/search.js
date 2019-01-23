// super_card/pagess/library/search.js
var app = getApp()
const getInf = (str, key) => str.replace(new RegExp(`${key}`, 'g'), `%%${key}%%`).split('%%');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showHistory:false,

    searchKey: '',
    page: 1,
    cardList: [],
    cardListCopy: [],
    lastPage: false,
    show_goTop: false,
    isLoading: false,
    userPosLat: 0,
    userPosLng: 0,

    prevPage: false,

    searchHistory: [],

    category:[
      { id: 0, name: "全部" },
      { id: 1, name: "名片" },
      { id: 2, name: "官网商城" },
      { id: 3, name: "产品" },
      { id: 4, name: "需求信息" },
    ],
    activeCategoryId: 0,
    length: '',
    allInfo: [],
    cardInfo: [],
    websiteInfo: [],
    productInfo: [],
    demandInfo: [],
    listDataCopy: [],// 用来搜索的复制数组,实现关键字高亮，原来数组不可以动的，所以要复制个新数组出来拆分成需要的数据去展示
  },

  // 聚焦事件
  focusInput:function(){
    var that = this
    that.setData({ showHistory:true })
  },

  cancelSearch: function (){
    wx.navigateBack({
      
    })
  },

  truncateHistory:function (){
    wx.setStorageSync('pubS', [])
    this.setData({ searchHistory: [], showHistory: false })
  },

  chooseSearch:function (e){
    this.data.lastPage = false
    this.data.page = 1
    this.setData({ showHistory: false, searchKey : e.currentTarget.dataset.key })
    this.getPulicCard()
  },

// 点击分类标题切换
  tabClick: function (e) {
    console.log('tabClick-e',e)
    var id = e.target.dataset.id
    console.log('id', id)
    this.setData({
      activeCategoryId: id
    });
  },


  
// 名片点击查看更多
  // cardInfoMore: function (e) {
  //   console.log('tabClick-e', e)
  //   var that = this;
  //   var cardList = that.data.cardList
  //   var cardInfo = cardList.cardInfo //还没确定具体数据字段
  //   var page = that.data.page;
  //   var data = {
  //     page: page+1,
  //     search_key: that.data.searchKey,
  //     userLat: that.data.userPosLat,
  //     userLng: that.data.userPosLng,
  //   }
  //   app.util.request({
  //     'url': 'entry/wxapp/getPubCard',
  //     'method': 'POST',
  //     'data': data,
  //     success(res) {
  //       var data = res.data.data
  //       that.setData({
  //         cardInfo: cardInfo.concat(data),//还没确定具体数据字段
  //         length: data.length,
  //         page: page + 1
  //       })
  //     }
  //   })
  // },
  


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var pages = getCurrentPages();
    that.data.prevPage = pages[pages.length - 2]; // 上一级页
    var prevPageData = that.data.prevPage.data
    that.setData({ userPosLat: prevPageData.userPosLat, userPosLng: prevPageData.userPosLng })
    that.getHistory()
    
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

  //监听页面滚动
  onPageScroll: function (e) {

    if (this.data.show_goTop === false && e.scrollTop >= 200) this.setData({ show_goTop: true })

    if (this.data.show_goTop === true && e.scrollTop < 200) this.setData({ show_goTop: false })

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
    console.log('cardlist3', this.data.cardList)
    console.log('listDataCopy3', this.data.listDataCopy)
  },

  getPulicCard: function (callback = false, mode = 'cover') {
    var that = this

    if (that.data.isLoading === true || that.data.searchKey == ''){
      typeof callback === `function` && callback()
      return
    } 

    var data = {
      page: that.data.page,
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
          that.data.cardList = that.data.cardList.concat(res.data.data)

        } else {
          that.data.cardList = res.data.data
        }

        that.setData({
          cardList: that.data.cardList,
        })

      }
    })

    

  },

  setHistory: function (searchKey){

    try {

      var history = wx.getStorageSync('pubS')
      if (history.length > 0){
        history.push(searchKey)
        wx.setStorageSync('pubS', history)
      }else{
        var history = [searchKey]
        wx.setStorageSync('pubS', history)
      }


    } catch (e) {

      var history = [searchKey]
      wx.setStorageSync('pubS', history)

    }
    this.setData({ searchHistory: history })
  },

  getHistory: function (){
    var that = this
    try {
      var history = wx.getStorageSync('pubS')

      if (history.length > 0)
        that.setData({ searchHistory: history })

    } catch (e) {
      that.setData({ searchHistory: [] })
    }
  },

  //确认搜索
  confirmSearchKey: function () {

    if (this.data.searchKey) {

      this.setData({ showHistory: false })
      this.data.lastPage = false
      this.data.page = 1
       //this.getPulicCard()
      this.searchTap()
      console.log('cardlist', this.data.cardList)
      console.log('listDataCopy', this.data.listDataCopy)
      this.setHistory(this.data.searchKey)

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
    // var key = e.detail.value
    var that = this;
    var key = that.trim(e.detail.value)
    that.setData({ searchKey: key })
    that.data.lastPage = false
    that.data.page = 1
    //that.searchTap()
  },
  // 去除首尾的空格
  trim: function (s) {
    return s.replace(/(^\s*)|(\s*$)/g, "");
  },

  // 搜索关键字，实现高亮效果
  searchTap: function () {
    var that = this;
    var data = {
      page: that.data.page,
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

        var data = res.data.data
        var newData = res.data.data

        for (var i = 0; i < data.length; i++) {
          var dic = data[i];
          var newDic = newData[i];
          var text = dic.name;
          newDic.name = getInf(text, that.data.searchKey);
          var company = dic.company;
          newDic.company = getInf(company, that.data.searchKey);

        }

        that.setData({
          cardList: data,
          listDataCopy: newData
        })

      }
    })

    console.log('cardlist2', this.data.cardList)
    console.log('listDataCopy2', this.data.listDataCopy)
  },



  //设置搜索关键字
  // setSearchKey: function (e) {
  //   //console.log(e)
  //   var key = e.detail.value
  //   this.setData({ searchKey: key })
  //   this.data.lastPage = false
  //   this.data.page = 1
  // },


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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})