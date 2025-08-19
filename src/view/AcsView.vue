<template>
  <template v-if="!isCascading || cascadingAccepted">
    <slot v-if="mode === 'new-window'" :redirect="runRedirect" />
    <Teleport v-if="mode === 'iframe'" to="body">
      <iframe ref="iframe" name="acs"></iframe>
    </Teleport>
  </template>

  <CascadingForm v-if="isCascading" :paymentStatus="paymentStatus" @accepted="onCascadingAccepted" />
</template>

<script setup lang="ts">
import useRedirect from './../composable/useRedirect';
import CascadingForm from './../components/form/CascadingForm.vue';
import type { ThreeDS, Account } from 'o10r-pp-core';
import { nextTick, onMounted, ref } from 'vue';

defineSlots<{
  default(props: { redirect?: () => void }): unknown;
}>();

const props = withDefaults(
  defineProps<{
    mode?: 'new-window' | 'iframe';
    paymentStatus: ThreeDS & Account;
  }>(),
  {
    mode: 'iframe',
  }
);

const { createHiddenForm, createWindow } = useRedirect();
const runRedirect = ref<() => void>();
const threeds = props.paymentStatus.threeds;

const iframe = ref<HTMLIFrameElement>();
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

function onCascadingAccepted() {
  cascadingAccepted.value = true;

  nextTick(autoRunRedirect);
}

function autoRunRedirect() {
  if (props.mode !== 'new-window' && runRedirect.value) {
    runRedirect.value();
  }
}

if ('iframe' in threeds) {
  const iframe = createHiddenIframe();
  const form = createHiddenForm(threeds.iframe.url, 'POST', threeds.iframe.params);

  form.target = iframe.name;

  document.body.appendChild(iframe);
  document.body.appendChild(form);

  form.submit();
  form.remove();
} else if (props.mode === 'iframe') {
  runRedirect.value = () => {
    const form = createHiddenForm(threeds.redirect.url, 'POST', threeds.redirect.params);

    if (iframe.value) {
      form.target = iframe.value.name;

      document.body.appendChild(iframe.value);
      document.body.appendChild(form);

      form.submit();
      form.remove();

      runRedirect.value = undefined;
    }
  };
} else if (props.mode === 'new-window') {
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

onMounted(
  () => {
    if (!isCascading) {
      autoRunRedirect();
    }
  }
);
</script>

<style scoped>
iframe {
  position: fixed;
  top: 0;
  left: 0;
  background: white;
  width: 100%;
  height: 100%;
  z-index: 10000;
}
</style>
