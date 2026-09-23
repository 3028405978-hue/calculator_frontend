# 代码规范（Code Style）

**本规范来源：Google JavaScript Style Guide**
参考地址：https://google.github.io/styleguide/jsguide.html

以下列出本前端项目在开发中遵循的 Google JavaScript Style Guide 核心规则：

## 1. 命名规范

| 类型 | 规范 | 示例 |
|---|---|---|
| 变量 | 小驼峰（lowerCamelCase） | `lastResult`、`historyList` |
| 常量 | 全大写 + 下划线（UPPER_SNAKE_CASE） | `API_BASE` |
| 函数 | 小驼峰（lowerCamelCase） | `loadHistory()`、`calculate()` |
| 类 / 构造函数 | 大驼峰（UpperCamelCase） | （本项目无自定义类） |
| 私有成员 | 后置下划线 | `value_`（本项目未使用） |

## 2. 缩进与格式

- 使用 **2 个空格** 缩进，不使用 Tab。
- 每行不超过 **80 个字符**。
- 语句以分号 `;` 结尾。
- 字符串统一使用**单引号**（团队约定；Google 规范允许单双引号，保持统一即可）。

```js
const displayExpression = document.getElementById('expression');
```

## 3. 变量声明

- 一律使用 `const` 声明不会重新赋值的变量。
- 需要重新赋值时使用 `let`，**不使用 `var`**。
- 变量在使用前声明，避免隐式全局变量。

## 4. 函数

- 使用函数声明或箭头函数，避免匿名函数造成混乱。
- 函数名应体现其行为，动词开头：`loadHistory`、`deleteHistory`、`clearAll`。

```js
function renderHistory(records) {
  // ...
}
```

## 5. 字符串拼接

- 优先使用**模板字符串**（反引号）进行拼接，可读性更好。

```js
const resp = await fetch(`${API_BASE}/api/history/${id}`, { method: 'DELETE' });
```

## 6. 异步编程

- 使用 `async / await` 处理异步请求，避免回调地狱。

```js
async function calculate() {
  const resp = await fetch(...);
  const data = await resp.json();
}
```

## 7. 注释

- 每个重要函数前添加注释，说明其职责。
- 文件顶部添加文件级注释，说明模块整体职责。
- 注释解释"为什么"，不机械复述代码。

## 8. 错误处理

- 网络请求使用 `try / catch` 捕获异常，并给出用户可读的提示。

```js
try {
  const resp = await fetch(...);
} catch (err) {
  showError('Cannot reach the backend server.');
}
```

## 9. 事件监听

- 使用 `addEventListener` 绑定事件，不在 HTML 中写 `onclick`。
- 动态生成的元素使用**事件委托**绑定。

```js
historyList.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-del');
  if (btn) deleteHistory(btn.dataset.id);
});
```

## 10. 可访问性

- 按钮使用 `<button>` 元素并设置 `type="button"`。
- 为交互元素提供可读的文本或 `aria-label`。

---

以上规范适用于本前端项目的全部 JavaScript 代码，提交前请自查。
