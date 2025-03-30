<script setup lang="ts">
import { TIME_RANGES, type TimeOfDay } from '../types/selectors';

// TODO: Consolidate selectors.

interface Props {
    modelValue: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: TimeOfDay): void;
}>();

function selectRange(event: Event) {
  const select = event.target as HTMLSelectElement;
  emit('update:modelValue', select.value as TimeOfDay);
};
</script>

<template>
  <div class="time-range-selector">
    <!-- <span class="material-icons-outlined time-icon icon">access_time</span> -->
    <select 
      id="time-select" 
      :value="modelValue"
      @change="selectRange"
      class="time-dropdown"
    >
      <option 
        v-for="time in TIME_RANGES" 
        :key="time.value" 
        :value="time.value"
      >
        {{ time.label }}
      </option>
    </select>
  </div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/icon?family=Material+Icons+Outlined');

.time-range-selector {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  
  .time-icon {
    margin-right: 0.5rem;
    font-size: 1.2rem;
    color: #666;
  }
  
  .time-dropdown {
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