<script setup lang="ts">
import WeatherComparison from './components/WeatherComparison.vue';
</script>

<template>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet">
  <div class="app">
    <WeatherComparison />
  </div>
</template>

<style>
/**TODO: Make styles file and generalize stuff for quick editing. */
body {
  font-family: sans-serif;
  margin: 0;
  padding: 0;
}

.app {
  padding: 20px;
}

.icon {
  cursor: default;
}
</style>
