module.exports = {
  total: 100,

  method: 'GET',

  format: (total, list) => ({
    list,
    total,
  }),

  getParams: ctx => [
    ctx.query.page,
    ctx.query.pageSize,
  ],
};
