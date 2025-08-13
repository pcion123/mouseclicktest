// UI 管理器
class UIManager {
    constructor() {
        this.elements = {};
        this.isTestActive = false;
        this.currentMode = 'free';
        this.initElements();
        this.bindEvents();
        this.loadSettings();
        this.initTheme();
    }
    
    // 初始化 DOM 元素
    initElements() {
        this.elements = {
            // 控制按鈕
            startBtn: document.getElementById('startBtn'),
            stopBtn: document.getElementById('stopBtn'),
            resetBtn: document.getElementById('resetBtn'),
            settingsBtn: document.getElementById('settingsBtn'),
            themeBtn: document.getElementById('themeBtn'),
            
            // 測試相關
            testMode: document.getElementById('testMode'),
            testZone: document.getElementById('testZone'),
            clickTarget: document.getElementById('clickTarget'),
            clickFeedback: document.getElementById('clickFeedback'),
            statusText: document.getElementById('statusText'),
            currentMode: document.getElementById('currentMode'),
            
            // 設定對話框
            settingsModal: document.getElementById('settingsModal'),
            closeSettingsBtn: document.getElementById('closeSettingsBtn'),
            saveSettingsBtn: document.getElementById('saveSettingsBtn'),
            cancelSettingsBtn: document.getElementById('cancelSettingsBtn'),
            
            // 設定輸入
            duplicateWindow: document.getElementById('duplicateWindow'),
            burstWindow: document.getElementById('burstWindow'),
            burstThreshold: document.getElementById('burstThreshold'),
            intervalThreshold: document.getElementById('intervalThreshold'),
            
            // 清除確認對話框
            clearConfirmModal: document.getElementById('clearConfirmModal'),
            closeClearConfirmBtn: document.getElementById('closeClearConfirmBtn'),
            confirmClearBtn: document.getElementById('confirmClearBtn'),
            cancelClearBtn: document.getElementById('cancelClearBtn'),
            
            // 圖表控制
            clearChartBtn: document.getElementById('clearChartBtn')
        };
    }
    
