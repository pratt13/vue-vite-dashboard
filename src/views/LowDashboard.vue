<template>
  <v-container fluid fill-height>
    <div class="text-h1 text-left">Low Dashboard</div>
    <v-row no-gutters class="flex" align="center" justify="center">
      <v-col cols="8" align="center" justify="center" style="min-width: 1000px">
        <v-sheet class="pa-2 ma-2">
          <BarChart :chartData="lowBarChartData" :chartOptions="lowBarChartOptions" />
        </v-sheet>
      </v-col>
      <v-col cols="2" style="min-width: 350px; min-height: 200px">
        <v-sheet class="pa-2 ma-2">
          <v-date-input
            v-model="dateRange"
            @update:model-value="handleRange"
            label="Select range"
            multiple="range"
            color="primary"
            variant="underlined"
            :max="maxDate"
          ></v-date-input>
        </v-sheet>
        <v-sheet>
          <v-container fluid>
            <p>Time Bucket: {{ radios }}</p>
            <v-radio-group v-model="radios" @update:model-value="handleBucket">
              <v-radio label="15 Minute" value="15min"></v-radio>
              <v-radio label="30 Minute" value="30min"></v-radio>
              <v-radio label="1 Hour" value="60min"></v-radio>
              <v-radio label="2 Hour" value="120min"></v-radio>
            </v-radio-group>
          </v-container>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import 'chartjs-adapter-moment'
import moment from 'moment'
import GlucoseService from '/@/services/glucose.ts'
import { DATETIME_FORMAT } from '/@/utils/constants.ts'

const BarChart = defineAsyncComponent(() => import('/@/components/BarChart.vue'))

export default {
  name: 'LowDashboard',
  components: {
    BarChart,
  },
  data() {
    const startOfMonth = moment().startOf('month').format(DATETIME_FORMAT)
    const endOfToday = moment().endOf('day').format(DATETIME_FORMAT)
    return {
      lowBarChartData: {
        labels: [],
        datasets: [],
      },
      lowBarChartOptions: {
        responsive: true,
        // scales: {
        //   x: {

        //   type: 'time',
        //   unit: 'hour',
        //   min: moment('00:00:00', 'hh:mm:ss'),
        //   max: moment('23:59:59', 'hh:mm:ss'),
        //   },
        //   title: {
        //     display: true,
        //     text: 'Time',
        //   },
        // }
      },
      model: null,
      maxDate: endOfToday,
      glucoseService: new GlucoseService(),
      dateRange: [startOfMonth, endOfToday],
      radios: '60min',
    }
  },
  created() {
    // Created or Mounted
    this.handleRange({
      0: moment().startOf('month').format(DATETIME_FORMAT),
      1: moment().endOf('day').format(DATETIME_FORMAT),
    })
  },
  methods: {
    handleRange(modelData) {
      const dateValues = Object.values(modelData)
      const startDate = dateValues[0]
      const endDate = dateValues[dateValues.length]
      this.dateRange = [
        moment(startDate).format(DATETIME_FORMAT),
        moment(endDate).format(DATETIME_FORMAT),
      ]
      // Re-fetch the data
      this.fetchPercentageDataFromAPI()
    },
    handleBucket(radioValue) {
      this.radios = radioValue
      // Re-fetch the data
      this.fetchPercentageDataFromAPI()
    },
    async fetchPercentageDataFromAPI() {
      // Get data
      const data = await this.glucoseService.getGlucosePercentagesGroupedByDay(
        this.dateRange[0],
        this.dateRange[1],
        this.radios,
      )
      const timeInterval = data.map((d) => d.timeInterval)
      const timeIntervalData = data.map((d) => d.timeIntervalData)

      this.lowBarChartData = {
        labels: timeInterval,
        datasets: [
          {
            label: 'Low events',
            data: timeIntervalData.map((d) => d.numberOfLows),
          },
        ],
      }
    },
  },
}
</script>
