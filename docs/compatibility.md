# 兼容性与验证说明

## 平台能力矩阵

| 能力 | Cloudflare Workers | Cloudflare Pages Functions | Vercel |
|---|---:|---:|---:|
| 登录、订阅页面和后台 | ✅ | ✅ | ✅ |
| VLESS/Trojan/SS 订阅生成 | ✅ | ✅ | ✅ |
| Clash/Sing-box/Surge/Quantumult X/Loon 转换 | ✅ | ✅ | ✅ |
| 在线优选 IP 页面 | ✅ | ✅ | ✅ |
| KV 绑定读写 | `ips` 或 `KV` | `ips` 或 `KV` | Cloudflare KV REST API |
| VLESS WebSocket/TCP 转发 | ✅ | ✅ Advanced Mode | 返回 `501` |
| VLESS gRPC/XHTTP 转发 | ✅ | ✅ Advanced Mode | 返回 `501` |
| UDP DNS/DoH 转发 | ✅ | ✅ Advanced Mode | 返回 `501` |

Cloudflare 专用转发依赖 `cloudflare:sockets`。Vercel 入口不会导入该模块，只复用订阅、后台及 KV 逻辑。

Pages 必须使用 Functions Advanced Mode 的 `_worker.js`，并通过 Git 或 Wrangler 部署。Dashboard 的普通静态 Direct Upload 不会可靠部署 Pages Functions。

## 配置优先级

同一个配置同时出现在多个位置时，优先级为：

1. 订阅 URL 查询参数。
2. Worker/Vercel 环境变量。
3. 后台写入的 `config/v1`。
4. 程序默认值。

`ID` 只从环境变量或程序默认值读取，不能通过后台修改。

## 路由兼容性

| 路由 | 方法 | 鉴权 | 说明 |
|---|---|---|---|
| `/login` | GET/POST | 无 | 登录并签发后台会话 |
| `/{ID}` | GET | 路径密码 | 原有订阅与配置页面 |
| `/{ID}/setting` | GET | 路径密码 | 原有链接生成页面 |
| `/{ID}/ips` | GET | 路径密码 | 原有优选 IP 页面 |
| `/{ID}/save`、`append`、`load` | POST | 路径密码 | 原有 KV 接口 |
| `/admin` | GET | Cookie | 本地后台管理页面 |
| `/admin/config.json` | GET/PUT/POST | Cookie | 版本化配置接口 |
| `/admin/ip/normal`、`proxy` | GET/PUT/POST | Cookie | 优选 IP 管理接口 |
| `/admin/status` | GET | Cookie | 运行时和 KV 状态 |
| `/logout` | GET | 无 | 清除后台会话 |
| `/ipsFetch` | GET | 无 | 优选 IP 数据接口 |

WebSocket Upgrade、`application/grpc` POST 和显式 `transport=xhttp` POST 会在普通 HTTP 路由之前进入 Cloudflare 转发层。

## 构建与发布产物

```bash
npm run build:worker
npm run package:pages
npm test
```

- `_worker.js`：模块化 Cloudflare Workers 入口。
- `_worker.src.js`：由源码生成的单文件 Worker。
- `_worker.src.js.zip`：Pages 拖放上传包，内部文件名为 `_worker.js`。
- `api/vercel.js`：Vercel Serverless 入口。

不要直接编辑 `_worker.src.js`；应修改 `core/` 源码后重新运行构建命令。

## 发布前检查

1. 配置不同的 `ID` 与 `UUID`，不要继续使用默认登录密码。
2. 配置 `HOST`，并确认 UUID 与节点端一致。
3. 使用后台功能时绑定 `ips` 或 `KV` 命名空间。
4. Vercel 使用 KV 时配置 `CF_NAMESPACE_ID`、`CF_ACCOUNT_ID`、`CF_EMAIL`、`CF_API_KEY`。
5. 运行 `npm test`。
6. 运行 `npm run package:pages` 并检查 ZIP 中只有一个 `_worker.js`。
7. 分别验证登录、原有订阅地址、后台、Clash/Sing-box 和 Cloudflare WebSocket。
