import type { App } from 'vue';
import * as components from './components';
import './style.css';

export * from './components';

export default {
    install(app: App) {
        for (const key in components) {
            app.component(key, (components as any)[key]);
        }
    }
};