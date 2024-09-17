<template>
  <v-container fluid fill-height>
    <div class="text-h1 text-left">Daily Dashboard</div>
    <v-row no-gutters class="flex" align="center" justify="center">
      <v-col cols="8" align="center" justify="center" style="min-width: 1000px">
        <v-sheet class="pa-2 ma-2">
          <LineChart :chartData="lineChartData" :chartOptions="lineChartOptions" />
        </v-sheet>
      </v-col>
      <v-col cols="2" style="min-width: 350px; min-height: 200px">
        <v-sheet class="pa-2 ma-2">
          <v-date-input
            v-model="model"
            @update:model-value="handleRange"
            label="Select range"
            multiple="range"
            color="primary"
            variant="underlined"
            :max="maxDate"
          ></v-date-input>
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
import {
  warningColour,
  blackColour,
  warningColourDark,
  DATETIME_FORMAT,
} from '/@/utils/constants.ts'

const LineChart = defineAsyncComponent(() => import('/@/components/LineChart.vue'))

export default {
  name: 'DailyDashboard',
  components: {
    LineChart,
  },
  data() {
    const defaultLineChartOptions = {
      scales: {
        y: {
          min: 0,
          suggestedMax: 18,
        },
        x: {
          display: true,
          type: 'time',
          unit: 'hour',
          min: moment('00:00:01', 'hh:mm:ss'),
          max: moment('23:59:59', 'hh:mm:ss'),
          title: {
            display: true,
            text: 'Time',
          },
          ticks: {
            // forces step size to be 2 hours
            stepSize: 2,
          },
        },
      },
    }
    const endOfToday = moment().endOf('day').format(DATETIME_FORMAT)
    const startOfYear = moment().startOf('year').format(DATETIME_FORMAT)
    return {
      lineChartData: {
        labels: [],
        datasets: [],
      },
      lineChartOptions: defaultLineChartOptions,
      model: null,
      maxDate: endOfToday,
      glucoseService: new GlucoseService(),
      dateRange: [startOfYear, endOfToday],
    }
  },
  created() {
    // Created or Mounted
    this.handleRange({
      0: moment().startOf('year').format(DATETIME_FORMAT),
      1: moment().endOf('year').format(DATETIME_FORMAT),
    })
    this.fetchDataFromAPI()
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
      this.fetchDataFromAPI()
    },
    async fetchDataFromAPI() {
      // Get data
      const {
        median: medianData,
        raw: rawData,
        intervals,
        q10: q10,
        q25: q25,
        q75: q75,
        q90: q90,
      } = await this.glucoseService.getAggregateData(this.dateRange[0], this.dateRange[1])

      const maxValue = Math.max(...rawData.flat(1)) + 1
      // Fill the inner quartile darker
      const dataSets = [
        { label: 'Q10 Quantile', data: q10, fill: 0, borderColor: warningColour },
        { label: 'Q25 Quantile', data: q25, fill: false, borderColor: warningColourDark },
        { label: 'Q75 Quantile', data: q75, fill: 1, borderColor: warningColourDark },
        { label: 'Median', data: medianData, fill: false, borderColor: blackColour },
        { label: 'Q90 Quantile', data: q90, fill: 0, borderColor: warningColour },
      ]
      this.lineChartData = {
        datasets: dataSets.map((d) => ({
          label: d.label,
          fill: d.fill,
          backgroundColor: d.borderColor,
          borderColor: d.borderColor,
          borderWidth: 1,
          pointRadius: 0,
          data: d.data.map((d, index) => ({
            x: moment(intervals[index], 'hh:mm'),
            y: d,
          })),
        })),
        labels: intervals.map((d) => moment(d, 'hh:mm')),
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
