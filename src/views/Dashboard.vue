<template>
  <Dashboard :msg="'Vue3 ref proxy reactive data！' + environment" />
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'

const Dashboard = defineAsyncComponent(() => import('/@/components/GlucoseLineChart.vue'))

const environment = import.meta.env?.VITE_APP_NODE_ENV ?? 'undefined'
</script>
