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
    <VueDatePicker :model-value="date" @update:model-value="handleDate" range />
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import 'chartjs-adapter-moment'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import moment from 'moment'

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
  //setup() {
  //  const startDate = ref();
  //  const endDate = ref();
  //  return {
  //    startDate,
  //    endDate
  //  }},
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
    this.barChartOptions = {}
    const nowDate = moment().format(DATE_FORMAT)
    const firstOfMonth = moment().startOf('month').format(DATE_FORMAT)
    return {
      lineChartData: this.lineChartData,
      lineChartOptions: this.lineChartOptions,
      barChartData: this.barChartData,
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
          console.log('Getting Strava Data')
          // Get the different activity types
          const activity_types = Object.keys(stravaData.meta_data)
          console.log(activity_types)
          // For each activity type create the data
          this.lineChartData = {
            labels: stravaData.timestamped_data.map((d) => d[0]),
            datasets: activity_types.map((a_type) => ({
              label: a_type,
              fill: false,
              borderColor: 'rgb(251, 8, 162)',
              backgroundColor: 'rgb(251, 8, 162)',
              borderWidth: 1,
              pointRadius: 3,
              data: stravaData.timestamped_data
                .filter((d) => d[1] == a_type)
                .map((d) => ({ x: d[0], y: d[2] })),
            })),
          }
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
