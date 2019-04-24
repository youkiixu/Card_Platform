// super_card/pagess/team/team.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemChioce: 1,

    sliderOffset: 0,
    sliderLeft: 2,

    list: false,
    page: 1,
    lastPage: false,
    child_num: 0,

    agent_grade: '',

    show_goTop: false,

    category: [
      { id: 1, name: "全部" },
      { id: 2, name: "成功" },
      { id: 3, name: "等待" },
      { id: 4, name: "失败" },
    ],
    activeCategoryId: 1,

    allInfo: [],


  },


  // 点击分类标题切换
  tabClick: function (e) {
    var id = e.target.dataset.id
    this.setData({
      activeCategoryId: id,
      itemChioce: id,
      page: 1,
      lastPage: false
    });
    this.getRecord()
  },

  //返回首页
  backIndex: function (e) {
    wx.switchTab({
      url: '../../pages/index/index',
    });
  },

  droptRetracts:function(e){
    var that = this

    //方法1：修改数组中的元素值 -- show_hide（show_hide为自己在获取数据的时候加上去的元素属性）
    var index = e.currentTarget.dataset.index
    if (that.data.allInfo[index].show_hide == 1){   
      that.data.allInfo[index].show_hide = 2        
    }else{
      that.data.allInfo[index].show_hide = 1
    }

    that.setData({
      allInfo: that.data.allInfo
    })
  
    //方法2：修改数组中的元素值 -- show_hide（show_hide为自己在获取数据的时候加上去的元素属性）
    // var index = e.currentTarget.dataset.index
    // var Key = "allInfo[" + index + "].show_hide"
    // if (that.data.allInfo[index].show_hide === 1) {
    //   that.setData({ [Key]: 2 })
    // } else {
    //   that.setData({ [Key]: 1 })
    // }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRecord()
  },


  // 全部列表
  getRecord: function (isload) {
    var that = this;
    var data = {
      page: that.data.page,
      type: that.data.itemChioce
    }
    app.util.request({
      'url': 'entry/wxapp/getBusinessChoices',
      'method': 'POST',
      'data': data,
      success(res) {
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
        for (var i = 0; i < that.data.allInfo.length ; i++){
          var status = parseInt(that.data.allInfo[i].status) 
          var statuInfo = ''
          switch (status) {
              case 0:
                statuInfo = "等待";
                break;
              case 1:
                statuInfo = "推荐成功";
                break;
              case -1:
                statuInfo = "失败";
                break;
            }
          that.data.allInfo[i].statuInfo = statuInfo  //给数组增加属性值（字段）--- 在接口返回那里是看不到的，即改动不了接口数据库的数据，因为是自己增加的，所以要打印在控制台才可以看到增加的属性值，然后重新setData才会变更到视图层
          that.data.allInfo[i].show_hide = 1  //给数组增加属性值（字段） 
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
    this.getRecord()
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

    that.getRecord(true) //传值过去，表示页面上拉加载的就不清空数据

  },

})