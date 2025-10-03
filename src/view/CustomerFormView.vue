<template>
  <form action="" ref="formRef" @submit.prevent="handleSubmit" @input="validateForm">
    <p v-if="!fields.length">{{ translate('t_proceed_payment') }}</p>
    <BaseField
      v-for="field in fields"
      :key="field.name"
      :field="field"
      :validationError="validationErrors[field.name]"
      @blur="touched.push(field.name)"
    />
    <PPButton v-if="showPayButton" class="pp-button" :disabled="!formValidationResult.isValid || submitted">
      {{ translate(`b_confirm`) }}
    </PPButton>
  </form>
</template>

<script setup lang="ts">
import type { FormValidationResult } from 'o10r-pp-payment-method';
import { useForm as useFormConfig } from 'o10r-pp-payment-method';
import BaseField from "./../components/field/BaseField.vue";
import { inject, onMounted } from "vue";
import type { Translator } from "o10r-pp-core";
import { useCustomerFields } from "o10r-pp-core";
import useForm from "./../composable/useForm";

withDefaults(
  defineProps<{
    showPayButton?: boolean
  }>(), {
    showPayButton: true
  }
);

const emit = defineEmits<{
  (event: 'confirm', data: Record<string, unknown>): void;
  (event: 'input', data: { data: Record<string, unknown>, validation: FormValidationResult }): void;
}>();

const { translate } = inject('translator') as Translator;
const { fields, validate } = useFormConfig(useCustomerFields());

const {
  formRef,
  submitted,
  touched,
  formValidationResult,
  validationErrors,
  getFormData
} = useForm(translate);

async function validateForm(): Promise<void> {
  const formData = getFormData();

  formValidationResult.value.isValid = false;
  formValidationResult.value = await validate(formData);

  emit('input', { data: formData, validation: formValidationResult.value });
}

async function handleSubmit() {
  submitted.value = true;

  emit('confirm', getFormData());
}

onMounted(validateForm);
</script>
