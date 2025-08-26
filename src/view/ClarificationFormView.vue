<template>
  <form action="" ref="formRef" @submit.prevent="handleSubmit" @input="validateForm">
    <template v-for="field of form.fields" :key="field.name">
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
      {{ translate(`b_clarify`) }}
    </PPButton>
  </form>
</template>

<script setup lang="ts">
import type { ClarificationSection, Translator } from 'o10r-pp-core';
import { useForm as buildFormConfig } from 'o10r-pp-payment-method';
import useForm from './../composable/useForm';
import { PPInput } from 'o10r-pp-ui-kit-vue';
import { inject, onMounted } from 'vue';

const props = defineProps<{
  paymentStatus: ClarificationSection
}>();

const emit = defineEmits<{
  (event: 'clarify', data: Record<string, unknown>): void
}>();

const { translate } = inject('translator') as Translator;

const form = buildFormConfig(props.paymentStatus.clarification);

const {
  formRef,
  submitted,
  touched,
  formValidationResult,
  validationErrors,
  getFormData,
  isPPInputType
} = useForm(translate);

async function validateForm(): Promise<void> {
  formValidationResult.value.isValid = false;
  formValidationResult.value = await form.validate(getFormData());
}

async function handleSubmit() {
  const formData = getFormData();

  submitted.value = true;

  emit('clarify', formData);
}

onMounted(validateForm);
</script>
