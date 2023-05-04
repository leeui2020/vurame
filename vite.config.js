import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import defineOptions from 'unplugin-vue-define-options/vite';
import mockServerPlugin from './mock';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const plugins = [vue(), vueJsx(), defineOptions()];

  if (env.VITE_MOCK === 'enable') {
    plugins.push(mockServerPlugin());
  }

  return defineConfig({
    base: env.VITE_BASE,
    plugins,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "./src/styles/global/index.scss";',
        },
      },
    },
  });
};
