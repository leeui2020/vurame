import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';
import colors from 'colors';
import dayjs from 'dayjs';
import debounce from 'lodash/debounce';

const methodColors = {
  GET: colors.bold.green,
  POST: colors.bold.yellow,
};

function getMockFilePaths(dir, paths = []) {
  const stat = fs.statSync(dir);
  if (stat.isDirectory()) {
    fs.readdirSync(dir).forEach((filePath) => {
      getMockFilePaths(path.join(dir, filePath), paths);
    });
    return paths;
  }

  if (/\.mock\.js$/.test(dir)) {
    paths.push(dir);
  }

  return paths;
}

function loadFile(dir) {
  Object.keys(require.cache).forEach((key) => {
    if (key.includes(dir)) {
      delete require.cache[require.resolve(key)];
    }
  });

  const pools = {};
  const entries = getMockFilePaths(dir, []);

  entries.forEach((filePath) => {
    const module = require(filePath);
    Object.entries(module).forEach(([apiUrl, mockItem]) => {
      pools[apiUrl] = mockItem;
    });
  });

  return pools;
}

function fileLoader(dir, handle) {
  const loader = debounce(() => {
    const pools = handle(loadFile(dir));
    const infos = Object.keys(pools || {}).map((key) => {
      const url = colors.gray(key);
      const method = methodColors[pools[key].method](`[${pools[key].method}]`);
      return `${method} ${url}`;
    });
    const time = dayjs(new Date()).format('YYYY/MM/DD HH:mm:ss');
    console.log(colors.gray(`[[MOCK]] ${time}`));
    console.log(`\t${infos.join('\n\t')}`);
  }, 500);

  chokidar.watch([path.resolve(dir, './**/*.js')])
    .on('all', (event) => {
      if (['add', 'change'].includes(event)) {
        loader();
      }
    });

  loader();
}

export default fileLoader;
