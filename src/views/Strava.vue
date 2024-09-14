<template>
  <v-container fluid fill-height>
    <div class="text-h1 text-left">Summary of Strava Activities</div>
    <v-row no-gutters class="flex" align="center" justify="center">
      <v-col cols="8" style="min-width: 1000px; min-height: 200px">
        <v-sheet class="pa-2 ma-2">
          <LineChart :chartData="lineChartData" :chartOptions="lineChartOptions" />
        </v-sheet>
      </v-col>
      <v-col cols="2" style="min-width: 300px; min-height: 200px">
        <v-sheet class="pa-2 ma-2">
          <VueDatePicker
            @update:model-value="handleDate"
            model-value="month"
            month-picker
            name="monthPicker"
          />
          <v-sheet class="pa-2 ma-2">
            <StatsCard :stats="statsData" />
          </v-sheet>
        </v-sheet>
      </v-col>
    </v-row>

    <v-row no-gutters class="flex" align="center" justify="center">
      <v-col cols="6" style="min-width: 600px; min-height: 350px">
        <v-sheet class="pa-2 ma-2">
          <BarChart
            :chartData="countBarChartData"
            :chartOptions="countBarChartOptions"
            :width="600"
            :height="350"
          />
        </v-sheet>
      </v-col>
      <v-col cols="6" style="min-width: 600px; min-height: 350px">
        <v-sheet class="pa-2 ma-2">
          <BarChart
            :chartData="distanceBarChartData"
            :chartOptions="distanceBarChartOptions"
            :width="600"
            :height="350"
          />
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import 'chartjs-adapter-moment'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import moment from 'moment'
import { BACKGROUND_COLOURS, BORDER_COLOURS } from '/@/utils/constants'

const LineChart = defineAsyncComponent(() => import('/@/components/LineChart.vue'))
const BarChart = defineAsyncComponent(() => import('/@/components/BarChart.vue'))
const StatsCard = defineAsyncComponent(() => import('/@/components/StatsCard.vue'))

const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss'
export default {
  name: 'StravaDashboard',
  components: {
    BarChart,
    LineChart,
    VueDatePicker,
    StatsCard,
  },
  data() {
    this.lineChartData = {
      labels: [],
      datasets: [],
    }
    this.lineChartOptions = {
      responsive: true,
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
      responsive: true,
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
      responsive: true,
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
    this.statsData = []
    return {
      lineChartData: this.lineChartData,
      lineChartOptions: this.lineChartOptions,
      countBarChartData: this.countBarChartData,
      distanceBarChartData: this.distanceBarChartData,
      distanceBarChartOptions: this.distanceBarChartOptions,
      countBarChartOptions: this.countBarChartOptions,
      month: moment().startOf('month').format(DATE_FORMAT),
      statsData: this.statsData,
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
                borderWidth: 1,
              },
            ],
          }

          this.statsData = [
            {
              metric: 'Activities',
              icon: 'fas fa-person-running',
              value: activity_types
                .map((t) => stravaData.meta_data[t].number_activities)
                .reduce((partialSum, a) => partialSum + a, 0),
            },
            {
              metric: 'Types of Activities',
              icon: 'fas fa-medal',
              value: activity_types.length,
            },
            {
              metric: 'Distance',
              icon: 'fas fa-shoe-prints',
              value: `${activity_types.map((t) => stravaData.meta_data[t].distance).reduce((partialSum, a) => partialSum + a, 0)}m`,
            },
          ]
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
