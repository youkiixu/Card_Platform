// super_card/pages/mall-manage/mall-manage.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mallselected:1,

    card_id: 0,
    store_name: '',
    store_logo: '',
    store_introduce: '',
    add_date: app.util.getCurDate(),
    address: '',
    latitude: 0,
    longitude: 0,
    store_business: '',
    store_contact: '',
    store_owner: '',
    store_banner: [],
    goods: [],

    card:{},
   
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,

    have_store: false,

    batchArr: false,
    batchStatus:false,
    batchIds:[],


  },

  toPreviewStore: function () {
    wx.navigateTo({
      url: '../../pages/overt/mall?card_id=' + this.data.card_id,
    })

  },

  delCardGoods:function (e){
    var that = this
    var index = e.currentTarget.dataset.index
    var id = that.data.goods[index].id

    wx.showModal({
      title: '提示',
      content: '确认要删除该商品吗？',
      confirmColor: that.data.themeColor,
      success(res) {
        if (res.confirm) {
          app.util.request({
            'url': 'entry/wxapp/delCardGoods',
            'mothod': 'POST',
            'data': { card_id: that.data.card_id, goods_id: id },
            success(res) {

              that.data.goods.splice(index, 1)
              that.setData({ goods: that.data.goods })

            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },

  updateGoodsStatus:function (e){
    var that = this
    var index = e.currentTarget.dataset.index
    //console.log(that.data.goods[index])

    var id = that.data.goods[index].id
    var status = that.data.goods[index].status == 1 ? 0 : 1

    app.util.request({
      'url': 'entry/wxapp/updateGoodsStatus',
      'mothod': 'POST',
      'data': {card_id : that.data.card_id, upStr: [{ id: id, status: status}] },
      success(res) {

          that.data.goods[index].status = status
          that.setData({ goods: that.data.goods })

      }
    })

    


  },

  
 batchConfirm:function (e){
    var that = this
    if(that.data.batchIds.length < 1 || that.data.batchStatus === false) 
      return

    var up = []
    for(var x in that.data.batchIds)
        up.push({id: that.data.batchIds[x], status: that.data.batchStatus})

    app.util.request({
     'url': 'entry/wxapp/updateGoodsStatus',
     'mothod': 'POST',
     'data': { card_id: that.data.card_id, upStr:up },
     success(res) {

       for (var x in that.data.goods)
          for(var y in up)
            if(up[y].id == that.data.goods[x].id)
              that.data.goods[x].status = that.data.batchStatus

       that.setData({ batchArr: false, batchStatus:false, batchIds: [] , goods: that.data.goods })

     }
   })

 },
 selectBatch:function (e){
   //console.log(e)
   var batchIds = e.detail.value
   this.setData({ batchIds: batchIds })
   //this.data.batchArr[index].checked = true
 },
  cancelBatch:function (){
    this.setData({  batchStatus: false, batchArr: false })
  },
  batchManage:function (e){
      //console.log(e)
      var status = e.currentTarget.dataset.status
      var goods = this.data.goods
      var batchArr = []
      for(var x in goods)
        if(goods[x].status != status)
          batchArr.push(goods[x])

     if(batchArr.length < 1){
      var tip = status == 1 ? '上架' : '下架'
      wx.showToast({
        title: '暂无可'+ tip +'商品',
        icon: 'none'
      })
      return
     }
     for(var x in batchArr)
      batchArr[x].checked = false

    this.setData({ batchStatus:status, batchArr: batchArr })

  },

  batchGoodsStatus: function () {


  },


  toEditGoods: function (e){
      var index = e.currentTarget.dataset.index
      wx.navigateTo({
        url: 'edit-goods?index=' + index,
      })
  },

  createCardStore: function (e) {

    if (typeof e != 'undefined' && typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }

    var that = this
    if (!that.data.store_name) {
      wx.showToast({
        title: '请输入店铺名称',
        icon: 'none'
      })
      return
    }


    if (that.data.store_name.length < 2 || that.data.store_name.length > 16) {
      wx.showToast({
        title: '店铺名称长度应该在2至16个字符之内',
        icon: 'none'
      })
      return
    }


    if (!that.data.store_logo) {
      wx.showToast({
        title: '请上传店铺logo',
        icon: 'none'
      })
      return
    }

    //修改start
    // if (!that.data.store_introduce) {
    //   wx.showToast({
    //     title: '请输入店铺简介',
    //     icon: 'none'
    //   })
    //   return
    // }

    // if (that.data.store_introduce.length < 4 || that.data.store_introduce.length > 140) {
    //   wx.showToast({
    //     title: '公司简介长度应该在4至140个字符之内',
    //     icon: 'none'
    //   })
    //   return
    // }

    // if (!that.data.add_date) {
    //   wx.showToast({
    //     title: '请选择成立日期',
    //     icon: 'none'
    //   })
    //   return
    // }

    // if (!that.data.address) {
    //   wx.showToast({
    //     title: '请选择店铺地址',
    //     icon: 'none'
    //   })
    //   return
    // }



    // if (!that.data.store_business) {
    //   wx.showToast({
    //     title: '请输入您的主营业务',
    //     icon: 'none'
    //   })
    //   return
    // }

    // if (that.data.store_business.length < 4 || that.data.store_business.length > 200) {
    //   wx.showToast({
    //     title: '主营业务长度应该在4至200个字符之内',
    //     icon: 'none'
    //   })
    //   return
    // }

    // if (!that.data.store_contact) {
    //   wx.showToast({
    //     title: '请输入联系方式',
    //     icon: 'none'
    //   })
    //   return
    // }

    // var myreg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    // if (!myreg.test(that.data.store_contact)) {
    //   wx.showToast({
    //     title: '请输入正确的联系方式(手机号)',
    //     icon: 'none',
    //   })
    //   return
    // }

    // if (!that.data.store_owner) {
    //   wx.showToast({
    //     title: '请输入店铺所有者',
    //     icon: 'none'
    //   })
    //   return
    // }

    // if (that.data.store_owner.length < 2 || that.data.store_owner.length > 8) {
    //   wx.showToast({
    //     title: '店铺所有者长度应该在2至8个字符之内',
    //     icon: 'none'
    //   })
    //   return
    // }

    //修改end


    /*if (that.data.store_banner.length < 1) {
      wx.showToast({
        title: '请上传店铺banner图',
        icon: 'none'
      })
      return
    }*/

    // var data = {
    //   card_id: that.data.card_id,
    //   store_name: that.data.store_name,
    //   store_logo: that.data.store_logo,
    //   store_introduce: that.data.store_introduce,
    //   add_date: that.data.add_date,
    //   address: that.data.address,
    //   latitude: that.data.latitude,
    //   longitude: that.data.longitude,
    //   store_business: that.data.store_business,
    //   store_contact: that.data.store_contact,
    //   store_owner: that.data.store_owner,
    //   store_banner: that.data.store_banner,
    // }

    var data = {
      card_id: that.data.card_id,
      store_name: that.data.store_name,
      store_logo: that.data.store_logo,
      store_introduce: '',
      add_date: '',
      address: '',
      latitude: '',
      longitude: '',
      store_business: '',
      store_contact: '',
      store_owner: '',
      store_banner: that.data.store_banner,
    }

    app.util.request({
      'url': 'entry/wxapp/saveCardStore',
      'mothod': 'POST',
      'data': data,
      success(res) {

        //return
        if (that.data.have_store === false) {

          wx.showToast({
            title: '创建成功',
          })
          that.setData({
            have_store: true, 
            mallselected: 2,
            store_name: data.store_name,
            store_logo: data.store_logo,
            store_introduce: that.data.store_introduce,
            add_date: data.add_date,
            address: data.address,
            contact: data.contact,
            latitude: data.latitude,
            longitude: data.longitude,
            store_business: data.store_business,
            store_contact: data.store_contact,
            store_owner: data.store_owner,
            store_banner: data.store_banner ? data.store_banner : []
          })

        } else {

          wx.showToast({
            title: '保存成功',
          })

        }



      }
    })

  },


  getBgPic: function () {
    var that = this
    wx.request({
      url: app.util.url('entry/wxapp/getFrontPics'),
      data: {
        page: 'storebg',
      },
      success: function (res) {
        console.log(res)
        var data = res.data.data
        that.setData({ storebg: data })
      }
    })
  },

  bindDateChange: function (e) {
    this.setData({
      add_date: e.detail.value
    })
  },

  //切换基本信息设置
  mallBasic:function(){
    var that = this
    if(that.data.mallselected == 1) return
      that.setData({
        mallselected:1
      })
  },
  //切换添加商品
  mallShop: function () {
    var that = this
    if (that.data.have_store === false) {
      wx.showToast({
        title: '请先设置商城基本信息',
        icon: 'none'
      })
      return
    }
    if (that.data.mallselected == 2) return
      that.setData({
        mallselected: 2
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    if (typeof options.card_id == 'undefiend') {
      wx.navigateBack()
      return
    }
    //that.getBgPic()
    that.setData({ card_id: options.card_id })

  
    //判断是否为会员，非会员不能开通商城
    var getUserInfo = wx.getStorageSync('getUserInfo');
    var isVip = getUserInfo.vip;

    if (isVip == 0 ) {  
      wx.showModal({
        title: '系统提示',
        content: '您还不是会员，请先开通会员',
        showCancel: false,
        confirmColor: '#f90',
        confirmText: '去开通',
        success: function (res) {
          wx.redirectTo({
            url: '../../pages/opt-version/opt-version',
          })
        }
      });
      return
    }

    //获取商城信息
    that.getStoreInfo()

    //that.getUserInfo()  //之前代码调用函数that.getUserInfo()，默认是需要进行认证的

    
  },

  getUserInfo:function (){
    var that = this
    app.util.request({
      'url': 'entry/wxapp/getUserInfo',
      success(res) {

        var data = res.data.data
        console.log(data)
        if (data.is_company != 1) {
          wx.showModal({
            title: '系统提示',
            content: '您还没有进行企业认证，暂无编辑权限',
            showCancel: false,
            confirmColor: '#f90',
            confirmText: '去认证',
            success: function (res) {
              wx.redirectTo({
                url: '../../pagess/certify-opt/certify-opt',
              })
            }
          });
          return
        }else{

          that.getStoreInfo()

        }

      }
    })
  },

  getStoreInfo:function (callback){
    var that = this
    app.util.request({
      'url': 'entry/wxapp/getCardStore',
      'data': { card_id: that.data.card_id, edit: 1 },
      success(res) {
        typeof callback === `function` && callback()

        var data = res.data.data

        if (data === false)
          that.setData({ have_store: false })
        else
          that.setData({
            have_store: true,
            store_name: data.store.store_name,
            store_logo: data.store.store_logo,
            store_introduce: data.store.store_introduce,
            add_date: data.store.add_date,
            address: data.store.address,
            latitude: data.store.latitude,
            longitude: data.store.longitude,
            store_business: data.store.store_business,
            store_contact: data.store.store_contact,
            store_owner: data.store.store_owner,
            store_banner: data.store.store_banner ? data.store.store_banner : [],
            goods: data.goods ? data.goods : [],
            card: data.card,
            card_id: data.card.id
          })

      }
    })


  },


  //选择地址信息
  getCurrentLocation: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log('选择地址信息',res)
        var address = res.address + '(' + res.name + ')'
        that.setData({ address: address, latitude: res.latitude, longitude: res.longitude })
        // that.setData({ address: res.address, latitude: res.latitude, longitude: res.longitude })
        console.log('address:', that.data.address)
      }
    })
  },

//原始代码
  // setField: function (e) {
  //   //console.log(e)
  //   var that = this
  //   var field = e.target.dataset.field
  //   console.log(field)
  //   switch (field) {
  //     case 'store_name':
  //       that.data.store_name = e.detail.value
  //       break
  //     case 'store_introduce':
  //       that.data.store_introduce = e.detail.value
  //       break
  //     case 'address':
  //       that.data.address = e.detail.value
  //       break
  //     case 'store_business':
  //       that.data.store_business = e.detail.value
  //       break
  //     case 'store_contact':
  //       that.data.store_contact = e.detail.value
  //       break
  //     case 'store_owner':
  //       that.data.store_owner = e.detail.value
  //       break
  //   }
  // },


  //修改后
  setField: function (e) {
    //console.log(e)
    var that = this
    var field = e.target.dataset.field
    console.log(field) 
    that.data.store_name = e.detail.value  
  },

//原始代码
  // choosePic:function (e){
  //   console.log('选择图片：',e)

  //   var field = e.currentTarget.dataset.field
  //   var that = this
  //   wx.chooseImage({
  //     count: 1, // 默认9
  //     sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
  //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
  //     success: function (res) {
  //       var src = res.tempFilePaths[0]
  //       console.log('chooseImage-res:',res)
  //       wx.compressImage({
  //         src: src, // 图片路径
  //         quality: 80, // 压缩质量
  //         complete: function (){
  //           wx.showLoading({
  //             title: '正在上传...',
  //           })

  //           wx.uploadFile({
  //             url: app.util.url('entry/wxapp/uploadTempPic'),
  //             filePath: src,
  //             name: 'pic',
  //             header: {
  //               'content-type': 'multipart/form-data' // 默认值
  //             },
  //             formData: {
  //               'card_id': that.data.card_id
  //             },
  //             success: function (res) {
  //               wx.hideLoading()

  //               console.log(res)
  //               res = JSON.parse(res.data)
  //               if (res.errno == 0) {
                
  //                   that.setData({ store_logo: res.data.path })

  //               } else {
  //                 wx.showToast({
  //                   title: res.message,
  //                   icon: 'none',
  //                   duration: 2000
  //                 })

  //               }

                


  //             }

  //           })



  //         }
  //       })

  //     }
  //   })

  // },

  



  //修改后
  choosePic: function (e) {
    var field = e.currentTarget.dataset.field
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var src = res.tempFilePaths[0]
        //wx.compressImage(Object object) 基础库 2.4.0 开始支持，低版本需做兼容处理。
        if (wx.compressImage) {
            wx.compressImage({
              src: src, // 图片路径
              quality: 80, // 压缩质量
              complete: function () {
                wx.showLoading({
                  title: '正在上传...',
                })

                wx.uploadFile({
                  url: app.util.url('entry/wxapp/uploadTempPic'),
                  filePath: src,
                  name: 'pic',
                  header: {
                    'content-type': 'multipart/form-data' // 默认值
                  },
                  formData: {
                    'card_id': that.data.card_id
                  },
                  success: function (res) {
                    wx.hideLoading()

                    console.log(res)
                    res = JSON.parse(res.data)
                    if (res.errno == 0) {

                      that.setData({ store_logo: res.data.path })

                    } else {
                      wx.showToast({
                        title: res.message,
                        icon: 'none',
                        duration: 2000
                      })

                    }




                  }

                })



              }
            })
        } else {
          wx.showModal({
            title: '提示',
            content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
          })
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
    this.getStoreInfo(function () {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  
})