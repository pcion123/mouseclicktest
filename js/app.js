// 主應用程式
class MouseClickTestApp {
    constructor() {
        this.detector = new MouseAnomalyDetector();
        this.statistics = new StatisticsManager();
        this.chart = new ChartManager('timelineChart');
        this.ui = new UIManager();
        
        this.updateInterval = null;
        this.isRunning = false;
        
        this.bindEvents();
        this.initialize();
    }
    
    // 綁定事件
    bindEvents() {
        // UI 事件
        document.addEventListener('mousetest:testStart', (e) => this.handleTestStart(e.detail));
        document.addEventListener('mousetest:testStop', () => this.handleTestStop());
        document.addEventListener('mousetest:testReset', () => this.handleTestReset());
        document.addEventListener('mousetest:click', (e) => this.handleClick(e.detail));
        document.addEventListener('mousetest:modeChange', (e) => this.handleModeChange(e.detail));
        document.addEventListener('mousetest:settingsChange', (e) => this.handleSettingsChange(e.detail));
        document.addEventListener('mousetest:settingsLoad', (e) => this.handleSettingsLoad(e.detail));
        document.addEventListener('mousetest:chartClear', () => this.handleChartClear());
        document.addEventListener('mousetest:resize', () => this.handleResize());
        
        // 頁面生命週期事件
        window.addEventListener('beforeunload', () => this.handleBeforeUnload());
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    }
    
    // 初始化應用程式
    initialize() {
        console.log('滑鼠按鍵異常檢測工具已啟動');
        this.updateDisplay();
        
        // 載入上次會話數據
        this.loadLastSession();
        
        // 顯示歡迎訊息
        this.ui.showNotification('歡迎使用滑鼠按鍵異常檢測工具！', 'info');
    }
    
    // 處理測試開始
    handleTestStart(detail) {
        this.isRunning = true;
        this.statistics.start();
        this.startUpdateLoop();
        
        console.log(`測試開始 - 模式: ${detail.mode}`);
        this.ui.updateStatus('測試進行中', 'active');
    }
    
    // 處理測試停止
    handleTestStop() {
        this.isRunning = false;
        this.statistics.stop();
        this.stopUpdateLoop();
        
        console.log('測試停止');
        this.ui.updateStatus('測試已停止', 'stopped');
        
        // 保存會話數據
        this.saveSession();
        
        // 顯示測試結果摘要
        this.showTestSummary();
    }
    
    // 處理測試重置
    handleTestReset() {
        this.isRunning = false;
        this.statistics.reset();
        this.detector.reset();
        this.chart.clear();
        this.stopUpdateLoop();
        
        console.log('測試重置');
        this.ui.updateStatus('準備開始測試', 'ready');
        this.ui.showNotification('測試數據已重置', 'info');
    }
    
    // 處理點擊事件
    handleClick(clickData) {
        if (!this.isRunning) return;
        
        // 處理點擊數據
        const processedClick = this.detector.processClick(clickData);
        
        // 顯示視覺反饋
        const hasAnomaly = processedClick.anomalies.length > 0;
        this.ui.showClickFeedback(clickData.x, clickData.y, hasAnomaly);
        
        // 記錄異常事件
        if (hasAnomaly) {
            console.log('檢測到異常點擊:', processedClick.anomalies);
        }
        
        // 更新顯示（如果不在更新循環中）
        if (!this.updateInterval) {
            this.updateDisplay();
        }
    }
    
    // 處理模式變更
    handleModeChange(detail) {
        console.log(`測試模式變更為: ${detail.mode}`);
        
        // 根據模式調整 UI
        const modeConfig = detail.config;
        if (modeConfig.description) {
            this.ui.updateStatus(modeConfig.description, 'info');
        }
    }
    
    // 處理設定變更
    handleSettingsChange(newSettings) {
        this.detector.updateConfig(newSettings);
        console.log('檢測設定已更新:', newSettings);
    }
    
    // 處理設定載入
    handleSettingsLoad(settings) {
        this.detector.updateConfig(settings);
        console.log('檢測設定已載入:', settings);
    }
    
    // 處理圖表清除
    handleChartClear() {
        this.chart.clear();
        this.ui.showNotification('圖表已清除', 'info');
    }
    
    // 處理視窗大小變更
    handleResize() {
        this.chart.resize();
    }
    
    // 開始更新循環
    startUpdateLoop() {
        if (this.updateInterval) return;
        
        this.updateInterval = setInterval(() => {
            this.updateDisplay();
        }, CONFIG.ui.updateInterval);
    }
    
