import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import loadComponent from './auto/component';

export default function create() {
  return createApp(App)
    .use(router)
    .use(loadComponent);
}
