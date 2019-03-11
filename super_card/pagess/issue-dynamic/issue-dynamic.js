// super_card/pages/issue-dynamic/issue-dynamic.js
var app = getApp()
var QQMapWX = require('../../resource/js/qqmap-wx-jssdk.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    card_id:0,
    info:'',

    province: '',
    city: '',
    dict: '',
    address: '',
    latitude: 0,
    longitude: 0,

    pics: [],

  },

  //发布动态
  publicationDynamics:function(){
    var that = this
    var address = that.data.province + that.data.city + that.data.dict + that.data.address 
    console.log(that.data.pics)

    if (that.data.info.length == 0) {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    if (that.data.info.length < 10) {
      wx.showToast({
        title: '内容不能少于10字符',
        icon: 'none',
        duration: 2000
      })
      return false
    }

    app.util.request({
      'url':'entry/wxapp/publicationDynamics',
      'method':'post',
      'data': { card_id: that.data.card_id, content: that.data.info, latitude: that.data.latitude, longitude: that.data.longitude,address:address,pics:that.data.pics},
      success(res){
        console.log(res)
        app.freshIndex = true
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; // 上一级页
        prevPage.setData({ isFresh: true })

        //var album = res.data.data

        wx.showToast({
          title: res.data.message,
          icon: 'success',
          duration: 2000
        })
        setTimeout(function () {
          wx.navigateBack()
        }, 2000)
      }
    })

  },

  //删除相片
  removePic: function (e) {
    var index = e.target.dataset.index
    this.data.pics.splice(index, 1)
    this.setData({ pics: this.data.pics })
    console.log(this.data.pics)
  },

  /**
   * 上传图片
   */
  uploadAlbumPic: function () {

    var that = this
    var pics = []
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)
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

  //文字内容
  recordfollow: function (e) {
    console.log(e)
    this.data.info = e.detail.value
  },

  //选择地址信息
  getCurrentLocation: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        //console.log(res)
        var regex = /^(北京市|天津市|重庆市|上海市|香港特别行政区|澳门特别行政区)/;
        var REGION_PROVINCE = [];
        var addressBean = {
          REGION_PROVINCE: null,
          REGION_COUNTRY: null,
          REGION_CITY: null,
          ADDRESS: null
        };
        function regexAddressBean(address, addressBean) {
          regex = /^(.*?[市州]|.*?地区|.*?特别行政区)(.*?[市区县])(.*?)$/g;
          var addxress = regex.exec(address);
          addressBean.REGION_CITY = addxress[1];
          addressBean.REGION_COUNTRY = addxress[2];
          addressBean.ADDRESS = addxress[3] + "(" + res.name + ")";
          //console.log(addxress);
        }
        if (!(REGION_PROVINCE = regex.exec(res.address))) {
          regex = /^(.*?(省|自治区))(.*?)$/;
          REGION_PROVINCE = regex.exec(res.address);
          addressBean.REGION_PROVINCE = REGION_PROVINCE[1];
          regexAddressBean(REGION_PROVINCE[3], addressBean);
        } else {
          addressBean.REGION_PROVINCE = REGION_PROVINCE[1];
          regexAddressBean(res.address, addressBean);
        }
        that.setData({ province: addressBean.REGION_PROVINCE, city: addressBean.REGION_CITY, dict: addressBean.REGION_COUNTRY, address: addressBean.ADDRESS, latitude: res.latitude, longitude: res.longitude })
        console.log(addressBean);
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (!options.card_id) {
      return false
    }
    that.setData({ card_id: options.card_id })
    console.log(that.data.card_id)

    var qqmapsdk = new QQMapWX({
      key: app.config.getConf('tencent_map_key') // 必填
    });
    //1、获取当前位置坐标
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (addressRes) {
            console.log(addressRes)
            //var address = addressRes.result.formatted_addresses.recommend;
            var address = addressRes.result.address
            that.setData({
              address: address,
              latitude: latitude,
              longitude: longitude
            })

          }
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})