const app = getApp();
import dataFormate from '../../js/data.js'
import {initChart} from '../../js/chart.js'
import utils from '../../js/utils.js'
Page({
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    ec: {},
    canvasDom :'',
    mapData: [],
    mapShow:false,
    dailyTextContent:{}
  },

  async  onLoad() {
    let tableName = '92807'
    let mapData = await utils.httpGet(tableName)
    let dailyTextContent = await utils.httpGet('92979')
    // console.log(dailyTextContent)
    mapData = utils.handleData(mapData, dataFormate)
    this.setData({
      ec: {
        onInit: initChart,
        lazyLoad:true
      },
      dailyTextContent:dailyTextContent
      // canvasDom: canvasDom
    })
    let canvasDom = this.selectComponent('#mychart-dom-area')
    canvasDom.setSeriesData(mapData)
    canvasDom.init()
    //  console.log(result)
    // this.ec.lazyLoad=false
  }
});
