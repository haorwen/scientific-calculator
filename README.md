# 科学计算器

## 功能特性

✅ 基本四则运算  
✅ 科学计算功能（三角函数、对数、幂运算等）  
✅ 实时计算预览  
✅ 明暗主题切换  
✅ 键盘输入支持  
✅ 动画交互效果  
✅ 移动端适配

## 技术栈

- HTML5 & Semantic Markup
- CSS3 变量与动画
- Vanilla JavaScript
- Font Awesome 图标
- 本地存储主题偏好

## 快速开始

```bash
git clone https://github.com/haorwen/scientific-calculator.git
cd scientific-calculator
python -m http.server 8000
```
访问 http://localhost:8000 即可使用

## 特色功能

### 智能主题切换
```css
[data-theme="dark"] {
  --bg-color: #121212;
  --calculator-bg: #1e1e1e;
  --button-color: #ffffff;
}
```

### 实时计算预览
```javascript
function updateDisplay() {
  try {
    const result = calculateExpression(expression);
    preview.textContent = '= ' + formatNumber(result);
  } catch {
    preview.textContent = '';
  }
}
```

### 动画交互
```css
.button-click {
  animation: buttonClick 0.2s ease-out;
}

@keyframes buttonClick {
  50% { transform: scale(0.95); }
}
```

## 项目结构
```
calculator/
├── index.html
├── styles.css
├── script.js
└── README.md
```

## 贡献指南
欢迎提交PR或issue，代码提交前请运行：
```bash
npx prettier --write .
```

## 许可证
[MIT License](LICENSE)