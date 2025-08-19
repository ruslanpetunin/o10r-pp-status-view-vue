<template>
  <form action="" @submit.prevent="handleSubmit">
    <PPInput
      class="pp-input"
      type="text"
      name="pan"
      :value="paymentStatus.account.number"
      :disabled="true"
      :label="translate(`l_pan`)"
    />
    <div class="row">
      <div class="column">
        <PPInput
          class="pp-input"
          type="text"
          name="'expiry'"
          :value="`${paymentStatus.account.expiry_month}/${paymentStatus.account.expiry_year}`"
          :disabled="true"
          :label="translate(`l_expiry`)"
        />
      </div>
      <div class="column">
        <PPInput
          class="pp-input"
          type="text"
          name="cvv"
          value="***"
          :disabled="true"
          :label="translate(`l_cvv`)"
        />
      </div>
    </div>
    <PPInput
      class="pp-input"
      type="text"
      name="cardholder"
      :value="paymentStatus.account.card_holder"
      :disabled="true"
      :label="translate(`l_cardholder`)"
    />
    <PPButton class="pp-button" :disabled="submitted">
      {{ translate(`b_cascading`) }}
    </PPButton>
  </form>
</template>

<script setup lang="ts">
import type { Account, ThreeDS, Translator } from 'o10r-pp-core';
import { PPInput } from 'o10r-pp-ui-kit-vue';
import { inject, ref } from 'vue';

defineProps<{
  paymentStatus: ThreeDS & Account
}>();

const emit = defineEmits<{
  (event: 'accepted'): void
}>();

const { translate } = inject('translator') as Translator;

const submitted = ref<boolean>(false);

async function handleSubmit() {
  submitted.value = true;

  emit('accepted');
}
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
