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
      :width="400"
      :height="200"
    />
    <BarChart
      :chartData="distanceBarChartData"
      :chartOptions="barChartOptions"
      :width="400"
      :height="200"
    />
    <VueDatePicker :model-value="date" @update:model-value="handleDate" range />
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import 'chartjs-adapter-moment'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import moment from 'moment'

const BACKGROUND_COLOURS = [
  'rgba(255, 99, 132, 0.2)',
  'rgba(255, 159, 64, 0.2)',
  'rgba(255, 205, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(153, 102, 255, 0.2)',
  'rgba(201, 203, 207, 0.2)',
]
const BORDER_COLOURS = [
  'rgb(255, 99, 132)',
  'rgb(255, 159, 64)',
  'rgb(255, 205, 86)',
  'rgb(75, 192, 192)',
  'rgb(54, 162, 235)',
  'rgb(153, 102, 255)',
  'rgb(201, 203, 207)',
]
const LineChart = defineAsyncComponent(() => import('/@/components/LineChart.vue'))
const BarChart = defineAsyncComponent(() => import('/@/components/BarChart.vue'))
const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss'
export default {
  name: 'StravaDashboard',
  components: {
    BarChart,
    LineChart,
    VueDatePicker,
  },
  data() {
    this.lineChartData = {
      labels: [],
      datasets: [],
    }
    this.lineChartOptions = {}
    this.barChartData = {
      labels: [],
      datasets: [],
    }
    this.distanceBarChartData = {
      labels: [],
      datasets: [],
    }
    this.barChartOptions = { responsive: false }
    const nowDate = moment().format(DATE_FORMAT)
    const firstOfMonth = moment().startOf('month').format(DATE_FORMAT)
    return {
      lineChartData: this.lineChartData,
      lineChartOptions: this.lineChartOptions,
      barChartData: this.barChartData,
      distanceBarChartData: this.distanceBarChartData,
      barChartOptions: this.barChartOptions,
      date: [firstOfMonth, nowDate],
    }
  },
  mounted() {
    this.fetchDataFromAPI()
  },
  methods: {
    fetchDataFromAPI() {
      // This is dirty
      const url = `http://localhost:5000/strava/summary?start=${this.date[0]}&end=${this.date[1]}`
      // Strava data
      fetch(url, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((stravaData) => {
          // Get the different activity types
          const activity_types = Object.keys(stravaData.meta_data)
          // For each activity type create the data
          this.lineChartData = {
            labels: stravaData.timestamped_data.map((d) => d[0]),
            datasets: activity_types.map((a_type, idx) => ({
              label: a_type,
              fill: false,
              borderColor: BORDER_COLOURS[idx],
              backgroundColor: BACKGROUND_COLOURS[idx],
              borderWidth: 1,
              pointRadius: 3,
              data: stravaData.timestamped_data
                .filter((d) => d[1] == a_type)
                .map((d) => ({ x: d[0], y: d[2] })),
            })),
          }
          this.barChartData = {
            labels: activity_types,
            datasets: [
              {
                label: 'Activity Count',
                data: activity_types.map((t) => stravaData.meta_data[t].number_activities),
                backgroundColor: BACKGROUND_COLOURS,
                borderColor: BORDER_COLOURS,
                borderWidth: 1,
              },
            ],
          }
          this.distanceBarChartData = {
            labels: activity_types,
            datasets: [
              {
                label: 'Activity Distance',
                data: activity_types.map((t) => stravaData.meta_data[t].distance),
                backgroundColor: BACKGROUND_COLOURS,
                borderColor: BORDER_COLOURS,
                borderWidth: 1,
              },
            ],
          }
        })
        .catch((e) => {
          console.log('*******Error**********')
          console.log(e)
        })
    },
    handleDate(modelData) {
      // Date picker event
      this.date = [
        moment(modelData[0]).format(DATE_FORMAT),
        moment(modelData[1]).format(DATE_FORMAT),
      ]
      // Re-fetch the data
      this.fetchDataFromAPI()
    },
  },
}
</script>
