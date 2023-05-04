import camelCase from 'lodash/camelCase';

const getName = path => camelCase(path) || 'index';

export default function loadPageRoutes() {
  const vueEntries = import.meta.glob('@/pages/**/main.vue');
  const cofEntries = import.meta.glob('@/pages/**/main.js', { eager: true });
  const routesCache = {};

  Object.entries(vueEntries).forEach(([key, component]) => {
    const [, path = '/'] = key.match(/^\/src\/pages(\/\S+)?\/main\.vue$/);
    const name = getName(path);
    routesCache[name] = { name, path, component };
  });

  Object.entries(cofEntries).forEach(([key, options]) => {
    const [, path = '/'] = key.match(/^\/src\/pages(\/\S+)?\/main\.js$/);
    const name = getName(path);
    routesCache[name] = Object.assign(routesCache[name] || {}, options.default);
  });

  return Object.values(routesCache);
}
