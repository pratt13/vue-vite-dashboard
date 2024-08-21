<template>
  <v-container fluid fill-height>
    <div class="text-h1 text-left">Day Tracker</div>
    <v-row no-gutters class="flex" align="center" justify="center">
      <v-col cols="8" align="center" justify="center" style="min-width: 1000px">
        <v-sheet class="pa-2 ma-2">
          <LineChart :chartData="lineChartData" :chartOptions="lineChartOptions" />
        </v-sheet>
      </v-col>
      <v-col cols="2" style="min-width: 350px; min-height: 200px">
        <v-sheet class="pa-2 ma-2">
          <v-date-input
            v-model="endDate"
            @update:model-value="handleEndDate"
            label="Select Date"
            color="primary"
            variant="underlined"
            :max="maxDate"
          ></v-date-input>
          <v-container fluid>
            <p>Include {{ prevDays }} days</p>
            <v-radio-group v-model="prevDays" @update:model-value="handlePrevDays">
              <v-radio label="One" value="1"></v-radio>
              <v-radio label="Three" :value="3"></v-radio>
              <v-radio label="Five" value="5"></v-radio>
              <v-radio label="Seven" value="7"></v-radio>
            </v-radio-group>
          </v-container>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { defineAsyncComponent } from 'vue'
import GlucoseService from '/@/services/glucose.ts'
import 'chartjs-adapter-moment'
import moment from 'moment'
import { DATETIME_FORMAT, DATE_FORMAT, TIME_FORMAT, defaultMaxGlucose } from '/@/utils/constants.ts'

const LineChart = defineAsyncComponent(() => import('/@/components/LineChart.vue'))

export default {
  name: 'DayTracker',
  components: {
    LineChart,
  },
  data() {
    const defaultLineChartOptions = {
      scales: {
        y: {
          min: 0,
          suggestedMax: defaultMaxGlucose,
        },
        x: {
          display: true,
          type: 'time',
          unit: 'hour',
          min: moment('00:00:01', TIME_FORMAT),
          max: moment('23:59:59', TIME_FORMAT),
          ticks: {
            // forces step size to be 2 hours
            stepSize: 2,
          },
          title: {
            display: true,
            text: 'Time',
          },
        },
      },
    }
    const endOfToday = moment().endOf('day').format(DATETIME_FORMAT)
    return {
      lineChartData: {
        labels: [],
        datasets: [],
      },
      lineChartOptions: defaultLineChartOptions,
      model: null,
      maxDate: endOfToday,
      glucoseService: new GlucoseService(),
      endDate: endOfToday,
      prevDays: 3, // Default previous days is 3
    }
  },
  created() {
    // Created or Mounted
    this.fetchDataFromAPI()
  },
  methods: {
    handleEndDate(modelData) {
      this.endDate = moment(modelData).endOf('today').format(DATETIME_FORMAT)
      // Re-fetch the data
      this.fetchDataFromAPI()
    },
    handlePrevDays(radioValue) {
      this.prevDays = radioValue
      // Re-fetch the data
      this.fetchDataFromAPI()
    },
    async fetchDataFromAPI() {
      const rawData = await this.glucoseService.getDayData(
        moment(this.endDate).subtract(this.prevDays, 'd').format(DATETIME_FORMAT),
        this.endDate,
      )
      const maxValue = Math.round(
        1 + Math.max(...Object.values(rawData).map((arr) => Math.max(...arr.map((d) => d[1])))),
      )
      const dataSetKeys = Object.keys(rawData)
      this.lineChartData = {
        datasets: dataSetKeys.map((k) => ({
          label: moment(k).format(DATE_FORMAT),
          borderWidth: 1,
          fill: false,
          pointRadius: 0,
          borderWidth: 2,
          data: rawData[k].map((d) => ({
            x: moment(d[0], TIME_FORMAT),
            y: d[1],
          })),
        })),
        labels: rawData[dataSetKeys[0]].map((d) => moment(d[0], TIME_FORMAT)),
      }
      this.lineChartOptions = {
        ...this.lineChartOptions,
        scales: {
          ...this.lineChartOptions.scales,
          y: { ...this.lineChartOptions.scales.y, max: maxValue },
        },
      }
    },
  },
}
</script>
