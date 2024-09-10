<template>
  <v-card class="mx-auto" max-width="368">
    <v-card-item class="text-h3">
      Statistics <font-awesome-icon icon="fa-solid fa-chart-line" />
    </v-card-item>

    <v-card-text class="py-0">
      <v-col class="text-h3"> HbA1c: {{ hba1c }} </v-col>

      <v-col> Time in target: {{ timeInTarget }} </v-col>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'StatisticsCard',
  props: {
    timeInTarget: {
      type: Number,
      default: () => 1.2,
    },
  },
  data: () => ({
    hba1c: 12,
  }),
}
</script>
