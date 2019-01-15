// super_card/pagess/team/team.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemChioce:1,
    
    sliderOffset: 0,
    sliderLeft: 2,

    list:false,
    page:1,
    lastPage:false,

    agent_grade:'',
    lv:'',
  },

  // 级别选择
  goChangeTeam: function (event) {
    var cic = event.currentTarget.dataset.replyType
    var that = this
    

    var lv = that.data.lv
    var ag = that.data.agent_grade[lv-1]
    
    if (cic == that.data.itemChioce) {
      return
    } else {
      that.setData({ itemChioce: cic })
      console.log(cic)

      if ( ag.three_profit != 0 ){
        if (that.data.itemChioce == 1) {
          that.setData({
            sliderOffset: 0,
            sliderLeft: 2,
          });
        
        }
        if (that.data.itemChioce == 2) {
          that.setData({
            sliderOffset: 32,
            sliderLeft: 2,
          });
        }
        if (that.data.itemChioce == 3) {
          that.setData({
            sliderOffset: 64,
            sliderLeft: 2,
          });
        }
      } else if ( ag.two_profit != 0 && ag.three_profit == 0 ){
        if (that.data.itemChioce == 1) {
          that.setData({
            sliderOffset: 0,
            sliderLeft: 2,
          });

        }
        if (that.data.itemChioce == 2) {
          that.setData({
            sliderOffset: 48,
            sliderLeft: 2,
          });
        }
      }

      that.data.page = 1
      that.data.lastPage = false
      this.getUserTeam()
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({ lv:options.agent })
    this.getUserTeam()

    var agentGrade = app.config.getConf('agent_grade')
    this.setData({ agent_grade: agentGrade })
    console.log(this.data.agent_grade)
  },

  getUserTeam: function (cb, mode = 'cover'){
    var that = this
    app.util.request({
      'url': 'entry/wxapp/getAgentTeam',
      'data': { page: that.data.page, type: that.data.itemChioce },
      success(res) {
        typeof cb == "function" && cb()
        console.log(res)
        if (mode == 'append') {
          if (!res.data.data.length) {
            that.data.lastPage = true
            return false
          }
          console.log(res.data.data)
          that.data.list = that.data.list.concat(res.data.data)
          console.log(that.data.list)

        } else {
          that.data.list = res.data.data.list
          that.setData({ childs_num: res.data.data.childs_num })
        }
        that.setData({ list: that.data.list })

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
    var that = this
    this.getUserTeam(function () {

      wx.stopPullDownRefresh()

    })

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

    that.getUserTeam(function () {

      wx.hideLoading();

    }, 'append')

  },

})