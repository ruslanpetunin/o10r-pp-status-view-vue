<template>
  <BaseField
    v-for="field of otherFields"
    :key="field.name"
    :field="field"
    :validationError="validationErrors[field.name]"
    @blur="$emit('blur', field.name)"
  />

  <div v-if="postalCodeField || cityField" class="pp-form-row">
    <div v-if="postalCodeField" :class="{'pp-form-col': cityField}">
      <BaseField
        :field="postalCodeField"
        :validationError="validationErrors[postalCodeField.name]"
        @blur="$emit('blur', postalCodeField.name)"
      />
    </div>
    <div v-if="cityField" :class="{'pp-form-col': postalCodeField}">
      <BaseField
        :field="cityField"
        :validationError="validationErrors[cityField.name]"
        @blur="$emit('blur', cityField.name)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Field } from "o10r-pp-core";
import BaseField  from "./BaseField.vue";

type ShippingFieldsConfig = {
  postalCodeField?: Field;
  cityField?: Field;
  otherFields: Field[];
};

const props = defineProps<{
  fields: Field[]
  validationErrors: Record<string, string>
}>();

defineEmits<{
  (event: 'blur', fieldName: string): void;
}>();

const { postalCodeField, cityField, otherFields } = props.fields.reduce<ShippingFieldsConfig>(
  (acc, field) => {
    if (field.name === 'shipping_postal_code') {
      acc.postalCodeField = field;
    } else if (field.name === 'shipping_city') {
      acc.cityField = field;
    } else {
      acc.otherFields.push(field);
    }

    return acc;
  },
  { otherFields: [] }
);
</script>
