<template>
  <div id="grid">
    <div class="wide">
      <LineChart
        :chartData="lineChartData"
        :chartOptions="lineChartOptions"
        :width="50"
        :height="10"
      />
    </div>
    <BarChart
      :chartData="barChartData"
      :chartOptions="barChartOptions"
      :width="450"
      :height="200"
    />
    <BarChart
      :chartData="barChartData"
      :chartOptions="barChartOptions"
      :width="450"
      :height="200"
    />
    <BarChart
      :chartData="barChartData"
      :chartOptions="barChartOptions"
      :width="450"
      :height="200"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
// TODO: import GlucoseService from '/@/services/glucose.ts'
import 'chartjs-adapter-moment'

const LineChart = defineAsyncComponent(() => import('/@/components/LineChart.vue'))
const BarChart = defineAsyncComponent(() => import('/@/components/BarChart.vue'))

const defaultMaxY = 18
export default {
  name: 'GlucoseDashboard',
  components: {
    LineChart,
    BarChart,
  },
  data() {
    this.avChartData = {
      labels: [],
      datasets: [],
    }
    this.lineChartData = {
      labels: [],
      datasets: [],
    }
    this.barChartData = {
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
          type: 'time',
          title: {
            display: true,
            text: 'Date',
          },
        },
      },
    }
    this.barChartOptions = { responsive: false } //responsive:false, maintainAspectRatio:false}
    return {
      avChartData: this.avChartData,
      lineChartData: this.lineChartData,
      barChartData: this.barChartData,
      lineChartOptions: this.lineChartOptions,
      barChartOptions: this.barChartOptions,
    }
  },
  mounted() {
    this.fetchDataFromAPI()
  },
  methods: {
    fetchDataFromAPI() {
      fetch('http://localhost:5000/glucose', {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((glucoseData) => {
          console.log('Getting Glucose Data')
          const maxValue = Math.max(...glucoseData.map((d) => d[1])) + 1
          console.log(maxValue)
          const formattedChartData = {
            datasets: [
              {
                label: 'Glucose Level Tracker',
                fill: false,
                borderColor: 'rgb(251, 8, 162)',
                backgroundColor: 'rgb(251, 8, 162)',
                borderWidth: 1,
                pointRadius: 3,
                data: glucoseData.map((d) => ({ x: d[2], y: d[1] })),
              },
              {
                label: 'low',
                radius: 0,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.1,
                hoverOffset: 4,
                data: glucoseData.map((d) => ({ x: d[2], y: 4 })),
                fill: true,
              },
              {
                label: 'target',
                radius: 0,
                backgroundColor: 'rgb(221,255,221)',
                tension: 0.1,
                hoverOffset: 4,
                data: glucoseData.map((d) => ({ x: d[2], y: 10 })),
                fill: 1,
              },
              {
                label: 'high',
                radius: 0,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.1,
                hoverOffset: 4,
                data: glucoseData.map((d) => ({ x: d[2], y: maxValue })),
                fill: 2,
              },
            ],
            labels: glucoseData.map((d) => d[2]),
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

      // Bar CHart data
      fetch('http://localhost:5000/strava/summary', {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((stravaData) => {
          console.log('Getting Strava Data')
          this.barChartData = {
            labels: stravaData.activity,
            datasets: [
              {
                label: 'Activity Count',
                data: stravaData.number_activities,
              },
            ],
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
