<template>
  <LineChart :chartData="lineChartData" :chartOptions="lineChartOptions" />
</template>

<script>
import { defineAsyncComponent } from 'vue'
import 'chartjs-adapter-moment'

const LineChart = defineAsyncComponent(() => import('/@/components/LineChart.vue'))

const defaultMaxY = 18
export default {
  name: 'GlucoseExerciseDashboard',
  components: {
    LineChart,
  },
  data() {
    this.lineChartData = {
      labels: [],
      datasets: [],
    }
    this.lineChartOptions = {
      showLine: false,
      scales: {
        y: {
          min: 0,
          suggestedMax: defaultMaxY,
        },
        x: {
          display: true,
          //ticks: {stepSize: 15},
          stepSize: 1,
          min: -60,
          title: {
            display: true,
            text: 'Minutes since exercise',
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
      fetch('http://localhost:5000/strava-libre/summary', {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((glucoseData) => {
          console.log('Getting Strava and Libre Data')
          const { mean: meanData, median: medianData, intervals, std: stdData } = glucoseData

          const formattedChartData = {
            datasets: [
              {
                label: 'Lower Var Glucose Level',
                fill: false,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 1,
                pointRadius: 3,
                data: meanData.map((d, index) => ({
                  x: intervals[index] / 60 - 60,
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
                data: meanData.map((d, index) => ({ x: intervals[index] / 60 - 60, y: d })),
              },

              {
                label: 'Upper Var Glucose Level',
                fill: 0,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 1,
                pointRadius: 3,
                data: meanData.map((d, index) => ({
                  x: intervals[index] / 60 - 60,
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
                data: medianData.map((d, index) => ({ x: intervals[index] / 60 - 60, y: d })),
              },
            ],
            labels: intervals.map((d) => Math.round(d / 60) - 60),
          }
          this.lineChartData = formattedChartData
        })
        .catch((e) => {
          console.log('*******Error**********')
          console.log(e)
        })
    },
  },
}
</script>
