// super_card/pagess/member-core/member-core.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vipSet: [],
    uInfo:false,
    wxInfo: '',
    privilege:false,

    cardExpert:false,
    vip_last_time: 0,
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.freshCurPage()
  },

  freshCurPage:function (cb){

    var that = this
    //获取当前用户ID
    app.util.getUserInfo(function (res) {

      //console.log(res)
      that.setData({ wxInfo: res.wxInfo })
      app.util.request({
        'url': 'entry/wxapp/initOpenVip',
        //'cachetime': '30',
        success(res) {
          typeof cb == "function" && cb()
          //console.log(res)
          var uInfo = res.data.data.uInfo
          var vipSet = res.data.data.vipSet

          //注意：苹果手机不支持以“-”分割的时间形式，如2030-01-01，故必须进行格式转换。安卓手机支持“-”或者“/”分割的时间形式；日期之间的比较要转换成时间戳才能做比较
          var t = uInfo.vip_last_time
          var time = t.replace(/-/g, "/")
          var vip_last_time = Date.parse(time) > Date.parse('2029/1/1') ? '永久' : uInfo.vip_last_time

          var rules = vipSet[uInfo.vip - 1].rules
          var privilege = []
          for (var i = 0, len = rules.length; i < len; i += 4)
            privilege.push(rules.slice(i, i + 4))

          that.setData({ uInfo: uInfo, vipSet: vipSet, privilege: privilege, vip_last_time: vip_last_time})
          console.log('privilege', that.data.privilege)
        }
      })

    })

  },

  showCardExpert: function (e){
 
    var pdx = e.currentTarget.dataset.pdx
    var pidx = e.currentTarget.dataset.pidx

    var cardExpert = this.data.privilege[pdx][pidx]
    this.setData({ cardExpert: cardExpert })

  },

  hideCardExpert: function (){
    this.setData({ cardExpert: false })
  },

  toOpenVip: function () {
    wx.redirectTo({
      url: '../../pages/opt-version/opt-version',
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
    // app.config.set(this)
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
    this.freshCurPage(function (){
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


})