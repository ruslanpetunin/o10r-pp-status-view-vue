<template>
  <PPInput
    v-if="isPPInputType(field.type)"
    class="pp-input"
    :label="translate(`l_${field.name}`)"
    :type="field.type"
    :name="field.name"
    @blur="$emit('blur')"
    :error="validationError"
  />
  <PPSelect
    v-else-if="field.type === 'select'"
    class="pp-input"
    :name="field.name"
    :label="translate(`l_${field.name}`)"
    :error="validationError"
  >
    <option
      v-for="option of field.options"
      :key="option.value"
      :value="option.value"
    >
      {{ getSelectOptionLabel(field.name, option.value) }}
    </option>
  </PPSelect>
  <PPCheckbox
    v-else-if="field.type === 'checkbox'"
    class="pp-input"
    :label="field.label || field.name"
    :name="field.name"
    @change="$emit('blur')"
    :error="validationError"
  />
</template>

<script setup lang="ts">
import { inject } from "vue";
import type { Field, Translator } from "o10r-pp-core";
import useForm from "./../../composable/useForm";
import { PPInput, PPSelect, PPCheckbox } from "o10r-pp-ui-kit-vue";

defineProps<{
  field: Field
  validationError?: string
}>();

defineEmits<{
  (event: 'blur'): void;
}>();

const { translate } = inject('translator') as Translator;

const { isPPInputType } = useForm(translate);

function getSelectOptionLabel(fieldName: string, optionValue: string): string {
  const name = fieldName
    .replace(/^billing\_/, '')
    .replace(/^shipping\_/, '');

  return translate(`so_${name}_${optionValue.toLowerCase()}`);
}
</script>
