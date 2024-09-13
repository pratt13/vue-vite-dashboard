<template>
  <div class="pa-2 mt-5 mr-10">
    <v-switch label="Theme" @click="toggleTheme"></v-switch>
  </div>
</template>

<script setup>
import { useTheme } from 'vuetify'

const theme = useTheme()

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>
