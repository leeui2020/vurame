import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import loadComponent from './auto/component';
import { installI18n } from './locales';

export default function create() {
  return createApp(App)
    .use(installI18n)
    .use(createPinia())
    .use(router)
    .use(loadComponent);
}
