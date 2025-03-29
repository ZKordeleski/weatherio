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

function selectDay(dayIndex: number) {
    emit('update:modelValue', dayIndex);
}
</script>
<template>
  <div class="day-selector">
    <h3>Day of Week</h3>
    <div class="day-buttons">
      <button
        v-for="(day, index) in daysOfWeek"
        :key="day"
        type="button"
        :class="{ selected: index === modelValue }"
        @click="selectDay(index)"
      >
        {{ day }}
      </button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
</style>