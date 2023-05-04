import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import loadComponent from './auto/component';

export default function create() {
  return createApp(App)
    .use(createPinia())
    .use(router)
    .use(loadComponent);
}
