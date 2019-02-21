// super_card/pages/edit-goods/edit-goods.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showMode: false,
    index:false,
    goods_id: 0,
    goods_name: '',
    goods_introduce: '',
    goods_price: '',
    goods_stock: '',
    goods_pics:[],
    goods_content: [],
    status:0,
    pageData: [],

    prevPage:{},
    card:{},

    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,

  },

  saveCardGoods:function (e){

    var act = e.currentTarget.dataset.act

    var that = this
    if (!that.data.goods_name) {
      wx.showToast({
        title: '请输入商品名称',
        icon: 'none'
      })
      return
    }

    if (that.data.goods_name.length < 2 || that.data.goods_name.length > 10) {
      wx.showToast({
        title: '商品名称长度应该在2至10个字符之内',
        icon: 'none'
      })
      return
    }


    if (!that.data.goods_introduce) {
      wx.showToast({
        title: '请输入商品副标题',
        icon: 'none'
      })
      return
    }

    if (that.data.goods_introduce.length < 4 || that.data.goods_introduce.length > 30) {
      wx.showToast({
        title: '商品副标题长度应该在4至30个字符之内',
        icon: 'none'
      })
      return
    }

    if (!that.data.goods_price) {
      wx.showToast({
        title: '请输入商品价格',
        icon: 'none'
      })
      return
    }

    if (that.data.goods_pics.length < 1) {
      wx.showToast({
        title: '请上传商品图片',
        icon: 'none'
      })
      return
    }

    if (that.data.pageData.length < 1) {
      wx.showToast({
        title: '请输入商品详情',
        icon: 'none'
      })
      return
    }

    var data = {
      goods_id: that.data.goods_id,
      card_id: that.data.prevPage.data.card_id,
      goods_name: that.data.goods_name,
      goods_introduce: that.data.goods_introduce,
      goods_price: that.data.goods_price,
      goods_stock: that.data.goods_stock,
      goods_pics: that.data.goods_pics,
      pageData: that.data.pageData,
      status: (act == 'savepush' ? 1 : 0)
    }

    app.util.request({
      'url': 'entry/wxapp/saveCardGoods',
      'mothod': 'POST',
      'data': data,
      success(res) {

        var goods = {
          id: parseInt(res.data.data),
          card_id: data.card_id,
          goods_name: data.goods_name,
          goods_introduce: data.goods_introduce,
          goods_price: data.goods_price,
          goods_stock: data.goods_stock,
          goods_pics: data.goods_pics,
          goods_content: data.pageData,
          status: data.status,
        }

        if (that.data.index !== false) {

          that.data.prevPage.data.goods[that.data.index] = goods

        } else {

          that.data.prevPage.data.goods.push(goods)

        }
        that.data.prevPage.setData({ goods: that.data.prevPage.data.goods })


        if(act == 'goon'){

          that.setData({
            index: false,
            goods_id: 0,
            goods_name: '',
            goods_introduce: '',
            goods_price: '',
            goods_stock: '',
            goods_pics: [],
            pageData: [],
            status: 0,
          })

        }else{
          wx.navigateBack()
        }


      }
    })


  },


  setGoodsInfo: function (e) {
    //console.log(e)
    var that = this
    var field = e.target.dataset.field
    console.log(field)
    switch (field) {
      case 'goods_name':
        that.data.goods_name = e.detail.value
        break
      case 'goods_introduce':
        that.data.goods_introduce = e.detail.value
        break
      case 'goods_price':
        that.data.goods_price = e.detail.value
        break
      case 'goods_stock':
        that.data.goods_stock = e.detail.value
        break
    }
  },

  //隐藏选择图片展示方式
  delDmb: function () {
    this.setData({ showMode: false })
  },

  ///跳转上传图片页面
  goChoicePicture: function (e) {
    var that = this
    that.delDmb()
    that.data.type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '../edit-page/edit-picture?type=' + that.data.type + '&index=' + that.data.index,
    })
  },

  delPageData: function (e) {
    //console.log(e)
    var index = e.currentTarget.dataset.index
    this.data.pageData.splice(index, 1)
    this.setData({ pageData: this.data.pageData })
  },

  moveList: function (e) {
    console.log(e)
    var that = this
    var index = e.currentTarget.dataset.index
    if (index == 0) {
      var arr = ['下移', '最下']
      wx.showActionSheet({
        itemList: arr,
        success(res) {

          console.log(res)
          var tindex = res.tapIndex;
          var temp = that.data.pageData.splice(index, 1)
          console.log(temp)
          switch (tindex) {
            case 0:
              console.log('下移')
              that.data.pageData.splice(++index, 0, temp[0])
              break;
            case 1:
              console.log('最下')
              that.data.pageData.push(temp[0])
              break;
          }
          that.setData({ pageData: that.data.pageData })

        }
      })
    } else if ((that.data.pageData.length - 1) == index) {
      var arr = ['上移', '最上']
      wx.showActionSheet({
        itemList: arr,
        success(res) {

          console.log(res)
          var tindex = res.tapIndex;
          var temp = that.data.pageData.splice(index, 1)
          console.log(temp)
          switch (tindex) {
            case 0:
              console.log('上移')
              that.data.pageData.splice(--index, 0, temp[0])
              break;
            case 1:
              console.log('最上')
              that.data.pageData.unshift(temp[0])
              break;
          }
          that.setData({ pageData: that.data.pageData })

        }
      })
    } else {

      var arr = ['下移', '上移', '最上', '最下']
      wx.showActionSheet({
        itemList: arr,
        success(res) {
          console.log(res)
          var tindex = res.tapIndex;
          var temp = that.data.pageData.splice(index, 1)
          console.log(temp)
          switch (tindex) {
            case 0:
              console.log('下移')
              that.data.pageData.splice(++index, 0, temp[0])
              break;
            case 1:
              console.log('上移')
              that.data.pageData.splice(--index, 0, temp[0])
              break;
            case 2:
              console.log('最上')
              that.data.pageData.unshift(temp[0])
              break;
            case 3:
              console.log('最下')
              that.data.pageData.push(temp[0])
              break;
          }
          that.setData({ pageData: that.data.pageData })
        }
      })

    }

  },


  jumpList: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    var that = this;
    wx.showActionSheet({
      itemList: ['标题', '文本', '图片', '名片', '位置'],
      success(res) {
        var tindex = res.tapIndex;
        switch (tindex) {

          case 0:
            console.log('标题')
            //var obj = { type: 'title', val: '标题' }
            wx.navigateTo({
              url: '../edit-page/edit-text?index=' + index + '&type=title'
            })
            break;
          case 1:
            console.log('文本')
            //var obj = { type: 'content', val: '内容' }
            wx.navigateTo({
              url: '../edit-page/edit-text?index=' + index + '&type=content'
            })
            break;
          case 2:
            console.log('图片')
            that.data.index = index
            that.setData({ showMode: true })
            break;
          case 3:
            console.log('名片')
            var obj = { type: 'card' }
            that.addPageData(index, obj)
            break;
          case 4:
            console.log('位置')
            that.getCurrentLocation(index)
            break;
        }

      },
      fail(res) {
        console.log(res.errMsg)
      }
    })

  },

  editPageData: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var type = that.data.pageData[index].type
    
    switch (type) {
      case 'title':
        wx.navigateTo({
          url: '../edit-page/edit-text?index=' + index + '&type=' + type + '&is_edit=1'
        })
        break
      case 'content':
        wx.navigateTo({
          url: '../edit-page/edit-text?index=' + index + '&type=' + type + '&is_edit=1'
        })
        break
      case 'map':
        that.getCurrentLocation(index, true)
        break
      case 'pic':
        wx.navigateTo({
          url: '../edit-page/edit-picture?type=' + type + '&index=' + index + '&is_edit=1',
        })
        break
      case 'grid_pic':
        wx.navigateTo({
          url: '../edit-page/edit-picture?type=' + type + '&index=' + index + '&is_edit=1',
        })
        break
      case 'more_pic':
        wx.navigateTo({
          url: '../edit-page/edit-picture?type=' + type + '&index=' + index + '&is_edit=1',
        })
        break
    }
  },

  addPageData: function (index, obj) {
    var that = this
    if (index == 'top') {
      that.data.pageData.unshift(obj)
    } else {
      that.data.pageData.splice(++index, 0, obj)
    }
    that.setData({ pageData: that.data.pageData })

  },
  updatePageData: function (index, obj) {
    var that = this

    that.data.pageData[index] = obj

    that.setData({ pageData: that.data.pageData })

  },


  //选择地址信息
  getCurrentLocation: function (index, is_edit = false) {
    var that = this;
    wx.chooseLocation({
      success: function (res) {

        var obj = { type: 'map', val: { title: res.address, latitude: res.latitude, longitude: res.longitude } }
        if (is_edit === true)
          that.updatePageData(index, obj)
        else
          that.addPageData(index, obj)
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var pages = getCurrentPages();
    that.data.prevPage = pages[pages.length - 2]; // 上一级页
    if(typeof options.index != 'undefined'){

      that.data.index = options.index
      var goods = that.data.prevPage.data.goods[that.data.index]
      that.setData({ 
          goods_id: goods.id, 
          goods_name: goods.goods_name,
          goods_introduce: goods.goods_introduce,
          goods_price: goods.goods_price,
          goods_stock: goods.goods_stock,
          goods_pics: goods.goods_pics,
          pageData: goods.goods_content,
        })
    }

    that.setData({ card_id: that.data.prevPage.data.card_id, card : that.data.prevPage.data.card })
    
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
  onShareAppMessage: function () {

  }
})