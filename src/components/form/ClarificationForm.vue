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
      {{ translate(`b_pay`) }}
    </PPButton>
  </form>
</template>

<script setup lang="ts">
import type { Clarification, Translate } from 'orchestrator-pp-core';
import { useForm as buildFormConfig } from 'orchestrator-pp-payment-method';
import useForm from './../../composable/useForm';
import { PPInput } from 'orchestrator-pp-vue-ui-kit';
import { onMounted } from 'vue';

const props = defineProps<{
  paymentStatus: Clarification
  translate: Translate
}>();

const emit = defineEmits<{
  (event: 'clarify', data: Record<string, unknown>): void
}>();

const form = buildFormConfig(props.paymentStatus.clarification_fields);

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
  formValidationResult.value = await form.validate(getFormData());
}

async function handleSubmit() {
  const formData = getFormData();

  submitted.value = true;

  emit('clarify', formData);
}

onMounted(validateForm);
</script>
