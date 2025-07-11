<template>
  <form action="">
    <template v-for="field of paymentMethod.paymentForm.fields" :key="field.name">
      <PPInput
        v-if="PaymentMethodFieldType.NUMBER === field.type"
        :label="translate(`label_${field.name}`)"
        type="number"
        v-model="value"
      />
      <PPInput
        v-else-if="PaymentMethodFieldType.TEXT === field.type"
        :label="translate(`label_${field.name}`)"
        type="text"
        v-model="value"
      />
      <PPInput
        v-else-if="PaymentMethodFieldType.EMAIL === field.type"
        :label="translate(`label_${field.name}`)"
        type="email"
        v-model="value"
      />
      <PPInput
        v-else-if="PaymentMethodFieldType.TEL === field.type"
        :label="translate(`label_${field.name}`)"
        type="tel"
        v-model="value"
      />
      <PPInput
        v-else-if="PaymentMethodFieldType.PASSWORD === field.type"
        :label="translate(`label_${field.name}`)"
        type="password"
        v-model="value"
      />
    </template>
  </form>
</template>

<script setup lang="ts">
import { PaymentMethodFieldType } from 'orchestrator-pp-core'
import type { PaymentMethod, Translate } from "orchestrator-pp-core";
import { PPInput } from "orchestrator-pp-vue-ui-kit";
import { ref } from 'vue'

defineProps<{
  paymentMethod: PaymentMethod,
  translate: Translate
}>();

const value = ref<string>('');
</script>

<style scoped>

</style>
