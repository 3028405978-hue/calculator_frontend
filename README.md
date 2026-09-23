# Calculator Frontend（计算器前端）

前后端分离计算器系统的**前端页面**，使用原生 HTML + CSS + JavaScript 实现。
负责用户交互与信息展示：表达式输入、按钮交互、结果展示、历史记录展示、
历史删除、错误信息展示。**前端不进行任何计算**，所有计算通过 HTTP API
交由后端完成。

## 功能特性

- 计算器界面：数字键、四则运算符、括号、小数点、清空、退格、等号
- 表达式实时显示（`*` `/` 以 `×` `÷` 展示）
- 计算结果由后端返回并展示
- 错误提示：后端返回的错误信息以红色提示框展示
- 历史记录：从后端数据库加载并展示（表达式、结果、时间）
- 删除单条历史记录、清空全部历史
- 键盘输入支持（数字、运算符、回车计算、退格、Esc 清空）
- 亮色 / 暗色主题切换（选择持久化在浏览器）

## 技术栈

| 组件 | 技术 |
|---|---|
| 结构 | HTML5 |
| 样式 | CSS3（CSS 变量实现主题切换） |
| 逻辑 | 原生 JavaScript（ES6，`fetch` 发起请求） |
| 构建 | 无（纯静态页面，无需构建工具） |

## 项目结构

```
calculator_frontend/
├── index.html          # 页面结构
├── css/
│   └── style.css       # 样式（含亮色/暗色主题）
├── js/
│   └── app.js          # 交互逻辑与 API 调用
├── codestyle.md        # 代码规范（Google JavaScript Style Guide）
└── README.md
```

## 运行环境

- 任意现代浏览器（Chrome / Edge / Firefox / Safari）
- 后端服务已启动（默认 `http://127.0.0.1:8000`）

## 启动方法

前端是纯静态页面，任选一种方式打开即可：

### 方式一：直接双击打开（推荐，最简单）

双击 `index.html`，浏览器直接打开页面。
（后端已开启 CORS，`file://` 方式打开也能正常请求后端接口。）

### 方式二：本地静态服务器

```bash
cd calculator_frontend
python -m http.server 8080
```

浏览器访问：`http://127.0.0.1:8080`

## 配置说明

后端地址配置在 `js/app.js` 顶部：

```js
const API_BASE = 'http://127.0.0.1:8000';
```

- 本地开发：保持默认值即可。
- 部署到公网：把 `API_BASE` 改成你的后端公网地址，例如
  `https://your-backend.onrender.com`。

## 与后端的连接方式

前端通过以下 HTTP 接口与后端通信（`API_BASE` 为后端地址）：

| 功能 | 请求 |
|---|---|
| 计算 | `POST {API_BASE}/api/calculate`，body `{"expression": "12+8"}` |
| 查询历史 | `GET {API_BASE}/api/history` |
| 删除历史 | `DELETE {API_BASE}/api/history/{id}` |
| 清空历史 | `DELETE {API_BASE}/api/history` |

交互流程：

```
用户点击按钮 → 拼装表达式 → POST /api/calculate
   → 后端解析计算并存库 → 返回结果 → 前端展示结果并刷新历史
```

## 部署方法

前端可部署到任意静态托管平台（GitHub Pages、Netlify、Vercel、PythonAnywhere 等），
只需要把整个 `calculator_frontend` 目录上传即可。部署后记得把
`js/app.js` 中的 `API_BASE` 改为实际可访问的后端地址。
