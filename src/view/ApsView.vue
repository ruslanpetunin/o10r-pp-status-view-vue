<template>
  <slot v-if="mode === 'new-window'" :redirect="runRedirect" />
  <Teleport v-if="mode === 'iframe'" to="body">
    <iframe ref="iframe" name="aps"></iframe>
  </Teleport>
</template>

<script setup lang="ts">
import useRedirect from './../composable/useRedirect';
import type { ApsSection } from 'o10r-pp-core';
import { onMounted, ref } from 'vue'

defineSlots<{
  default(props: { redirect?: () => void }): unknown;
}>();

const props = withDefaults(
  defineProps<{
    mode?: 'new-window' | 'iframe';
    paymentStatus: ApsSection
  }>(),
  {
    mode: 'iframe',
  }
);

const { createHiddenForm, createWindow } = useRedirect();
const runRedirect = ref<() => void>();
const redirectConfig = props.paymentStatus.aps.redirect;
const iframe = ref<HTMLIFrameElement>();

function autoRunRedirect() {
  if (props.mode !== 'new-window' && runRedirect.value) {
    runRedirect.value();
  }
}

if (props.mode === 'iframe') {
  runRedirect.value = () => {
    const form = createHiddenForm(redirectConfig.url, redirectConfig.method, redirectConfig.body || {});

    if (iframe.value) {
      form.target = iframe.value.name;

      document.body.appendChild(form);

      form.submit();
      form.remove();

      runRedirect.value = undefined;
    }
  };
} else if (props.mode === 'new-window') {
  runRedirect.value = () => {
    const { name } = createWindow();
    const form = createHiddenForm(redirectConfig.url, redirectConfig.method, redirectConfig.body || {});

    form.target = name;

    document.body.appendChild(form);

    form.submit();
    form.remove();

    runRedirect.value = undefined;
  };
}

onMounted(autoRunRedirect);
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
