<template>
  <div id="header">Glucose Levels</div>
  <div id="grid">
    <div class="wide">
      <LineChart
        :chartData="lineChartData"
        :chartOptions="lineChartOptions"
        :width="500"
        :height="200"
      />
    </div>
    <div>
      <VueDatePicker
        @update:model-value="handleWeek"
        model-value="week"
        week-picker
        name="weekPicker"
        :week-numbers="{ type: 'iso' }"
      />
    </div>
    <div class="medium">
      <BarChart
        :chartData="barChartData"
        :chartOptions="barChartOptions"
        :width="400"
        :height="200"
      />
    </div>
    <div class="medium">
      <BarChart
        :chartData="barChartData"
        :chartOptions="barChartOptions"
        :width="400"
        :height="200"
      />
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import 'chartjs-adapter-moment'
import moment from 'moment'

const LineChart = defineAsyncComponent(() => import('/@/components/LineChart.vue'))
const BarChart = defineAsyncComponent(() => import('/@/components/BarChart.vue'))
const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss'

const defaultMaxY = 18
export default {
  name: 'GlucoseDashboard',
  components: {
    LineChart,
    BarChart,
    VueDatePicker,
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
      week: [
        moment().startOf('week').format(DATE_FORMAT),
        moment().endOf('week').format(DATE_FORMAT),
      ],
    }
  },
  mounted() {
    this.fetchDataFromAPI()
  },
  methods: {
    fetchDataFromAPI() {
      fetch(`http://localhost:5000/glucose?start=${this.week[0]}&end=${this.week[1]}`, {
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
    handleWeek(modelData) {
      // Month picker event
      console.log(modelData)
      this.week = modelData.map((d) => moment(d).format(DATE_FORMAT))
      // Re-fetch the data
      this.fetchDataFromAPI()
    },
  },
}
</script>
