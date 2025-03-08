// 初始化变量
let input = document.getElementById('input');
let preview = document.getElementById('preview');
let expression = '';
let lastResult = null;

// 初始化主题
function initTheme() {
    const themeSwitch = document.getElementById('theme-switch');
    
    // 检查本地存储中的主题设置
    const savedTheme = localStorage.getItem('calculator-theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeSwitch.checked = true;
    }
    
    // 主题切换事件监听
    themeSwitch.addEventListener('change', function() {
        if (this.checked) {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('calculator-theme', 'dark');
        } else {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('calculator-theme', 'light');
        }
    });
}

// 初始化按钮事件
function initButtons() {
    const buttons = document.querySelectorAll('.button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除点击动画代码
            
            const value = this.getAttribute('data-value');
            handleButtonClick(value);
        });
    });
    
    // 添加键盘支持
    document.addEventListener('keydown', handleKeyPress);
}

// 处理键盘输入
function handleKeyPress(e) {
    const key = e.key;
    
    // 数字和运算符
    if (/[0-9+\-*/.()%]/.test(key)) {
        handleButtonClick(key);
    }
    // 回车键 = 等号
    else if (key === 'Enter') {
        handleButtonClick('=');
    }
    // 退格键
    else if (key === 'Backspace') {
        handleButtonClick('backspace');
    }
    // Escape键 = 清除
    else if (key === 'Escape') {
        handleButtonClick('clear');
    }
    // 特殊符号映射
    else if (key === '^') {
        handleButtonClick('pow');
    }
}

// 处理按钮点击
function handleButtonClick(value) {
    switch(value) {
        case 'clear':
            expression = '';
            updateDisplay();
            break;
            
        case 'backspace':
            expression = expression.slice(0, -1);
            updateDisplay();
            break;
            
        case '=':
            if (expression) {
                try {
                    lastResult = calculateExpression(expression);
                    expression = lastResult.toString();
                    preview.textContent = '';
                } catch (error) {
                    preview.textContent = '错误';
                }
                updateDisplay();
            }
            break;
            
        case 'sin':
        case 'cos':
        case 'tan':
        case 'log':
        case 'sqrt':
            expression += value + '(';
            updateDisplay();
            break;
            
        case 'pow':
            expression += '^';
            updateDisplay();
            break;
            
        case 'pi':
            expression += 'π';
            updateDisplay();
            break;
            
        case 'e':
            expression += 'e';
            updateDisplay();
            break;
            
        case 'percent':
            if (expression) {
                try {
                    const value = calculateExpression(expression);
                    expression = (value / 100).toString();
                    updateDisplay();
                } catch (error) {
                    preview.textContent = '错误';
                }
            }
            break;
            
        default:
            expression += value;
            updateDisplay();
            break;
    }
}

// 更新显示
function updateDisplay() {
    // 格式化显示表达式
    let displayExpression = expression
        .replace(/\*/g, '×')
        .replace(/\//g, '÷')
        .replace(/\^/g, '^')
        .replace(/π/g, 'π')
        .replace(/e/g, 'e');
    
    input.textContent = displayExpression || '0';
    
    // 实时计算预览
    if (expression && expression !== lastResult?.toString()) {
        try {
            const result = calculateExpression(expression);
            preview.textContent = '= ' + formatNumber(result);
            preview.style.opacity = '1';
        } catch (error) {
            preview.textContent = '';
            preview.style.opacity = '0';
        }
    } else {
        preview.textContent = '';
        preview.style.opacity = '0';
    }
}

// 计算表达式
function calculateExpression(expr) {
    // 替换特殊符号
    expr = expr.replace(/π/g, 'Math.PI')
               .replace(/e/g, 'Math.E')
               .replace(/\^/g, '**')
               .replace(/sin\(/g, 'Math.sin(')
               .replace(/cos\(/g, 'Math.cos(')
               .replace(/tan\(/g, 'Math.tan(')
               .replace(/log\(/g, 'Math.log10(')
               .replace(/sqrt\(/g, 'Math.sqrt(');
    
    // 使用Function构造函数计算表达式
    try {
        // 使用Function构造函数比eval更安全
        const result = Function('return ' + expr)();
        
        // 处理浮点数精度问题
        return roundToSignificantDigits(result, 12);
    } catch (error) {
        throw new Error('计算错误');
    }
}

// 处理浮点数精度问题
function roundToSignificantDigits(num, digits) {
    if (num === 0) return 0;
    
    // 处理非常小或非常大的数字
    if (!isFinite(num) || isNaN(num)) return num;
    
    // 使用toFixed处理精度问题
    const absNum = Math.abs(num);
    
    if (absNum < 1e-10) {
        // 非常小的数字使用科学计数法
        return Number(num.toExponential(digits - 1));
    } else if (absNum >= 1e10) {
        // 非常大的数字使用科学计数法
        return Number(num.toExponential(digits - 1));
    } else {
        // 正常范围的数字
        // 计算小数位数
        const decimalPlaces = Math.max(0, digits - Math.floor(Math.log10(absNum)) - 1);
        // 使用toFixed处理精度
        return Number(num.toFixed(decimalPlaces));
    }
}

// 格式化数字显示
function formatNumber(num) {
    if (!isFinite(num)) return num.toString();
    if (isNaN(num)) return 'NaN';
    
    // 使用toLocaleString格式化数字
    if (Math.abs(num) < 1e-10 || Math.abs(num) >= 1e10) {
        return num.toExponential(6);
    }
    
    // 检查是否为整数
    if (Number.isInteger(num)) {
        return num.toString();
    }
    
    // 移除末尾多余的0
    const strNum = num.toString();
    if (strNum.includes('.')) {
        return strNum.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
    }
    
    return strNum;
}

// 初始化应用
function initApp() {
    initTheme();
    initButtons();
    updateDisplay();
    
    // 添加平滑的加载动画
    document.querySelectorAll('.button').forEach((button, index) => {
        button.style.animationDelay = `${index * 0.02}s`;
    });
}

// 当DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);