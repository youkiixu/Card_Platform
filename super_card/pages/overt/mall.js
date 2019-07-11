// super_card/pages/mall/mall.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    card_id: 0,
    agent_id: 0,

    uid:0,

    storeInfo : {},
    goodsList: [],

    page: 1,
    lastPage: false,

    prevPage: false,
    preview: false,

    activeCategoryId: 0,
    itemChioce: 0,

    category: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options', options)
    var that = this
    if(options.scene) {
        var scene = options.scene.split('_');
        options = Object.assign(this.options , {
            card_id: scene[0],
            agent_id: scene[1]
        })
    }
    
    //获取当前用户ID
    app.util.getUserInfo(function (response) {

      that.setData({ uid: response.memberInfo.uid })

      if (typeof options.card_id != 'undefined') {
        

        that.setData({ card_id: options.card_id  , agent_id: options.agent_id})
        app.util.footer(that, that.data.card_id);

        app.config.cardTrack(that.data.card_id, 1, 'view')
        var par = {
            card_id: that.data.card_id 
        }
        if(that.data.agent_id) {
            par = Object.assign(par , {
                agent_id: that.data.agent_id
            })
        }
        app.util.request({
          'url': 'entry/wxapp/getCardStore',
          'method': 'post',
          'data': par,
          success(res) {

            var data = res.data.data

            that.setData({ storeInfo: data.store, goodsList: data.goods })
            console.log(that.data.goodsList)
            wx.setNavigationBarTitle({
              //title: that.data.storeInfo.store_name + ' - ' + app.config.getConf('app_name')
              title: '商城'
            }) 

          }
        })

      } else {
        
        var pages = getCurrentPages();
        that.data.prevPage = pages[pages.length - 2]; // 上一级页
        var data = that.data.prevPage.data

        var store = {
          store_name: data.store_name,
          store_logo: data.store_logo,
          store_introduce: data.store_introduce,
          add_date: data.add_date,
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
          store_business: data.store_business,
          store_contact: data.store_contact,
          store_owner: data.store_owner,
          store_banner: data.store_banner ? data.store_banner : [],

        }

        that.setData({ storeInfo: store, goodsList: data.goods, card: data.card, preview: true })
        wx.hideShareMenu()
      }

      that.getCardGoodsCateList()
      that.getCardGoods()

    })


  },
  toDetail:function(){
    console.log('11')
  },



  // 点击分类标题切换
  tabClick: function (e) {
    var id = e.target.dataset.id
    this.setData({
      page: 1,
      lastPage: false,
      activeCategoryId: id,
      itemChioce: id
    });
    this.getCardGoods()
  },

  //获取商品分类
  getCardGoodsCateList: function () {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getGoodsCate',
      'method': 'POST',
      'data': { card_id: that.data.card_id},
      success(res) {
        var category = [{ id: "0", name: "全部" }]
        if (res.data.message == 'ok') {
          for (var i = 0; i < res.data.data.length; i++) {
            category.push(res.data.data[i]);
          }
        }
        that.setData({
          category: category,
          page: 1,
          lastPage: false,
          activeCategoryId: 0,
        })
        console.log('category:', that.data.category)
      }
    })
  },



  getCardGoods: function (callback = false, mode = 'cover') {
    
    var that = this
    app.util.request({
      'url': 'entry/wxapp/getCardGoods',
      'method': 'post',
      'data': { card_id: that.data.card_id, cate_id: that.data.itemChioce, page: that.data.page },
      success(res) {

        typeof callback === `function` && callback()
        var data = res.data.data

        if (mode == 'append') {
          if (!res.data.data.length) {
            that.data.lastPage = true
            return false
          }
          that.data.goodsList = that.data.goodsList.concat(res.data.data)
        } else {
          that.data.goodsList = res.data.data
        }

        that.setData({
          goodsList: that.data.goodsList,
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

    var that = this
    if(that.data.preview === false){
      that.data.page = 1
      that.data.lastPage = false
      that.getCardGoods(function () {
        wx.stopPullDownRefresh()
      })
    }else{
      wx.stopPullDownRefresh()
    }
   
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    var that = this
    if (that.data.preview === false) {
      if (that.data.lastPage === true) return false
      that.data.page++
      that.getCardGoods('', 'append')
    }

  },

  backCard:function (e){
  
    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }

    wx.redirectTo({
      url: '/super_card/pages/overt/overt?card_id=' + this.data.card_id + '&from_act=other',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    var title = '欢迎查看 "' + this.data.storeInfo.store_name + '" 的名片商城'
    var path = '/super_card/pages/overt/mall?card_id=' + this.data.card_id
    var imgUrl = ''
    app.config.cardTrack(this.data.card_id, 4, 'praise')

    return {
      title: title,
      path: path,
      imageUrl: imgUrl
    }

  }


})