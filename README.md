# VURAME

## 1.介绍

本项目是基于 vue3 封装的前端基础架构。为统一规范、方便使用、提高编码效率，该架构针对接口、路由、组件、样式、状态共享、i18n国际化等方面做了更进一步的封装。初次接触的开发者可以阅读本篇文档，了解本框架的封装思路并掌握使用方法。

## 2.命令行

```bash
# 开发模式运行
npm run dev
# 开发模式打包
npm run build:dev
# 测试模式打包
npm run build:test
# 生产环境打包
npm run build:prod
# 代码格式化检查并修复
npm run lint
```

## 3.环境变量

不同模式使用的环境变量文件：

|环境|文件|
|:-|:-|
|开发模式|.env.dev|
|测试模式|.env.test|
|生产模式|.env.prod|

### 变量说明

|变量|说明|
|-|-|
|NODE_ENV|构建模式，`development` 开发模式，`production` 生产模式|
|VITE_BASE|网站的基础路径|
|VITE_API_BASE|接口的基础路径|
|VITE_MOCK|是否开启接口MOCK，`enable` 开启，`disabled` 关闭|
|VITE_LOCALE|国际化默认语言|

## 4.接口

### 4.1接口的定义与使用

接口以键值对的形式定义在 /src/api/index.js 文件中。
键表示接口名称，值表示接口的访问地址：

```js
import defineApi from './define';

export default defineApi({
  // 定义获取用户信息的接口
  getUserInfo: '/api/user/info',

  // 定义登录、登出接口
  login: '/api/user/login',
  logout: '/api/user/logout',
});
```

使用方式：
```js
import api from '@/api'

api.getUserInfo()
api.login()

api.logout()
  .then((data) => {
    // 处理成功请求，data为接口返回的数据
    // 不同项目中的接口数据结构可能不同，但通过转换一般都会包含三个部分：
    // code - 状态码、msg - 提示信息、data[1] - 响应数据
    // then 分支这里的 data 指向的是解析后的 data[1]
  })
  .catch((err) => {
    // 处理异常请求
    // err 是继承 Error 类型的 ApiError 类
    // 含有 code、message 两个属性
    // code 指向接口返回的状态码
    // message 指向接口返回的提示信息
  })
```

定义的每个接口都会生成一个函数，可以在任意地方调用。函数基于 axios 封装，支持传递三个参数：
```js
api.getUserInfo(data, headers, opts);
// data - 接口参数，不同的请求方法中data携带的位置不同：GET -> query；POST -> body；
// headers - 请求头信息
// opts - 其他 axios 支持的参数
```

接口支持嵌套定义：
```js
// 定义
export default defineApi({
  user: {
    getUserInfo: '/api/user/info',
    login: '/api/user/login',
    logout: '/api/user/logout',
  },
});

// 使用
api.user.getUserInfo()
api.user.login()
api.user.logout()
```

### 4.1接口中间件

支持通过中间件的形式，对接口的行为加以干涉。
接口的中间件定义在 /src/api/plugin/module/ 目录下，每个中间件占据单独一个文件。
文件命名应遵循全小写中横线连接的规范，文件名与中间件名称的转换关系如下：

```
post.js -> POST
post-form.js -> POST_FORM
```

定义中间件的文件，应默认导出（export default）一个函数：
```ts
// 中间件函数
// options - 中间件参数，定义接口时可以针对不同接口进行传参
// method - 修改接口的请求方式
// beforeHooks、afterHooks、errorHooks - 在不同的时机执行钩子函数以干预接口的行为
type MiddlewareHandler<T> = (options: T) => Partial<{
  method: 'GET' | 'POST';
  beforeHooks: BeforeHook[];
  afterHooks: AfterHook[];
  errorHooks: ErrorHook[];
}>

// 接口请求前，通过修改 config 干预本次接口的请求行为。可以在该时机更改请求方式、请求参数、请求头等信息
type BeforeHook = (config: RequestConfig) => Partial<RequestConfig>;

// 请求成功，可以修改 data，返回的数据会覆盖原有的 data 成为新的 data
type AfterHook = (data: any, config: RequestConfig) => any;

// 请求异常，如不对异常兜底，则需要在函数执行后继续抛出异常；否则该函数返回的数据，将成为新的data
type ErrorHook = (err: ApiError, config: RequestConfig) => any;
```

