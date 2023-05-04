import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import mockServerPlugin from './mock';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const plugins = [vue(), vueJsx()];

  if (env.VITE_MOCK === 'enable') {
    plugins.push(mockServerPlugin());
  }

  return defineConfig({
    plugins,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  });
};
