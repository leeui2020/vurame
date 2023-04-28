import parseUrl from './parse-url';
import apiPlugins from '../plugin';
import * as request from '@/utils/core/request';

export default function createApi(url) {
  const { base, plugins } = parseUrl(url);
  const config = {
    method: 'get',
    beforeHooks: [],
    afterHooks: [],
    errorHooks: [],
  };

  const mergeConfig = (newConfig) => {
    config.method = newConfig.method || config.method;
    config.beforeHooks.push(...(newConfig.beforeHooks || []));
    config.afterHooks.push(...(newConfig.afterHooks || []));
    config.errorHooks.push(...(newConfig.errorHooks || []));
  };

  plugins.forEach(({ name, options }) => {
    mergeConfig(apiPlugins[name](options));
  });

  return async function apiHandle(data, headers, opts = {}) {
    const requestConfig = config.beforeHooks
      .reduce((obj, hook) => hook(obj), {
        url: base,
        data,
        opts,
        headers,
        apiHandle,
      });

    let next = request[config.method](
      requestConfig.url,
      requestConfig.data,
      requestConfig.headers,
      requestConfig.opts,
    );

    config.afterHooks.forEach((hook) => {
      next = next.then(res => hook(res, requestConfig));
    });

    config.errorHooks.forEach((hook) => {
      next = next.catch(err => hook(err, requestConfig));
    });

    return next;
  };
}
