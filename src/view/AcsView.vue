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
import type { RedirectMode } from "./../types/redirect";

defineSlots<{
  default(props: { redirect?: () => void }): unknown;
}>();

const props = withDefaults(
  defineProps<{
    mode?: RedirectMode;
    paymentStatus: AcsSection & AccountSection;
  }>(),
  {
    mode: 'iframe',
    // mode: 'new-window',
    // mode: 'current-window',
  }
);

const acs = props.paymentStatus.acs;
const isHiddenIframe = 'iframe' in acs;
const isCascading = 'is_cascading' in acs && acs.is_cascading;
const cascadingAccepted = ref<boolean>(false);

const { iframe, runRedirect, autoRunRedirect, createHiddenForm } = useRedirect(
  isHiddenIframe ? acs.iframe : acs.redirect,
  props.mode
);


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

if (isHiddenIframe) {
  const hiddenIframe = createHiddenIframe();
  const form = createHiddenForm(acs.iframe.url, acs.iframe.method, acs.iframe.body || {});

  runRedirect.value = undefined;
  form.target = hiddenIframe.name;

  document.body.appendChild(hiddenIframe);
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
