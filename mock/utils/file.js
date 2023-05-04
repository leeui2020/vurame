const fs = require('fs');
const path = require('path');
const config = require('../config/file');

module.exports = function useFile(opts) {
  const {
    method = config.method,
    filename,
  } = typeof opts === 'string'
    ? { filename: opts }
    : (opts || {});

  return {
    method,
    content(ctx, res) {
      const filePath = path.resolve(config.baseDir, filename);
      const buffer = fs.readFileSync(filePath, { encoding: 'binary' });
      res.end(buffer);
      return 'stop';
    },
  };
};
