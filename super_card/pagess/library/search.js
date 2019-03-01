// super_card/pagess/library/search.js
var app = getApp()
const getInf = (str, key) => str.replace(new RegExp(`${key}`, 'g'), `%%${key}%%`).split('%%');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showHistory: false,

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

    category: [
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
    cardMore: false,
    websiteMore: false,
    productMore: false,
    demandMore: false,

    sliceCard: [],//存放截取后的数组数据
    sliceWebsite: [],//存放截取后的数组数据
    sliceProduct: [],//存放截取后的数组数据
    sliceDemand: [],//存放截取后的数组数据

    websiteInfo: [],
    productInfo: [],
    demandInfo: [],

   //全部数据中的高亮字体
    cardListDataCopy: [],// 用来搜索的复制数组,实现关键字高亮，原来数组不可以动的，所以要复制个新数组出来拆分成需要的数据去展示
    websiteInfoDataCopy: [],
    productInfoDataCopy: [],
    demandInfoDataCopy: [],

    cateCardList: [],//分类--名片数据
    cateWebsite: [],//分类--官网商城数据
    cateProduct: [],//分类--产品数据
    cateDemand: [],//分类--需求信息数据

    //分类数据中的高亮字体
    cateCardListDataCopy: [],// 用来搜索的复制数组,实现关键字高亮，原来数组不可以动的，所以要复制个新数组出来拆分成需要的数据去展示
    cateWebsiteDataCopy: [],
    cateProductDataCopy: [],
    cateDemandDataCopy: [],

    imgPic:'../../resource/images/logo.png', //默认图片


  },

  // 聚焦事件
  focusInput: function () {
    var that = this
    that.setData({ showHistory: true })
  },

  cancelSearch: function () {
    wx.navigateBack({

    })
  },

  truncateHistory: function () {
    wx.setStorageSync('pubS', [])
    this.setData({ searchHistory: [], showHistory: false })
  },

  chooseSearch: function (e) {
    this.data.lastPage = false
    this.data.page = 1
    this.setData({ showHistory: false, searchKey: e.currentTarget.dataset.key })
    this.getPubAll() //全部数据
    //清空一次数据，防止搜索的时候重复加载
    this.setData({
      cateCardList: [],
      cateWebsite: [],
      cateProduct: [],
      cateDemand: [],
      cateCardListDataCopy: [],
      cateWebsiteDataCopy: [],
      cateProductDataCopy: [],
      cateDemandDataCopy: []
    })
    this.getCardInfo() //名片数据
    this.getPubStore() //商城数据
    this.getPubProduct()//产品数据
    this.getPubSquare()//需求数据
  },

  // 点击分类标题切换
  tabClick: function (e) { 
    var id = e.target.dataset.id 
    this.setData({
      activeCategoryId: id
    });
  },

  // 名片点击查看更多
  cardInfoMore: function (e) {
    this.setData({
      activeCategoryId: 1
    });
  },

  // 商城官网点击查看更多
  websiteInfoMore: function (e) {
    this.setData({
      activeCategoryId: 2
    });
  },

  // 产品点击查看更多
  productInfoMore: function (e) {
    this.setData({
      activeCategoryId: 3
    });
  },

  // 需求点击查看更多
  demandInfoMore: function (e) {
    this.setData({
      activeCategoryId: 4
    });
  },

 

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
  },


  //全部数据方法start
  getPubAll: function (callback = false, mode = 'cover') {
    var that = this

    if (that.data.isLoading === true || that.data.searchKey == '') {
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
      'url': 'entry/wxapp/getPubAll',
      'method': 'POST',
      'data': data,
      success(res) {
        console.log('res',res)
        that.data.isLoading = false

        typeof callback === `function` && callback()

        if (mode == 'append') {

          if (!res.data.data.length) {
            that.data.lastPage = true
            return false
          }
          that.data.cardList = that.data.cardList.concat(res.data.data.card_list)

        } else {
          that.data.cardList = res.data.data.card_list
        }

        that.setData({
          cardList: that.data.cardList,
          cardListDataCopy: that.data.cardList,
          websiteInfo: res.data.data.store_list,
          productInfo: res.data.data.product_list,
          demandInfo: res.data.data.square_list,
          websiteInfoDataCopy: res.data.data.store_list,
          productInfoDataCopy: res.data.data.product_list,
          demandInfoDataCopy: res.data.data.square_list
        })

       //名片关键字高亮start
        var data = that.data.cardList
        var newData = that.data.cardListDataCopy
        for (var i = 0; i < data.length; i++) {
          var dic = data[i];
          var newDic = newData[i];
          var name = dic.name;
          newDic.name = getInf(name, that.data.searchKey);
          var title = dic.title;
          newDic.title = getInf(title, that.data.searchKey);
          var company = dic.company;
          newDic.company = getInf(company, that.data.searchKey);
        }
        that.setData({
          cardListDataCopy: newData
        })
        //名片关键字高亮end

         //商城官网关键字高亮start
      
        var data = that.data.websiteInfo
        var newWebData = that.data.websiteInfoDataCopy
        for (var i = 0; i < data.length; i++) {
          var dic = data[i];
          var newDic = newWebData[i];
          var store_name = dic.store_name;
          newDic.store_name = getInf(store_name, that.data.searchKey);
          var store_business = dic.store_business;
          newDic.store_business = getInf(store_business, that.data.searchKey);
        }
        that.setData({
          websiteInfoDataCopy: newWebData
        })
        //商城官网关键字高亮end  

         //产品关键字高亮start
        
        var data = that.data.productInfo
        var newProData = that.data.productInfoDataCopy
        for (var i = 0; i < data.length; i++) {
          var dic = data[i];
          var newDic = newProData[i];
          var goods_name = dic.goods_name;
          newDic.goods_name = getInf(goods_name, that.data.searchKey);
          var goods_introduce = dic.goods_introduce;
          newDic.goods_introduce = getInf(goods_introduce, that.data.searchKey);
        }
        that.setData({
          productInfoDataCopy: newProData
        })
         //产品关键字高亮end

         //需求信息关键字高亮start
       
        var data = that.data.demandInfo
        var newDemData = that.data.demandInfoDataCopy
        for (var i = 0; i < data.length; i++) {
          var dic = data[i];
          var newDic = newDemData[i];
          var user_name = dic.user_name;
          newDic.user_name = getInf(user_name, that.data.searchKey);
          var content = dic.content;
          newDic.content = getInf(content, that.data.searchKey);
        }
        that.setData({
          demandInfoDataCopy: newDemData
        })
        //需求信息关键字高亮end

        //数组截取及查看更多按钮的显示start （名片信息的没渲染截取后的，因为接口还不完善，现在只能搜索出名片信息）
        var cardbLength = that.data.cardList.length
        var webLength = that.data.websiteInfo.length
        var proLength = that.data.productInfo.length
        var demLength = that.data.demandInfo.length

        var sliceC = that.data.cardListDataCopy  //渲染搜索出来的关键字显示高亮
        //var sliceW = that.data.websiteInfo
        var sliceW = that.data.websiteInfoDataCopy
        // var sliceP = that.data.productInfo  
        var sliceP = that.data.productInfoDataCopy
        // var sliceD = that.data.demandInfo
        var sliceD = that.data.demandInfoDataCopy


        cardbLength > 3 ? that.setData({ cardMore: true, sliceCard: sliceC.slice(0, 3) }) : that.setData({ cardMore: false, sliceCard: sliceC })
        webLength > 3 ? that.setData({ websiteMore: true, sliceWebsite: sliceW.slice(0, 3) }) : that.setData({ websiteMore: false, sliceWebsite: sliceW })
        proLength > 3 ? that.setData({ productMore: true, sliceProduct: sliceP.slice(0, 3) }) : that.setData({ productMore: false, sliceProduct: sliceP })
        demLength > 3 ? that.setData({ demandMore: true, sliceDemand: sliceD.slice(0, 3) }) : that.setData({ demandMore: false, sliceDemand: sliceD })

        //数组截取及查看更多按钮的显示end
      }
    })
  },
  //全部数据方法end


