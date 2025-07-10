<template>
  <form action="">
    <template v-for="field of paymentMethod.paymentForm.fields" :key="field.name">
      <PPInput v-if="PaymentMethodFieldType.NUMBER === field.type" type="number" v-model="value" label="Card number" />
      <PPInput v-else-if="PaymentMethodFieldType.TEXT === field.type" type="text" v-model="value" label="Card number" />
      <PPInput v-else-if="PaymentMethodFieldType.EMAIL === field.type" type="email" v-model="value" label="Card number" />
      <PPInput v-else-if="PaymentMethodFieldType.TEL === field.type" type="tel" v-model="value" label="Card number" />
      <PPInput v-else-if="PaymentMethodFieldType.PASSWORD === field.type" type="password" v-model="value" label="Card number" />
    </template>
  </form>
</template>

<script setup lang="ts">
import { PaymentMethodFieldType } from "orchestrator-pp-core";
import type { PaymentMethod } from "orchestrator-pp-core";
import { PPInput } from "orchestrator-pp-vue-ui-kit";
import { ref } from 'vue'

defineProps<{
  paymentMethod: PaymentMethod
}>();

const value = ref<string>('');
</script>

<style scoped>

</style>
