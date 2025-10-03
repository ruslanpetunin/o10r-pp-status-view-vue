<template>
  <template v-if="shippingData">
    <PPCheckbox
      class="pp-input"
      :label="translate('l_billing_is_shipping')"
      :value="!fillManually"
      @change="onCheckboxChange(!$event)"
    />
  </template>

  <template v-if="!shippingData || fillManually">
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
  <template v-else-if="billingFieldsPrefilledByShipping">
    <input
      v-for="[name, value] of Object.entries(billingFieldsPrefilledByShipping)"
      type="hidden"
      :key="name"
      :name="name"
      :value="value"
    >
  </template>
</template>

<script setup lang="ts">
import type { Field, Translator } from "o10r-pp-core";
import { shippingDataToBillingData } from "o10r-pp-core";
import BaseField  from "./BaseField.vue";
import { computed, inject, ref } from "vue";
import { PPCheckbox } from "o10r-pp-ui-kit-vue";

type BillingFieldsConfig = {
  postalCodeField?: Field;
  cityField?: Field;
  otherFields: Field[];
};

const props = defineProps<{
  fields: Field[],
  shippingData?: Record<string, unknown>,
  validationErrors: Record<string, string>
}>();

const emit = defineEmits<{
  (event: 'fillManually', fillManually: boolean): void;
  (event: 'blur', fieldName: string): void;
}>();

const { translate } = inject('translator') as Translator;

const fillManually = ref<boolean>(false);
const { postalCodeField, cityField, otherFields } = props.fields.reduce<BillingFieldsConfig>(
  (acc, field) => {
    if (field.name === 'billing_postal_code') {
      acc.postalCodeField = field;
    } else if (field.name === 'billing_city') {
      acc.cityField = field;
    } else {
      acc.otherFields.push(field);
    }

    return acc;
  },
  { otherFields: [] }
);

const billingFieldsPrefilledByShipping = computed<Record<string, unknown>|undefined>(
  () => {
    if (props.shippingData && props.fields.length) {
      const result: Record<string, unknown> = {};
      const shippingAsBilling = shippingDataToBillingData(props.shippingData);

      for (const field of props.fields) {
        if (field.name in shippingAsBilling) {
          result[field.name] = shippingAsBilling[field.name];
        }
      }

      return result;
    }

    return undefined;
  }
);

function onCheckboxChange(flag: boolean) {
  fillManually.value = flag;

  emit('fillManually', fillManually.value);
}
</script>