// 名片数据方法start  渲染的时候记得写对相对于的数据进行渲染 即cateCardListDataCopy
  getCardInfo: function () {
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
        that.data.isLoading = false
        
        if (!res.data.data.length) {
          that.data.lastPage = true
          return false
        }
        that.data.cateCardList = that.data.cateCardList.concat(res.data.data)

        that.setData({
          cateCardList: that.data.cateCardList,
          cateCardListDataCopy: that.data.cateCardList
        })
        var data = that.data.cateCardList
        var newData = that.data.cateCardListDataCopy
        for (var i = 0; i < data.length; i++) {
          var dic = data[i];
          var newDic = newData[i];
          var name = dic.name;
          newDic.name = getInf(name, that.data.searchKey);
          var title = dic.title;
          newDic.title = getInf(title, that.data.searchKey);
          var company = dic.company;
          newDic.company = getInf(company, that.data.searchKey);
        }
        that.setData({
          cateCardListDataCopy: newData
        })
      }
    })


  },

  // 名片数据方法end

  // 商城列表数据方法start
  getPubStore: function () {
    var that = this;
    var data = {
      page: that.data.page,
      search_key: that.data.searchKey,
      userLat: that.data.userPosLat,
      userLng: that.data.userPosLng,
    }
    that.data.isLoading = true
    app.util.request({
      'url': 'entry/wxapp/getPubStore',
      'method': 'POST',
      'data': data,
      success(res) {
        that.data.isLoading = false

        if (!res.data.data.length) {
          that.data.lastPage = true
          return false
        }
        that.data.cateWebsite = that.data.cateWebsite.concat(res.data.data)

        that.setData({
          cateWebsite: that.data.cateWebsite,
          cateWebsiteDataCopy: that.data.cateWebsite
        })
        var data = that.data.cateWebsite
        var newWebData = that.data.cateWebsiteDataCopy
        for (var i = 0; i < data.length; i++) {
          var dic = data[i];
          var newDic = newWebData[i];
          var store_name = dic.store_name;
          newDic.store_name = getInf(store_name, that.data.searchKey);
          var store_business = dic.store_business;
          newDic.store_business = getInf(store_business, that.data.searchKey);
        }
        that.setData({
          cateWebsiteDataCopy: newWebData
        })
      }
    })


  },

  // 商城列表数据方法end

  // 产品列表数据方法start
  getPubProduct: function () {
    var that = this;
    var data = {
      page: that.data.page,
      search_key: that.data.searchKey,
      userLat: that.data.userPosLat,
      userLng: that.data.userPosLng,
    }
    that.data.isLoading = true
    app.util.request({
      'url': 'entry/wxapp/getPubProduct',
      'method': 'POST',
      'data': data,
      success(res) {
        that.data.isLoading = false

        if (!res.data.data.length) {
          that.data.lastPage = true
          return false
        }
        that.data.cateProduct = that.data.cateProduct.concat(res.data.data)

        that.setData({
          cateProduct: that.data.cateProduct,
          cateProductDataCopy: that.data.cateProduct
        })
        var data = that.data.cateProduct
        var newProData = that.data.cateProductDataCopy
        for (var i = 0; i < data.length; i++) {
          var dic = data[i];
          var newDic = newProData[i];
          var goods_name = dic.goods_name;
          newDic.goods_name = getInf(goods_name, that.data.searchKey);
          var goods_introduce = dic.goods_introduce;
          newDic.goods_introduce = getInf(goods_introduce, that.data.searchKey);
        }
        that.setData({
          cateProductDataCopy: newProData
        })
      }
    })
  },

  // 产品列表数据方法end


  // 需求信息数据方法start
  getPubSquare: function () {
    var that = this;
    var data = {
      page: that.data.page,
      search_key: that.data.searchKey,
      userLat: that.data.userPosLat,
      userLng: that.data.userPosLng,
    }
    that.data.isLoading = true
    app.util.request({
      'url': 'entry/wxapp/getPubSquare',
      'method': 'POST',
      'data': data,
      success(res) {
        that.data.isLoading = false

        if (!res.data.data.length) {
          that.data.lastPage = true
          return false
        }
        that.data.cateDemand = that.data.cateDemand.concat(res.data.data)

        that.setData({
          cateDemand: that.data.cateDemand,
          cateDemandDataCopy: that.data.cateDemand
        })
        var data = that.data.cateDemand
        var newDemData = that.data.cateDemandDataCopy
        for (var i = 0; i < data.length; i++) {
          var dic = data[i];
          var newDic = newDemData[i];
          var user_name = dic.user_name;
          newDic.user_name = getInf(user_name, that.data.searchKey);
          var content = dic.content;
          newDic.content = getInf(content, that.data.searchKey);
        }
        that.setData({
          cateDemandDataCopy: newDemData
        })
      }
    })
  },

  // 需求信息数据方法end


  setHistory: function (searchKey) {

    try {

      var history = wx.getStorageSync('pubS')
      if (history.length > 0) {
        history.push(searchKey)
        wx.setStorageSync('pubS', history)
      } else {
        var history = [searchKey]
        wx.setStorageSync('pubS', history)
      }


    } catch (e) {

      var history = [searchKey]
      wx.setStorageSync('pubS', history)

    }
    this.setData({ searchHistory: history })
  },

  getHistory: function () {
    var that = this
    try {
      var history = wx.getStorageSync('pubS')

      if (history.length > 0)
        that.setData({ searchHistory: history })

    } catch (e) {
      that.setData({ searchHistory: [] })
    }
  },

  //按回车键或者手机输入法的搜索确认搜索
  confirmSearchKey: function () {

    if (this.data.searchKey) {

      this.setData({ showHistory: false })
      this.data.lastPage = false
      this.data.page = 1
      //清空一次数据，防止搜索的时候重复加载
      this.setData({
        cateCardList: [],
        cateWebsite: [],
        cateProduct: [],
        cateDemand: [],
        cateCardListDataCopy: [],
        cateWebsiteDataCopy: [],
        cateProductDataCopy: [],
        cateDemandDataCopy: []
      })
      this.getPubAll() //原本的  全部数据
      this.getCardInfo() //名片数据
      this.getPubStore() //商城数据
      this.getPubProduct()//产品数据
      this.getPubSquare()//需求数据

      this.setHistory(this.data.searchKey)

    } else {

      wx.showToast({
        title: '请输入搜索关键词',
        icon: 'none'
      })

    }
  },

  //按搜索两个字进行搜索
  searchResult: function () {

    if (this.data.searchKey) {

      this.setData({ showHistory: false })
      this.data.lastPage = false
      this.data.page = 1
      //清空一次数据，防止搜索的时候重复加载
      this.setData({
        cateCardList: [],
        cateWebsite: [],
        cateProduct: [],
        cateDemand: [],
        cateCardListDataCopy: [],
        cateWebsiteDataCopy: [],
        cateProductDataCopy: [],
        cateDemandDataCopy: []
      })
      this.getPubAll() //原本的  全部数据
      this.getCardInfo() //名片数据
      this.getPubStore() //商城数据
      this.getPubProduct()//产品数据
      this.getPubSquare()//需求数据

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
    var that = this;
    var key = that.trim(e.detail.value)
    that.setData({ searchKey: key })
    that.data.lastPage = false
    that.data.page = 1
  },
  // 去除首尾的空格
  trim: function (s) {
    return s.replace(/(^\s*)|(\s*$)/g, "");
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
    this.getPubAll(function () {
      wx.stopPullDownRefresh()
    })  //全部数据

    //清空一次数据，防止下拉的时候重复加载
    this.setData({
      cateCardList: [],
      cateWebsite: [],
      cateProduct: [],
      cateDemand: [],
      cateCardListDataCopy: [],
      cateWebsiteDataCopy: [],
      cateProductDataCopy: [],
      cateDemandDataCopy: []
    })
    
     this.getCardInfo() //名片数据
     this.getPubStore() //商城数据
     this.getPubProduct()//产品数据
     this.getPubSquare()//需求数据
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

    that.getPubAll(function () {

      wx.hideLoading();

    }, 'append')

     this.getCardInfo() //名片数据
     this.getPubStore() //商城数据
     this.getPubProduct()//产品数据
     this.getPubSquare()//需求数据

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})