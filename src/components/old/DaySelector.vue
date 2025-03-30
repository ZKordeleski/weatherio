<script setup lang="ts">
import { DAYS_OF_WEEK, type DayOfWeek } from '../../types/selectors';

interface Props {
    modelValue: DayOfWeek,
}

const props = defineProps<Props>();

interface Emits {
    (e: 'update:modelValue', value: DayOfWeek): void
}

const emit = defineEmits<Emits>();

function selectDay(event: Event) {
    const select = event.target as HTMLSelectElement;
    emit('update:modelValue', parseInt(select.value) as DayOfWeek);
}
</script>

<template>
  <div class="day-selector">
    <span class="material-icons-outlined time-icon icon">access_time</span>
    <!-- <span class="material-icons-outlined day-icon icon">calendar_today</span> -->
    <select 
      id="day-select" 
      :value="modelValue"
      @change="selectDay"
      class="day-dropdown"
    >
      <option 
        v-for="(day, index) in DAYS_OF_WEEK" 
        :key="index" 
        :value="index"
      >
        {{ day }}
      </option>
    </select>
  </div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/icon?family=Material+Icons+Outlined');

.day-selector {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  
  .day-icon {
    margin-right: 0.5rem;
    font-size: 1.2rem;
    color: #666;
  }
  
  .day-dropdown {
    padding: 0.5rem;
    border: none; // NOTE: Makes it difficult to recognize these as interactive?
    // border-radius: 4px;
    font-size: 0.9rem;
    background-color: white;
    min-width: 100px;
    cursor: pointer;
    
    &:focus {
      outline: none;
      border-color: #2196F3;
    }
  }
}
</style>