<template>
  <v-card class="m-2 pa-2" align="center" variant="outlined">
    <v-empty-state
      v-if="failedToLoad && !isLoading"
      headline="No Data"
      text="No Data was returned"
      icon="fas fa-circle-exclamation"
    ></v-empty-state>
    <LoadingChart height="500" width="1000" v-if="isLoading" />
    <Bar v-if="!isLoading && !failedToLoad" :data="chartData" :options="chartOptions" />
  </v-card>
</template>

<script>
import { Bar } from 'vue-chartjs'
import LoadingChart from '/@/components/StatsCard.vue'

export default {
  name: 'BarChart',
  components: { Bar, LoadingChart },
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    chartOptions: {
      type: Object,
      default: () => {},
    },
    isLoading: {
      type: Boolean,
      default: () => false,
    },
    failedToLoad: {
      type: Boolean,
      default: () => false,
    },
  },
}
</script>
