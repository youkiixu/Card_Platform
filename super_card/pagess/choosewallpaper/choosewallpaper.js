// super_card/pagess/team/team.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemChioce: 1,
    page: 1,
    lastPage: false,

    show_goTop: false,

    category: [],
    activeCategoryId: 1,

    allInfo: [],

  },


  // 点击分类标题切换
  tabClick: function (e) {
    var id = e.target.dataset.id
    this.setData({
      page: 1,
      activeCategoryId: id,
      itemChioce: id
    });
    this.getWallpaper()
  },

  //删除自定义海报
  delWallpaper:function(e){
    var that = this
    var index = e.currentTarget.dataset.dd
    var id = that.data.allInfo[index].id
    
    wx.showModal({
      title: '提示',
      content: '确认要删除该海报吗？',
      confirmColor: '#f90',
      success(res) {
        if (res.confirm) {
          app.util.request({
            'url': 'entry/wxapp/delWallpaper',
            'mothod': 'GET',
            'data': { id: id },
            success(res) {
              wx.showToast({
                title: res.data.message,
                icon: 'success'
              })
              that.data.allInfo.splice(index, 1)
              that.setData({ allInfo: that.data.allInfo })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
          
        }
      }
    })
  },

  chooseWallpaper:function(e){
    var id = e.currentTarget.dataset.index
    var allInfo = this.data.allInfo
    var picPath = allInfo[id].path
    var wp_id = allInfo[id].id

    var pages = getCurrentPages();
    // var Page = pages[pages.length - 1];//当前页
    var prevPage = pages[pages.length - 2];  //上一个页面
    //var info = prevPage.data //取上页data里的数据也可以修改
    prevPage.setData({ wp_id: wp_id ,bgimg: picPath })//设置数据

    wx.showToast({
      title: '海报选择成功',
      icon: 'success',
      duration: 2000,
      success:function(res){
        wx.navigateBack()
      }
    })
  },

  /**
  * 上传自定义图片
  */
  uploadAlbumPic: function () {
    var that = this

    var iosPay = app.config.iosPay(that)

    //判断是否为会员，非会员不能自定义海报
    var getUserInfo = wx.getStorageSync('getUserInfo');
    var isVip = getUserInfo.vip;
    //判断是否加入了推广组 proGroup == 0,则表示未加入
    var proGroup = wx.getStorageSync('proGroup');

    // if (isVip == 0 && proGroup == 0) {
    //   wx.showModal({
    //     title: '系统提示',
    //     content: iosPay ? '您还不是会员，请先开通会员' : '不可服务',
    //     cancelText: '返回',
    //     confirmColor: '#f90',
    //     confirmText: iosPay ? '去开通' : '知道了',
    //     success: function (res) {
    //       if (res.confirm) {
    //         iosPay ? wx.redirectTo({ url: '../../pages/opt-version/opt-version' }) : wx.navigateBack()
    //       } else if (res.cancel) {
    //         return
    //       }
    //     }
    //   });
    //   return
    // } 

    var length = that.data.allInfo.length
    wx.showModal({
      title: '系统提示',
      content: '您最多只能自定义10张海报，如还需要自定义海报，可删除其他不需要的海报',
      showCancel: false,
      confirmColor: '#f90',
      confirmText: '知道了',
      success(res) {
        return;
      }
    });
    
    // if ((isVip > 0 || proGroup == 1) && length >= 10) {
    //   wx.showModal({
    //     title: '系统提示',
    //     content: '您最多只能自定义10张海报，如还需要自定义海报，可删除其他不需要的海报',
    //     showCancel: false,
    //     confirmColor: '#f90',
    //     confirmText: '知道了',
    //     success(res) {
    //       return;
    //     }
    //   });
    //   return
    // }   
    
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '上传中···',
        })
        var tempFilePaths = res.tempFilePaths[0]
        wx.uploadFile({
          url: app.util.url('entry/wxapp/uploadWallpaper'),
          filePath: tempFilePaths,
          name: 'pic',//这里根据自己的实际情况改
          // formData: {
          //   user: 'test'
          // },
          success(res) {
            var data = JSON.parse(res.data)
            var picInfo = data.data
            that.data.allInfo.push(picInfo)
            that.setData({
              allInfo: that.data.allInfo
            });
            wx.hideLoading()
          },
          fail:function(res){
            console.log('上传失败', res)
          }
        })
      }
    })
  },

  // 海报分类
  getWallpaperCateList: function () {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getWallpaperCateList',
      'method': 'POST',
      success(res) {
        that.setData({
          category: res.data.data
        })
      }
    })
  },


  // 海报数据
  getWallpaper: function (isload) {
    var that = this;
    var data = {
      page: that.data.page,
      cate_id: that.data.itemChioce
    }
    app.util.request({
      'url': 'entry/wxapp/wallPaperLists',
      'method': 'POST',
      'data': data,
      success(res) {
        // if (!res.data.data.length) {
        //   that.data.lastPage = true
        //   return false
        // }

        //isload==true表示是在页面上拉加载的函数里面执行的方法，则不清空数据，继续再原有数据的基础上追加
        if (isload == true) {
          that.data.allInfo = that.data.allInfo.concat(res.data.data)
        } else {
          that.setData({
            allInfo: []
          })
          that.data.allInfo = res.data.data
        }
        that.setData({
          allInfo: that.data.allInfo
        })

      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWallpaperCateList()
    this.getWallpaper()
    var agentGrade = app.config.getConf('agent_grade')
    this.setData({ agent_grade: agentGrade })
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
    this.getWallpaper()
    wx.stopPullDownRefresh() //处理完数据刷新后，wx.stopPullDownRefresh可以停止当前页面的下拉刷新。

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

    that.getWallpaper(true) //传值过去，表示页面上拉加载的就不清空数据

  },

})