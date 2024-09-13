<template>
  <v-card class="m-2 pa-2" align="center" variant="outlined">
    <Bar :data="chartData" :options="chartOptions" />
  </v-card>
</template>

<script>
import { Bar } from 'vue-chartjs'

export default {
  name: 'BarChart',
  components: { Bar },
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
