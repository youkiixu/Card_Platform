// super_card/pages/group-modify/group-modify.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    group_id: 0,
    name: '',
    card_id: 0,
    type_id: 0,
    anyone_request: 0,
    allow_collect:0,
    note: '',
    

    groupTypes: {},
    typeVal: '',
    card:{},
    userCards:[],
    cardPickerShow: { visible: false, animateCss: 'wux-animate--fade-out' },
    card_id_copy:0,
  },

  //取消创建或修改名片组
  navBack:function (){
    wx.navigateBack()
  },

  //选择名片处理
  cardChange: function (e){

    this.setData({ card_id: e.detail.value })
  },

  //确认名片选择
  openCardSelect: function (){

    this.data.card_id_copy = this.data.card_id
    this.toggleCardPicker()

  },

  //确认名片选择
  confirmCardSelect: function () {

    if(this.data.card_id_copy !== this.data.card_id){
        for(var x in this.data.userCards){
          if(this.data.userCards[x].id == this.data.card_id)
            this.setData({ card: this.data.userCards[x] })
        }
    }
    this.toggleCardPicker()

  },

  //确认名片选择
  cancelCardSelect: function () {

    this.setData({ card_id: this.data.card_id_copy })
    this.toggleCardPicker()

  },
  

  //显示/隐藏名片选择器
  toggleCardPicker: function (){
    this.data.cardPickerShow = this.data.cardPickerShow.visible === true ? { visible: false, animateCss: 'wux-animate--fade-out' } : { visible: true, animateCss: 'wux-animate--fade-in' }
    this.setData({ cardPickerShow: this.data.cardPickerShow })
  },



  //设置是否允许收藏
  collectChange: function (e){
    this.setData({ allow_collect: e.detail.value })
  },

  //设置是否仅管理员可邀请新成员
  requestChange: function (e) {
    this.setData({ anyone_request: e.detail.value })
  },

  //设置名称
  setGroupName: function (e){
    this.setData({ name: e.detail.value })
  },

  //设置备注
  setGroupNote: function (e) {
    
    this.setData({ note: e.detail.value })
  },

  //保存名片组信息
  saveGroup: function (){

    var name = this.data.name
    if(!name){ 
      wx.showToast({
        title: '名称不能为空',
        icon: 'none'
      })
      return false
    }
    if (name.length < 4 || name.length > 30){
       wx.showToast({
        title: '名称字数不合法',
        icon: 'none'
      })
      return false
    }
    var card_id = this.data.card_id
    if (!card_id){
      wx.showToast({
        title: '请选择名片',
        icon: 'none'
      })
      return false
    } 

    var type_id = this.data.type_id
    if (!type_id){
      wx.showToast({
        title: '请选择类型',
        icon: 'none'
      })
      return false
    } 
    var group_id = this.data.group_id
    var anyone_request = this.data.anyone_request
    var allow_collect = this.data.allow_collect
    var note = encodeURIComponent(this.data.note)

    var that = this
    app.util.request({
      'url': 'entry/wxapp/saveGroup',
      'method': 'POST',
      'data': { group_id: group_id, name: name, card_id: card_id, type_id: type_id, anyone_request: anyone_request, allow_collect: allow_collect, note: note},
      success(res) {

        console.log(res)
        
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; // 上一级页
        prevPage.setData({ isFresh: true })

        wx.showToast({
          title: res.data.message,
          icon: 'success',
          duration: 2000
        })


        setTimeout(function () {
          wx.navigateBack()
        }, 2000);

        

      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    var that = this
    if(options.group_id > 0){
      wx.setNavigationBarTitle({ title: '修改名片组设置' });
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; // 上一级页
      var group = prevPage.data.group
      
      that.setData({ group_id: group.id, name: group.name, type_id: group.type_id, note: group.note, card_id: group.card_id, anyone_request: group.anyone_request, allow_collect: group.allow_collect })
     

    }else{

      wx.setNavigationBarTitle({ title: '创建名片组' });
      app.util.request({
        'url': 'entry/wxapp/getUserCard',
        'data': { 'no_need_whole': 1 },
        success(res) {

          if (res.data.data.length < 1) {
            wx.showToast({
              title: '请先创建名片',
              icon: 'none'
            })
            wx.navigateBack()
            return false
          }

          that.setData({ userCards: res.data.data, card: res.data.data[0], card_id: res.data.data[0].id })
          
        }
      })

    }
    that.getGroupType()
  
   

  },

  //获取名片组类型
  getGroupType:function (){
    var that = this
    app.util.request({
      'url': 'entry/wxapp/getGroupType',
      'method': 'POST',
      success(res) {

        //console.log(res)
        that.data.groupTypes = res.data.data
        if(that.data.type_id > 0)
          for(var x in that.data.groupTypes){
            if (that.data.groupTypes[x].id == that.data.type_id)
              that.setData({ typeVal: that.data.groupTypes[x].name })
          }

      }

    })

  },

  //显示类型选择
  showTypeSelect: function (){
    
    var types = []
    var typeIds = []
    for(var x in this.data.groupTypes){
      if(x > 5) break
      types.push(this.data.groupTypes[x].name)
      typeIds.push(this.data.groupTypes[x].id)
    }
    var that = this
    wx.showActionSheet({
      itemList: types,
      success: function (res) {
        
        //console.log(res)
        that.setData({ typeVal: types[res.tapIndex], type_id: typeIds[res.tapIndex] })

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