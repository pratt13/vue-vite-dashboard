<template>
  <v-card class="mx-auto" max-width="368" variant="outlined">
    <v-empty-state
      height="500"
      width="1000"
      v-if="isLoading"
      title="Loading..."
      icon="fas fa-spinner"
    ></v-empty-state>
    <div v-else class="text-h4">Summary</div>
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
  name: 'StatsCard',
  props: {
    stats: {
      type: Array,
      default: () => [{ metric: 'No Stats', icon: 'fas fa-line-chart', value: '0' }],
    },
    isLoading: {
      type: Boolean,
      default: () => false,
    },
  },
}
</script>
