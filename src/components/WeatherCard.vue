<script setup lang="ts">
import type { DayWeather } from '../types/weather';
import { computed } from 'vue';
import TimeChart from './TimeChart.vue';
import WeatherIcons from './WeatherIcons.vue';
import { DAYS_OF_WEEK } from '../types/selectors';

interface Props {
  title: string;
  date: string | undefined;
  dayData: DayWeather | null;
  conditions: {
    temp: number;
    humidity: number;
    precipProb: number;
    conditions: string;
  } | null;
  timeRange: {
    label: string;
    startHour: number;
    endHour: number;
  } | null;
  isSuitable: boolean;
}

const props = defineProps<Props>();

const getWindSpeed = computed(() => {
  if (!props.dayData) return '';
  return Math.round(props.dayData.windspeed).toString();
});

const getDayOfMonth = computed(() => {
  if (!props.date) return '';
  const date = new Date(props.date);
  return date.getDate().toString();
});

const getDayOfWeek = computed(() => {
  if (!props.date) return '';
  const date = new Date(props.date);
  return DAYS_OF_WEEK[date.getDay()];
});

const getFormattedDate = computed(() => {
  if (!props.date) return '';
  return `${getDayOfWeek.value} the ${getDayOfMonth.value}th`;
});

const hasRain = computed(() => {
  if (!props.conditions) return false;
  return props.conditions.precipProb > 0;
});

// TODO: Use vue inline dynamic style tag?
// Determine color of title text based on "This" or "Next"
const getTitleColor = computed(() => {
  return props.title.toLowerCase() === 'this' ? '#ff6b6b' : '#333'; // TODO: Orange contrast ratio is low. 2.77.
});

// Get weather condition text
// TODO: Type the condition text.
const getWeatherCondition = computed(() => {
  if (!props.conditions) return '';
  
  // Capitalization of the first letter.
  const condition = props.conditions.conditions;
  return condition.charAt(0).toUpperCase() + condition.slice(1);
});
</script>

<template>
  <div class="weather-card" :class="{ 'suitable': isSuitable }">
    <h1 class="card-title heading1" :style="{ color: getTitleColor }">
      {{ title }} {{ getFormattedDate }}
    </h1>
    
    <div v-if="conditions" class="weather-overview">
      <!-- Weather condition icon -->
      <WeatherIcons 
        :condition="conditions.conditions"
        :size="60"
      />
      
      <div class="weather-details">
        <div class="condition-temp body">
          <span>{{ getWeatherCondition }}</span>
          <span>{{ Math.round(conditions.temp) }}°F</span>
        </div>
        
        <!-- Wind information with icon -->
        <p class="wind small">
          <span class="material-icons-outlined detail-icon icon">air</span>
          winds {{ getWindSpeed }}mph
        </p>
        
        <!-- Precipitation information with icon -->
        <p class="precip small">
          <span class="material-icons-outlined detail-icon icon">water_drop</span>
          {{ hasRain ? conditions.precipProb + '% chance rain' : 'no rain' }}
        </p>
      </div>
    </div>
    
    <div v-else class="no-data">
      <p>No data available for this day</p>
    </div>
    
    <TimeChart 
      v-if="dayData && dayData.hours" 
      :hours="dayData.hours"
      :time-range="timeRange"
    />
  </div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/icon?family=Material+Icons+Outlined');

.weather-card {
  width: 100%;
  max-height: 600px;
  padding: 15px;
  background-color: #fff;
  box-sizing: border-box;
  
  &.suitable {
    border: 3px solid #4caf50; // TODO: I think an icon in the top right could be nice? Little check?
  }
  
  .card-title {
    width: 100%;
    font-size: 1.5rem;
    margin-top: 0;
    margin-bottom: 15px;
    text-align: center;
    font-weight: 600;
    
    @media (min-width: 768px) {
      font-size: 1.5rem;
      margin-bottom: 20px;
    }
  }
  
  .weather-overview {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    
    .weather-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-left: 15px;
      min-width: 0; // Allow text to wrap
      
      .condition-temp.body {
        font-size: 1.1rem;
        margin: 0;
        white-space: nowrap;
        
        span {
          margin-right: 5px;
        
        // NOTE: Might help the temperature stand out a bit?
        //   &:last-child {
        //     font-weight: bold;
        //   }
        }
        
        @media (min-width: 768px) {
          font-size: 1.3rem;
        }
      }
      
      .wind.small, .precip.small {
        font-size: .9rem;
        margin: 0;
        display: flex;
        align-items: center;
        line-height: 1; // Needed for centering with icons.
        
        .detail-icon {
          font-size: 1.2rem;
          margin-right: 4px;
        }
      }
    }
  }
  
  .no-data {
    text-align: center;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 8px;
    margin-bottom: 20px;
  }
}
</style>