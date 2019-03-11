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
    child_num:0,

    agent_grade:'',
    lv:'',

    show_goTop: false,

    category: [
      { id: 1, name: "全部" },
      { id: 2, name: "推荐" },
      { id: 3, name: "会员" },
      { id: 4, name: "代理" },
    ],
    activeCategoryId: 1,

    allInfo: [],


  },


  // 点击分类标题切换
  tabClick: function (e) {
    var id = e.target.dataset.id
    this.setData({
      activeCategoryId: id,
      itemChioce: id
    });
    this.getUserTeam() 
  },

 
  // 级别选择
  // goChangeTeam: function (event) {
  //   var cic = event.currentTarget.dataset.replyType
  //   var that = this
    

  //   var lv = that.data.lv
  //   var ag = that.data.agent_grade[lv-1]
    
  //   if (cic == that.data.itemChioce) {
  //     return
  //   } else {
  //     that.setData({ itemChioce: cic })
  //     console.log(cic)

  //     if ( ag.three_profit != 0 ){
  //       if (that.data.itemChioce == 1) {
  //         that.setData({
  //           sliderOffset: 0,
  //           sliderLeft: 2,
  //         });
        
  //       }
  //       if (that.data.itemChioce == 2) {
  //         that.setData({
  //           sliderOffset: 32,
  //           sliderLeft: 2,
  //         });
  //       }
  //       if (that.data.itemChioce == 3) {
  //         that.setData({
  //           sliderOffset: 64,
  //           sliderLeft: 2,
  //         });
  //       }
  //     } else if ( ag.two_profit != 0 && ag.three_profit == 0 ){
  //       if (that.data.itemChioce == 1) {
  //         that.setData({
  //           sliderOffset: 0,
  //           sliderLeft: 2,
  //         });

  //       }
  //       if (that.data.itemChioce == 2) {
  //         that.setData({
  //           sliderOffset: 48,
  //           sliderLeft: 2,
  //         });
  //       }
  //     }

  //     that.data.page = 1
  //     that.data.lastPage = false
  //     this.getUserTeam()
  //   }
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options', options)
    this.setData({ lv:options.agent })
    this.getUserTeam() 
    var agentGrade = app.config.getConf('agent_grade')
    this.setData({ agent_grade: agentGrade })
    console.log(this.data.agent_grade)
  },



// 全部列表
  getUserTeam: function (isload) {
    var that = this;
    var data = {
      page: that.data.page,
      type: that.data.itemChioce
    }
    app.util.request({
      'url': 'entry/wxapp/getAgentTeam',
      'method': 'POST',
      'data': data,
      success(res) {
        // if (!res.data.data.length) {
        //   that.data.lastPage = true
        //   return false
        // }

        //isload==true表示是在页面上拉加载的函数里面执行的方法，则不清空数据，继续再原有数据的基础上追加
        if (isload==true){
          that.data.allInfo = that.data.allInfo.concat(res.data.data)
        }else{
          that.setData({
            allInfo: []
          })
          that.data.allInfo = res.data.data
        }
        that.setData({
          allInfo: that.data.allInfo
        })
        console.log('allInfo', that.data.allInfo)
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

  //监听页面滚动
  onPageScroll: function (e) {

    if (this.data.show_goTop === false && e.scrollTop >= 200) this.setData({ show_goTop: true })

    if (this.data.show_goTop === true && e.scrollTop < 200) this.setData({ show_goTop: false })

  },

  // 一键回到顶部
  goTop: function (e) {
    if (wx.pageScrollTo) {
      this.setData({ show_goTop: false })
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    } else {
      wx.showToast({
        title: '暂不支持',
      })
    }
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
    this.getUserTeam()
    wx.stopPullDownRefresh() //处理完数据刷新后，wx.stopPullDownRefresh可以停止当前页面的下拉刷新。
    
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

    that.getUserTeam(true) //传值过去，表示页面上拉加载的就不清空数据

  },

})