// super_card/pagess/spread/spread.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        memberInfo: '',
        qrPic: '',
        screenWidth: '',
        winHeight: '',
        ratio: '',
        qrPicUrl:'',
        shareImgPath: '',
        hiddenImg: false
    },



    //刷新二维码
    freshQrcode: function (cb) {

        var that = this

        app.util.getUserInfo(function (res) {
            var memberInfo = res.memberInfo
            that.setData({
                memberInfo: memberInfo
            })
            that.getAgentQrcode()
            typeof cb == "function" && cb()

        });

    },
    getAgentQrcode: function () {
        var that = this
        app.util.request({
            'url': 'entry/wxapp/getAgentCode',
            //'cachetime': '30',
            success(res) {
                that.setData({
                    qrPic: res.data.data
                })
              wx.setStorageSync('qrPic', that.data.qrPic);
              
            }
        })

    },

    downImage() {
      var that = this
      if (!that.data.shareImgPath) return
        wx.getImageInfo({
          src: this.data.shareImgPath,
            success(res) {
                wx.saveImageToPhotosAlbum({
                    filePath: res.path,
                    success(res) {
                        wx.showToast({
                            title: '保存至相册成功',
                            icon: 'success'
                        })
                    },
                    fail(err) {
                        wx.showToast({
                            title: '保存失败',
                            icon: 'error'
                        })
                    }
                })
            },

        })
    },

    savePosterPic: function () {
        var that = this
        wx.getSetting({
            success(res) {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                        scope: "scope.writePhotosAlbum",
                        success(res) {
                            that.downImage()
                        },
                        fail(err) {
                            wx.showModal({
                                title: '系统提示',
                                content: '保存二维码到本地需要授权，点击确定获取授权。',
                                confirmText: '去授权',
                                cancelText: '取消',
                                success: function (res) {
                                    if(res.confirm) {
                                        wx.openSetting({
                                            success(res) {
                                                that.savePosterPic()
                                            }
                                        })
                                    } else {
                                        
                                    }
                                }
                            })
                            
                        }
                    })
                }else{
                    that.downImage()
                }

            }
        })
    },

    backPage: function () {
        wx.navigateBack()
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        this.freshQrcode()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

      //画布

      var that = this

      //获取用户设备信息，屏幕宽度
      wx.getSystemInfo({
        success(res) {
          that.setData({
            screenWidth: res.screenWidth,
            winHeight: res.windowHeight,
            ratio: res.pixelRatio
          })

        }
      }) 
      //读取缓存
      var qrPic = wx.getStorageSync('qrPic');

      // 由于canvas不能使用网络图片，所以此处进行头像临时路径存储，下载文件下来
          wx.downloadFile({
            url: qrPic,
            success(res) {

              that.setData({
                qrPicUrl: res.tempFilePath,
              })

              var unit = that.data.screenWidth / 375;
              var ratio = that.data.ratio;
              var screenWidth = that.data.screenWidth;
              var winHeight = that.data.winHeight;
              var qrPicUrl = that.data.qrPicUrl;

              // 使用 wx.createContext 获取绘图上下文 context
              const context = wx.createCanvasContext('canvas')

              context.setFontSize(20)
              context.setFillStyle('#000')
              context.setTextAlign('center')
              context.fillText('商桥智能名片VIP', unit * 130, unit * 50)
              context.drawImage(qrPicUrl, unit * 20, unit * 80, unit * 454 / 2, unit * 454 / 2)
              context.setFontSize(15)
              context.setFillStyle('#515151')
              context.setTextAlign('center')
              context.fillText('扫一扫二维码图案，即可开通会员！', unit * 140, unit * 350)

              //把画板内容绘制成图片，并回调 画板图片路径
              context.draw(false, function () {
                wx.canvasToTempFilePath({
                  x: 0,
                  y: 0,
                  width: screenWidth,
                  height: winHeight,
                  destWidth: ratio * screenWidth,
                  destHeight: ratio * winHeight,
                  canvasId: 'canvas',
                  quality: 1,
                  success: function (res) {
                    that.setData({
                      shareImgPath: res.tempFilePath,
                      hiddenImg: false
                    })
                    if (!res.tempFilePath) {
                      wx.showModal({
                        title: '提示',
                        content: '图片绘制中，请稍后重试',
                        showCancel: false
                      })
                    }
                    wx.hideLoading()

                  }

                })
              });
            },
          });

  },


    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

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
        this.freshQrcode(function () {
            wx.stopPullDownRefresh();
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
        var that = this;
        // var memberInfo = that.data.memberInfo; 

        // var title = '您好，"' + memberInfo.nickname + '" 推荐您开通会员'
        // var path = '/super_card/pages/open-membership/open-membership?agent_id=' + memberInfo.uid
        // var imgUrl = ''


        // return {
        //     title: title,
        //     path: path,
        //     imageUrl: imgUrl
        // }

    }


})