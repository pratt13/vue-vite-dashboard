<template>
  <Doughnut :data="chartData" :options="chartOptions" />
</template>

<script>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  Colors,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Doughnut } from 'vue-chartjs'

// Duplicate registration of some
ChartJS.register(CategoryScale, ArcElement, Title, Tooltip, Legend, Colors)

export default {
  name: 'DoughnutChart',
  components: { Doughnut },
  plugins: [ChartDataLabels], // Registering here doesn't seem to work, global registering is not what we want though
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
