<template>
  <div id="header">Summary of Strava Activities</div>
  <div id="grid">
    <div class="wide">
      <LineChart
        :chartData="lineChartData"
        :chartOptions="lineChartOptions"
        :width="500"
        :height="200"
      />
    </div>
    <div class="widget">
      <VueDatePicker
        @update:model-value="handleDate"
        model-value="month"
        month-picker
        name="monthPicker"
      />
    </div>

    <div class="medium">
      <BarChart
        :chartData="countBarChartData"
        :chartOptions="countBarChartOptions"
        :width="400"
        :height="200"
      />
    </div>
    <div class="medium">
      <BarChart
        :chartData="distanceBarChartData"
        :chartOptions="distanceBarChartOptions"
        :width="400"
        :height="200"
      />
    </div>
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
    this.lineChartOptions = {
      showLine: true,
      scales: {
        y: {
          min: 0,
          title: {
            display: true,
            text: 'Distance',
          },
          ticks: {
            callback: function (value, _index, _values) {
              return Number((value / 1000).toString()) + 'K' //pass tick values as a string into Number function
            },
          },
        },
        x: {
          display: true,
          type: 'time',
          time: {
            unit: 'day',
          },
          title: {
            display: true,
            text: 'Date',
          },
        },
      },
    }
    this.countBarChartData = {
      labels: [],
      datasets: [],
    }
    this.distanceBarChartData = {
      labels: [],
      datasets: [],
    }
    this.countBarChartOptions = {
      responsive: false,
      scales: {
        y: {
          min: 0,
          title: {
            display: true,
            text: 'Count',
          },
          ticks: {
            callback: function (value) {
              if (value % 1 === 0) {
                return value
              }
            },
          },
        },
      },
    }
    this.distanceBarChartOptions = {
      responsive: false,
      scales: {
        y: {
          min: 0,
          title: {
            display: true,
            text: 'Distance',
          },
          ticks: {
            callback: function (value, _index, _values) {
              return Number((value / 1000).toString()) + 'K' //pass tick values as a string into Number function
            },
          },
        },
      },
    }
    return {
      lineChartData: this.lineChartData,
      lineChartOptions: this.lineChartOptions,
      countBarChartData: this.countBarChartData,
      distanceBarChartData: this.distanceBarChartData,
      distanceBarChartOptions: this.distanceBarChartOptions,
      countBarChartOptions: this.countBarChartOptions,
      month: moment().startOf('month').format(DATE_FORMAT),
    }
  },
  mounted() {
    this.fetchDataFromAPI()
  },
  methods: {
    fetchDataFromAPI() {
      // This is dirty
      const endDate = moment(this.month).endOf('month').format(DATE_FORMAT)
      const url = `http://localhost:5000/strava/summary?start=${this.month}&end=${endDate}`
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
          this.countBarChartData = {
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
      // Month picker event
      this.month = moment(modelData).format(DATE_FORMAT)
      // Re-fetch the data
      this.fetchDataFromAPI()
    },
  },
}
</script>
