<template>
  <v-container fluid fill-height>
    <div class="text-h1 text-left">Tracker</div>
    <v-row no-gutters class="flex" align="center" justify="center">
      <v-col cols="8" align="center" justify="center" style="min-width: 1000px">
        <v-sheet class="pa-2 ma-2">
          <LineChart
            :failedToLoad="failedToLoad"
            :isLoading="isLoading"
            :chartData="lineChartData"
            :chartOptions="lineChartOptions"
          />
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
        <v-sheet class="pa-2 ma-2">
          <StatsCard :isLoading="hba1c.isLoading" :stats="hba1c.value" />
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
const StatsCard = defineAsyncComponent(() => import('/@/components/StatsCard.vue'))

export default {
  name: 'GlucoseTrackerDashboard',
  components: {
    LineChart,
    StatsCard,
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
      hba1c: { isLoading: false, value: null },
      isLoading: true,
      failedToLoad: false, //feels reacty change
    }
  },
  created() {
    // Created or Mounted
    this.handleRange({
      0: moment().startOf('day').format(DATETIME_FORMAT),
      1: moment().format(DATETIME_FORMAT),
    })
  },
  methods: {
    handleRange(modelData) {
      const dateValues = Object.values(modelData)
      console.log(dateValues)
      const startDate = dateValues[0]
      const endDate = dateValues[dateValues.length]
      this.dateRange = [
        moment(startDate).format(DATETIME_FORMAT),
        moment(endDate).format(DATETIME_FORMAT),
      ]
      // Re-fetch the data
      this.fetchHBA1CDataFromAPI()
      this.fetchTrackerDataFromAPI()
    },
    async fetchTrackerDataFromAPI() {
      const { rawData } = await this.glucoseService.getAll(this.dateRange[0], this.dateRange[1])
      if (rawData.length == 0) {
        this.isLoading = false
        this.failedToLoad = true
        return
      }
      // Set that it is loaded to true if it has data
      this.isLoading = false
      this.failedToLoad = false
      const { startDate, endDate } = this.dateRange

      // Construct chart data
      const maxValue = Math.round(
        Math.max(...[11, Math.max(...rawData.map((x) => Number(x[1]))) + 1]),
      )
      const dataSets = [
        {
          label: 'Reading',
          data: rawData.map((d) => ({ x: moment(d[2]).format(DATETIME_FORMAT), y: d[1] })),
          fill: false,
          borderColor: singleMarkerColour,
          pointRadius: 1,
        },
        {
          label: 'Low',
          data: rawData.map((d) => ({ x: d[2], y: 4 })),
          fill: true,
          borderColor: warningColour,
          pointRadius: 0,
        },
        {
          label: 'Target',
          data: rawData.map((d) => ({ x: d[2], y: 10 })),
          fill: 1,
          borderColor: inRangeColour,
          pointRadius: 0,
        },
        {
          label: 'High',
          data: rawData.map((d) => ({ x: d[2], y: maxValue })),
          fill: 2,
          borderColor: warningColour,
          pointRadius: 0,
        },
      ]
      this.lineChartData = {
        datasets: dataSets.map((d) => ({
          label: d.label,
          fill: d.fill,
          backgroundColor: d.borderColor,
          borderColor: d.borderColor,
          borderWidth: 2,
          pointRadius: d.pointRadius,
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
          x: { ...this.lineChartOptions.scales.x, min: startDate, max: endDate },
        },
      }
    },
    async fetchHBA1CDataFromAPI() {
      const { hBA1C } = await this.glucoseService.getHBA1C(this.dateRange[0], this.dateRange[1])
      const dataValues =
        hBA1C == null
          ? [{ metric: 'HBA1c', icon: 'fa-circle-exclamation', value: 'No data' }]
          : [
              {
                metric: 'HBA1c',
                icon: 'fas fa-line-chart',
                value: Math.round((hBA1C + Number.EPSILON) * 100) / 100,
              },
            ]
      this.hba1c = { isLoading: false, value: dataValues }
    },
  },
}
</script>
