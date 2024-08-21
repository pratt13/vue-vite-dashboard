<template>
  <v-empty-state v-if="isLoading" title="Loading..." icon="fas fa-spinner"></v-empty-state>
</template>
<script>
export default {
  name: 'LoadingChart',
  props: {
    isLoading: {
      type: Boolean,
      default: () => false,
    },
  },
}
</script>
