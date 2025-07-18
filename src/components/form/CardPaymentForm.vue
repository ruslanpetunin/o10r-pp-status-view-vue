<template>
  <form action="" ref="formRef" @submit.prevent="handleSubmit" @input="handleInput">
    <template v-for="field of paymentMethod.paymentForm.fields" :key="field.name">
      <PPInput
        v-if="isPPInputType(field.type)"
        :label="translate(`l_${field.name}`)"
        :type="field.type"
        :name="field.name"
        @blur="touched.push(field.name)"
        :error="errors[field.name]"
        class="pp-input"
      />
    </template>
    <PPButton class="pp-button" :disabled="!formValidationResult.isValid || submited">
      {{ translate(`b_pay`) }}
    </PPButton>
  </form>
</template>

<script setup lang="ts">
import type { Translate } from "orchestrator-pp-core";
import type { PaymentMethod, FormValidationResult } from "orchestrator-pp-payment-method";
import { PPInput } from "orchestrator-pp-vue-ui-kit";
import { ref, onMounted, computed } from 'vue'

const props = defineProps<{
  paymentMethod: PaymentMethod,
  translate: Translate
}>();

const emit = defineEmits<{
  (event: 'pay', data: Record<string, unknown>): void;
}>();

const submited = ref<boolean>(false);
const touched = ref<string[]>([]);
const formValidationResult = ref<FormValidationResult>({ isValid: false, errors: {} });
const formRef = ref<HTMLFormElement>();

const errors = computed<Record<string, string>>(
  () => {
    const result: Record<string, string> = {};

    if (!formValidationResult.value.isValid) {
      for (const fieldName of Object.keys(formValidationResult.value.errors)) {
        const errors = formValidationResult.value.errors[fieldName];

        if (errors && touched.value.includes(fieldName)) {
          const firstErrorRuleName = Object.keys(errors)[0];

          result[fieldName] = props.translate(
            `ve_${firstErrorRuleName}`,
            {
              name: props.translate(`l_${fieldName}`)
            }
          );
        }
      }
    }

    return result;
  }
);

function isPPInputType(type: string): type is 'text' | 'number' | 'email' | 'password' | 'tel' {
  return ['text', 'number', 'email', 'password', 'tel'].includes(type);
}

function getFormData(): Record<string, unknown> {
  const data: Record<string, unknown> = {};

  if (!formRef.value) {
    return data;
  } else {
    const formData = new FormData(formRef.value);

    formData.forEach((value, key) => {
      data[key] = value
    });

    return data;
  }
}

async function validateForm(): Promise<void> {
  formValidationResult.value.isValid = false;
  formValidationResult.value = await props.paymentMethod.paymentForm.validate(getFormData());
}

async function handleInput(): Promise<void> {
  await validateForm();
}

async function handleSubmit() {
  const formData = getFormData();

  submited.value = true;

  await props.paymentMethod.paymentForm.onSubmit(formData);
  emit('pay', formData);
}

onMounted(validateForm);
</script>
