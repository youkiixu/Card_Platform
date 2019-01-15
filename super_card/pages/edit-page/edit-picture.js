// super_card/pages/edit-picture/edit-picture.js
var app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:0,
    type: '',

    pics:[],

    num: 0,
    total:0,

    dis:false,
    is_edit: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    if (typeof options.type == 'undefined' || typeof options.index == 'undefined') {
      wx.navigateBack()
      return
    }
    that.setData({ type:  options.type })
    that.data.index = options.index

   
    var pages = getCurrentPages();
    that.data.prevPage = pages[pages.length - 2]; // 上一级页

    if (that.data.type == 'pic')
      that.setData({ total: 1 })
    else if(that.data.type == 'grid_pic')
      that.setData({ total: 8 })
    else
      that.setData({ total: 9 })

    //console.log(options.is_edit)
    if (typeof options.is_edit != 'undefined') {
      that.data.is_edit = options.is_edit
      //console.log(that.data.index)
      var obj = that.data.prevPage.data.pageData[that.data.index]

      if(typeof obj.val == 'string')
        that.setData({ pics: [obj.val] })
      else
        that.setData({ pics: obj.val })
    }

  },

  editPic: function (e){

    var index = e.currentTarget.dataset.index
    console.log(index)
    console.log(this.data.pics[index])
    wx.navigateTo({
      url: '../pic-cropper/index?path=' + this.data.pics[index] + '&pindex=' + index,
    })
  },

  removePic: function (e) {
    var index = e.target.dataset.index
    this.data.pics.splice(index, 1)
    this.setData({ pics: this.data.pics })
  },


  uploadPostPic: function () {

    var that = this

    var pics = []
    wx.chooseImage({
      count: that.data.total, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        //console.log(res)

        var imgsrc = res.tempFilePaths
        pics = pics.concat(imgsrc);
        that.uploadimg({
          url: app.util.url('entry/wxapp/uploadTempPic'),
          path: pics
        });

      }
    })
  },

  //图片队列上传
  uploadimg: function (data) {

    var that = this,
      i = data.i ? data.i : 0,//当前上传的哪张图片
      success = data.success ? data.success : 0,//上传成功的个数
      fail = data.fail ? data.fail : 0;//上传失败的个数

    /*var formData = {
      card_id: that.data.card_id,
      album_id: that.data.album_id,
    }*/

    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'pic',//这里根据自己的实际情况改
      header: {
        'content-type': 'multipart/form-data' // 默认值
      },
      //formData: formData,//这里是上传图片时一起上传的数据
      success: (res) => {

        console.log(res)

        res = JSON.parse(res.data)

        if (res.errno) {

          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 3000
          })
          return

        } else {

          //var album_id = parseInt(res.data.album_id)

          //if (album_id > 0) that.setData({ album_id: album_id })

          //delete res.data.album_id
          console.log(res.data)
          that.data.pics.push(res.data.path)
          that.setData({ pics: that.data.pics })

        }

      },
      fail: (res) => {
        //图片上传失败，图片上传失败的变量+1
        fail++
        //console.log('fail:' + i + "fail:" + fail)
      },
      complete: () => {

        //console.log(i);
        i++;//这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) {   //当图片传完时，停止调用          

          //this.queryMultipleNodes()
          console.log('上传完毕');
          //console.log('成功：' + success + " 失败：" + fail);
          wx.showToast({
            title: '上传成功',
            icon: 'success',
          })
          /*app.freshIndex = true
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2]; // 上一级页
          prevPage.setData({ isFresh: true })*/

        } else {//若图片还没有传完，则继续调用函数
          //console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);

        }

      }
    });
  },

  savePageData: function (e) {

    if (typeof e.detail.formId != 'undefined') {
      console.log(e.detail.formId)
      app.formIds.push(e.detail.formId)
    }

    var that = this
    if(that.data.pics.length < 1) return

    var obj = { type: that.data.type, val: that.data.pics }

    if (that.data.is_edit !== false)
      that.data.prevPage.updatePageData(that.data.index, obj)
    else
      that.data.prevPage.addPageData(that.data.index, obj)

    wx.navigateBack()

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