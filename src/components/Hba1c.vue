<template>
  <div style="position: relative; align-items: center; justify-content: center; width: 80%">
    <div>HBa1c: {{ msg }}</div>
  </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{ msg: number }>(), { msg: 0 })
</script>
