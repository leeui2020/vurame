export default function parseUrl(url) {
  const plugins = [];
  const base = url.replace(/<(.*?)>/g, (re, $1) => {
    const [$11, ...$12] = $1.split(':');
    const paramStr = $12.join(':');
    const pluginOptions = Object.fromEntries(paramStr.split(/,\s*/).map((valStr) => {
      const [v1, ...v2] = valStr.split(/\s*=\s*/);
      return [v1, v2.join('=')];
    }));

    plugins.push({
      name: $11,
      options: pluginOptions,
    });

    return '';
  });

  return { base, plugins };
}
