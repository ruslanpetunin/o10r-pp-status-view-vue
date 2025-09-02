<template>
  <slot v-if="mode === 'new-window'" :redirect="runRedirect" />
  <Teleport v-if="mode === 'iframe'" to="body">
    <iframe ref="iframe" name="aps"></iframe>
  </Teleport>
</template>

<script setup lang="ts">
import useRedirect from './../composable/useRedirect';
import type { ApsSection } from 'o10r-pp-core';
import { onMounted } from 'vue';
import type { RedirectMode } from "./../types/redirect";

defineSlots<{
  default(props: { redirect?: () => void }): unknown;
}>();

const props = withDefaults(
  defineProps<{
    mode?: RedirectMode;
    paymentStatus: ApsSection
  }>(),
  {
    mode: 'iframe',
    // mode: 'new-window',
    // mode: 'current-window',
  }
);


const { iframe, runRedirect, autoRunRedirect } = useRedirect(
  props.paymentStatus.aps.redirect,
  props.mode
);

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
