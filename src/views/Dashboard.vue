<template>
  <LineChart :chartData="lineChartData" :chartOptions="lineChartOptions" :width="50" :height="10" />
</template>

<script>
import { defineAsyncComponent } from 'vue'
// TODO: import GlucoseService from '/@/services/glucose.ts'
import 'chartjs-adapter-moment'
import moment from 'moment'
const LineChart = defineAsyncComponent(() => import('/@/components/LineChart.vue'))

const defaultMaxY = 18
export default {
  name: 'GlucoseAverage',
  components: {
    LineChart,
  },
  data() {
    this.lineChartData = {
      labels: [],
      datasets: [],
    }
    this.lineChartOptions = {
      //showLine: false,
      scales: {
        y: {
          min: 0,
          suggestedMax: defaultMaxY,
        },
        x: {
          display: true,
          type: 'time',
          //unit: "minute",
          min: moment('00:00:01', 'hh:mm:ss'),
          title: {
            display: true,
            text: 'Time',
          },
        },
      },
    }
    return {
      lineChartData: this.lineChartData,
      lineChartOptions: this.lineChartOptions,
    }
  },
  mounted() {
    this.fetchDataFromAPI()
  },
  methods: {
    fetchDataFromAPI() {
      fetch('http://localhost:5000/glucose/aggregate/15min', {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((glucoseData) => {
          console.log('Getting Seven Day Glucose Data')
          console.log(glucoseData)
          const {
            mean: meanData,
            median: medianData,
            raw: rawData,
            intervals,
            std: stdData,
          } = glucoseData
          console.log(meanData)
          const maxValue = Math.max(...rawData.flat(1)) + 1
          const formattedChartData = {
            datasets: [
              {
                label: 'Lower Var Glucose Level',
                fill: false,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 1,
                pointRadius: 3,
                data: meanData.map((d, index) => ({
                  x: moment(intervals[index], 'hh:mm'),
                  y: d - stdData[index],
                })),
              },
              {
                label: 'Mean Glucose Level',
                fill: 1,
                borderColor: 'rgb(251, 8, 162)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 1,
                pointRadius: 3,
                data: meanData.map((d, index) => ({ x: moment(intervals[index], 'hh:mm'), y: d })),
              },

              {
                label: 'Upper Var Glucose Level',
                fill: 0,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 1,
                pointRadius: 3,
                data: meanData.map((d, index) => ({
                  x: moment(intervals[index], 'hh:mm'),
                  y: d + stdData[index],
                })),
              },
              {
                label: 'Median Glucose Level',
                fill: false,
                borderColor: '#08fb49',
                backgroundColor: '#08fb49',
                borderWidth: 1,
                pointRadius: 3,
                data: medianData.map((d, index) => ({
                  x: moment(intervals[index], 'hh:mm'),
                  y: d,
                })),
              },
            ],
            labels: intervals.map((d) => moment(d, 'hh:mm')),
          }
          this.lineChartData = formattedChartData
          const def = this.lineChartOptions
          this.lineChartOptions = {
            ...def,
            scales: { ...def.scales, y: { ...def.scales.y, max: maxValue } },
          }
        })
        .catch((e) => {
          console.log('*******Error**********')
          console.log(e)
        })
    },
  },
}
</script>
