const config = require('../config/pager');

module.exports = function usePager(opts) {
  const {
    data,
    total = config.total,
    format = config.format,
    method = config.method,
    getParams = config.getParams,
  } = typeof opts === 'function'
    ? { data: opts }
    : (opts || {});

  return {
    method,
    content(ctx, res) {
      const [page, pageSize] = getParams(ctx, res);
      const offset = (page - 1) * pageSize;
      const size = Math.max(0, Math.min(pageSize, total - offset));
      const list = Array(size).fill(0)
        .map(data);

      return format(total, list);
    },
  };
};
