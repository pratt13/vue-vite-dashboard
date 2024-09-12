<template>
  <div class="text-h8">Target Range</div>
  <v-range-slider
    v-model="range"
    :max="12"
    :min="3.9"
    :step="0.1"
    class="align-center"
    hide-details
    strict
  >
    <template #prepend>
      <v-text-field
        v-model="range[0]"
        density="compact"
        style="width: 70px"
        type="number"
        variant="outlined"
        hide-details
        single-line
      ></v-text-field>
    </template>
    <template #append>
      <v-text-field
        v-model="range[1]"
        density="compact"
        style="width: 70px"
        type="number"
        variant="outlined"
        hide-details
        single-line
      ></v-text-field>
    </template>
  </v-range-slider>
</template>
<script>
export default {
  name: 'GlucoseRange',
  data() {
    return {
      range: [4, 10],
    }
  },
}
</script>
