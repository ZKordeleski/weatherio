<script setup lang="ts">
interface Props {
  modelValue: string;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'search', value: string): void;
}

const emit = defineEmits<Emits>();

function handleInput(event: Event) {
  const input = event.target as HTMLInputElement;
  emit('update:modelValue', input.value);
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    emit('search', (event.target as HTMLInputElement).value);
  }
}
</script>

<template>
  <div class="location-selector">
    <span class="material-icons-outlined location-icon icon">location_on</span>
    <input 
      id="location-input"
      type="text"
      :value="modelValue"
      @input="handleInput"
      @keydown="handleKeyDown"
      placeholder="Enter location (city, state, zip)"
      class="location-input subheading"
    />
  </div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/icon?family=Material+Icons+Outlined');

.location-selector {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  
  .location-icon {
    margin-right: 0.5rem;
    font-size: 1.5rem;
    color: #666;
  }
  
  .location-input {
    padding: 0.5rem;
    border: none;
    border-radius: 0;
    font-size: 1.2rem;
    font-weight: 500;
    background-color: transparent;
    min-width: 150px;
    font-family: sans-serif;
    
    &:focus {
      outline: none;
      border-color: #2196F3;
    }
  }
}
</style>
