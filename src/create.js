import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

export default function create() {
  return createApp(App)
    .use(router);
}
