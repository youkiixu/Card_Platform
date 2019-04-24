// super_card/pages/group-request/group-request.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    group_id: 0,
    group: {},
    groupTypes: [],
    card_id: 0,

    userCards: [],
    cardPickerShow: { visible: false, animateCss: 'wux-animate--fade-out' },

    uid:0,

    from_act : 'request',
    showBackIndex: true,
    chooseCards:{},
  },

  //返回首页
  backIndex: function () {
    wx.switchTab({
      url: '../index/index',
    });
  },

  //选择名片处理
  cardChange: function (e) {
    var card_id = e.detail.value
    console.log('名片选择card_id:', this.data.card_id)
    console.log('名片选择userCards:', this.data.userCards)
    var userCards = this.data.userCards
    for (var i = 0; i < userCards.length; i++) {
      if (card_id == userCards[i].id) {
        var chooseCards = userCards[i]
      }
    }

    this.setData({ card_id: e.detail.value, chooseCards: chooseCards })
  },


  //确认名片选择
  confirmCardSelect: function () {
    var that = this
    //判断该名片是否已经加入过营销群组
    var chooseCards = that.data.chooseCards
    if (chooseCards.dynamic == 1 && chooseCards.store == 1 && chooseCards.website == 1) {
      wx.showModal({
        title: '系统提示',
        content: '该名片已经存在于推广组，不可重复加入',
        showCancel: false,
        confirmText: '知道了'
      })
    } else {
      that.toggleCardPicker()
      app.util.request({
        'url': 'entry/wxapp/joinCardGroup',
        'data': { group_id: that.data.group_id, card_id: that.data.card_id },
        success(res) {

          wx.showToast({
            title: res.data.message,
            icon: 'success'
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '../group/group',
            })
          }, 2000)

        }
      })
    }
    
  },

  noWantJoin: function () {

    wx.reLaunch({
      url: '../index/index',
    })

  },

  //检查用户是否有创建名片，如果没有提示创建
  checkUserIsCreate: function (act) {

    if (this.data.userCards.length < 1) {
      wx.showModal({
        title: '系统提示',
        content: '您还没有创建名片，只有创建名片后才可以' + (act ? act : '操作') + '哦',
        showCancel: false,
        confirmColor: '#00a1e9',
        confirmText: '去创建',
        success: function (res) {
          wx.navigateTo({
            url: '../basic/basic',
          })
        }
      });
      return false
    }
    return true
  },

  //显示/隐藏名片选择器
  toggleCardPicker: function () {

    if(this.checkUserIsCreate('加入该名片组') === false) return

    this.data.cardPickerShow = this.data.cardPickerShow.visible === true ? { visible: false, animateCss: 'wux-animate--fade-out' } : { visible: true, animateCss: 'wux-animate--fade-in' }
    this.setData({ cardPickerShow: this.data.cardPickerShow })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options',options)
    var that = this

    if(options.group_id < 1){
       wx.navigateBack()
       return
    }
    that.setData({ group_id: options.group_id })

    //获取当前用户ID
    app.util.getUserInfo(function (response) {
      
        //console.log(response)
        that.setData({ uid: response.memberInfo.uid })
      
        app.util.request({
          'url': 'entry/wxapp/checkIsUserInGroup',
          'data': { group_id: that.data.group_id},
          success(res) {

            if (res.data.data === true){
              wx.redirectTo({
                url: '../group-manage/group-manage?group_id=' + that.data.group_id + '&from_act=' + that.data.from_act,
              })
              return false
            }

            app.util.request({
              'url': 'entry/wxapp/getGroupCards',
              'data': { group_id: that.data.group_id},
              success(res) {

            //console.log(res)
                var data = res.data.data
                data.card_list[0].mobile = data.card_list[0].mobile.substr(0, 3)
                data.icons = data.card_list.slice(0, 9)
                var len = data.icons.length
                if (len < 9)
                  for (var i = len; i < 9; i++)
                    data.icons.push({ picture: 'no' })

                that.setData({ group_id: data.id, group: data })
                that.getGroupType()
              
                app.util.request({
                  'url': 'entry/wxapp/getUserCard',
                  'data': { 'no_need_whole': 1 },
                  success(res) {

                    if (res.data.data.length < 1) {
                      wx.showModal({
                        title: '系统提示',
                        content: '请先创建名片',
                        showCancel: false,
                        confirmColor: '#f90',
                        confirmText: '知道了',
                        success: function (res) {
                          wx.switchTab({
                            url: '../index/index',
                          })
                        }
                      });
                      return
                      // wx.showToast({
                      //   title: '请先创建名片',
                      //   icon: 'none',
                      // })
                      // wx.navigateBack()
                      // return false
                    }
                    that.setData({ userCards: res.data.data, card_id: res.data.data[0].id })
                  }
                })
              }  
            })
          }  
        })
      })
    },


      //获取名片组类型
  getGroupType: function () {
        var that = this
        app.util.request({
          'url': 'entry/wxapp/getGroupType',
          'method': 'POST',
          success(res) {

            //console.log(res)
            that.data.groupTypes = res.data.data
            that.setData({ groupTypes: that.data.groupTypes })

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
    var that = this
    app.config.init(function () {
      app.config.set(that)
    })
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

})