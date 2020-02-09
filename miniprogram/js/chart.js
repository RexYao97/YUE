import geoJson from "./mapData";
import echarts from "../ec-canvas/echarts";
module.exports = {
  initChart: function(canvas, width, height, seriesData) {
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height
    });
    canvas.setChart(chart);
    //  console.log(geoJson)
    echarts.registerMap("china", geoJson);

    const option = {
      tooltip: {
        trigger: "item"
      },
      visualMap: {
        min: 0,
        max: 34000,
        // splitNumber: 5,
        pieces:[
            {min: 5001}, // 不指定 max，表示 max 为无限大（Infinity）。
            {min: 3001, max: 5000},
            {min: 1001, max: 3000},
            {min: 101, max: 1000},
            {min: 11, max: 100},
            // {value: 123, label: '123（自定义特殊颜色）', color: 'grey'}, // 表示 value 等于 123 的情况。
            {max: 10}     // 不指定 min，表示 min 为无限大（-Infinity）。
        ],
        color: ['#96d1d2','#72b1b9','#4e91a0','#2a7187','#06516e'].reverse(),
        textStyle: {
            color: '#000'
        }
      },
      textStyle:{
        fontSize:10,
        color:'#f1f1f1'
      },
      series: [
        {
          type: "map",
          mapType: "china",
          label: {
            normal: {
              show: true
            },
            emphasis: {
              textStyle: {
                color: "#fff"
              }
            }
          },
          itemStyle: {
            normal: {
              borderColor: "#389BB7",
              areaColor: "#fff"
            },
            emphasis: {
              areaColor: "#389BB7",
              borderWidth: 0
            }
          },
          animation: false,

          data: seriesData
        }
      ]
    };

    chart.setOption(option);

    return chart;
  }
};
