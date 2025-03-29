<script setup lang="ts">
import { TIME_RANGES, type TimeOfDay } from '../types/selectors';


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
    <label for="time-select">Time of Day:</label>
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

</style>