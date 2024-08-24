<template>
  <LineChart :chartData="lineChartData" :chartOptions="lineChartOptions" />
  <div>
    <div class="row">
      <div class="col-12">
        <chart width="1000" height="300" id="chart1">
          <LineChart :chartData="lineChartData" :chartOptions="lineChartOptions" />
        </chart>
      </div>
    </div>
  </div>
  <div class="pageWidth">
    <chart width="1000" height="300" id="chart1">
      <LineChart :chartData="lineChartData" :chartOptions="lineChartOptions" />
    </chart>
  </div>
  <div class="py-4 container-fluid">
    <div class="col-lg-12 position-relative z-index-2">
      <div class="row mb-4">
        <div class="row">
          <div class="col-lg-3 col-md-6 col-sm-6 mt-lg-0 mt-4">
            <BarChart :chartData="barChartData" :chartOptions="barChartOptions" />
          </div>
          <div class="col-lg-3 col-md-6 col-sm-6 mt-lg-0 mt-4"> mini-statistics-card 4 </div>
        </div>
        <div class="row mt-4">
          <div class="col-lg-4 col-md-6 mt-4"> chart-holder-card </div>
          <div class="col-lg-4 col-md-6 mt-4"> chart-holder-card </div>
          <div class="col-lg-4 mt-4"> chart-holder-card </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-8 col-md-6 mb-md-0 mb-4"> HERE </div>
      <div class="col-lg-4 col-md-6"> Time line list </div>
    </div>
  </div>
  <div class="row">
    <div class="col-lg-4">
      <div class="card card-chart">
        <div class="card-header">
          <h5 class="card-category">Total Shipments</h5>
          <h3 class="card-title"><i class="tim-icons icon-bell-55 text-primary"></i> 763,215</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
// TODO: import GlucoseService from '/@/services/glucose.ts'
import 'chartjs-adapter-moment'

const LineChart = defineAsyncComponent(() => import('/@/components/LineChart.vue'))
const BarChart = defineAsyncComponent(() => import('/@/components/BarChart.vue'))

export default {
  name: 'GlucoseDashboard',
  components: {
    LineChart,
    BarChart,
  },
  data() {
    this.lineChartData = {
      labels: [],
      datasets: [],
    }
    this.barChartData = {
      labels: [],
      datasets: [],
    }
    this.lineChartOptions = {
      showLine: false,
      scales: {
        y: {
          min: 0,
          suggestedMax: 18,
        },
        x: {
          display: true,
          type: 'time',
          title: {
            display: true,
            text: 'Date',
          },
        },
      },
    }
    this.barChartOptions = {}
    return {
      lineChartData: this.lineChartData,
      barChartData: this.barChartData,
      lineChartOptions: this.lineChartOptions,
      barChartOptions: this.barChartOptions,
    }
  },
  mounted() {
    this.fetchDataFromAPI()
  },
  methods: {
    fetchDataFromAPI() {
      fetch('http://localhost:5000/glucose', {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((glucoseData) => {
          console.log('Getting Glucose Data')
          const formattedChartData = {
            datasets: [
              {
                label: 'Glucose Level Tracker',
                fill: false,
                borderColor: 'rgb(251, 8, 162)',
                backgroundColor: 'rgb(251, 8, 162)',
                borderWidth: 1,
                pointRadius: 3,
                data: glucoseData.map((d) => ({ x: d[2], y: d[1] })),
              },
              //{
              //  label: 'target',
              //  radius: 0,
              //  backgroundColor: 'rgb(221,255,221)',
              //  tension: 0.1,
              //  hoverOffset: 4,
              //  data: glucoseData.map((d) => ({ x: d[2], y: 10 })),
              //  fill: true,
              //},
              {
                label: 'low',
                radius: 0,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.1,
                hoverOffset: 4,
                data: glucoseData.map((d) => ({ x: d[2], y: 4 })),
                fill: true,
              },
            ],
            labels: glucoseData.map((d) => d[2]),
          }
          this.lineChartData = formattedChartData
          this.barChartData = {
            labels: ['January', 'February', 'March'],
            datasets: [{ data: [40, 20, 12] }],
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
