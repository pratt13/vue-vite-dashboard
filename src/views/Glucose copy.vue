<template>
  <div id="header">Summary of Glucose Activities</div>
  <div id="grid">
    <div class="wide">
      <LineChart
        :chartData="lineChartData"
        :chartOptions="lineChartOptions"
        :width="500"
        :height="200"
      />
    </div>
    <div class="justify-center space-y-2 items-center">
      <VueDatePicker
        @update:model-value="handleRange"
        v-model="date"
        range
        name="weekPicker"
        :enable-time-picker="false"
        :format="formatDateRange"
      />
      <GlucoseRange />
      <StatsCard :stats="statsData" />
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
      <DoughnutChart
        :chartData="percentDoughnutChartData"
        :chartOptions="percentDoughnutChartOptions"
        :width="400"
        :height="200"
      />
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import 'chartjs-adapter-moment'
import moment from 'moment'
const LineChart = defineAsyncComponent(() => import('/@/components/LineChart.vue'))
const BarChart = defineAsyncComponent(() => import('/@/components/BarChart.vue'))
const DoughnutChart = defineAsyncComponent(() => import('/@/components/DoughnutChart.vue'))
const StatsCard = defineAsyncComponent(() => import('/@/components/StatsCard.vue'))
const GlucoseRange = defineAsyncComponent(() => import('/@/components/GlucoseRange.vue'))

import { replaceUnderscore, capitaliseString } from '/@/utils'

const DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss'
const DATE_FORMAT = 'DD/MM/YYYY'
const defaultMaxY = 18
export default {
  name: 'GlucoseDashboard',
  components: {
    LineChart,
    BarChart,
    DoughnutChart,
    VueDatePicker,
    StatsCard,
    GlucoseRange,
  },
  data() {
    this.avChartData = {
      labels: [],
      datasets: [],
    }
    this.lineChartData = {
      labels: [],
      datasets: [],
    }
    this.countBarChartData = {
      labels: [],
      datasets: [],
    }
    this.percentDoughnutChartData = {
      labels: [],
      datasets: [],
    }
    this.lineChartOptions = {
      showLine: false,
      scales: {
        y: {
          min: 0,
          suggestedMax: defaultMaxY,
          stepSize: 1,
        },
        x: {
          display: true,
          type: 'time',
          ticks: {
            // forces step size to be 50 units
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
      responsive: false,
      scales: {
        y: {
          ticks: {
            stepSize: 1,
          },
        },
      },
    }
    this.percentDoughnutChartOptions = {
      responsive: false,
      plugins: {
        datalabels: {
          formatter: (value) => {
            return Math.round(value, 2) + '%'
          },
        },
      },
    }
    this.date = [
      moment().startOf('day').format(DATETIME_FORMAT),
      moment().endOf('day').format(DATETIME_FORMAT),
    ]
    this.hbaValue = 0
    this.statsData = []
    return {
      avChartData: this.avChartData,
      lineChartData: this.lineChartData,
      countBarChartData: this.countBarChartData,
      lineChartOptions: this.lineChartOptions,
      countBarChartOptions: this.countBarChartOptions,
      date: this.date,
      hbaValue: this.hbaValue,
      statsData: this.statsData,
    }
  },
  mounted() {
    this.fetchDataFromAPI()
  },
  methods: {
    formatDateRange(dateRange) {
      // TODO: Move to a util
      return Object.values(dateRange)
        .map((d) => moment(d).format(DATE_FORMAT))
        .join(',')
    },
    handleRange(modelData) {
      // Range picker event
      this.date = [
        moment(modelData[0]).startOf('day').format(DATETIME_FORMAT),
        moment(modelData[1]).endOf('day').format(DATETIME_FORMAT),
      ]
      // Re-fetch the data
      this.fetchDataFromAPI()
    },
    fetchDataFromAPI() {
      fetch(`http://localhost:5000/glucose/meta?start=${this.date[0]}&end=${this.date[1]}`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((glucoseData) => {
          console.log('Getting Glucose Data')
          // HBa1c - JS rounding madness
          this.hbaValue = Math.round((glucoseData.meta_data.mean + Number.EPSILON) * 100) / 100
          const maxValue = Math.round(Math.max(...glucoseData.raw_data.map((d) => d[0]))) + 1
          const formattedChartData = {
            datasets: [
              {
                label: 'Glucose Level Tracker',
                fill: false,
                borderColor: 'rgb(251, 8, 162)',
                backgroundColor: 'rgb(251, 8, 162)',
                borderWidth: 1,
                pointRadius: 3,
                data: glucoseData.raw_data.map((d) => ({ x: d[1], y: d[0] })),
              },
              {
                label: 'low',
                radius: 0,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.1,
                hoverOffset: 4,
                data: glucoseData.raw_data.map((d) => ({ x: d[1], y: 4 })),
                fill: true,
              },
              {
                label: 'target',
                radius: 0,
                backgroundColor: 'rgb(221,255,221)',
                tension: 0.1,
                hoverOffset: 4,
                data: glucoseData.raw_data.map((d) => ({ x: d[1], y: 10 })),
                fill: 1,
              },
              {
                label: 'high',
                radius: 0,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.1,
                hoverOffset: 4,
                data: glucoseData.raw_data.map((d) => ({ x: d[1], y: maxValue })),
                fill: 2,
              },
            ],
            labels: glucoseData.raw_data.map((d) => d[1]),
          }
          this.lineChartData = formattedChartData
          const def = this.lineChartOptions
          this.lineChartOptions = {
            ...def,
            scales: { ...def.scales, y: { ...def.scales.y, max: maxValue } },
          }
          const count_values = ['number_lows', 'number_highs']
          this.countBarChartData = {
            labels: count_values.map((l) => replaceUnderscore(capitaliseString(l))),
            datasets: [
              {
                label: 'Glucose Counts',
                data: count_values.map((v) => glucoseData.meta_data[v]),
              },
            ],
          }

          const percent_values = [
            'percentage_of_time_high',
            'percentage_of_time_low',
            'percentage_of_time_in_target',
          ]
          this.percentDoughnutChartData = {
            labels: percent_values.map((l) => replaceUnderscore(capitaliseString(l))),
            datasets: [
              {
                label: 'Percentage',
                data: percent_values.map((v) => glucoseData.meta_data[v]),
              },
            ],
          }
          this.statsData = [
            {
              metric: 'HbA1c',
              icon: 'fas fa-droplet',
              value: Math.round((glucoseData.meta_data.mean + Number.EPSILON) * 100) / 100,
            },
          ]
        })
        .catch((e) => {
          console.log('*******Error**********')
          console.log(e)
        })
    },
  },
}
</script>
