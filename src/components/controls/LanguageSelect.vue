<template>
  <select v-model="selected">
    <option v-for="language in languages" :key="language.code" :value="language.code">
      {{ language.label }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Language } from 'orchestrator-pp-core'

const props = defineProps<{
  current: Language
}>();

const emit = defineEmits<{
  (e: 'change', language: Language): void
}>();

const selected = ref<Language>(props.current);
const languages: { label: string, code: Language }[] = [
  { label: 'English', code: Language.EN },
  { label: 'Русский', code: Language.RU },
];

watch(selected, (newValue) => {
  emit('change', newValue)
});

watch(
  () => props.current,
  (newVal) => {
    if (newVal !== selected.value) {
      selected.value = newVal
    }
  }
);
</script>