    // 停止更新循環
    stopUpdateLoop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    
    // 更新顯示
    updateDisplay() {
        const stats = this.detector.getStats();
        const intervalStats = this.detector.getIntervalStats();
        const recentAnomalies = this.detector.getRecentAnomalies();
        const timelineData = this.detector.getTimelineData();
        
        // 更新統計顯示
        this.statistics.updateDisplay(stats, intervalStats, recentAnomalies);
        
        // 更新圖表
        this.chart.updateData(timelineData);
    }
    
    // 顯示測試結果摘要
    showTestSummary() {
        const stats = this.detector.getStats();
        const sessionData = this.statistics.getSessionData();
        const performance = this.statistics.getPerformanceMetrics(stats, this.detector.getIntervalStats());
        
        const duration = Math.round(sessionData.duration / 1000);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        const timeString = `${minutes}分${seconds}秒`;
        
        const summary = `
測試完成！

測試時間: ${timeString}
總點擊數: ${stats.total}
有效點擊: ${stats.valid}
異常點擊: ${stats.anomalous}
異常率: ${stats.anomalyRate}%
健康度: ${stats.healthLevel.text} (${stats.healthScore}分)
        `.trim();
        
        this.ui.showNotification(summary, stats.healthScore >= 85 ? 'success' : stats.healthScore >= 70 ? 'warning' : 'error');
        
        console.log('測試摘要:', { stats, sessionData, performance });
    }
    
    // 保存會話數據
    saveSession() {
        try {
            const sessionData = this.statistics.exportData(
                this.detector.getStats(),
                this.detector
            );
            
            localStorage.setItem(CONFIG.storage.lastSession, JSON.stringify(sessionData));
            
            // 保存到歷史記錄
            this.saveToHistory(sessionData);
            
            console.log('會話數據已保存');
        } catch (error) {
            console.error('保存會話數據失敗:', error);
        }
    }
    
    // 載入上次會話
    loadLastSession() {
        try {
            const stored = localStorage.getItem(CONFIG.storage.lastSession);
            if (stored) {
                const sessionData = JSON.parse(stored);
                console.log('載入上次會話數據:', sessionData);
                // 可以在這裡恢復一些狀態
            }
        } catch (error) {
            console.warn('載入上次會話失敗:', error);
        }
    }
    
    // 保存到歷史記錄
    saveToHistory(sessionData) {
        try {
            let history = JSON.parse(localStorage.getItem(CONFIG.storage.history) || '[]');
            
            // 添加新會話
            history.push({
                id: Date.now(),
                timestamp: sessionData.timestamp,
                duration: sessionData.session.duration,
                totalClicks: sessionData.statistics.total,
                anomalyRate: parseFloat(sessionData.statistics.anomalyRate),
                healthScore: sessionData.statistics.healthScore,
                mode: this.ui.currentMode
            });
            
            // 限制歷史記錄數量
            if (history.length > 100) {
                history = history.slice(-100);
            }
            
            localStorage.setItem(CONFIG.storage.history, JSON.stringify(history));
        } catch (error) {
            console.error('保存歷史記錄失敗:', error);
        }
    }
    
    // 處理頁面卸載前
    handleBeforeUnload() {
        if (this.isRunning) {
            this.saveSession();
        }
    }
    
    // 處理頁面可見性變更
    handleVisibilityChange() {
        if (document.hidden && this.isRunning) {
            // 頁面隱藏時暫停測試
            this.handleTestStop();
            this.ui.showNotification('頁面隱藏，測試已自動停止', 'warning');
        }
    }
    
    // 導出測試數據
    exportData(format = 'json') {
        const stats = this.detector.getStats();
        const data = this.statistics.exportData(stats, this.detector);
        
        if (format === 'json') {
            return JSON.stringify(data, null, 2);
        } else if (format === 'csv') {
            return this.convertToCSV(data);
        }
        
        return data;
    }
    
    // 轉換為 CSV 格式
    convertToCSV(data) {
        const headers = [
            'timestamp', 'x', 'y', 'button', 'interval', 
            'hasAnomaly', 'anomalyTypes'
        ];
        
        let csv = headers.join(',') + '\n';
        
        data.clickHistory.forEach(click => {
            const row = [
                click.timestamp,
                click.x,
                click.y,
                click.button,
                click.interval || '',
                click.anomalies.length > 0,
                click.anomalies.join(';')
            ];
            csv += row.join(',') + '\n';
        });
        
        return csv;
    }
    
    // 獲取應用程式狀態
    getAppState() {
        return {
            isRunning: this.isRunning,
            statistics: this.detector.getStats(),
            intervals: this.detector.getIntervalStats(),
            ui: this.ui.getState(),
            session: this.statistics.getSessionData()
        };
    }
}

// 當頁面載入完成後初始化應用程式
document.addEventListener('DOMContentLoaded', () => {
    window.mouseTestApp = new MouseClickTestApp();
});

// 導出類（用於測試）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MouseClickTestApp;
}
