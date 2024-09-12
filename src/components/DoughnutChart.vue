<template>
  <Doughnut v-if="active" :data="chartData" :options="chartOptions" />
</template>

<script>
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Doughnut } from 'vue-chartjs'

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
    active: {
      type: Boolean,
      required: true,
    },
  },
}
</script>
