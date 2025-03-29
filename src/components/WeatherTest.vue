<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getWeatherForecast } from '../api/weatherapi';
import type { WeatherData } from '../types/weather';

const weatherData = ref<WeatherData | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);
const location = ref('Reston, VA');

const fetchWeatherData = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    const data = await getWeatherForecast(location.value);
    weatherData.value = data;
    console.log('Weather data:', data);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error occurred';
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = () => {
  fetchWeatherData();
};

// Grab some data right off the rip.
onMounted(fetchWeatherData);
</script>

<template>
  <div class="weather-test">
    <h1>Weather API Test</h1>
    
    <form @submit.prevent="handleSubmit">
      <label for="location">Location:</label>
      <input 
        id="location" 
        v-model="location" 
        type="text" 
        placeholder="Enter location"
      />
      <button type="submit">Fetch Weather</button>
    </form>
    
    <div v-if="isLoading" class="loading">
      Loading weather data...
    </div>
    
    <div v-else-if="error" class="error">
      Error: {{ error }}
    </div>
    
    <div v-else-if="weatherData" class="results">
      <h2>{{ weatherData.resolvedAddress }}</h2>
      <p>{{ weatherData.description }}</p>
      
      <h3>Current Conditions</h3>
      <div v-if="weatherData.currentConditions" class="current-conditions">
        <p>Temperature: {{ weatherData.currentConditions.temp }}°F</p>
        <p>Conditions: {{ weatherData.currentConditions.conditions }}</p>
      </div>
      
      <h3>Forecast</h3>
      <div class="days-container">
        <div 
          v-for="day in weatherData.days.slice(0, 7)" 
          :key="day.datetime" 
          class="day-card"
        >
          <h4>{{ new Date(day.datetime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) }}</h4>
          <p>High: {{ day.tempmax }}°F</p>
          <p>Low: {{ day.tempmin }}°F</p>
          <p>Precipitation: {{ day.precipprob }}%</p>
          <p>{{ day.conditions }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weather-test {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

form {
  margin-bottom: 20px;
}

label {
  margin-right: 10px;
}

input {
  padding: 8px;
  margin-right: 10px;
  width: 250px;
}

button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

.loading, .error {
  margin: 20px 0;
}

.error {
  color: red;
}

.days-container {
  display: flex;
  overflow-x: auto;
  gap: 15px;
  padding: 10px 0;
}

.day-card {
  min-width: 150px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background-color: #f9f9f9;
}
</style>