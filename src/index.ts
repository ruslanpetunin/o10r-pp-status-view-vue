import type { App, FunctionPlugin } from 'vue';
import PpUiKit from 'o10r-pp-ui-kit-vue';
import type { Translator } from 'o10r-pp-core';
import * as components from './views';

import 'o10r-pp-ui-kit-vue/style.css';
import './style.css';

export * from './views';
export * from 'o10r-pp-ui-kit-vue';

const connect: FunctionPlugin = (app: App, translator: Translator) => {
  app.provide('translator', translator);

  app.use(PpUiKit);

  for (const key in components) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    app.component(key, (components as any)[key]);
  }
}

export default connect;
