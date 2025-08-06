import type { App } from 'vue';
import PpUiKit from 'orchestrator-pp-vue-ui-kit';
import * as components from './components';

import 'orchestrator-pp-vue-ui-kit/style.css';
import './style.css';

export * from './components';
export * from 'orchestrator-pp-vue-ui-kit';

export default {
    install(app: App) {
        app.use(PpUiKit);

        for (const key in components) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            app.component(key, (components as any)[key]);
        }

        return app;
    }
};
