<template>
  <form action="" @submit="handleSubmit">
    <template v-for="field of paymentMethod.paymentForm.fields" :key="field.name">
      <PPInput
        v-if="isPPInputType(field.type)"
        :label="translate(`label_${field.name}`)"
        :type="field.type"
        :name="field.name"
        class="pp-input"
      />
    </template>
    <PPButton class="pp-button">{{ translate(`btn_pay`) }}</PPButton>
  </form>
</template>

<script setup lang="ts">
import type { Translate } from "orchestrator-pp-core";
import type { PaymentMethod } from "orchestrator-pp-payment-method";
import { PPInput } from "orchestrator-pp-vue-ui-kit";

const props = defineProps<{
  paymentMethod: PaymentMethod,
  translate: Translate
}>();

const emit = defineEmits<{
  (event: 'pay', data: Record<string, unknown>): void;
}>();

function isPPInputType(type: string): type is 'text' | 'number' | 'email' | 'password' | 'tel' {
  return ['text', 'number', 'email', 'password', 'tel'].includes(type);
}

async function handleSubmit(event: Event) {
  event.preventDefault();

  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);

  const data: Record<string, unknown> = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });

  await props.paymentMethod.paymentForm.onSubmit?.(data);
  emit('pay', data);
}
</script>

<style scoped>
.pp-input:not(:last-of-type) {
  margin-bottom: var(--pp-gap-md);
}

.pp-button {
  width: 100%;
  margin-top: var(--pp-gap-xl);
}
</style>
