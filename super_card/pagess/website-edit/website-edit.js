// super_card/pages/website-edit/website-edit.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mallselected: 1,
    showMode:false,

    have_website: false,

    card_id: 0,

    website_name: '',
    website_logo: '',
    company_name: '',
    contact: '',
    owner: '',
    banner: '',

    pageData: [],
    card:{},

    type: '',
    index: 0
  },

  createCardWebsite: function (e){

    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }

    var that = this
    if(!that.data.website_name){
      wx.showToast({
        title: '请输入官网名称',
        icon: 'none'
      })
      return
    }

    if (that.data.website_name.length < 2 || that.data.website_name.length > 16) {
      wx.showToast({
        title: '官网名称长度应该在2至16个字符之内',
        icon: 'none'
      })
      return
    }


    if (!that.data.website_logo) {
      wx.showToast({
        title: '请上传官网logo',
        icon: 'none'
      })
      return
    }
//修改start
    // if (!that.data.company_name) {
    //   wx.showToast({
    //     title: '请输入公司名称',
    //     icon: 'none'
    //   })
    //   return
    // }

    // if(that.data.company_name.length < 4 || that.data.company_name.length > 16) {
    //   wx.showToast({
    //     title: '公司名称长度应该在4至16个字符之内',
    //     icon: 'none'
    //   })
    //   return
    // }

    // if (!that.data.contact) {
    //   wx.showToast({
    //     title: '请输入联系方式',
    //     icon: 'none'
    //   })
    //   return
    // }

    // var myreg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    // if (!myreg.test(that.data.contact)) {
    //   wx.showToast({
    //     title: '请输入正确的联系方式(手机号)',
    //     icon: 'none',
    //   })
    //   return
    // }

    // if (!that.data.owner) {
    //   wx.showToast({
    //     title: '请输入官网所有者',
    //     icon: 'none'
    //   })
    //   return
    // }
    // if (that.data.owner.length < 2 || that.data.owner.length > 8) {
    //   wx.showToast({
    //     title: '官网所有者长度应该在2至8个字符之内',
    //     icon: 'none'
    //   })
    //   return
    // }

    //修改end

    if (!that.data.banner) {
      wx.showToast({
        title: '请上传官网banner图',
        icon: 'none'
      })
      return
    }

    // var data = {
    //     card_id : that.data.card_id,
    //     website_name: that.data.website_name,
    //     website_logo: that.data.website_logo,
    //     company_name: that.data.company_name,
    //     contact: that.data.contact,
    //     owner: that.data.owner,
    //     banner: that.data.banner,
    //     pageData: JSON.stringify(that.data.pageData)
    // }

    var data = {
      card_id: that.data.card_id,
      website_name: that.data.website_name,
      website_logo: that.data.website_logo,
      company_name: '',
      contact: '',
      owner: '',
      banner: that.data.banner,
      pageData: JSON.stringify(that.data.pageData)
    }
    
    app.util.request({
      'url': 'entry/wxapp/saveCardWebsite',
      'mothod': 'POST',
      'data': data,
      success(res) {


        if(that.data.have_website === false){
          wx.showToast({
            title: '创建成功',
          })
          that.setData({ have_website: true, mallselected: 2,
            website_name: data.website_name,
            website_logo: data.website_logo,
            company_name: data.company_name,
            contact: data.contact,
            owner: data.owner,
            banner: data.banner
          })
        }else{
          wx.showToast({
            title: '保存成功',
          })
        }



      }
    })

  },


  setField: function (e){
    //console.log(e)
    var that = this
    var field = e.target.dataset.field
    console.log(field)
    switch(field){
      case 'website_name':
        that.data.website_name = e.detail.value
        break
      case 'company_name':
        that.data.company_name = e.detail.value
        break
      case 'contact':
        that.data.contact = e.detail.value
        break
      case 'owner':
        that.data.owner = e.detail.value
        break
    }
  },

  // choosePic:function (e){
  //   var field = e.currentTarget.dataset.field
  //   var that = this
  //   wx.chooseImage({
  //     count: 1, // 默认9
  //     sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
  //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
  //     success: function (res) {
  //       var src = res.tempFilePaths[0]
  //       wx.compressImage({
  //         src: src, // 图片路径
  //         quality: 80, // 压缩质量
  //         complete: function (){

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

  //               console.log(res)
  //               res = JSON.parse(res.data)
  //               if (res.errno == 0) {
                  
  //                 if(field == 'banner')
  //                   that.setData({ banner: res.data.path })
  //                 else
  //                   that.setData({ website_logo: res.data.path })

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
                    console.log(res)
                    res = JSON.parse(res.data)
                    if (res.errno == 0) {
                      if (field == 'banner')
                        that.setData({ banner: res.data.path })
                      else
                        that.setData({ website_logo: res.data.path })
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



  //隐藏选择图片展示方式
  delDmb:function(){
    this.setData({showMode:false})
  },

  //跳转上传图片页面
  goChoicePicture: function (e) {
    var that = this
    that.delDmb()
    that.data.type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '../edit-page/edit-picture?type=' + that.data.type + '&index=' + that.data.index,
    })
  },

  delPageData: function(e){
    //console.log(e)
    var index = e.currentTarget.dataset.index
    this.data.pageData.splice(index, 1)
    this.setData({ pageData: this.data.pageData })
  },

  moveList:function(e){
    console.log(e)
    var that = this
    var index = e.currentTarget.dataset.index
    if(index == 0){
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
    }else if((that.data.pageData.length - 1) ==  index){
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
    }else{

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

  jumpList:function(e){
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
              url: '../edit-page/edit-text?index='+ index +'&type=title'
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

  editPageData:function (e){
    var that = this
    var index = e.currentTarget.dataset.index
    var type = that.data.pageData[index].type
    switch(type){
        case 'title':
          wx.navigateTo({
            url: '../edit-page/edit-text?index=' + index + '&type=' + type +'&is_edit=1'
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

  addPageData:function (index, obj){
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

        var obj = {type: 'map', val: { title: res.address, latitude: res.latitude, longitude: res.longitude }}
        if(is_edit === true)
          that.updatePageData(index, obj)
        else
          that.addPageData(index, obj)
      }
    })
  },

  //切换站点设置
  mallBasic: function () {
    var that = this
    if (that.data.mallselected == 1) return
    that.setData({
      mallselected: 1
    })
  },
  //切换编辑内容
  mallShop: function () {
    var that = this
    if(that.data.have_website === false){
      wx.showToast({
        title: '请先设置站点基本信息',
        icon: 'none'
      })
      return
    }
    if (that.data.mallselected == 2) return
    that.setData({
      mallselected: 2
    })
  },

  toPreviewWebsite:function (e) {

    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }
    wx.navigateTo({
      url: '../../pages/overt/website?card_id=' + this.data.card_id,
    })

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    if (typeof options.card_id == 'undefiend'){
      wx.navigateBack()
      return
    }

    that.setData({ card_id: options.card_id })


    //判断是否为会员，非会员不能开通官网
    var getUserInfo = wx.getStorageSync('getUserInfo'); 
    var isVip = getUserInfo.vip;
    
    if (isVip == 0) {
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

    //获取官网信息
    that.getWebSite()

   // that.getUserInfo()
  },

  getUserInfo: function () {
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
        } else {

          that.getWebSite()

        }

      }
    })
  },


  getWebSite: function (callback){
    var that = this
    app.util.request({
      'url': 'entry/wxapp/getCardWebsite',
      'data': { card_id: that.data.card_id },
      success(res) {
        
        typeof callback === `function` && callback()

        console.log(res)
        var data = res.data.data

        if (data === false)
          that.setData({ have_website: false })
        else
          that.setData({
            have_website: true,
            website_name: data.website.website_name,
            website_logo: data.website.website_logo,
            company_name: data.website.company_name,
            contact: data.website.contact,
            owner: data.website.owner,
            banner: data.website.banner,
            pageData: data.website.data ? data.website.data : [],
            card: data.card
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
    this.getWebSite(function () {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

 
})