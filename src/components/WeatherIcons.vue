<script setup lang="ts">
// Define props
const props = defineProps<{
  condition: string;
  size?: number;
}>();

// Set default size if not provided
const iconSize = props.size || 40;

// Function to determine which icon to show based on the condition text
function getIconName() {
  const conditionLower = props.condition.toLowerCase();
  
  // Clear/Sunny
  if (conditionLower.includes('sunny') || 
      conditionLower.includes('clear')) {
    return 'wb_sunny';
  }

  // Rainy
  if (conditionLower.includes('rain') || 
      conditionLower.includes('shower') || 
      conditionLower.includes('drizzle')) {
    return 'rainy';
  }
  
  // Snowy
  if (conditionLower.includes('snow') || 
      conditionLower.includes('flurr') || 
      conditionLower.includes('sleet')) {
    return 'ac_unit';
  }
  
  // Thunderstorm
  if (conditionLower.includes('thunder') || 
      conditionLower.includes('storm') || 
      conditionLower.includes('lightning')) {
    return 'thunderstorm';
  }

  // Partly cloudy
  if (conditionLower.includes('partially') && conditionLower.includes('cloud')) {
    return 'partly_cloudy_day';
  }
  
  // Cloudy/Overcast
  if (conditionLower.includes('cloud') || 
      conditionLower.includes('overcast')) {
    return 'cloud';
  }
  
  // Default
  return 'help_outline';
};
</script>

<template>
  <div class="weather-icon" :style="{ width: `${iconSize}px`, height: `${iconSize}px` }">
    <span 
      class="material-symbols-outlined icon" 
      :style="{ fontSize: `${iconSize}px` }"
    >{{ getIconName() }}</span>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined');

.weather-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  cursor: default;
}

.material-icons-outlined {
  width: auto;
  height: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: inherit;
}
</style>