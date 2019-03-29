//获取小程序配置
var config = {}


config.getConf = function (key) {
  //console.log('key',key)
  var conf = wx.getStorageSync('appConfig');
  // console.log('conf', conf)
  for (var x in conf)
    if (conf[x].code == key) return conf[x].value

},

  config.init = function (cb) {
    var app = getApp()
    var conf = wx.getStorageSync('appConfig');
    console.log(app.util.url('entry/wxapp/getAppConfig'))
    if (!conf) {
      wx.request({
        url: app.util.url('entry/wxapp/getAppConfig'),
        success(res) {

          wx.setStorageSync('appConfig', res.data.data);
          typeof cb == `function` && cb()

        }
      })

      wx.request({
        url: app.util.url('entry/wxapp/getEmojiPic'),
        success: function (res) {
          app.emoji = res.data.data
        }
      })

    } else {
      typeof cb == `function` && cb()
    }



  }


config.set = function (obj) {

  var app = getApp()
  //全局统一设置默认标题
  // wx.setNavigationBarTitle({
  //   title: app.config.getConf('app_name')
  // })

  var nav_set = app.config.getConf('app_nav_set')
  wx.setNavigationBarColor({
    frontColor: (nav_set.top.top_text_color == 1 ? '#ffffff' : '#000000'),
    backgroundColor: nav_set.top.top_bg_color,
    /*animation: {
      duration: 400,
      timingFunc: 'easeIn'
    }*/
  })

  obj.setData({
    setDone: true,
    themeColor: nav_set.app_theme_color,
    themeColorV: nav_set.vice_theme_color
  })

}

config.footer = function (obj) {
  var app = getApp();
  var that = obj;
  var tabBar = app.config.getConf('app_nav_set').bottom

  //console.log(tabBar);
  if (typeof tabBar['list'].length != 'undefined' && tabBar['list'].length < 1) {
    obj.setData({ tabBar: '', 'tabBar.thisurl': '' })


    for (var x in app.tabBarO.list) {
      var index = parseInt(x)
      wx.setTabBarItem({
        index: index,
        text: app.tabBarO.list[x].text,
        iconPath: app.tabBarO.list[x].iconPath,
        selectedIconPath: app.tabBarO.list[x].selectedIconPath
      })
    }

    wx.setTabBarStyle({
      color: tabBar.color,
      selectedColor: tabBar.selectedColor,
      backgroundColor: tabBar.backgroundColor,
      borderStyle: tabBar.borderStyle,
      fail: function (res) {
        console.log(res)
      },
    })

    wx.showTabBar()
    return

  }

  for (var i in tabBar['list']) {
    //tabBar['list'][i]['redirect'] = (tabBar['list'][i]['pagePath'].indexOf('card-book') > -1 ? true : false )
    tabBar['list'][i]['pageUrl'] = tabBar['list'][i]['pagePath'].replace(/(\?|#)[^"]*/g, '')
  }
  wx.hideTabBar()
  that.setData({
    tabBar: tabBar,
    'tabBar.thisurl': that.__route__
  })
};


config.iosPay = function (obj) {

  var app = getApp();
  var that = obj;

  if (app.config.getConf('ios_payment_switch') == 0 && app.platform == 'ios') {
    that.setData({
      iosPayDialog: { visible: true, animateCss: 'wux-animate--fade-in' }
    })
    return false
  }
  return true

}

config.setAd = function (obj) {

  var app = getApp();
  var that = obj;
  var show_ad_switch = app.config.getConf('show_ad_switch')
  if (show_ad_switch != 1) return false

  var show_ad_pos = app.config.getConf('show_ad_pos')
  if (show_ad_pos == '') return false

  var flower_ad_code = app.config.getConf('flower_ad_code')
  //if (flower_ad_code == '' || !/^\<ad .*?\>\<\/ad\>$/.test(flower_ad_code)) return false
  if (flower_ad_code == '' || !/[a-fA-F0-9]{16}/.test(flower_ad_code)) return false
  //console.log(obj)
  var posArr = show_ad_pos.split(",")
  for (var x in posArr) {
    if (posArr[x] == 1 && obj.route.indexOf('card-book') > 0) {
      obj.setData({ adCode1: flower_ad_code })
      break
    }
    if (posArr[x] == 5 && obj.route.indexOf('square') > 0) {
      obj.setData({ adCode5: flower_ad_code })
    }
    if (posArr[x] == 6 && obj.route.indexOf('square') > 0) {
      obj.setData({ adCode6: flower_ad_code })
      break
    }
    if (posArr[x] == 2 && obj.route.indexOf('library') > 0) {
      obj.setData({ adCode2: flower_ad_code })
    }
    if (posArr[x] == 3 && obj.route.indexOf('library') > 0) {
      obj.setData({ adCode3: flower_ad_code })
      break
    }

  }
  //console.log(flower_ad_code)

}


config.comebackUpdate = function () {
  wx.setStorageSync('comebacks_set_time', (Date.parse(new Date()) / 1000) - (60 * 30))
}

//获取回传的名片
config.setUserComeback = function (cb) {

  var setTime = wx.getStorageSync('comebacks_set_time')
  var currTime = Date.parse(new Date()) / 1000
  if ((currTime - setTime) < (60 * 30)) return

  wx.removeStorageSync('comebacks')

  var app = getApp()
  wx.request({
    url: app.util.url('entry/wxapp/getUserComeback'),
    success(res) {
      //console.log(res)
      //if (res.data.data.length > 0) wx.showTabBarRedDot({ index: 1 })
      wx.setStorageSync('comebacks', res.data.data)
      wx.setStorageSync('comebacks_set_time', Date.parse(new Date()) / 1000)

      typeof cb == `function` && cb()

    }
  })
},

  //名片雷达追踪
  config.cardTrack = function (card_id, type, sign, target) {

    var app = getApp()
    wx.request({
      url: app.util.url('entry/wxapp/recordCardTrack'),
      data: {
        card_id: card_id,
        type: type,
        sign: sign,
        target: target,
        scene: app.formScene
      },
      success: function (res) {
        console.log(res)
      }
    })

  }

module.exports = config;
