<template>
  <BaseField
    v-for="field of paymentFields"
    :key="field.name"
    :field="field"
    :validationError="validationErrors[field.name]"
    @blur="$emit('blur', field.name)"
  />
  <BillingFieldGroup
    :fields="billingFields"
    :shippingData="shippingData"
    :validationErrors="validationErrors"
    @blur="$emit('blur', $event)"
  />
</template>

<script setup lang="ts">
import { useBillingFields } from "o10r-pp-core";
import type { Field } from "o10r-pp-core";
import BaseField  from "./BaseField.vue";
import BillingFieldGroup  from "./BillingFieldGroup.vue";

type PaymentFieldsConfig = {
  paymentFields: Field[];
  billingFields: Field[];
};

const props = defineProps<{
  fields: Field[],
  shippingData?: Record<string, unknown>,
  validationErrors: Record<string, string>
}>();

defineEmits<{
  (event: 'blur', fieldName: string): void;
}>();

const billingFieldsNames = useBillingFields().map(field => field.name);

const { paymentFields, billingFields } = props.fields.reduce<PaymentFieldsConfig>(
  (acc, field) => {
    if (!billingFieldsNames.includes(field.name)) {
      acc.paymentFields.push(field);
    } else {
      acc.billingFields.push(field);
    }

    return acc;
  },
  { paymentFields: [], billingFields: [] }
);
</script>
