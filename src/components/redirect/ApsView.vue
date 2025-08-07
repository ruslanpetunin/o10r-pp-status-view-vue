<template>
  <slot :redirect="runRedirect" />
</template>

<script setup lang="ts">
import useRedirect from './../../composable/useRedirect';
import type { Redirect } from 'o10r-pp-core';
import { ref } from 'vue';

defineSlots<{
  default(props: { redirect?: () => void }): unknown;
}>();

const props = defineProps<{
  paymentStatus: Redirect
}>();

const { createHiddenForm, createWindow } = useRedirect();
const runRedirect = ref<() => void>();
const redirectConfig = props.paymentStatus.redirect;


runRedirect.value = () => {
  const { name } = createWindow();
  const form = createHiddenForm(redirectConfig.url, redirectConfig.method, redirectConfig.params || {});

  form.target = name;

  document.body.appendChild(form);

  form.submit();
  form.remove();

  runRedirect.value = undefined;
};
</script>
