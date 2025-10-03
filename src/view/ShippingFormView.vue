<template>
  <form action="" ref="formRef" @submit.prevent="handleSubmit" @input="validateForm">
    <p v-if="!fields.length">{{ translate('t_proceed_payment') }}</p>
    <ShippingFieldGroup
      :fields="fields"
      :validationErrors="validationErrors"
      @blur="touched.push($event)"
    />
    <PPButton v-if="showPayButton" class="pp-button" :disabled="!formValidationResult.isValid || submitted">
      {{ translate(`b_confirm`) }}
    </PPButton>
  </form>
</template>

<script setup lang="ts">
import type { FormValidationResult } from 'o10r-pp-payment-method';
import { useForm as useFormConfig } from 'o10r-pp-payment-method';
import ShippingFieldGroup from "./../components/field/ShippingFieldGroup.vue";
import { inject, onMounted } from "vue";
import type { Translator } from "o10r-pp-core";
import { useShippingFields } from "o10r-pp-core";
import useForm from "./../composable/useForm";

const props = withDefaults(
  defineProps<{
    allowedCountries?: string[]
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
const { fields, validate } = useFormConfig(useShippingFields(props.allowedCountries));

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
