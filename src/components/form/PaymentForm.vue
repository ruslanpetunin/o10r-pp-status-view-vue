<template>
  <form action="">
    <template v-for="field of paymentMethod.paymentForm.fields">
      <PPInput v-if="PaymentMethodFieldType.NUMBER === field.type" type="number" />
      <PPInput v-else-if="PaymentMethodFieldType.TEXT === field.type" type="text" />
      <PPInput v-else-if="PaymentMethodFieldType.EMAIL === field.type" type="email" />
      <PPInput v-else-if="PaymentMethodFieldType.TEL === field.type" type="tel" />
      <PPInput v-else-if="PaymentMethodFieldType.PASSWORD === field.type" type="password" />
    </template>
  </form>
</template>

<script setup lang="ts">
import { PaymentMethodFieldType } from "orchestrator-pp-core";
import type { PaymentMethod } from "orchestrator-pp-flow";
import { PPInput } from "orchestrator-pp-vue-ui-kit";

defineProps<{
  paymentMethod: PaymentMethod
}>();
</script>

<style scoped>

</style>
