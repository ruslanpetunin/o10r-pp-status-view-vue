<template>
  <template v-if="paymentStatus?.status === PaymentStatus.PENDING">
    <slot name="pending" />
  </template>
  <template v-else-if="paymentStatus?.status === PaymentStatus.FAILED">
    <slot name="failed" />
  </template>
  <template v-else-if="paymentStatus?.status === PaymentStatus.SUCCESS">
    <slot name="success" />
  </template>
  <template v-else>
    <slot name="notStarted" />
  </template>
</template>

<script setup lang="ts">
import type { PaymentStatusData } from 'orchestrator-pp-core';
import { PaymentStatus } from 'orchestrator-pp-core';

defineProps<{
  paymentStatus?: PaymentStatusData
}>();
</script>
