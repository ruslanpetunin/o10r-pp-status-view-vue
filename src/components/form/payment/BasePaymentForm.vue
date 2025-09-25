<template>
  <form action="" ref="formRef" @submit.prevent="handleSubmit" @input="validateForm">
    <p v-if="!paymentMethod.paymentForm.fields.length">{{ translate('t_proceed_payment') }}</p>
    <PaymentFieldGroup
      :fields="paymentMethod.paymentForm.fields"
      :validationErrors="validationErrors"
      @blur="touched.push($event)"
    />
    <PPButton v-if="showPayButton" class="pp-button" :disabled="!formValidationResult.isValid || submitted">
      {{ translate(`b_pay`) }}
    </PPButton>
  </form>
</template>

<script setup lang="ts">
import type { Translator } from 'o10r-pp-core';
import type { FormValidationResult, PaymentMethod } from 'o10r-pp-payment-method';
import { inject, onMounted } from 'vue';
import useForm from './../../../composable/useForm';
import PaymentFieldGroup from './../../../components/field/PaymentFieldGroup.vue';

const props = defineProps<{
  paymentMethod: PaymentMethod,
  showPayButton: boolean
}>();

const emit = defineEmits<{
  (event: 'pay', data: Record<string, unknown>): void;
  (event: 'input', data: { data: Record<string, unknown>, validation: FormValidationResult }): void;
}>();

const { translate } = inject('translator') as Translator;

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
  formValidationResult.value = await props.paymentMethod.paymentForm.validate(formData);

  emit('input', { data: formData, validation: formValidationResult.value });
}

async function handleSubmit() {
  const formData = getFormData();

  submitted.value = true;

  await props.paymentMethod.paymentForm.onSubmit(formData);
  emit('pay', formData);
}

onMounted(validateForm);
</script>
