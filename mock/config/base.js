export const CODE_OK = 0;
export const CODE_ERROR = -1;

export const SUCCESS_MSG = '请求成功';
export const ERROR_MSG = '请求失败';

export const DATA_DEFAULT = null;

export const responseTranasfer = ({ code, msg, data }) => ({
  code,
  msg,
  data,
});
