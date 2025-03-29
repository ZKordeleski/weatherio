<script setup lang="ts">

interface Props {
    modelValue: number,
}

const props = defineProps<Props>();

interface Emits {
    (e: 'update:modelValue', value: number): void
}

const emit = defineEmits<Emits>();

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function selectDay(event: Event) {
    const select = event.target as HTMLSelectElement;
    emit('update:modelValue', parseInt(select.value));
}

</script>
<template>
  <div class="day-selector">
    <label for="day-select">Day of Week:</label>
    <select 
      id="day-select" 
      :value="modelValue"
      @change="selectDay"
      class="day-dropdown"
    >
      <option 
        v-for="(day, index) in daysOfWeek" 
        :key="index" 
        :value="index"
      >
        {{ day }}
      </option>
    </select>
  </div>
</template>

<style scoped lang="scss">
.day-selector {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  
  label {
    margin-right: 0.75rem;
    font-weight: 500;
  }
  
  .day-dropdown {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;
    background-color: white;
    min-width: 150px;
    cursor: pointer;
    
    &:focus {
      outline: none;
      border-color: #2196F3;
    }
  }
}
</style>