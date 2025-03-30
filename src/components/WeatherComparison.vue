<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { getMockWeatherForecast } from '../api/weatherapi';
import { type DayOfWeek, type TimeOfDay, DAYS_OF_WEEK, TIME_RANGES } from '../types/selectors';
import type { DayWeather, WeatherData } from '../types/weather';
import DaySelector from './DaySelector.vue';
import LocationSelector from './LocationSelector.vue';
import TimeOfDaySelector from './TimeOfDaySelector.vue';
import WeatherCard from './WeatherCard.vue';
import Selector from './Selector.vue';
  
const weatherData = ref<WeatherData | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);
const location = ref('Dolores Park, SF');


const selectedDay = ref<DayOfWeek>(5); // Default to Friday
const selectedTimeOfDay = ref<TimeOfDay>('afternoon');
  
async function fetchWeatherData() {
  isLoading.value = true;
  error.value = null;
  
  try {
    // Get 2 weeks of data
    // TODO: Ensure we fetch the maximum amount needed for preprocessing, cache it, and we can prevent unnecessary calls.
    const today = new Date();
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(today.getDate() + 14);
    
    const startDate = today.toISOString().split('T')[0];
    const endDate = twoWeeksFromNow.toISOString().split('T')[0];
    
    const data = await getMockWeatherForecast(location.value, startDate, endDate);
    weatherData.value = data;
    console.log('Weather data:', data);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred fetching weather data';
  } finally {
    isLoading.value = false;
  }
};
  
const selectedTimeRange = computed(() => {
  return TIME_RANGES.find(t => t.value === selectedTimeOfDay.value);
});

// TODO: Consolidate these.
// Filter days for this week and next week based on the selected day of week
const thisWeekDay = computed<DayWeather | null>(() => {
  if (!weatherData.value) return null;
  
  // Find the first occurrence of the selected day of week
  const days = weatherData.value.days;
  return days.find(day => {
    const date = new Date(day.datetime);
    return date.getDay() === selectedDay.value;
  }) || null;
});
  
const nextWeekDay = computed<DayWeather | null>(() => {
  if (!weatherData.value) return null;
  
  // Find the second occurrence of the selected day of week
  const days = weatherData.value.days;
  let foundFirst = false;
  
  for (const day of days) {
    const date = new Date(day.datetime);
    if (date.getDay() === selectedDay.value) {
      if (foundFirst) {
        return day;
      }
      foundFirst = true;
    }
  }
  
  return null;
});

const dayOptions = DAYS_OF_WEEK.map((day, index) => ({
  value: index,
  label: day
}));

const timeOptions = TIME_RANGES.map(time => ({
  value: time.value,
  label: time.label
}));
  
function getConditionsForTimeRange(day: DayWeather | null) {
  if (!day || !day.hours || !selectedTimeRange.value) return null;
  
  const { startHour, endHour } = selectedTimeRange.value;
  
  // Filter hours within the time range
  const hoursInRange = day.hours.filter(hour => {
    const hourTime = parseInt(hour.datetime.split(':')[0]);
    return hourTime >= startHour && hourTime < endHour;
  });
  
  if (hoursInRange.length === 0) return null;
  
  // Compute summary metrics for the details section.
  const avgTemp = hoursInRange.reduce((sum, hour) => sum + hour.temp, 0) / hoursInRange.length;
  const avgHumidity = hoursInRange.reduce((sum, hour) => sum + hour.humidity, 0) / hoursInRange.length;
  const maxPrecipProb = Math.max(...hoursInRange.map(hour => hour.precipprob || 0));
  
  return {
    temp: avgTemp,
    humidity: avgHumidity,
    precipProb: maxPrecipProb,
    conditions: hoursInRange[Math.floor(hoursInRange.length / 2)].conditions
  };
};
  
// Computed properties for the weather during the selected time ranges
const thisWeekConditions = computed(() => getConditionsForTimeRange(thisWeekDay.value));
const nextWeekConditions = computed(() => getConditionsForTimeRange(nextWeekDay.value));

// TODO: Clean up these two computed.
const isThisWeekSuitable = computed(() => {
  if (!thisWeekConditions.value) return false;
  
  const temp = thisWeekConditions.value.temp;
  const precipProb = thisWeekConditions.value.precipProb;
  const humidity = thisWeekConditions.value.humidity;
  
  // Basic suitability criteria
  return temp >= 60 && temp <= 75 && precipProb < 30 && humidity >= 25 && humidity <= 75;
});
  
const isNextWeekSuitable = computed(() => {
  if (!nextWeekConditions.value) return false;
  
  const temp = nextWeekConditions.value.temp;
  const precipProb = nextWeekConditions.value.precipProb;
  const humidity = nextWeekConditions.value.humidity;
  
  // TODO: Rethink suitability criteria -- stubs for now.
  return temp >= 60 && temp <= 75 && precipProb < 30 && humidity >= 25 && humidity <= 75;
});
  
// Refetch on change.
watch([selectedDay, selectedTimeOfDay], () => {
  fetchWeatherData();
}, { deep: true });
  
fetchWeatherData();
</script>

<template>
  <div class="weather-comparison">
    <header class="site-header">
      <h1 class="site-title">WHETHER.IO</h1>
    </header>
    
    <div class="controls">
      <LocationSelector 
        v-model="location" 
        @search="fetchWeatherData"
      />
      
      <div class="time-selectors">
        <Selector
          v-model="selectedDay"
          :options="dayOptions"
          icon="access_time"
          id="day-select"
          prefix="Every "
        />
        
        <Selector
          v-model="selectedTimeOfDay"
          :options="timeOptions"
          id="time-select"
        />
      </div>
    </div>
    
    <div v-if="isLoading" class="loading">
      <p>Loading weather data...</p>
    </div>
    
    <div v-else-if="error" class="error">
      <p>Error: {{ error }}</p>
    </div>
    
    <div v-else-if="weatherData" class="weather-display">
      <div class="comparison-container">
        <WeatherCard 
          title="This"
          :date="thisWeekDay?.datetime"
          :day-data="thisWeekDay"
          :conditions="thisWeekConditions"
          :time-range="selectedTimeRange || null"
          :is-suitable="isThisWeekSuitable"
        />
        
        <WeatherCard 
          title="Next"
          :date="nextWeekDay?.datetime"
          :day-data="nextWeekDay"
          :conditions="nextWeekConditions"
          :time-range="selectedTimeRange || null"
          :is-suitable="isNextWeekSuitable"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.weather-comparison {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px;
  box-sizing: border-box;
}

.site-header {
  padding: 10px 0;
  margin-bottom: 15px;
  
  .site-title {
    color: #ff6b6b;
    font-size: 1.2rem;
    margin: 0;
    font-weight: bold;
    
    @media (min-width: 768px) {
      font-size: 1.5rem;
    }
  }
}

.controls {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 20px;
  width: 100%;
  
  .time-selectors {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 10px;
    
    @media (min-width: 350px) {
      flex-direction: row;
      gap: 15px;
    }
  }
  
  @media (min-width: 650px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    gap: 20px;
    
    .time-selectors {
      flex-direction: row;
      width: auto;
    }
  }
}

.loading, .error {
  text-align: center;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-top: 20px;
}

.error {
  color: #d32f2f;
}

.comparison-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
  
  @media (min-width: 768px) {
    flex-direction: row;
    gap: 30px;
  }
}
</style>