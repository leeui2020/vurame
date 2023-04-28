// 基础路径
export const baseURL = import.meta.env.VITE_API_BASE;
// 超时时间
export const timeout = 0;

// 状态码：请求成功
export const CODE_OK = 0;
// 状态码：请求失败
export const CODE_ERROR = -1;

// 响应数据转换
export const responseTransfer = res => ({
  code: res.code,
  msg: res.msg,
  data: res.data,
});

// 全局注入headers
export const injectHeaders = () => ({});
