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
    lv: '',

    show_goTop: false,

    category: [],

    activeCategoryId: 1,

    allInfo: [],

    agent: '',

    cate_nums: [],

    searchKey: '',
    disabled: false,//要判断是否已经开通过会员试用


  },


  // 点击分类标题切换
  tabClick: function (e) {
    var id = e.target.dataset.id
    this.setData({
      activeCategoryId: id,
      itemChioce: id,
      searchKey: ''
    });
    this.getUserTeam(id) //之前是不传值即直接this.getUserTeam()，然后在getUserTeam里面直接拿setdata里面的值传给后台，setdata一般都挺快的， 后面接方法一般没有影响， 就是可能特别卡的时候 比较容易出现异步的现象； 直接传值时即this.getUserTeam(id)，防止因为异步机制导致数据加载慢，防止会出现空白没有数据的情况。注意的是如果采用直接传值方法，就要每次调用该方法时都要传对应的id过去，这两种方法看情况而定，都可以用。
  },

  //开通共享人脉
  libraryOpen: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    if (that.data.allInfo[index].is_relation == 0) {
      that.data.allInfo[index].is_relation = 1  //修改数组中的元素值，is_relation是本来数组就有返回的元素
    } else {
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
      fail(res) {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },

  //开通会员试用
  // opemMemberTry: function (e) {
  //   var that = this
  //   var index = e.currentTarget.dataset.ii
  //   console.log('index',index)
  //   if (that.data.allInfo[index].is_relation22 == 0) {
  //     that.data.allInfo[index].is_relation22 = 1  //修改数组中的元素值，is_relation是本来数组就有返回的元素
  //   } else {
  //     that.data.allInfo[index].is_relation22 = 0 //修改数组中的元素值
  //   }
  //   //修改数组中的元素值，最后要重新赋值
  //   that.setData({
  //     allInfo: that.data.allInfo
  //   })

  //   var data = {
  //     uid: that.data.allInfo[index].id,
  //     is_relation22: that.data.allInfo[index].is_relation22
  //   }
  //   app.util.request({
  //     'url': 'entry/wxapp/saveRalation22',
  //     'method': 'POST',
  //     'data': data,
  //     success(res) {
  //       wx.showToast({
  //         title: res.data.message,
  //         icon: 'none',
  //         duration: 1000
  //       })
  //     },
  //     fail(res) {
  //       wx.showToast({
  //         title: res.data.message,
  //         icon: 'none',
  //         duration: 1000
  //       })
  //     }
  //   })
  // },


  //按回车键或者手机输入法的搜索确认搜索
  confirmSearchKey: function () {
    if (this.data.searchKey) {
      this.data.lastPage = false
      this.data.page = 1
      this.getUserTeam(this.data.itemChioce)
    } else {
      wx.showToast({
        title: '请输入搜索关键词',
        icon: 'none'
      })
    }
  },

  //按搜索两个字进行搜索
  searchResult: function () {
    if (this.data.searchKey) {
      this.data.lastPage = false
      this.data.page = 1
      this.getUserTeam(this.data.itemChioce)
    } else {
      wx.showToast({
        title: '请输入搜索关键词',
        icon: 'none'
      })
    }
  },



  //设置搜索关键字
  setSearchKey: function (e) {
    var that = this;
    var key = that.trim(e.detail.value)
    that.setData({ searchKey: key })
    that.data.lastPage = false
    that.data.page = 1
  },
  // 去除首尾的空格
  trim: function (s) {
    return s.replace(/(^\s*)|(\s*$)/g, "");
  },


  // 全部列表 -----直接传值时（id），防止因为异步机制导致数据加载慢，防止会出现空白没有数据的情况。注意的是如果采用直接传值方法，就要每次调用该方法时都要传对应的id过去
  getUserTeam: function (id, isload) {
    var that = this;
    var data = {
      page: that.data.page,
      type: id,
      nickname: that.data.searchKey,
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
        if (isload == true) {
          that.data.allInfo = that.data.allInfo.concat(res.data.data)
        } else {
          that.setData({
            allInfo: []
          })
          that.data.allInfo = res.data.data
        }

        for (var i = 0; i < that.data.allInfo.length; i++) {
          //vip到期时间
          var vip_date = new Date(parseInt(that.data.allInfo[i].vip_last_time) * 1000)
          var vip_Y = vip_date.getFullYear()
          var vip_M = (vip_date.getMonth() + 1 < 10 ? '0' + (vip_date.getMonth() + 1) : vip_date.getMonth() + 1)
          var vip_D = vip_date.getDate() < 10 ? '0' + vip_date.getDate() : vip_date.getDate()
          var vip_datetime = vip_Y + '-' + vip_M + '-' + vip_D

          var vip_time = parseInt(that.data.allInfo[i].vip_last_time) * 1000 > Date.parse('2029/1/1') ? '永久' : vip_datetime

          that.data.allInfo[i].vip_time = vip_time //给allInfo数组添加vip_time属性

          //代理到期时间
          var agent_date = new Date(parseInt(that.data.allInfo[i].agent_last_time) * 1000)
          var agent_Y = agent_date.getFullYear()
          var agent_M = (agent_date.getMonth() + 1 < 10 ? '0' + (agent_date.getMonth() + 1) : agent_date.getMonth() + 1)
          var agent_D = agent_date.getDate() < 10 ? '0' + agent_date.getDate() : agent_date.getDate()
          var agent_datetime = agent_Y + '-' + agent_M + '-' + agent_D

          var agent_time = parseInt(that.data.allInfo[i].agent_last_time) * 1000 > Date.parse('2029/1/1') ? '永久' : agent_datetime

          that.data.allInfo[i].agent_time = agent_time //给allInfo数组添加agent_time属性

        }

        that.setData({
          allInfo: that.data.allInfo
        })

        console.log('that.data.allInfo', that.data.allInfo)

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
    that.getUserTeam(this.data.itemChioce, true) //传true过去，表示页面上拉加载的就不清空数据

  },

})