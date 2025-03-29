<script setup lang="ts">

interface Props {
    modelValue: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const timeRanges = [
  { value: 'morning', label: 'Morning (8am-12pm)' },
  { value: 'afternoon', label: 'Afternoon (12pm-5pm)' },
  { value: 'evening', label: 'Evening (5pm-9pm)' }
];

function selectRange(event: Event) {
  const select = event.target as HTMLSelectElement;
  emit('update:modelValue', select.value);
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
        v-for="time in timeRanges" 
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