    // 綁定事件
    bindEvents() {
        // 控制按鈕事件
        this.elements.startBtn.addEventListener('click', () => this.startTest());
        this.elements.stopBtn.addEventListener('click', () => this.stopTest());
        this.elements.resetBtn.addEventListener('click', () => this.resetTest());
        this.elements.settingsBtn.addEventListener('click', () => this.showSettings());
        this.elements.themeBtn.addEventListener('click', () => this.toggleTheme());
        
        // 測試模式變更
        this.elements.testMode.addEventListener('change', (e) => this.changeMode(e.target.value));
        
        // 點擊目標事件
        this.elements.clickTarget.addEventListener('mousedown', (e) => this.handleClick(e));
        this.elements.clickTarget.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // 設定對話框事件
        this.elements.closeSettingsBtn.addEventListener('click', () => this.hideSettings());
        this.elements.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        this.elements.cancelSettingsBtn.addEventListener('click', () => this.hideSettings());
        
        // 對話框背景點擊關閉
        this.elements.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.elements.settingsModal) {
                this.hideSettings();
            }
        });
        
        // 清除圖表
        this.elements.clearChartBtn.addEventListener('click', () => this.clearChart());
        
        // 清除確認對話框事件
        this.elements.clearConfirmModal.addEventListener('click', (e) => {
            if (e.target === this.elements.clearConfirmModal) this.hideClearConfirm();
        });
        this.elements.closeClearConfirmBtn.addEventListener('click', () => this.hideClearConfirm());
        this.elements.confirmClearBtn.addEventListener('click', () => this.performClear());
        this.elements.cancelClearBtn.addEventListener('click', () => this.hideClearConfirm());
        
        // 鍵盤快捷鍵
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // 視窗大小變更
        window.addEventListener('resize', () => this.handleResize());
    }
    
    // 開始測試
    startTest() {
        this.isTestActive = true;
        this.updateControlButtons();
        this.elements.testZone.classList.add('active');
        this.elements.statusText.textContent = '測試進行中 - 在藍色區域內點擊';
        this.elements.clickTarget.querySelector('.target-text').textContent = '點擊進行測試';
        
        // 觸發開始事件
        this.dispatchEvent('testStart', { mode: this.currentMode });
    }
    
    // 停止測試
    stopTest() {
        this.isTestActive = false;
        this.updateControlButtons();
        this.elements.testZone.classList.remove('active');
        this.elements.statusText.textContent = '測試已停止';
        this.elements.clickTarget.querySelector('.target-text').textContent = '測試已停止';
        
        // 觸發停止事件
        this.dispatchEvent('testStop');
    }
    
    // 重置測試
    resetTest() {
        this.isTestActive = false;
        this.updateControlButtons();
        this.elements.testZone.classList.remove('active');
        this.elements.statusText.textContent = '準備開始測試';
        this.elements.clickTarget.querySelector('.target-text').textContent = '點擊此區域開始測試';
        
        // 清除反饋效果
        this.elements.clickFeedback.innerHTML = '';
        
        // 觸發重置事件
        this.dispatchEvent('testReset');
    }
    
    // 更新控制按鈕狀態
    updateControlButtons() {
        this.elements.startBtn.disabled = this.isTestActive;
        this.elements.stopBtn.disabled = !this.isTestActive;
        this.elements.resetBtn.disabled = false;
    }
    
    // 變更測試模式
    changeMode(mode) {
        this.currentMode = mode;
        const modeConfig = CONFIG.modes[mode];
        this.elements.currentMode.textContent = `模式: ${modeConfig.name}`;
        
        // 觸發模式變更事件
        this.dispatchEvent('modeChange', { mode, config: modeConfig });
    }
    
    // 處理點擊事件
    handleClick(event) {
        if (!this.isTestActive) return;
        
        const rect = this.elements.clickTarget.getBoundingClientRect();
        const clickData = {
            timestamp: Date.now(),
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
            button: event.button,
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
            altKey: event.altKey
        };
        
        // 觸發點擊事件
        this.dispatchEvent('click', clickData);
    }
    
    // 顯示點擊反饋
    showClickFeedback(x, y, isAnomaly = false) {
        const ripple = document.createElement('div');
        ripple.className = `click-ripple ${isAnomaly ? 'anomaly' : 'valid'}`;
        ripple.style.left = `${x - 25}px`;
        ripple.style.top = `${y - 25}px`;
        ripple.style.width = '50px';
        ripple.style.height = '50px';
        
        this.elements.clickFeedback.appendChild(ripple);
        
        // 移除動畫元素
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, CONFIG.ui.feedbackDuration);
    }
    
    // 顯示設定對話框
    showSettings() {
        this.loadSettingsToForm();
        this.elements.settingsModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    // 隱藏設定對話框
    hideSettings() {
        this.elements.settingsModal.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    // 載入設定到表單
    loadSettingsToForm() {
        const settings = this.getStoredSettings();
        this.elements.duplicateWindow.value = settings.duplicateWindow;
        this.elements.burstWindow.value = settings.burstWindow;
        this.elements.burstThreshold.value = settings.burstThreshold;
        this.elements.intervalThreshold.value = settings.intervalThreshold;
    }
    
    // 保存設定
    saveSettings() {
        const settings = {
            duplicateWindow: parseInt(this.elements.duplicateWindow.value),
            burstWindow: parseInt(this.elements.burstWindow.value),
            burstThreshold: parseInt(this.elements.burstThreshold.value),
            intervalThreshold: parseInt(this.elements.intervalThreshold.value)
        };
        
        // 驗證設定
        if (this.validateSettings(settings)) {
            localStorage.setItem(CONFIG.storage.settings, JSON.stringify(settings));
            this.hideSettings();
            
            // 觸發設定變更事件
            this.dispatchEvent('settingsChange', settings);
            
            this.showNotification('設定已保存', 'success');
        }
    }
    
    // 驗證設定
    validateSettings(settings) {
        const errors = [];
        
        if (settings.duplicateWindow < 10 || settings.duplicateWindow > 200) {
            errors.push('重複點擊檢測窗口必須在 10-200ms 之間');
        }
        
        if (settings.burstWindow < 100 || settings.burstWindow > 1000) {
            errors.push('連擊檢測窗口必須在 100-1000ms 之間');
        }
        
        if (settings.burstThreshold < 2 || settings.burstThreshold > 10) {
            errors.push('連擊次數閾值必須在 2-10 之間');
        }
        
        if (settings.intervalThreshold < 10 || settings.intervalThreshold > 100) {
            errors.push('異常間隔閾值必須在 10-100ms 之間');
        }
        
        if (errors.length > 0) {
            this.showNotification(errors.join('\n'), 'error');
            return false;
        }
        
        return true;
    }
    
    // 載入設定
    loadSettings() {
        const settings = this.getStoredSettings();
        this.dispatchEvent('settingsLoad', settings);
    }
    
    // 獲取存儲的設定
    getStoredSettings() {
        const defaultSettings = CONFIG.detection;
        const stored = localStorage.getItem(CONFIG.storage.settings);
        
        if (stored) {
            try {
                return { ...defaultSettings, ...JSON.parse(stored) };
            } catch (e) {
                console.warn('無法解析存儲的設定，使用預設值');
            }
        }
        
        return defaultSettings;
    }
    
    // 清除圖表
    clearChart() {
        // 如果沒有數據，直接返回
        const hasData = document.querySelectorAll('.event-item').length > 0;
        if (!hasData) {
            this.showNotification('圖表已經是空的', 'info');
            return;
        }
        
        // 顯示確認對話框
        this.showClearConfirm();
    }
    
    // 顯示清除確認對話框
    showClearConfirm() {
        this.elements.clearConfirmModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    // 隱藏清除確認對話框
    hideClearConfirm() {
        this.elements.clearConfirmModal.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    // 執行清除操作
    performClear() {
        // 添加清除動畫效果
        const confirmBtn = this.elements.confirmClearBtn;
        const clearBtn = this.elements.clearChartBtn;
        
        confirmBtn.disabled = true;
        confirmBtn.querySelector('.btn-text').textContent = '清除中...';
        confirmBtn.querySelector('.btn-icon').textContent = '⏳';
        
        clearBtn.disabled = true;
        clearBtn.querySelector('.btn-text').textContent = '清除中...';
        clearBtn.querySelector('.btn-icon').textContent = '⏳';
        
        // 延遲執行，讓用戶看到動畫
        setTimeout(() => {
            this.dispatchEvent('chartClear');
            this.hideClearConfirm();
            
            // 恢復按鈕狀態
            setTimeout(() => {
                confirmBtn.disabled = false;
                confirmBtn.querySelector('.btn-text').textContent = '確認清除';
                confirmBtn.querySelector('.btn-icon').textContent = '🗑️';
                
                clearBtn.disabled = false;
                clearBtn.querySelector('.btn-text').textContent = '清除圖表';
                clearBtn.querySelector('.btn-icon').textContent = '🗑️';
                
                this.showNotification('圖表已清除', 'success');
            }, 300);
        }, 800);
    }
    
    // 處理鍵盤事件
    handleKeydown(event) {
        // ESC 關閉對話框
        if (event.key === 'Escape') {
            this.hideSettings();
        }
        
        // 空格鍵開始/停止測試
        if (event.code === 'Space' && event.target.tagName !== 'INPUT') {
            event.preventDefault();
            if (this.isTestActive) {
                this.stopTest();
            } else {
                this.startTest();
            }
        }
        
        // R 鍵重置
        if (event.key === 'r' && event.ctrlKey) {
            event.preventDefault();
            this.resetTest();
        }
    }
    
    // 處理視窗大小變更
    handleResize() {
        this.dispatchEvent('resize');
    }
    
    // 顯示通知
    showNotification(message, type = 'info') {
        // 創建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // 樣式
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '9999',
            maxWidth: '300px',
            wordWrap: 'break-word',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            transform: 'translateX(400px)',
            transition: 'transform 0.3s ease'
        });
        
        // 根據類型設置背景色
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#3182ce'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // 動畫進入
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // 自動移除
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // 觸發自定義事件
    dispatchEvent(type, detail = {}) {
        const event = new CustomEvent(`mousetest:${type}`, { detail });
        document.dispatchEvent(event);
    }
    
    // 更新狀態文本
    updateStatus(text, type = 'normal') {
        this.elements.statusText.textContent = text;
        this.elements.statusText.className = `status-${type}`;
    }
    
    // 獲取當前狀態
    getState() {
        return {
            isTestActive: this.isTestActive,
            currentMode: this.currentMode,
            settings: this.getStoredSettings()
        };
    }
    
    // 主題切換功能
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // 更新按鈕圖標
        this.elements.themeBtn.textContent = newTheme === 'light' ? '☀️' : '🌙';
        
        // 保存主題設定
        localStorage.setItem('mousetest-theme', newTheme);
        
        // 通知圖表更新顏色
        this.dispatchEvent('themeChanged', { theme: newTheme });
        
        // 顯示切換通知
        this.showNotification(`已切換至${newTheme === 'light' ? '淺色' : '深色'}主題`, 'success');
    }
    
    // 初始化主題
    initTheme() {
        const savedTheme = localStorage.getItem('mousetest-theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.elements.themeBtn.textContent = savedTheme === 'light' ? '☀️' : '🌙';
    }
}

// 導出類
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
}
