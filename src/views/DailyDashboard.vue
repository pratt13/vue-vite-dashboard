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
// TODO: import GlucoseService from '/@/services/glucose.ts'
import 'chartjs-adapter-moment'
import moment from 'moment'
const LineChart = defineAsyncComponent(() => import('/@/components/LineChart.vue'))

const defaultMaxY = 18
const DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss'

export default {
  name: 'DailyDashboard',
  components: {
    LineChart,
  },
  data() {
    this.maxDate = moment().endOf('day').format(DATETIME_FORMAT)
    this.lineChartData = {
      labels: [],
      datasets: [],
    }
    this.lineChartOptions = {
      //showLine: false,
      scales: {
        y: {
          min: 0,
          suggestedMax: defaultMaxY,
        },
        x: {
          display: true,
          type: 'time',
          //unit: "minute",
          min: moment('00:00:01', 'hh:mm:ss'),
          title: {
            display: true,
            text: 'Time',
          },
        },
      },
    }
    return {
      lineChartData: this.lineChartData,
      lineChartOptions: this.lineChartOptions,
      model: null,
    }
  },
  mounted() {
    this.fetchDataFromAPI()
  },
  methods: {
    fetchDataFromAPI() {
      fetch('http://localhost:5000/glucose/aggregate/15min', {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((glucoseData) => {
          console.log('Getting Data')
          const {
            median: medianData,
            raw: rawData,
            intervals,
            q10: q10,
            q25: q25,
            q75: q75,
            q90: q90,
          } = glucoseData
          const maxValue = Math.max(...rawData.flat(1)) + 1
          const formattedChartData = {
            datasets: [
              {
                label: 'Lower Q10 Quantile',
                fill: false,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 1,
                pointRadius: 3,
                data: q10.map((d, index) => ({
                  x: moment(intervals[index], 'hh:mm'),
                  y: d,
                })),
              },
              {
                label: 'Lower Q25 Quantile',
                fill: false,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 1,
                pointRadius: 3,
                data: q25.map((d, index) => ({
                  x: moment(intervals[index], 'hh:mm'),
                  y: d,
                })),
              },
              {
                label: 'Median Glucose Level',
                fill: 1,
                borderColor: 'rgb(251, 8, 162)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 1,
                pointRadius: 3,
                data: medianData.map((d, index) => ({
                  x: moment(intervals[index], 'hh:mm'),
                  y: d,
                })),
              },

              {
                label: 'Upper Q75 Quantlie',
                fill: 0,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 1,
                pointRadius: 3,
                data: q75.map((d, index) => ({
                  x: moment(intervals[index], 'hh:mm'),
                  y: d,
                })),
              },
              {
                label: 'Upper Q75 Quantlie',
                fill: 0,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 1,
                pointRadius: 3,
                data: q90.map((d, index) => ({
                  x: moment(intervals[index], 'hh:mm'),
                  y: d,
                })),
              },
            ],
            labels: intervals.map((d) => moment(d, 'hh:mm')),
          }
          this.lineChartData = formattedChartData
          const def = this.lineChartOptions
          this.lineChartOptions = {
            ...def,
            scales: { ...def.scales, y: { ...def.scales.y, max: maxValue } },
          }
        })
        .catch((e) => {
          console.log('*******Error**********')
          console.log(e)
        })
    },
  },
}
</script>
