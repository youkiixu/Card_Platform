// super_card/pages/group-manage/group-manage.js
import { $wuxDialog } from '../../components/wux'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      group_id: 0,
      uid: 0,
      group:{},

      isFresh: false,
      sort: 'create_time',
      sort_mode: 'desc',

      from_act: '',
      showBackIndex: false,
  },

  //返回首页
  backIndex: function () {
    wx.switchTab({
      url: '../index/index',
    });
  },
  

  //显示名片组二维码
  showGroupQr: function (){

    var that = this
    app.util.request({
      'url': 'entry/wxapp/getGroupQrcode',
      'method': 'POST',
      'data': { group_id: that.data.group_id },
      success(res) {
        console.log(res)
        wx.previewImage({
          current: res.data.data, // 当前显示图片的http链接
          urls: [res.data.data]
        })

      }
    })
  },
  
  //设置排序条件
  setSort: function (e) {
    //console.log(e)
    var sort = e.target.dataset.name
    var sort_mode = this.data.sort_mode == 'desc' ? 'asc' : 'desc'
    //console.log(sort, sort_mode)
    this.setData({ sort: sort, sort_mode: sort_mode })

    //this.cardListSort()

  },



  //刷新当前页
  freshCurrPage: function (cb) {

    var that = this
    app.util.request({
      'url': 'entry/wxapp/getGroupCards',
      'data': {group_id: that.data.group_id, from_act: that.data.from_act},
      success(res) {
        if(res.data.message == 'notInGroup'){
          wx.redirectTo({
            url: '../group-request/group-request?group_id=' + that.data.group_id,
          })
          return 
        }

        typeof cb == "function" && cb()

        //console.log(res)
        var data = res.data.data
        data.icons = data.card_list.slice(0, 9)
        var len = data.icons.length
        if (len < 9)
          for (var i = len; i < 9; i++)
            data.icons.push({ picture: 'no' })

        that.setData({ group_id: data.id, group: data, isFresh: false, from_act: ''})

        if(that.data.group.anyone_request == 1 || that.data.uid == that.data.group.card_list[0].uid)
          wx.showShareMenu()
        else
          wx.hideShareMenu()

        var pages = getCurrentPages();
        if(pages.length < 2) return 
        var prevPage = pages[pages.length - 2]; // 上一级页
        prevPage.setData({ isFresh: true })

      }
    })

  },

  //跳转更换管理员页面
  toViewGroup: function () {

    wx.navigateTo({
      url: '../group-fit/group-fit?group_id=' + this.data.group_id,
    })

  },


  //跳转更换管理员页面
  toChangeManager: function (){

    wx.navigateTo({
      url: '../manager-reset/manager-reset?group_id=' + this.data.group_id,
    })

  },


  //删除名片组
  toDelGroup: function (){

    var that = this

    $wuxDialog.confirm({
      title: '',
      content: '您确定要删除该名片组吗？',
      onConfirm(e) {

        var data = {
          group_id: that.data.group_id
        }

        app.util.request({
          'url': 'entry/wxapp/delCardGroup',
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

  //删除名片组
  toQuitGroup: function () {

    var that = this

    $wuxDialog.confirm({
      title: '',
      content: '您确定要退出该名片组吗？',
      onConfirm(e) {

        var data = {
          group_id: that.data.group_id
        }

        app.util.request({
          'url': 'entry/wxapp/quitCardGroup',
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

  //名片组管理选项
  showManageOptions: function (){
   var that = this
   var card_list = that.data.group.card_list
   if(that.data.uid == card_list[0].uid){
     
      if (card_list.length > 1)
        var options = ['名片组二维码', '更改设置', '更换管理员']
      else
        var options = ['名片组二维码', '更改设置', '删除名片组']

      wx.showActionSheet({
        itemList: options,
        success: function (res) {
          console.log(res)
          var index = res.tapIndex;
          switch (options[index]) {
            case '名片组二维码':
              that.showGroupQr()
            break
            case '更改设置':
              that.toModifyPage()
            break
            case '更换管理员':
              that.toChangeManager()
            break
            case '删除名片组':
              that.toDelGroup()
            break
          }
       }
      })

   }else{ 
     var options = ['查看名片组设置', '退出名片组']
     wx.showActionSheet({
       itemList: options,
       success: function (res) {

         var index = res.tapIndex;
         switch (options[index]) {
           
           case '查看名片组设置':
             that.toViewGroup()
             break
           case '退出名片组':
             that.toQuitGroup()
             break

         }

       }
     })

   }
  },

  //跳转名片组信息修改页面
  toModifyPage: function () {
    wx.navigateTo({
      url: '../group-modify/group-modify?group_id=' + this.data.group_id,
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log(options)
    if (options.group_id < 1){
       wx.navigateBack()
       return   
    }

    var that = this

    that.setData({ group_id: options.group_id })
    
    //获取当前用户ID
    app.util.getUserInfo(function (response) {
        that.setData({ uid: response.memberInfo.uid })

        app.util.request({
          'url': 'entry/wxapp/checkIsUserInGroup',
          'data': { group_id: that.data.group_id },
          success(res) {
            if (res.data.data === false) {
              wx.redirectTo({
                url: '../group-request/group-request?group_id=' + that.data.group_id,
              })
              return false
            }

            if (typeof options.from_act !== 'undefined'){

              that.setData({ showBackIndex: true, from_act: options.from_act })
              
              that.freshCurrPage()

            }else{
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2]; // 上一级页
              var groups = prevPage.data.groups
              
              for (var x in groups) {
                if (groups[x].id == that.data.group_id){ 
                  that.setData({ group : groups[x] })
                  break
                }
              }

              if (that.data.group.anyone_request == 1 || that.data.uid == that.data.group.card_list[0].uid )
                wx.showShareMenu()
              else
                wx.hideShareMenu()

            }
          }
        })
    })
    //wx.setNavigationBarTitle({ title: this.data.group.name });
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
    if (this.data.isFresh === true) this.freshCurrPage()
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

    this.freshCurrPage(function () {
      wx.stopPullDownRefresh()
    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    
    //console.log(res)
    if (res.target.id === 'requestJoinBtn') {

      //console.log(res.target)
      return {

        title: '邀请您加入名片组"'+ this.data.group.name +'"',
        path: '/super_card/pages/group-request/group-request?group_id=' + this.data.group_id + '&from_act=share',
        
      }

    }
    

  }
})