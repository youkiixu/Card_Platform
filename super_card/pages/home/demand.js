// super_card/pages/demand/demand.js
import { $wuxDialog } from '../../components/wux'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deleteShow:false,

    lists:[],

    page: 1,
    lastPage: false,

    checked: false,
    
    ids:false,

    selectAllChecked: false,
  },

  /**
   * 查看需求详情
   */
  goLookDetails:function(){
    wx.navigateTo({
      url: '../../pages/details/details'
    })
  },

  /**
   * 显示删除按钮
   */
  goDeletedemand:function(){
    this.setData({ deleteShow: true })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.getMyLists()

  },

  dealWithIds: function (e){
    //console.log(e)
    this.data.ids = e.detail.value
    if(this.data.ids.length == this.data.lists.length)
      this.setData({ selectAllChecked: true })
    else
      this.setData({ selectAllChecked: false })
  },

  selectAll:function (e){
    console.log('e',e)
    var len = e.detail.value.length
    if(len > 0){

      this.setData({ checked: true })
      this.data.ids = []
      for (var x in this.data.lists)
        this.data.ids.push(this.data.lists[x].id)
      
    }else{
      this.setData({ checked: false })
      this.data.ids = false
    }
    console.log(this.data.ids)

  },

  cancelDel: function (){
    this.setData({ checked: false, deleteShow: false, ids: false, selectAllChecked: false })
  },

  deleteChoosen: function (){
    var that = this
    console.log('that.data.ids', that.data.ids)
    if(that.data.ids === false){

      wx.showToast({
        title: '请先选择您要删除的信息',
        icon: 'none'
      })
      return false
    }

    $wuxDialog.confirm({
      title: '',
      content: '您确定要删除吗？',
      onConfirm(e) {
        app.util.request({
          'url': 'entry/wxapp/squareDel',
          'method': 'POST',
          'data': { id: that.data.ids.join(',') },
          success(res) {

            wx.showToast({
              title: res.data.message,
              icon: 'success'
            })
            that.getMyLists()
          }
        })
      },
      onCancel(e) {
        that.setData({ showVideo: true })
      }
    })

  },

  getMyLists: function (cb, mode = 'cover') {

    var that = this
    app.util.request({
      'url': 'entry/wxapp/getUserSquare',
      'method': 'POST',
      'data': { page: this.data.page },
      success(res) {
        typeof cb == "function" && cb()
        //console.log(res)
        if (mode == 'append') {

          if (!res.data.data.length) {
            that.data.lastPage = true
            return false
          }
          //console.log(res.data.data)
          that.data.lists = that.data.lists.concat(res.data.data)
          //console.log(that.data.cardList)
          //if (!that.data.searchKey) that.data.cardListCopy = that.data.cardList

        } else {
          that.data.lists = res.data.data

          //if (!that.data.searchKey) that.data.cardListCopy = res.data.data
        }

        for (var x in that.data.lists) {
          that.data.lists[x].label = that.data.lists[x].label.split(',')
        }
        that.setData({
          lists: that.data.lists,
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

  onPullDownRefresh: function () {
    this.cancelDel()
    this.data.page = 1
    this.data.lastPage = false

    var that = this

    that.getMyLists(function () {

      wx.stopPullDownRefresh();

    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    /*var that = this

    if (that.data.lastPage === true) return false

    wx.showLoading({
      title: '加载中',
    })

    that.data.page++

    that.getMyLists(function () {

      wx.hideLoading();

    }, 'append')*/
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})