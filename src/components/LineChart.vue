<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script>
import { Line } from 'vue-chartjs'
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
  Filler,
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
  Filler,
)
export default {
  name: 'LineChart',
  components: { Line },
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    chartOptions: {
      type: Object,
      default: () => {},
    },
  },
}
</script>
