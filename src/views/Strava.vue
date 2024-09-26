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
import { formatString } from '/@/utils/helpers'
import StravaService from '/@/services/strava.ts'

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
            step: 5,
          },
          unit: 'day',
          ticks: {
            // forces step size to be 2 hours
            stepSize: 2,
          },
          title: {
            display: true,
            text: 'Date',
          },
        },
      },
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
    return {
      lineChartData: {
        labels: [],
        datasets: [],
      },
      lineChartOptions: this.lineChartOptions,
      countBarChartData: {
        labels: [],
        datasets: [],
      },
      distanceBarChartData: {
        labels: [],
        datasets: [],
      },
      distanceBarChartOptions: this.distanceBarChartOptions,
      countBarChartOptions: this.countBarChartOptions,
      month: moment().startOf('month').format(DATE_FORMAT),
      endDate: moment().startOf('month').format(DATE_FORMAT),
      statsData: [],
      stravaService: new StravaService(),
    }
  },
  mounted() {
    this.fetchDataFromAPI()
  },
  methods: {
    handleDate(date) {
      // Month picker event
      this.month = moment(date).startOf('month').format(DATE_FORMAT)
      // Re-fetch the data
      this.fetchDataFromAPI()
    },
    async fetchDataFromAPI() {
      const data = await this.stravaService.getData(
        moment(this.month).startOf('month').format(DATE_FORMAT),
        moment(this.month).endOf('month').format(DATE_FORMAT),
      )
      const activities = Object.keys(data)

      // For each activity type create the data
      this.lineChartData = {
        datasets: activities.map((activity, idx) => ({
          label: formatString(activity),
          fill: false,
          borderColor: BORDER_COLOURS[idx],
          backgroundColor: BACKGROUND_COLOURS[idx],
          borderWidth: 1,
          pointRadius: 3,
          data: data[activity].timestampData.map((d) => ({ x: d.timestamp, y: d.totalDistance })),
        })),
      }
      this.lineChartOptions = {
        ...this.lineChartOptions,
        scales: {
          ...this.lineChartOptions.scales,
          x: {
            ...this.lineChartOptions.scales.x,

            min: moment(this.month).startOf('month'),
            max: moment(this.month).endOf('month'),
          },
        },
      }
      this.countBarChartData = {
        labels: activities.map((activity) => formatString(activity)),
        datasets: [
          {
            label: 'Activity Count',
            data: activities.map((activity) => data[activity].count),
            borderWidth: 1,
          },
        ],
      }
      this.distanceBarChartData = {
        labels: activities.map((activity) => formatString(activity)),
        datasets: [
          {
            label: 'Activity Distance',
            data: activities.map((activity) =>
              Math.max(...data[activity].timestampData.map((d) => d.totalDistance)),
            ),
            borderWidth: 1,
          },
        ],
      }

      this.statsData = [
        {
          metric: 'Activities',
          icon: 'fas fa-person-running',
          value: activities
            .map((activity) => data[activity].count)
            .reduce((partialSum, a) => partialSum + a, 0),
        },
        {
          metric: 'Types of Activities',
          icon: 'fas fa-medal',
          value: activities.length,
        },
        {
          metric: 'Distance',
          icon: 'fas fa-shoe-prints',
          value: `${activities.map((activity) => Math.max(...data[activity].timestampData.map((d) => d.totalDistance))).reduce((partialSum, a) => partialSum + a, 0)}m`,
        },
      ]
    },
  },
}
</script>
