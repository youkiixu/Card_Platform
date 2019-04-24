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

      checked: false,

      ids: false,

      selectAllChecked: false,
      deleteShow:false,
      mCard_id:0,
      type_id:0,
      type_name:'',
      types:[],
  },

  //返回首页
  backIndex: function () {
    wx.switchTab({
      url: '../index/index',
    });
  },

  editMember: function(){
    if (this.data.deleteShow == true){
      this.setData({
        deleteShow:false
      })
    }else{
      this.setData({
        deleteShow: true
      })
    }
  },

//监听checkbox的选中状态及拿到选中id的数组集合
  dealWithIds: function (e) {
    this.data.ids = e.detail.value
    if (this.data.ids.length == this.data.group.card_list.length - 1) //要把群主排除，所以要减去1
      this.setData({ selectAllChecked: true })
    else
      this.setData({ selectAllChecked: false })

      console.log('checkbox-ids:', this.data.ids)
  },
 
 //全选
  selectAll: function (e) {
    var len = e.detail.value.length
    if (len > 0) {
      this.setData({ checked: true })
      this.data.ids = []
      for (var x in this.data.group.card_list)
      this.data.ids.push(this.data.group.card_list[x].id)
      this.data.ids.splice(0, 1) //把第一个索引的元素排除不选择，因为第一个元素是群主，不可踢出；0 表示索引值，1表示排除的元素个数，splice(0,1)即表示排除掉下标索引值为0的这1个元素
    } else {
      this.setData({ 
        checked: false,
        ids:false
        })
    }
    console.log('全选的ids', this.data.ids)
  },

//移除所选组员
  deleteChoosen: function () {
    var that = this
    console.log('移除的ids', that.data.ids)
    if (that.data.ids === false) {

      wx.showToast({
        title: '请先选择您要移除的组员',
        icon: 'none'
      })
      return false
    }
   
    $wuxDialog.confirm({
      title: '',
      content: '您确定要移除吗？',
      onConfirm(e) {
        app.util.request({
          'url': 'entry/wxapp/delCardGroupMembers',
          'method': 'POST',
          'data': { card_ids: that.data.ids, group_id: that.data.group_id },
          // 'data': { card_ids: that.data.ids.join(','), group_id: that.data.group_id},//join() 方法用于把数组中的所有元素放入一个字符串,元素是通过指定的分隔符进行分隔的。
          success(res) {
            console.log('res',res)
            wx.showToast({
              title: res.data.message,
              icon: 'success'
            })
            that.freshCurrPage()
          }
        })
      },
      onCancel(e) {
        that.setData({ deleteShow: false })
      }
    })

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
           
            // var pages = getCurrentPages();
            // var prevPage = pages[pages.length - 2]; // 上一级页
            // prevPage.setData({ isFresh: true })

            wx.showToast({
              title: res.data.message,
              icon: res.data.errno ? 'error' : 'success',
              duration: 2000
            })

            if (res.data.errno == 0)
              setTimeout(function () {
                // wx.navigateBack()
                wx.switchTab({
                  url: '../index/index'
                })
              }, 2000)

          }
        })

      },
      onCancel(e) {

      },
    })

  },

  //退出名片组
  toQuitGroup: function () {

    var that = this

    $wuxDialog.confirm({
      title: '',
      content: '您确定要退出该名片组吗？',
      onConfirm(e) {

        var data = {
          group_id: that.data.group_id,
          card_id: that.data.mCard_id
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
      //if (card_list.length > 1 )
        // var options = ['名片组二维码', '更改设置', '更换管理员', '删除名片组']
      //   var options = ['名片组二维码', '更改设置',  '删除名片组']
      // else
      //   var options = ['名片组二维码', '更改设置', '删除名片组']
      
     var type_id = that.data.group.type_id
     var type_name = false
     if (type_id == 7 || type_id == 8){
       type_name = '推广组二维码'
     }else{
       type_name = '名片组二维码'
     }
     var options = [type_name, '更改设置', '删除名片组']

      wx.showActionSheet({
        itemList: options,
        success: function (res) {
          var index = res.tapIndex;
          switch (options[index]) {
            case type_name:
              that.showGroupQr()
            break
            case '更改设置':
              that.toModifyPage()
            break
            // case '更换管理员':
            //   that.toChangeManager()
            // break
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

  //获取当前用户名片
  getMyUserCards: function () {
    var that = this
    app.util.request({
      'url': 'entry/wxapp/getUserCard',
      'data': { 'no_need_whole': 1 },
      success(res) {
        var data = res.data.data
        for (var i = 0; i < data.length; i++) {
          if (data[i].is_default == 1) { //获取当前用户名片的card_id
            that.setData({
              mCard_id: data[i].id
            })
          }
        }
      }

    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options', options)
    var that = this

    if (typeof options.scene !== 'undefined') {
      const scene = decodeURIComponent(options.scene)
      var param = scene.split('_') //split() 方法用于把一个字符串分割成字符串数组,此处是根据字符串中的"_"来分割
      that.setData({
        group_id: param[0],
        from_act: param[1]
      })
    }else{
      that.setData({ group_id: options.group_id }) 
      if (typeof options.from_act !== 'undefined'){
        that.setData({ from_act: options.from_act })
      }
    }
    
    // if (options.group_id < 1){
    //    wx.navigateBack()
    //    return   
    // }

    if (that.data.group_id < 1) {
      wx.navigateBack()
      return
    }

    

    that.getMyUserCards()

    
    
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

            


            if (typeof that.data.from_act !== 'undefined'){

              that.setData({ showBackIndex: true})
              
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

    //that.getGroupType()
    
    
    
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
    console.log('onShow加载函数')
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

        title: '邀请您加入"'+ this.data.group.name +'"',
        path: '/super_card/pages/group-request/group-request?group_id=' + this.data.group_id + '&from_act=share',
        
      }

    }
    

  }
})