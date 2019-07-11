// super_card/pagess/team/team.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemChioce: 0,
    page: 1,
    lastPage: false,
    show_goTop: false,

    scrollLeft:0,
    currentTab: 0,

    categories: [
      { id: 1, name: "全部" }, 
      { id: 2, name: "商业管理" },
      { id: 3, name: "产品开发" },
      { id: 4, name: "推广营销" },
      { id: 5, name: "设计创意" },
      { id: 6, name: "电商运营" },
      { id: 7, name: "职业考试" },
      { id: 8, name: "生活兴趣" },
      { id: 9, name: "向上管理" },
      { id: 10, name: "商业实战" },
      { id: 11, name: "人力资源管理" },
    ],

    chargeList:[
      { id: 1, name: "全部" },
      { id: 2, name: "免费" },
      { id: 3, name: "收费" },
    ],

    activeChargeId:1,
    chargeChioce:1,
    
    showMoreCate:false,
    allInfo: [],



    //课程详情页数据
    activeTitleId:1,
    titleChioce:1,


  },


// 点击分类标题切换
  tabClick: function (e) {
    console.log('e', e)
    var currentTab = e.target.dataset.current
    console.log('currentTab', currentTab)
    // console.log('this.data.category[currentTab]:', this.data.category[currentTab])
    this.setData({
      page: 1,
      currentTab: currentTab,
      itemChioce: currentTab,
      showMoreCate: false
    });
    //this.getCourse() //课程数据
    this.checkCate()
  },

// 设置切换位置
  checkCate:function(){
   if (this.data.currentTab > 3 &&this.data.currentTab < 7){
     this.setData({
       scrollLeft:280
     });
   } else if (this.data.currentTab >= 7 && this.data.currentTab < 10){
     this.setData({
       scrollLeft: 480
     });
   } else if (this.data.currentTab >= 10 && this.data.currentTab < 14){
     this.setData({
       scrollLeft: 720
     });
   }else{
     this.setData({
       scrollLeft: 0
     });
   }
 },
  

  //点击展开更多分类
  tabMore: function () {
    console.log('more')
      this.setData({
        showMoreCate: true
      });
    //this.getCourse()
  },
 
 //关闭更多分类
  moreClose: function () {
      this.setData({
        showMoreCate: false
      });
    //this.getCourse()
  },

  //全部，免费，收费
  chargeClick: function (e) {
    var id = e.target.dataset.id
    this.setData({
      page: 1,
      activeChargeId: id,
      chargeChioce: id
    });
    //this.getCourse()
  },

// 课程详情页的js
  titleClick:function(e){
    console.log('e',e)
    var id = e.target.dataset.id
    console.log('title-id', id)
    this.setData({
      activeTitleId: id,
      titleChioce: id
    });

  },







  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getCourseCateList()
    // this.getCourse()
    
    //this.setData({ agent_grade: agentGrade, category: category })

  },


  // 课程分类
  getCourseCateList: function () {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getWallpaperCateList222',
      'method': 'POST',
      success(res) {
        that.setData({
          category: res.data.data
        })
      }
    })
  },


  // 课程列表
  getCourse: function (isload) {
    var that = this;
    var data = {
      page: that.data.page,
      type: that.data.itemChioce
    }
    app.util.request({
      'url': 'entry/wxapp/getAgentTeam222',
      'method': 'POST',
      'data': data,
      success(res) {
        // if (!res.data.data.length) {
        //   that.data.lastPage = true
        //   return false
        // }

        //isload==true表示是在页面上拉加载的函数里面执行的方法，则不清空数据，继续再原有数据的基础上追加
        if (isload == true) {
          that.data.allInfo = that.data.allInfo.concat(res.data.data)
        } else {
          that.setData({
            allInfo: []
          })
          that.data.allInfo = res.data.data
        }
        that.setData({
          allInfo: that.data.allInfo
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

  },

  //监听页面滚动
  onPageScroll: function (e) {

    if (this.data.show_goTop === false && e.scrollTop >= 500) this.setData({ show_goTop: true })

    if (this.data.show_goTop === true && e.scrollTop < 500) this.setData({ show_goTop: false })

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
    this.getCourse()
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

    that.getCourse(true) //传值过去，表示页面上拉加载的就不清空数据

  },

})