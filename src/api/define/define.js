import createApi from './create';

export default function defineApi(urlConfig) {
  return Object.fromEntries(Object.keys(urlConfig).map((key) => {
    if (typeof urlConfig[key] === 'string') {
      return [key, createApi(urlConfig[key])];
    }

    return [key, defineApi(urlConfig[key])];
  }));
}
