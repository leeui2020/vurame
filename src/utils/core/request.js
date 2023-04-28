import axios from 'axios';
import ApiError from '@/utils/core/api-error';
import * as config from '@/config/api';

const instance = axios.create({
  baseURL: config.baseURL,
  timeout: config.timeout,
  responseType: 'json',
  withCredentials: true,
});

instance.interceptors.request.use((obj) => {
  Object.assign(obj.headers, config.injectHeaders());
  return obj;
});

instance.interceptors.response.use((res) => {
  if (res.data instanceof Blob) {
    return res.data;
  }

  const data = config.responseTransfer(res.data);
  if (data.code === config.CODE_OK) {
    return data.data;
  }

  throw new ApiError(data.code, data.msg);
});

export const get = (url, params, headers, opts = {}) => instance.get(url, { params, headers, ...opts });
export const post = (url, data, headers, opts = {}) => instance.post(url, data, { headers, ...opts });
export const postForm = (url, data, headers, opts = {}) => instance.postForm(url, data, { headers, ...opts });

export default instance;
