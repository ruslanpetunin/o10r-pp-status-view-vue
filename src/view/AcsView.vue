<template>
  <template v-if="!isCascading || cascadingAccepted">
    <slot v-if="mode === 'new-window'" :redirect="runRedirect" />
    <Teleport v-if="mode === 'iframe' && !isHiddenIframe" to="body">
      <iframe ref="iframe" name="acs"></iframe>
    </Teleport>
  </template>

  <CascadingForm v-if="isCascading" :paymentStatus="paymentStatus" @accepted="onCascadingAccepted" />
</template>

<script setup lang="ts">
import useRedirect from './../composable/useRedirect';
import CascadingForm from './../components/form/CascadingForm.vue';
import type { AccountSection, AcsSection } from 'o10r-pp-core';
import { nextTick, onMounted, ref } from 'vue';

defineSlots<{
  default(props: { redirect?: () => void }): unknown;
}>();

const props = withDefaults(
  defineProps<{
    mode?: 'new-window' | 'iframe' | 'current-window';
    paymentStatus: AcsSection & AccountSection;
  }>(),
  {
    mode: 'iframe',
    // mode: 'new-window',
    // mode: 'current-window',
  }
);

const { createHiddenForm, createWindow } = useRedirect();
const runRedirect = ref<() => void>();
const acs = props.paymentStatus.acs;

const iframe = ref<HTMLIFrameElement>();
const isHiddenIframe = 'iframe' in acs;
const isCascading = 'is_cascading' in acs && acs.is_cascading;
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

if (isHiddenIframe) {
  const hiddenIframe = createHiddenIframe();
  const form = createHiddenForm(acs.iframe.url, acs.iframe.method, acs.iframe.body || {});

  form.target = hiddenIframe.name;

  document.body.appendChild(hiddenIframe);
  document.body.appendChild(form);

  form.submit();
  form.remove();
} else if (props.mode === 'iframe') {
  runRedirect.value = () => {
    const form = createHiddenForm(acs.redirect.url, acs.redirect.method, acs.redirect.body || {});

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
    const form = createHiddenForm(acs.redirect.url, acs.redirect.method, acs.redirect.body || {});

    form.target = name;

    document.body.appendChild(form);

    form.submit();
    form.remove();

    runRedirect.value = undefined;
  };
} else if (props.mode === 'current-window') {
  const form = createHiddenForm(acs.redirect.url, acs.redirect.method, acs.redirect.body || {});

  document.body.appendChild(form);

  form.submit();
  form.remove();
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
  border: none;
}
</style>
