<template>
  <CardPaymentForm
    v-if="paymentMethod.code === 'card'"
    :paymentMethod="paymentMethod"
    @pay="$emit('pay', $event)"
    @removed="$emit('removed')"
  />
  <BasePaymentForm v-else :paymentMethod="paymentMethod" @pay="$emit('pay', $event)" />
</template>

<script setup lang="ts">
import type { PaymentMethod } from "o10r-pp-payment-method";
import CardPaymentForm from './payment/CardPaymentForm.vue';
import BasePaymentForm from './payment/BasePaymentForm.vue';

defineProps<{
  paymentMethod: PaymentMethod
}>();

defineEmits<{
  (event: 'pay', data: Record<string, unknown>): void;
  (event: 'removed'): void;
}>();
</script>
