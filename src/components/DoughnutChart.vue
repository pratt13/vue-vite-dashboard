<template>
  <v-card class="m-2 pa-2" align="center" variant="outlined">
    <Doughnut v-if="active" :data="chartData" :options="chartOptions" />
  </v-card>
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
