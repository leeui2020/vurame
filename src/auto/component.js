import camelCase from 'lodash/camelCase';
import { defineAsyncComponent, defineComponent } from 'vue';

export default function loadComponent(app) {
  const entries = import.meta.glob('@/components/*/main.{vue,js,jsx}');

  Object.entries(entries).forEach(([key, val]) => {
    const [, id] = key.match(/^\/src\/components\/(\S+)\/main\.(vue|js|jsx)$/);
    const name = `App${camelCase(id).replace(/^\w/, re => re.toUpperCase())}`;
    const component = defineAsyncComponent(() => val().then(({ default: res }) => {
      if (typeof res === 'function') {
        return defineComponent({ name, setup: res });
      }

      return defineComponent({ name, ...res });
    }));

    app.component(name, component);
  });
}
