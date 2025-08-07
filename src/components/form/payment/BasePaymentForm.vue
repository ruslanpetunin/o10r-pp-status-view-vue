<template>
  <form action="" ref="formRef" @submit.prevent="handleSubmit" @input="validateForm">
    <template v-for="field of paymentMethod.paymentForm.fields" :key="field.name">
      <PPInput
        v-if="isPPInputType(field.type)"
        :label="translate(`l_${field.name}`)"
        :type="field.type"
        :name="field.name"
        @blur="touched.push(field.name)"
        :error="validationErrors[field.name]"
        class="pp-input"
      />
    </template>
    <PPButton class="pp-button" :disabled="!formValidationResult.isValid || submitted">
      {{ translate(`b_pay`) }}
    </PPButton>
  </form>
</template>

<script setup lang="ts">
import type { Translate } from "o10r-pp-core";
import type { PaymentMethod } from "o10r-pp-payment-method";
import { PPInput } from "o10r-pp-ui-kit-vue";
import { onMounted } from 'vue';
import useForm from './../../../composable/useForm';

const props = defineProps<{
  paymentMethod: PaymentMethod,
  translate: Translate
}>();

const emit = defineEmits<{
  (event: 'pay', data: Record<string, unknown>): void;
}>();

const {
  formRef,
  submitted,
  touched,
  formValidationResult,
  validationErrors,
  getFormData,
  isPPInputType
} = useForm(props.translate);

async function validateForm(): Promise<void> {
  formValidationResult.value.isValid = false;
  formValidationResult.value = await props.paymentMethod.paymentForm.validate(getFormData());
}

async function handleSubmit() {
  const formData = getFormData();

  submitted.value = true;

  await props.paymentMethod.paymentForm.onSubmit(formData);
  emit('pay', formData);
}

onMounted(validateForm);
</script>
