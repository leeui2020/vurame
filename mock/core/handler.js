import { parse } from 'node:url';
import * as config from '../config/base';

export default function mockHandler(mockPools) {
  return async function (req, res, next) {
    const { pathname, query } = parse(req.url);
    const method = req.method.toUpperCase();
    const [, mockItem] = Object.entries(mockPools)
      .find(([key, val]) => RegExp(key).test(pathname) && val.method === method) || [];

    if (!mockItem) {
      await next();
      return;
    }

    const context = {
      get url() {
        return pathname;
      },

      get query() {
        return query;
      },

      get body() {
        return req.body;
      },

      get headers() {
        return req.headers;
      },

      get request() {
        return req;
      },

      get response() {
        return res;
      },
    };

    let code = config.CODE_OK;
    let msg = config.SUCCESS_MSG;
    let data = config.DATA_DEFAULT;

    try {
      data = await mockItem.content(context, res);
      if (data === 'stop') {
        return;
      }

      if (data instanceof Error) {
        throw data;
      }
    } catch (err) {
      code = err.code || config.CODE_ERROR;
      msg = err.message || config.ERROR_MSG;
      data = config.DATA_DEFAULT;
    }

    res.setHeader('content-type', 'application/json;charset=utf-8');
    res.end(JSON.stringify(config.responseTranasfer({
      code,
      data,
      msg,
    })));
  };
}
