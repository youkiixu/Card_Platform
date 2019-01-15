// super_card/pages/customer-details/customer-details.js

import * as echarts from '../../components/ec-canvas/echarts';
import { $wuxPicker, $wuxDialog } from '../../components/wux'


var app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemChioce:1,

    ecBar: { lazyLoad: true },
    ecPie: { lazyLoad: true },
    ecLine: { lazyLoad: true },

    client_id :0 ,
    client_info: {},
    trackList: [], 
    recordList: [],

    cxt_arc:{},
    
    note: '',
    showNoteInput: false,

    rate_value_index: 0,
    rate_arr: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],

    page:1,
    lastPage: false,

    intre_times_index: 2,
    intre_times:['今日', '近7天', '近30天', '本月'],
    intre_times_val: ['today', 'days7', 'days30', 'month'],

    inter_times_index: 2,
    inter_times: ['今日', '近7天', '近30天', '本月', '全部'],
    inter_times_val: ['today', 'days7', 'days30', 'month', 'whole'],

    active_times_index: 1,
    active_times: ['近7天', '近15天', '近30天'],
    active_times_val: ['days7', 'days15', 'days30'],
  },


  contactClient:function (){
    
    var that = this
    wx.showActionSheet({
      itemList: ['发消息', '拨打电话'],
      success: function (res) {
        //console.log(res.tapIndex)
        var index = res.tapIndex;
        switch (index) {
          case 0:
            console.log('发消息')
            //回传开始
            app.util.request({
              'url': 'entry/wxapp/startChat',
              //'cachetime': '30',
              'data': { t_uid: that.data.client_info.c_uid, t_card_id: that.data.client_info.c_card_id, card_id: that.data.client_info.card_id },
              success(res) {

                wx.navigateTo({
                  url: '../../pages/chat/chat?chat_id=' + res.data.data + '&from=radar'
                })

              }
            })
            
            break;
          case 1:
            console.log('拨打电话')
            console.log(that.data.client_info.mobile)
            wx.makePhoneCall({
              phoneNumber: that.data.client_info.mobile,
            })
            break;
         
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    });

  },

  startNote: function (e){
    this.setData({ showNoteInput: true })
  },

  saveClientNote:function (e){
    
    var that = this
    
    that.data.note = e.detail.value

    if (!that.data.note || that.data.client_info.note == that.data.note){
      that.setData({ showNoteInput: false })
      return
    } 

    app.util.request({
      'url': 'entry/wxapp/updateClientStuff',
      'data': { client_id: that.data.client_id, note: that.data.note },
      success(res) {
        that.setData({ 'client_info.note': that.data.note, showNoteInput: false })
      }
    })

  },

  delRecord: function (e){

    var that = this
    console.log(e)
    var r_id = e.target.dataset.id
    var r_index = e.target.dataset.index
    $wuxDialog.confirm({
      title: '',
      content: '确定要删除吗？',
      onConfirm(e) {

        var data = {
          r_id: r_id
        }

        app.util.request({
          'url': 'entry/wxapp/delClientRecord',
          //'cachetime': '30',
          'method': 'POST',
          'data': data,
          success(res) {
           
            wx.showToast({
              title: '删除成功',
              icon: 'success',
            })
            that.data.recordList.splice(r_index, 1)
            that.setData({ recordList: that.data.recordList })

          }
        })

      },
      onCancel(e) {
       
      }
    })

  },


  getIntreChart: function (e){
    var that = this

    var intre_times_index = e.detail.value
    var time_t = that.data.intre_times_val[intre_times_index]
    if (intre_times_index == that.data.intre_times_index) return

    const ecPieComponent = this.selectComponent('#mychart-dom-pie');

    app.util.request({
      'url': 'entry/wxapp/clientIntreData',
      'data': { client_id: that.data.client_id, time_t: time_t },
      success(res) {

        that.setData({ intre_times_index: intre_times_index })

        var data = res.data.data

        ecPieComponent.init((canvas, width, height) => {

          const pieChart = echarts.init(canvas, null, {
            width: width,
            height: height
          });
          pieChart.setOption(getPieOption(data));

          return pieChart;
        });

      }

    })
  },

  getInterChart: function (e) {
    var that = this

    var inter_times_index = e.detail.value
    var time_t = that.data.inter_times_val[inter_times_index]
    if (inter_times_index == that.data.inter_times_index) return

    const ecBarComponent = this.selectComponent('#mychart-dom-bar');

    app.util.request({
      'url': 'entry/wxapp/clientInterData',
      'data': { client_id: that.data.client_id, time_t: time_t },
      success(res) {
        that.setData({ inter_times_index: inter_times_index })

        var data = res.data.data
        ecBarComponent.init((canvas, width, height) => {
          const barChart = echarts.init(canvas, null, {
            width: width,
            height: height
          });
          canvas.setChart(barChart);
          barChart.setOption(getBarOption(data));

          return barChart;
        });

      }
      });
  },

  getActiveChart: function (e) {
    var that = this

    var active_times_index = e.detail.value
    var time_t = that.data.active_times_val[active_times_index]

    if (active_times_index == that.data.active_times_index) return

    const ecLineComponent = this.selectComponent('#mychart-dom-line');
    app.util.request({
      'url': 'entry/wxapp/clientActiveData',
      'data': { client_id: that.data.client_id, time_t: time_t },
      success(res) {

        that.setData({ active_times_index: active_times_index })
     

        var data = res.data.data
        ecLineComponent.init((canvas, width, height) => {

          const lineChart = echarts.init(canvas, null, {
            width: width,
            height: height
          });
          canvas.setChart(lineChart);
          lineChart.setOption(getLineOption(data));

          return lineChart;

        });

      }
    })

  },


  updateClientRate: function (e){

    var rate_value_index = e.detail.value
    var that = this

    if(rate_value_index == that.data.rate_value_index) return

    var rate = that.data.rate_arr[rate_value_index]
    var that = this
    app.util.request({
      'url': 'entry/wxapp/updateClientRate',
      'data': { client_id: that.data.client_id, rate: rate },
      success(res) {

        var data = res.data.data
        //console.log(data)
        that.setData({ 'client_info.rate': rate })
        that.setData({ rate_value_index: rate_value_index })
        that.drawRateArc(parseInt(rate) / 100)

      }
    })

  },



  toFollowRecord: function (){
    wx.navigateTo({
      url: 'follow-record?client_id=' + this.data.client_id,
    })
  },


  /**
 *轨迹-智能分析-跟进记录 选择
 */
  goChangeItemChioce: function (event) {
    var cic = event.currentTarget.dataset.replyType
    var that = this
    if (cic == that.data.itemChioce) {
      return
    } else {

      that.setData({ itemChioce: cic })

      if (that.data.itemChioce == 1) {
        that.data.page = 1
        that.data.lastPage = false
        that.getTrackList()
      }
      if (that.data.itemChioce == 2) {
        that.getChartData()
      }
      if (that.data.itemChioce == 3) {
        that.data.page = 1
        that.data.lastPage = false
        that.getFllowRecord(function () {
          wx.stopPullDownRefresh()
        })
      }

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (typeof options.client_id == 'undefined' || options.client_id < 1)
      wx.navigateBack()

    this.setData({ client_id: options.client_id })
    this.getClientItem()
  },


  getClientItem: function (){

    var that = this
    app.util.request({
      'url': 'entry/wxapp/getClientItem',
      'data': { client_id: that.data.client_id },
      success(res) {
        var data = res.data.data
        //console.log(data)

        that.setData({ client_info: data.client_info,  trackList: data.trackList, recordList: data.recordList })

        var rate = parseInt(that.data.client_info.rate)
        that.setData({ rate_value_index: that.data.rate_arr.indexOf(rate) })
        that.drawRateArc(rate / 100)

      }
    })


  },


  getTrackList: function (callback = false, mode = 'cover'){

    var that = this
    app.util.request({
      'url': 'entry/wxapp/getTrackCuserDetail',
      'data': { card_id: that.data.client_info.c_card_id, to_card_id: that.data.client_info.card_id, page: that.data.page },
      success(res) {

        typeof callback === `function` && callback()
        var data = res.data.data

        if (mode == 'append') {
          if (!res.data.data.length) {
            that.data.lastPage = true
            return false
          }
          that.data.trackList = that.data.trackList.concat(res.data.data)
        } else {
          that.data.trackList = res.data.data
        }

        that.setData({
          trackList: that.data.trackList,
        })

      }
    })

  },

  getFllowRecord: function (callback = false, mode = 'cover') {

    var that = this
    app.util.request({
      'url': 'entry/wxapp/getFllowRecord',
      'data': { client_id: that.data.client_id, page: that.data.page },
      success(res) {

        typeof callback === `function` && callback()
        var data = res.data.data

        if (mode == 'append') {
          if (!res.data.data.length) {
            that.data.lastPage = true
            return false
          }
          that.data.recordList = that.data.recordList.concat(res.data.data)
        } else {
          that.data.recordList = res.data.data
        }

        that.setData({
          recordList: that.data.recordList,
        })

      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  drawRateArc: function (a = 0.2){

    var b = 1.6 * a + 0.7
    if (b > 2) {
      b = b - 2
    }

    var that = this
    // 页面渲染完成 
    that.data.cxt_arc = wx.createCanvasContext('canvasArc');//创建并返回绘图上下文context对象。 
    that.data.cxt_arc.setLineWidth(6);
    that.data.cxt_arc.setStrokeStyle('#afe3a5');
    that.data.cxt_arc.setLineCap('round')
    that.data.cxt_arc.beginPath();//开始一个新的路径
    that.data.cxt_arc.arc(50, 50, 40, 0.7 * Math.PI, 0.3 * Math.PI, false);//设置一个原点(50,50)，半径为40的圆的路径到当前路径 
    that.data.cxt_arc.stroke();//对当前路径进行描边 

    that.data.cxt_arc.setLineWidth(6);
    that.data.cxt_arc.setStrokeStyle('#feffff');
    that.data.cxt_arc.setLineCap('round')
    that.data.cxt_arc.beginPath();//开始一个新的路径 
    that.data.cxt_arc.arc(50, 50, 40, 0.7 * Math.PI, Math.PI * b, false);
    that.data.cxt_arc.stroke();//对当前路径进行描边 
    that.data.cxt_arc.draw(true);

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

      var that = this

      that.data.page = 1
      that.data.lastPage = false
      if(that.data.itemChioce == 1){
        that.getTrackList(function () {
          wx.stopPullDownRefresh()
        })
      }
      if (that.data.itemChioce == 2) {
        that.getChartData(function () {
          wx.stopPullDownRefresh()
        })
      }
      if (that.data.itemChioce == 3) {
        that.getFllowRecord(function () {
          wx.stopPullDownRefresh()
        })
      }

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this

    if (that.data.lastPage === true) return false
    
     
    if (that.data.itemChioce == 1) {
      that.data.page++
      that.getTrackList('', 'append')
    }
    if (that.data.itemChioce == 2) {

    }
    if (that.data.itemChioce == 3) {
      that.data.page++
      that.getFllowRecord('', 'append')
    }

  },

  getChartData: function (callback = false){

    const ecPieComponent = this.selectComponent('#mychart-dom-pie');
    const ecBarComponent = this.selectComponent('#mychart-dom-bar');
    const ecLineComponent = this.selectComponent('#mychart-dom-line');

    var that = this
    app.util.request({
      'url': 'entry/wxapp/clientChartData',
      'data': { client_id: that.data.client_id },
      success(res) {

        typeof callback === `function` && callback()

        that.setData({ intre_times_index: 2, inter_times_index: 2, active_times_index: 1 })

        console.log(res.data.data)

        var data = res.data.data
        
        //客户兴趣环形图
        if(typeof data.intre != `undefiend`){
          
          ecPieComponent.init((canvas, width, height) => {

            const pieChart = echarts.init(canvas, null, {
              width: width,
              height: height
            });
            pieChart.setOption(getPieOption(data.intre));

            return pieChart;
          });
      
        }

        if (typeof data.inter != `undefiend`) {
          ecBarComponent.init((canvas, width, height) => {
            const barChart = echarts.init(canvas, null, {
              width: width,
              height: height
            });
            canvas.setChart(barChart);
            barChart.setOption(getBarOption(data.inter));

            return barChart;
          });
        }

        if (typeof data.active != `undefiend`) {

          ecLineComponent.init((canvas, width, height) => {

            const lineChart = echarts.init(canvas, null, {
              width: width,
              height: height
            });
            canvas.setChart(lineChart);
            lineChart.setOption(getLineOption(data.active));

            return lineChart;

          });

        }

        //客户互动情况柱状图

        //近15日客户活跃度折线图

      }
    })

  },

})

function getBarOption(data) {
  return {
    color: ['#32C5E9'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    /*legend: {
      data: ['热度', '正面', '负面']
    },*/
    grid: {
      left: 20,
      right: 20,
      bottom: 15,
      top: 40,
      containLabel: true
    },
    xAxis: [
      {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    yAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: data.names,
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    series: [
      {
        name: '互动情况',
        type: 'bar',
        label: {
          normal: {
            show: false,
            position: 'inside'
          }
        },
        data: data.counts
      },
    ]
  };
}

function getPieOption(data) {

  var option = {
    legend: {
      bottom: -5,
      data: data.legend
    },
    backgroundColor: "#ffffff",
    color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
    series: [{
      label: {
        normal: {
          fontSize: 12
        }
      },
      labelLine: {
        normal: {
          show: true
        }
      },
      type: 'pie',
      center: ['50%', '50%'],
      radius: ['50%', '70%'],
      data: data.counts,
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 2, 2, 0.3)'
        }
      }

    }]
  };

  return option
}

function getLineOption(data) {

  var option = {
    color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
    /*legend: {
      data: ['A', 'B', 'C'],
      top: 50,
      left: 'center',
      backgroundColor: 'red',
      z: 100
    },*/
    grid: {
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.dates,
      // show: false
    },
    yAxis: {
      x: 'center',
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
      // show: false
    },
    series: [{
      name: '活跃度',
      type: 'line',
      areaStyle: {},
      data: data.counts,
    }]
  };
  return option

}