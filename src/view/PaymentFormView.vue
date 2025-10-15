<template>
  <CardPaymentForm
    v-if="paymentMethod.code === 'card'"
    :paymentMethod="paymentMethod"
    :shippingData="shippingData"
    :paymentMode="paymentMode"
    :showPayButton="showPayButton"
    @pay="$emit('pay', $event)"
    @removed="$emit('removed')"
    @input="$emit('input', $event)"
  />
  <BasePaymentForm
    v-else
    :paymentMethod="paymentMethod"
    :shippingData="shippingData"
    :paymentMode="paymentMode"
    :showPayButton="showPayButton"
    @pay="$emit('pay', $event)"
    @input="$emit('input', $event)"
  />
</template>

<script setup lang="ts">
import type { FormValidationResult, PaymentMethod } from 'o10r-pp-payment-method';
import { PaymentMode } from 'o10r-pp-core';
import CardPaymentForm from './../components/form/payment/CardPaymentForm.vue';
import BasePaymentForm from './../components/form/payment/BasePaymentForm.vue';

withDefaults(
  defineProps<{
    paymentMethod: PaymentMethod,
    shippingData?: Record<string, unknown>,
    paymentMode?: PaymentMode,
    showPayButton?: boolean
  }>(), {
    showPayButton: true,
    paymentMode: PaymentMode.PAYMENT,
  }
);

defineEmits<{
  (event: 'pay', data: Record<string, unknown>): void;
  (event: 'removed'): void;
  (event: 'input', data: { data: Record<string, unknown>, validation: FormValidationResult }): void;
}>();
</script>
