// super_card/pages/manager-reset/manager-reset.js
import { $wuxDialog } from '../../components/wux'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    group_id: 0,

    card_list: []
  },

  //更换管理员
  changeManager:function (e){
    
    console.log(e)
    var that = this   
    var card = e.currentTarget.dataset
    $wuxDialog.confirm({
      title: '',
      content: '您确定要选择"'+ card.name +'"为管理员吗？',
      onConfirm(e) {

        var data = {
          group_id: that.data.group_id,
          card_id: card.card_id,
          admin_id: card.uid
        }

        app.util.request({
          'url': 'entry/wxapp/changeGroupManager',
          //'cachetime': '30',
          'method': 'POST',
          'data': data,
          success(res) {

            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2]; // 上一级页
            prevPage.setData({ isFresh: true })

            wx.showToast({
              title: res.data.message,
              icon: res.data.errno ? 'error' : 'success',
              duration: 2000
            })

            if (res.data.errno == 0)
              setTimeout(function () {
                wx.navigateBack()
              }, 2000)

          }
        })

      },
      onCancel(e) {

      },
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if(options.group_id < 1) wx.navigateBack()

    this.setData({ group_id: options.group_id })

    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; // 上一级页
    var group = prevPage.data.group
    var card_list = []
    for(var x in group.card_list){
      if(x < 1) continue
      card_list.push(group.card_list[x])
    }
    this.setData({ group_id: group.id, card_list: card_list })
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