<template>
  <form action="" ref="formRef" @submit.prevent="handleSubmit" @input="validateForm">
    <PPInput
      v-if="showPan"
      class="pp-input"
      :label="translate(`l_pan`)"
      :type="'tel'"
      :name="'pan'"
      :error="validationErrors['pan']"
      :mask="'0000 0000 0000 0000 0000'"
      @input="unmaskedValues.pan = $event"
      @blur="touched.push('pan')"
    />
    <div class="row">
      <div class="column">
        <PPInput
          v-if="showExpiry"
          class="pp-input"
          :label="translate(`l_expiry`)"
          :type="'tel'"
          :name="'expiry'"
          :error="validationErrors['expiry']"
          :mask="'MM/YY'"
          @input="unmaskedValues.expiry = $event"
          @blur="touched.push('expiry')"
        />
      </div>
      <div class="column">
        <PPInput
          v-if="showCvv"
          class="pp-input"
          :label="translate(`l_cvv`)"
          :type="'password'"
          :name="'cvv'"
          :error="validationErrors['cvv']"
          :mask="'0000'"
          @input="unmaskedValues.cvv = $event"
          @blur="touched.push('cvv')"
        />
      </div>
    </div>
    <PPInput
      v-if="showCardholder"
      class="pp-input"
      :label="translate(`l_cardholder`)"
      :type="'text'"
      :name="'cardholder'"
      :error="validationErrors['cardholder']"
      :mask="(value: string) => value.replace(/[^a-zA-Z.'\- ]+/g, '').toUpperCase()"
      @input="unmaskedValues.cardholder = $event"
      @blur="touched.push('cardholder')"
    />
    <template v-for="field of otherFields" :key="field.name">
      <PPInput
        v-if="isPPInputType(field.type)"
        :label="translate(`l_${field.name}`)"
        :type="field.type"
        :name="field.name"
        @blur="touched.push(field.name)"
        :error="validationErrors[field.name]"
        class="pp-input"
      />
    </template>
    <PPButton class="pp-button" :disabled="!formValidationResult.isValid || submitted">
      {{ translate(`b_pay`) }}
    </PPButton>
  </form>
</template>

<script setup lang="ts">
import type { PaymentMethodField, Translate } from 'orchestrator-pp-core';
import type { PaymentMethod } from 'orchestrator-pp-payment-method'
import { PPInput } from "orchestrator-pp-vue-ui-kit";
import { ref, onMounted } from 'vue';
import usePaymentForm from './../../composable/usePaymentForm';

type CardFieldsConfig = {
  showPan: boolean;
  showExpiry: boolean;
  showCvv: boolean;
  showCardholder: boolean;
  otherFields: PaymentMethodField[]
};

const props = defineProps<{
  paymentMethod: PaymentMethod,
  translate: Translate
}>();

const emit = defineEmits<{
  (event: 'pay', data: Record<string, unknown>): void;
}>();

const {
  formRef,
  submitted,
  touched,
  formValidationResult,
  validationErrors,
  isPPInputType
} = usePaymentForm(props.translate);

const {
  showPan,
  showExpiry,
  showCvv,
  showCardholder,
  otherFields
} = props.paymentMethod.paymentForm.fields.reduce<CardFieldsConfig>(
  (acc, field) => {
    if (field.name === 'pan') {
      acc.showPan = true;
    } else if (['expiry_month', 'expiry_year'].includes(field.name)) {
      acc.showExpiry = true;
    } else if (field.name === 'cvv') {
      acc.showCvv = true;
    } else if (field.name === 'cardholder') {
      acc.showCardholder = true;
    } else {
      acc.otherFields.push(field);
    }

    return acc;
  },
  { showPan: false, showExpiry: false, showCvv: false, showCardholder: false, otherFields: [] }
);

const unmaskedValues = ref<Record<string, string>>({});


function getFormData(): Record<string, unknown> {
  const data: Record<string, unknown> = {};

  if (!formRef.value) {
    return data;
  } else {
    const formData = new FormData(formRef.value);

    formData.forEach((value, key) => {
      if (key === 'expiry') {
        const [month, year] = value.toString().split('/');

        data['expiry_month'] = month || '';
        data['expiry_year'] = year || '';
      } else if (unmaskedValues.value[key]) {
        data[key] = unmaskedValues.value[key];
      } else {
        data[key] = value;
      }
    });

    return data;
  }
}

async function validateForm(): Promise<void> {
  formValidationResult.value.isValid = false;
  formValidationResult.value = await props.paymentMethod.paymentForm.validate(getFormData());

  if (formValidationResult.value.errors['expiry_month'] || formValidationResult.value.errors['expiry_year']) {
    formValidationResult.value.errors['expiry'] = Object.assign({}, formValidationResult.value.errors['expiry_month'], formValidationResult.value.errors['expiry_year']);
  }
}

async function handleSubmit() {
  const formData = getFormData();

  submitted.value = true;

  await props.paymentMethod.paymentForm.onSubmit(formData);
  emit('pay', formData);
}

onMounted(validateForm);
</script>

<style scoped>
.row {
  display: flex;
  margin-bottom: var(--pp-gap-sm);
  gap: var(--pp-gap-sm);
}

.column {
  width: 50%;
}
</style>
