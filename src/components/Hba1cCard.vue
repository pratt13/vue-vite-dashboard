<template>
  <v-card class="mx-auto" max-width="368">
    <v-card-text class="py-0">
      <v-list>
        <v-list-item
          v-for="item in stats"
          :key="item.metric"
          :prepend-icon="item.icon"
          :subtitle="item.value"
          :title="item.metric"
        >
        </v-list-item>
      </v-list>
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
    numberOfLows: {
      type: Number,
      default: () => 2,
    },
    numberOfHighs: {
      type: Number,
      default: () => 2,
    },
    stats: {
      type: Array,
      default: () => [
        { metric: 'Tuesday', icon: 'fas fa-line-chart', value: '24\xB0/12\xB0' },
        { metric: 'Tuesday', icon: 'fas fa-line-chart', value: '24\xB0/12\xB0' },
      ],
    },
  },
  data: () => ({
    hba1c: 12,
  }),
}
</script>
