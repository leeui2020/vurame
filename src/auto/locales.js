import set from 'lodash/set';
import camelCase from 'lodash/camelCase';

export default function loadI18nMessages() {
  const entries = import.meta.glob('@/locales/*/*.json', { eager: true });
  const messages = {};

  Object.entries(entries).forEach(([key, val]) => {
    const [, path] = key.match(/^\/src\/locales\/(\S+)\.json$/);
    const msgPath = path
      .split('/')
      .map((item, index) => (index ? camelCase(item) : item))
      .join('.');

    set(messages, msgPath, val.default);
  });

  return messages;
}
