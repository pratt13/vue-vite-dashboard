<template>
  <div class="container">
    <GlucoseLineChart v-if="loaded" :data="chartData" :options />
  </div>
</template>

<script>
import { Line as GlucoseLineChart } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  TimeScale,
  PointElement,
  LineElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import 'chartjs-adapter-moment'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  TimeScale,
  LinearScale,
)

export default {
  name: 'GLucoseLineChart',
  components: { GlucoseLineChart },
  data: () => ({
    loaded: false,
    chartData: null,
  }),
  async mounted() {
    this.loaded = false
    this.options = {
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
    await fetch('http://localhost:5000/glucose', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((glucoseData) => {
        this.chartData = {
          datasets: [
            {
              label: 'Scatter Dataset 1',
              fill: false,
              borderColor: '#f87979',
              backgroundColor: '#f87979',
              data: glucoseData.map((d) => ({ x: d[2], y: d[1] })),
            },
          ],
          labels: glucoseData.map((d) => d[2]),
        }
        this.loaded = true
      })
      .catch((err) => console.error(err))
  },
}
</script>
