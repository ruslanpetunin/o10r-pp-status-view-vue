<template>
  <slot :redirect="runRedirect" />
</template>

<script setup lang="ts">
import type { ThreeDS } from 'orchestrator-pp-core';
import { ref } from 'vue';

defineSlots<{
  default(props: { redirect?: () => void }): unknown;
}>();

const props = defineProps<{
  paymentStatus: ThreeDS
}>();

const runRedirect = ref<() => void>();
const threeds = props.paymentStatus.threeds;

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

function createHiddenForm(url: string, data: Record<string, string>): HTMLFormElement {
  const form: HTMLFormElement = document.createElement('form');

  form.method = 'POST';
  form.action = url;

  for (const key of Object.keys(data)) {
    const input = document.createElement('input');

    input.type = 'hidden';
    input.name = key;
    input.value = data[key];

    form.appendChild(input);
  }

  return form;
}

function createWindow() {
  const windowName: string = 'w_' + Date.now() + Math.floor(Math.random() * 100000).toString();
  const features = 'height=550,width=800,channelmode=0,dependent=0,directories=0,fullscreen=0,location=0,menubar=0,resizable=0,scrollbars=0,status=0,toolbar=0';

  return {
    name: windowName,
    newWindow: window.open('', windowName, features)
  };
}

if ('iframe' in threeds) {
  const iframe = createHiddenIframe();
  const form = createHiddenForm(threeds.iframe.url, threeds.iframe.params);

  form.target = iframe.name;

  document.body.appendChild(iframe);
  document.body.appendChild(form);

  form.submit();
  form.remove();
} else {
  runRedirect.value = () => {
    const { name } = createWindow();
    const form = createHiddenForm(threeds.redirect.url, threeds.redirect.params);

    form.target = name;

    document.body.appendChild(form);

    form.submit();
    form.remove();

    runRedirect.value = undefined;
  };
}
</script>
