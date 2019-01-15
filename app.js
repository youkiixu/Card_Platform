//app.js
App({
	onLaunch: function (opt) {
     
     var that = this
      wx.getSystemInfo({
        success: function (res) {
          that.platform = res.platform
        }
      })

      wx.hideTabBar()
      if(opt && opt.scene && (opt.scene == 1011 || opt.scene == 1007)){
        this.shareOrScanIsValide = true
      }

      this.formScene = opt.scene

	},
	onShow: function () {
    //console.log('onShow***************************')
	},
	onHide: function () {
    //console.log('onHide***************************')
	},
	onError: function (msg) {
		//console.log(msg)
	},
	util: require('we7/resource/js/util.js'),

  tabBarO: {
    "color": "#666666",
    "selectedColor": "#00a1e9",
    "borderStyle": "black",
    "backgroundColor": "#ffffff",
    "list": [
      {
        "pagePath": "super_card/pages/index/index",
        "iconPath": "/super_card/resource/icon/my.png",
        "selectedIconPath": "/super_card/resource/icon/my_selected.png",
        "text": "名片"
      },
      {
        "pagePath": "super_card/pages/card-book/card-book",
        "iconPath": "/super_card/resource/icon/cardbook.png",
        "selectedIconPath": "/super_card/resource/icon/cardbook_selected.png",
        "text": "通讯录"
      },
      /*{
        "pagePath": "super_card/pages/radar/radar",
        "iconPath": "/super_card/resource/icon/radar.png",
        "selectedIconPath": "/super_card/resource/icon/radar_selected.png",
        "text": "雷达"
      },*/
      {
        "pagePath": "super_card/pages/library/library",
        "iconPath": "/super_card/resource/icon/library.png",
        "selectedIconPath": "/super_card/resource/icon/library_selected.png",
        "text": "公开库"
      },
      {
        "pagePath": "super_card/pages/square/square",
        "iconPath": "/super_card/resource/icon/square.png",
        "selectedIconPath": "/super_card/resource/icon/square_selected.png",
        "text": "需求广场"
      },
      {
        "pagePath": "super_card/pages/home/home",
        "iconPath": "/super_card/resource/icon/home.png",
        "selectedIconPath": "/super_card/resource/icon/home_selected.png",
        "text": "我的"
      }
    ]
  },
  tabBar: {
    "color": "#666666",
    "selectedColor": "#00a1e9",
    "borderStyle": "#c8c8c8",
    "backgroundColor": "#fff",
    "list": [
      {
        "pagePath": "/super_card/pages/overt/overt",
        "iconPath": "/super_card/resource/icon/mp.png",
        "selectedIconPath": "/super_card/resource/icon/mp_selected.png",
        "text": "名片"
      },
      {
        "pagePath": "/super_card/pages/overt/mall",
        "iconPath": "/super_card/resource/icon/mall.png",
        "selectedIconPath": "/super_card/resource/icon/mall_selected.png",
        "text": "商城"
      },
      {
        "pagePath": "/super_card/pages/overt/dynamic",
        "iconPath": "/super_card/resource/icon/dynamic.png",
        "selectedIconPath": "/super_card/resource/icon/dynamic_selected.png",
        "text": "动态"
      },
      {
        "pagePath": "/super_card/pages/overt/website",
        "iconPath": "/super_card/resource/icon/official.png",
        "selectedIconPath": "/super_card/resource/icon/official_selected.png",
        "text": "官网"
      }
    ]
  },
  globalData:{
    userInfo : null,
  },
  config: require('super_card/resource/js/config.js'),
  siteDomain: '',
  siteInfo:require('siteinfo.js'),
  freshHolder: false,
  freshHome: false,
  freshIndex: false,
  shareOrScanIsValide:false,
  initSquarePage : false,
  UID:0,
  formIds:[],
  formScene: 0,
  overtHaveBar:false,
  emoji:false,
  platform: false
});
