// super_card/pages/group-modify/group-modify.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    group_id: 0,
    name: '',
    card_id: 0,
    type_id: 0,
    anyone_request: 0,
    allow_collect: 1,
    allow_mall: 1,
    allow_website: 1,
    allow_dynamic: 1,
    note: '',


    groupTypes: {},
    typeVal: '',
    card: {},
    userCards: [],
    cardPickerShow: { visible: false, animateCss: 'wux-animate--fade-out' },
    card_id_copy: 0,

    mType_id: [],
  },

  //取消创建或修改名片组
  navBack: function () {
    wx.switchTab({
      url: '../../pages/index/index'
    })
  },

  //选择名片处理
  cardChange: function (e) {

    this.setData({ card_id: e.detail.value })
  },

  //确认名片选择
  openCardSelect: function () {

    this.data.card_id_copy = this.data.card_id
    this.toggleCardPicker()

  },

  //确认名片选择
  confirmCardSelect: function () {

    if (this.data.card_id_copy !== this.data.card_id) {
      for (var x in this.data.userCards) {
        if (this.data.userCards[x].id == this.data.card_id)
          this.setData({ card: this.data.userCards[x] })
      }
    }
    this.toggleCardPicker()

  },

  //确认名片选择
  cancelCardSelect: function () {

    this.setData({ card_id: this.data.card_id_copy })
    this.toggleCardPicker()

  },


  //显示/隐藏名片选择器
  toggleCardPicker: function () {
    this.data.cardPickerShow = this.data.cardPickerShow.visible === true ? { visible: false, animateCss: 'wux-animate--fade-out' } : { visible: true, animateCss: 'wux-animate--fade-in' }
    this.setData({ cardPickerShow: this.data.cardPickerShow })
  },



  //设置是否允许收藏
  collectChange: function (e) {
    this.setData({ allow_collect: e.detail.value })
  },

  //设置是否共用管理员商城
  mallChange: function (e) {
    this.setData({ allow_mall: e.detail.value })
  },

  //设置是否共用管理员官网
  websiteChange: function (e) {
    this.setData({ allow_website: e.detail.value })
  },

  //设置是否共用管理员动态
  dynamicChange: function (e) {
    this.setData({ allow_dynamic: e.detail.value })
  },

  //设置是否仅管理员可邀请新成员
  requestChange: function (e) {
    this.setData({ anyone_request: e.detail.value })
  },

  //设置名称
  setGroupName: function (e) {
    this.setData({ name: e.detail.value })
  },

  //设置备注
  setGroupNote: function (e) {

    this.setData({ note: e.detail.value })
  },

  //保存名片组信息
  saveGroup: function () {

    var name = this.data.name
    if (!name) {
      wx.showToast({
        title: '名称不能为空',
        icon: 'none'
      })
      return false
    }
    if (name.length < 4 || name.length > 30) {
      wx.showToast({
        title: '名称字数不合法',
        icon: 'none'
      })
      return false
    }
    var card_id = this.data.card_id
    if (!card_id) {
      wx.showToast({
        title: '请选择名片',
        icon: 'none'
      })
      return false
    }

    var type_id = this.data.type_id
    var group_id = this.data.group_id
    var anyone_request = this.data.anyone_request
    var allow_collect = this.data.allow_collect
    var allow_mall = this.data.allow_mall
    var allow_website = this.data.allow_website
    var allow_dynamic = this.data.allow_dynamic
    var note = encodeURIComponent(this.data.note)

    var that = this
    app.util.request({
      'url': 'entry/wxapp/saveGroup',
      'method': 'POST',
      'data': { group_id: group_id, name: name, card_id: card_id, type_id: type_id, anyone_request: anyone_request, allow_collect: allow_collect, allow_mall: allow_mall, allow_website: allow_website, allow_dynamic: allow_dynamic, note: note },
      success(res) {

        console.log('success-res', res)

        // var pages = getCurrentPages();
        // var prevPage = pages[pages.length - 2]; // 上一级页
        // prevPage.setData({ isFresh: true })

        wx.showToast({
          title: res.data.message,
          icon: 'success',
          duration: 2000
        })
        setTimeout(function () {
          wx.switchTab({
            url: '../../pages/index/index'
          })
        }, 2000);
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options', options)
    var that = this
    var typeVal = false
    typeVal = options.type_id == 7 ? '五人推广组' : '十人推广组'
    that.setData({ type_id: options.type_id, typeVal: typeVal })

      wx.setNavigationBarTitle({ title: '创建推广组' });
      app.util.request({
        'url': 'entry/wxapp/getUserCard',
        'data': { 'no_need_whole': 1 },
        success(res) {

          if (res.data.data.length < 1) {
            wx.showToast({
              title: '请先创建名片',
              icon: 'none'
            })
            wx.navigateBack()
            return false
          }

          that.setData({ userCards: res.data.data, card: res.data.data[0], card_id: res.data.data[0].id })

        }
      })
    
    that.getCardGroups()
    that.getGroupType()

  },

  //判断是否已经选过了五人或者十人组的类别
  getCardGroups: function () {
    var that = this
    app.util.request({
      'url': 'entry/wxapp/getCardGroups',
      success(res) {
        var data = res.data.data
        for (var i = 0; i < data.length; i++) {
          var mType_id = data[i].type_id
          that.data.mType_id.push(mType_id)
        }
        that.setData({
          mType_id: that.data.mType_id
        })
      }
    })
  },


  //获取名片组类型
  getGroupType: function () {
    var that = this
    app.util.request({
      'url': 'entry/wxapp/getGroupType',
      'method': 'POST',
      success(res) {
        that.data.groupTypes = res.data.data
        console.log(' this.data.groupTypes', that.data.groupTypes)

        if (that.data.type_id > 0)
          for (var x in that.data.groupTypes) {
            if (that.data.groupTypes[x].id == that.data.type_id)
              that.setData({ typeVal: that.data.groupTypes[x].name })
          }

      }

    })

  },

  //显示类型选择
  showTypeSelect: function () {
    var types = []
    var typeIds = []
    for (var x in this.data.groupTypes) {
      if (x > 5) break
      types.push(this.data.groupTypes[x].name)
      typeIds.push(this.data.groupTypes[x].id)
    }
    var that = this
    wx.showActionSheet({
      itemList: types,
      success: function (res) {

        //判断是否已经创建过了五人或者十人的营销群组
        var mType_id = that.data.mType_id
        if (mType_id.length > 0) {
          for (var i = 0; i < mType_id.length; i++) {
            if (mType_id[i] == 7 || mType_id[i] == 8) {
              if (typeIds[res.tapIndex] == 7 || typeIds[res.tapIndex] == 8) {
                wx.showModal({
                  title: '系统提示',
                  content: '您已创建了营销群组，不可重复创建!',
                  showCancel: false,
                  confirmColor: '#f90',
                  confirmText: '知道了',
                  success: function (res) {
                    console.log('知道了')
                  }
                });
                return
              }
            }
          }
        }

        that.setData({ typeVal: types[res.tapIndex], type_id: typeIds[res.tapIndex] })
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