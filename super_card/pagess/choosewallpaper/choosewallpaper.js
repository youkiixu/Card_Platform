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

    category: [
      { id: 1, name: "励志" },
      { id: 2, name: "推广" },
      { id: 3, name: "自定义" }
    ],
    activeCategoryId: 1,

    allInfo: [],

    pic:'',

  },


  // 点击分类标题切换
  tabClick: function (e) {
    var id = e.target.dataset.id
    this.setData({
      activeCategoryId: id,
      itemChioce: id
    });
    this.getWallpaper()
  },

  chooseWallpaper:function(e){
    var id = e.currentTarget.dataset.ii
    // var allInfo = this.data.allInfo
    // var picPath = allInfo[id].path
  
    // var pages = getCurrentPages();
    // // var Page = pages[pages.length - 1];//当前页
    // var prevPage = pages[pages.length - 2];  //上一个页面
    // //var info = prevPage.data //取上页data里的数据也可以修改
    // prevPage.setData({ bgimg: picPath })//设置数据
    // setTimeout(function () {
    //   wx.navigateBack()
    // }, 2000)
      
  },

  /**
  * 上传自定义图片
  */
  uploadAlbumPic: function () {

    var that = this
    var pics = []
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log('chooseImage-res',res)
        var tempFilePaths = res.tempFilePaths[0]
        console.log('tempFilePaths：', tempFilePaths)
        // wx.uploadFile({
        //   url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
        //   filePath: tempFilePaths,
        //   name: 'pic',//这里根据自己的实际情况改
        //   formData: {
        //     user: 'test'
        //   },
        //   success(res) {
        //     var data = res.data
        //     that.data.pics.push(data)
        //     console.log('uploadFile-res',res)
        //   }
        // })

      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWallpaper()
    var agentGrade = app.config.getConf('agent_grade')
    this.setData({ agent_grade: agentGrade })
  },



  // 全部列表
  getWallpaper: function (isload) {
    var that = this;
    var data = {
      page: that.data.page,
      type: that.data.itemChioce
    }
    app.util.request({
      'url': 'entry/wxapp/getAgentTeam',
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