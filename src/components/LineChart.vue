<template>
  <v-card min-height="500" max-height="500" min-width="1000" max-width="1000" variant="outlined">
    <v-empty-state
      v-if="failedToLoad && !isLoading"
      headline="No Data"
      text="No Data was returned"
      icon="fas fa-circle-exclamation"
    ></v-empty-state>
    <v-empty-state
      height="500"
      width="1000"
      v-if="isLoading"
      title="Loading..."
      icon="fas fa-spinner"
    ></v-empty-state>
    <Line v-if="!isLoading && !failedToLoad" :data="chartData" :options="chartOptions" />
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
    isLoading: {
      type: Boolean,
      default: () => false,
    },
    failedToLoad: {
      type: Boolean,
      default: () => false,
    },
    chartOptions: {
      type: Object,
      default: () => {},
    },
  },
}
</script>