使用中间件：
```js
defineApi({
  // 在路径前面以 <> + 中间件名称 的形式声明接口需要使用的中间件
  login: '<POST>/api/user/login',

  // 支持声明多个中间件，中间件从左到右执行
  logout: '<POST><CACHE>/api/user/logout',

  // 支持向中间件传递参数，参数携带在中间件名称后面，以:分割；多个参数使用,分割。
  getUserInfo: '<POST:lang=zh-CN,cache=true>/api/user/info',
})
```

## 5.Mock

### 5.1 Mock的定义

因为后端接口的开发效率不受前端控制，为了不影响开发期间的效率，以及保证项目在开发期间能够不依赖后端而独立完整的运行，建议项目中使用到的每个接口都必须编写配套的Mock。在本框架下，为接口编写Mock是一件十分简单的事情。

Mock文件定义在 /mock/modules/ 目录下，文件名以 .mock.js 结尾。
在 mock 文件中这样定义一个接口的 Mock:

```js
exports['/api/user/info'] = {
  // 接口的请求方式
  method: 'GET',
  // 接口的处理函数
  // 接口的响应结构一般需要包含 code、msg、data 三个部分
  // 这里 content 返回的数据指向的是响应数据中的data
  content: () => ({
    username: 'v_axhuili',
  }),
};

// 一个文件内支持定义任意个 Mock
// 如何模拟接口异常？

// 方式1.从content返回Error
exports['/api/user/login'] = {
  method: 'POST',
  content: () => new Error('登录失败'),
};

// 方式2.从content抛出Error
exports['/api/user/logout'] = {
  method: 'POST',
  content: () => {
    const err = new Error('登出异常');
    // 可以指定响应数据的状态码
    err.code = '10001';
    throw err;
  },
};
```

### 5.2 分页数据

针对需要分页的接口，框架中提供了 /mock/utils/pager.js 工具。使用方式：
```ts
type usePager<T, M> = ({
  // 生成单条数据
  data: () => T;
  // 总数量
  total: number;
  // 格式化响应结构
  format: (total: number, list: T[]) => Pager<T>;
  // 请求方式
  method: M;
  // 获取分页参数，第一个表示页码，第二个表示条数
  getParams: (ctx: MockContext) => [number, number];
}) => {
  method: M;
  content: () => Pager<T>;
};

type MockContext = {
  // 接口路径
  url: string;
  // GET请求参数
  query: Record<string, any>;
  // POST请求参数
  body: Record<string, any>;
  // 请求头
  headers: Record<string, any>;
  // 请求对象
  request: Request;
  // 响应对象
  response: Response;
};
```

分页工具的参数通常都配置了适应项目的默认配置，实际场景下一般只需要定义 data 即可。
对于只需定义 data 参数的情况，还支持这样调用：
```js
type usePager<T> = (data: () => T) => Pager<T>;
```

### 5.3二进制数据

对于下载等场景的接口，需要返回二进制数据的，框架中提供了 /mock/utils/file.js 工具。
使用前需将文件放置在 /mock/assets/ 目录下，使用方式：
```js
type useFile = ({
  // 请求方式
  method: 'GET' | 'POST';
  // 文件名称，如文件所在路径为 /mock/assets/1.jpg，则 filename 应是 1.jpg
  filename: string;
}) => Mock;
```

## 6.页面与动态路由
## 7.组件的定义与使用
## 8.Store的定义与使用
## 9.多语言的定义与使用
## 10.样式说明
