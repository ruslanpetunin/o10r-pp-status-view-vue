<template>
  <slot v-if="!isCascading || cascadingAccepted" :redirect="runRedirect" />
  <CascadingForm v-if="isCascading" :paymentStatus="paymentStatus" @accepted="cascadingAccepted = true" />
</template>

<script setup lang="ts">
import useRedirect from './../../composable/useRedirect';
import type { ThreeDS, Account } from 'o10r-pp-core';
import { ref } from 'vue';

defineSlots<{
  default(props: { redirect?: () => void }): unknown;
}>();

const props = defineProps<{
  paymentStatus: ThreeDS & Account
}>();

const { createHiddenForm, createWindow } = useRedirect();
const runRedirect = ref<() => void>();
const threeds = props.paymentStatus.threeds;

const isCascading = 'is_cascading' in props.paymentStatus.threeds && props.paymentStatus.threeds.is_cascading;
const cascadingAccepted = ref<boolean>(false);

function createHiddenIframe(): HTMLIFrameElement {
  const iframeName: string = 'i_' + Date.now() + Math.floor(Math.random() * 100000).toString();
  const iframe = document.createElement('iframe');

  iframe.src = 'about:blank';
  iframe.allow = 'clipboard-read; clipboard-write';
  iframe.style.width = '0px';
  iframe.style.height = '0px';
  iframe.style.border = 'none';
  iframe.style.display = 'block';
  iframe.name = iframeName;

  return iframe;
}

if ('iframe' in threeds) {
  const iframe = createHiddenIframe();
  const form = createHiddenForm(threeds.iframe.url, 'POST', threeds.iframe.params);

  form.target = iframe.name;

  document.body.appendChild(iframe);
  document.body.appendChild(form);

  form.submit();
  form.remove();
} else {
  runRedirect.value = () => {
    const { name } = createWindow();
    const form = createHiddenForm(threeds.redirect.url, 'POST', threeds.redirect.params);

    form.target = name;

    document.body.appendChild(form);

    form.submit();
    form.remove();

    runRedirect.value = undefined;
  };
}
</script>
