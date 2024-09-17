<template>
  <v-container fluid fill-height>
    <div class="text-h1 text-left">Tracker</div>
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
import GlucoseService from '/@/services/glucose.ts'
import 'chartjs-adapter-moment'
import moment from 'moment'
import {
  warningColour,
  inRangeColour,
  DATETIME_FORMAT,
  defaultMaxGlucose,
  singleMarkerColour,
} from '/@/utils/constants.ts'

const LineChart = defineAsyncComponent(() => import('/@/components/LineChart.vue'))

export default {
  name: 'GlucoseTrackerDashboard',
  components: {
    LineChart,
  },
  data() {
    const now = moment().format(DATETIME_FORMAT)
    const endOfToday = moment().endOf('day').format(DATETIME_FORMAT)
    const startOfToday = moment().startOf('day').format(DATETIME_FORMAT)
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
          min: startOfToday,
          max: now,
          // ticks: {
          //   // forces step size to be 2 hours
          //   stepSize: 2,
          // },
          title: {
            display: true,
            text: 'Time',
          },
        },
      },
    }
    return {
      lineChartData: {
        labels: [],
        datasets: [],
      },
      lineChartOptions: defaultLineChartOptions,
      model: null,
      maxDate: endOfToday,
      glucoseService: new GlucoseService(),
      dateRange: [startOfToday, now],
    }
  },
  created() {
    // Created or Mounted
    this.handleRange({
      0: moment().startOf('day').format(DATETIME_FORMAT),
      1: moment().format(DATETIME_FORMAT),
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
      const { rawData } = await this.glucoseService.getAll(this.dateRange[0], this.dateRange[1])
      const maxValue = Math.max(...[11, Math.max(...rawData.map((x) => Number(x[1]))) + 1])
      const dataSets = [
        {
          label: 'Reading',
          data: rawData.map((d) => ({ x: moment(d[2]).format(DATETIME_FORMAT), y: d[1] })),
          fill: false,
          borderColor: singleMarkerColour,
        },
        {
          label: 'Low',
          data: rawData.map((d) => ({ x: d[2], y: 4 })),
          fill: true,
          borderColor: warningColour,
        },
        {
          label: 'Target',
          data: rawData.map((d) => ({ x: d[2], y: 10 })),
          fill: 1,
          borderColor: inRangeColour,
        },
        {
          label: 'High',
          data: rawData.map((d) => ({ x: d[2], y: maxValue })),
          fill: 2,
          borderColor: warningColour,
        },
      ]
      this.lineChartData = {
        datasets: dataSets.map((d) => ({
          label: d.label,
          fill: d.fill,
          backgroundColor: d.borderColor,
          borderColor: d.borderColor,
          borderWidth: 2,
          pointRadius: 1,
          tension: 0.1,
          hoverOffset: 4,
          data: d.data,
        })),
        labels: rawData.map((d) => moment(d[2]).format(DATETIME_FORMAT)),
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
