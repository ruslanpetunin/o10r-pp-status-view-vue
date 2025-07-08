<template>
  <h1>It is payment form</h1>
</template>

<script setup lang="ts">
import { PaymentMethod } from "orchestrator-pp-flow";

defineProps<{
  paymentMethod: PaymentMethod
}>();
</script>

<style scoped>

</style>