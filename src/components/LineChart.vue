<template>
  <v-card min-height="500" max-height="500" min-width="1000" max-width="1000" variant="outlined">
    <Line :data="chartData" :options="chartOptions" />
  </v-card>
</template>

<script>
import { Line } from 'vue-chartjs'
import 'chartjs-adapter-moment'

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
      default: () => {
        backgroundColor: rgb(0, 0, 0)
      },
    },
  },
}
</script>
