import kebabCase from 'lodash/kebabCase';

const entries = import.meta.glob('./module/*.js', { eager: true });
const plugins = Object.fromEntries(Object.keys(entries).map((key) => {
  const [, $1] = key.match(/^\.\/module\/(\S+)\.js$/);
  const name = kebabCase($1).toUpperCase();
  return [name, entries[key].default];
}));

export default plugins;
