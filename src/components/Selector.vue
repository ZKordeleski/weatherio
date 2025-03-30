<script setup lang="ts">
interface Props {
  modelValue: string | number;
  options: Array<{value: string | number, label: string}>;
  icon?: string;
  id?: string;
  prefix?: string;
}
// TODO: Customize selector using custom select and overlay strategy to display prefix?
const props = defineProps<Props>();

interface Emits {
  (e: 'update:modelValue', value: string | number): void;
}

const emit = defineEmits<Emits>();

function handleSelect(event: Event) {
  const select = event.target as HTMLSelectElement;
  emit('update:modelValue', 
    typeof props.modelValue === 'number' ? parseInt(select.value) : select.value
  );
}
</script>

<template>
  <div class="selector">
    <span 
      v-if="icon" 
      class="material-icons-outlined icon"
    >{{ icon }}</span>
    
    <select 
      :id="id || 'selector'" 
      :value="modelValue"
      @change="handleSelect"
      class="selector-dropdown"
    >
      <option 
        v-for="option in options" 
        :key="option.value" 
        :value="option.value"
      >
        {{ (props.prefix || '') + option.label }}
      </option>
    </select>
  </div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/icon?family=Material+Icons+Outlined');

.selector {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  
  .icon {
    margin-right: 0.5rem;
    font-size: 1.2rem;
    color: #666;
  }
  
  .selector-dropdown {
    padding: 0.5rem; // TODO: Consider right-align?
    border: none;
    font-size: 0.9rem;
    font-family: sans-serif;
    background-color: #fff;
    min-width: 100px;
    cursor: pointer;
    
    &:focus {
      outline: none;
      border-color: #2196F3;
    }
  }
}
</style>