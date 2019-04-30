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

    category: [],

    activeCategoryId: 1,

    allInfo: [],

    agent:'',

    cate_nums:[],



  },


  // 点击分类标题切换
  tabClick: function (e) {
    var id = e.target.dataset.id
    this.setData({
      activeCategoryId: id,
      itemChioce: id
    });
    this.getUserTeam(id) //之前是不传值即直接this.getUserTeam()，然后在getUserTeam里面直接拿setdata里面的值传给后台，setdata一般都挺快的， 后面接方法一般没有影响， 就是可能特别卡的时候 比较容易出现异步的现象； 直接传值时即this.getUserTeam(id)，防止因为异步机制导致数据加载慢，防止会出现空白没有数据的情况。注意的是如果采用直接传值方法，就要每次调用该方法时都要传对应的id过去，这两种方法看情况而定，都可以用。
  },

  
  libraryOpen:function(e){
    var that = this
    var index = e.currentTarget.dataset.index
    if (that.data.allInfo[index].is_relation == 0){
      that.data.allInfo[index].is_relation = 1  //修改数组中的元素值，is_relation是本来数组就有返回的元素
    }else{
      that.data.allInfo[index].is_relation = 0 //修改数组中的元素值
    }
    //修改数组中的元素值，最后要重新赋值
    that.setData({
      allInfo: that.data.allInfo
    })

    var data = {
      uid: that.data.allInfo[index].id,
      is_relation: that.data.allInfo[index].is_relation
    }
    app.util.request({
      'url': 'entry/wxapp/saveRalation',
      'method': 'POST',
      'data': data,
      success(res) {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 1000
        })
      },
      fail(res){
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this

    that.getUserTeam(1)  //默认第一个
    
    var getUserInfo = wx.getStorageSync('getUserInfo');
    var agent = getUserInfo.agent;

    that.setData({ agent: agent })

    app.util.request({
      'url': 'entry/wxapp/getAgentNums',
      'method': 'POST',
      success(res) {
        var data = res.data.data
        that.setData({ cate_nums: data })
      }
    })


    


    
    //只有渠道代理和合伙人有渠道商显示
    // var category = agent > 1 ? [{ id: 1, name: "推荐" },{ id: 2, name: "会员" },{ id: 3, name: "服务商" },{ id: 4, name: "渠道商" },] : [{ id: 1, name: "推荐" },{ id: 2, name: "会员" },{ id: 3, name: "服务商" },]

    // this.setData({ agent_grade: agentGrade, category: category})

    //将时间戳转换成日期格式
    // var ts = 1398250549123
    // var date = new Date(ts); //获取一个时间对象
    // console.log('date:', date)
    // var Y = date.getFullYear() + '-';
    // var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    // var D = date.getDate() + ' ';
    // var h = date.getHours() + ':';
    // var m = date.getMinutes() + ':';
    // var s = date.getSeconds();

    // var DT = Y + M + D
    // var Time = h + m + s

    // console.log('日期时间：', Y + M + D + h + m + s);
    // console.log('日期：', DT);
    // console.log('时间', Time);

  },



// 全部列表 -----直接传值时（id），防止因为异步机制导致数据加载慢，防止会出现空白没有数据的情况。注意的是如果采用直接传值方法，就要每次调用该方法时都要传对应的id过去
  getUserTeam: function (id,isload) {
    var that = this;
    var data = {
      page: that.data.page,
      type: id
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
    this.getUserTeam(this.data.itemChioce)
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
    that.getUserTeam(this.data.itemChioce,true) //传true过去，表示页面上拉加载的就不清空数据

  },

})