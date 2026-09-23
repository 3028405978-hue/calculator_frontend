/**
 * 计算器前端逻辑
 * ===============
 * 前端职责：用户交互、表达式输入、发送请求、展示后端返回的结果/错误/历史。
 * 注意：前端**不计算**表达式，所有计算都由后端完成，前端只负责展示。
 *
 * 接口约定（后端 API）：
 *   POST   /api/calculate        计算表达式   body: {"expression": "12+8"}
 *   GET    /api/history          查询历史
 *   DELETE /api/history/{id}     删除一条历史
 *   DELETE /api/history          清空全部历史
 */

/* 后端 API 地址。
const API_BASE = 'https://calculator-backend-m02k.onrender.com';

/* ---------- 页面元素 ---------- */
const displayExpression = document.getElementById('expression');
const displayResult = document.getElementById('result');
const errorBox = document.getElementById('error-box');
const historyList = document.getElementById('history-list');
const historyEmpty = document.getElementById('history-empty');
const clearHistoryBtn = document.getElementById('clear-history');
const themeToggle = document.getElementById('theme-toggle');

/* ---------- 计算器状态 ---------- */
let expression = '';     // 当前输入的表达式
let lastResult = null;   // 上一次计算结果（用于继续运算）

/* ---------- 显示工具函数 ---------- */
function render() {
    // 表达式中 * / 显示为 × ÷
    const shown = expression.replace(/\*/g, '×').replace(/\//g, '÷');
    displayExpression.textContent = shown || '\u00A0';
    if (expression === '') {
        displayResult.textContent = lastResult !== null ? String(lastResult) : '0';
    }
}

function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove('hidden');
    // 4 秒后自动消失
    clearTimeout(showError.timer);
    showError.timer = setTimeout(() => {
        errorBox.classList.add('hidden');
    }, 4000);
}

function hideError() {
    errorBox.classList.add('hidden');
}

/* ---------- 输入控制 ---------- */
function appendValue(value) {
    // 等号之后若直接按运算符，则用上次结果继续运算
    if (expression === '' && lastResult !== null && '+-*/'.includes(value)) {
        expression = String(lastResult);
        lastResult = null;
    }
    expression += value;
    hideError();
    render();
}

function clearAll() {
    expression = '';
    lastResult = null;
    hideError();
    render();
}

function backspace() {
    expression = expression.slice(0, -1);
    render();
}

/* ---------- 计算请求（核心计算在后端完成） ---------- */
async function calculate() {
    if (expression === '') {
        return;
    }
    try {
        const resp = await fetch(`${API_BASE}/api/calculate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ expression: expression }),
        });
        const data = await resp.json();
        if (resp.ok) {
            lastResult = data.result;
            expression = '';
            displayResult.textContent = data.result;
            hideError();
            await loadHistory();          // 计算成功后刷新历史
        } else {
            showError(data.message || 'Invalid expression');
        }
    } catch (err) {
        showError('Cannot reach the backend server. Please check if it is running.');
    }
}

/* ---------- 历史记录 ---------- */
async function loadHistory() {
    try {
        const resp = await fetch(`${API_BASE}/api/history`);
        const data = await resp.json();
        if (!resp.ok) {
            return;
        }
        renderHistory(data.history);
    } catch (err) {
        // 后端未启动时保持静默，不打断计算器使用
    }
}

function renderHistory(records) {
    historyList.innerHTML = '';
    if (!records || records.length === 0) {
        historyEmpty.classList.remove('hidden');
        return;
    }
    historyEmpty.classList.add('hidden');
    records.forEach((item) => {
        const li = document.createElement('li');
        li.className = 'history-item';

        const meta = document.createElement('div');
        meta.className = 'history-meta';

        const expr = document.createElement('div');
        expr.className = 'history-expr';
        expr.textContent = item.expression.replace(/\*/g, '×').replace(/\//g, '÷');

        const result = document.createElement('div');
        result.className = 'history-result';
        result.textContent = '= ' + item.result;

        const time = document.createElement('div');
        time.className = 'history-time';
        time.textContent = item.created_at;

        meta.appendChild(expr);
        meta.appendChild(result);
        meta.appendChild(time);

        const delBtn = document.createElement('button');
        delBtn.className = 'btn-del';
        delBtn.textContent = 'Delete';
        delBtn.dataset.id = item.id;

        li.appendChild(meta);
        li.appendChild(delBtn);
        historyList.appendChild(li);
    });
}

async function deleteHistory(id) {
    try {
        const resp = await fetch(`${API_BASE}/api/history/${id}`, { method: 'DELETE' });
        if (resp.ok) {
            await loadHistory();      // 删除成功后按数据库最新状态刷新
        } else {
            showError('Failed to delete the record.');
        }
    } catch (err) {
        showError('Cannot reach the backend server.');
    }
}

async function clearHistory() {
    try {
        const resp = await fetch(`${API_BASE}/api/history`, { method: 'DELETE' });
        if (resp.ok) {
            await loadHistory();
        }
    } catch (err) {
        showError('Cannot reach the backend server.');
    }
}

/* ---------- 主题切换（扩展功能） ---------- */
function applyTheme(theme) {
    document.body.classList.toggle('dark', theme === 'dark');
    themeToggle.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
    localStorage.setItem('calc-theme', theme);
}

function toggleTheme() {
    const current = document.body.classList.contains('dark') ? 'dark' : 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
}

/* ---------- 事件绑定 ---------- */
document.querySelectorAll('.btn[data-value]').forEach((btn) => {
    btn.addEventListener('click', () => appendValue(btn.dataset.value));
});

document.querySelectorAll('.btn[data-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        if (action === 'clear') clearAll();
        if (action === 'backspace') backspace();
        if (action === 'equals') calculate();
    });
});

clearHistoryBtn.addEventListener('click', clearHistory);
themeToggle.addEventListener('click', toggleTheme);

// 历史列表的删除按钮（事件委托）
historyList.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-del');
    if (btn) {
        deleteHistory(btn.dataset.id);
    }
});

// 键盘输入（扩展功能）
document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (/^[0-9.+\-*/()]$/.test(key)) {
        e.preventDefault();
        appendValue(key);
    } else if (key === 'Enter') {
        e.preventDefault();
        calculate();
    } else if (key === 'Backspace') {
        e.preventDefault();
        backspace();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        e.preventDefault();
        clearAll();
    }
});

/* ---------- 初始化 ---------- */
applyTheme(localStorage.getItem('calc-theme') === 'dark' ? 'dark' : 'light');
render();
loadHistory();
