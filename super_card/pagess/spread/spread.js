// super_card/pagess/spread/spread.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        memberInfo: '',
        qrPic: ''
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

            }
        })

    },

    downImage() {
        var that = this
        if (!that.data.qrPic) return
        wx.getImageInfo({
            src: this.data.qrPic,
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