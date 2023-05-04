import path from 'path';
import bodyParser from 'body-parser';
import mockHandler from './core/handler';
import mockLoader from './core/loader';

const MOCK_DIR = path.resolve('mock');
const mockPools = {};

export default function mockServerPlugin() {
  return {
    name: 'vite-plugin-mock-server',
    apply: 'serve',
    enforce: 'pre',
    configureServer({ middlewares }) {
      middlewares.use(bodyParser.urlencoded({ extended: false }));
      middlewares.use(bodyParser.json());
      middlewares.use(mockHandler(mockPools));

      mockLoader(MOCK_DIR, pools => Object.assign(mockPools, pools));
    },
  };
}
