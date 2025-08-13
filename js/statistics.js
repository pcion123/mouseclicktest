// 統計管理器
class StatisticsManager {
    constructor() {
        this.startTime = null;
        this.endTime = null;
        this.isRunning = false;
        this.timer = null;
        this.sessionData = null;
        this.elements = {};
        this.initElements();
    }
    
    // 初始化 DOM 元素
    initElements() {
        this.elements = {
            timer: document.getElementById('testTimer'),
            totalClicks: document.getElementById('totalClicks'),
            validClicks: document.getElementById('validClicks'),
            anomalousClicks: document.getElementById('anomalousClicks'),
            anomalyRate: document.getElementById('anomalyRate'),
            avgInterval: document.getElementById('avgInterval'),
            minInterval: document.getElementById('minInterval'),
            maxInterval: document.getElementById('maxInterval'),
            currentInterval: document.getElementById('currentInterval'),
            duplicateCount: document.getElementById('duplicateCount'),
            intervalAnomalyCount: document.getElementById('intervalAnomalyCount'),
            burstCount: document.getElementById('burstCount'),
            healthFill: document.getElementById('healthFill'),
            healthText: document.getElementById('healthText'),
            eventCount: document.getElementById('eventCount'),
            eventsList: document.getElementById('eventsList')
        };
    }
    
    // 開始統計
    start() {
        this.startTime = Date.now();
        this.endTime = null;
        this.isRunning = true;
        this.startTimer();
    }
    
    // 停止統計
    stop() {
        this.endTime = Date.now();
        this.isRunning = false;
        this.stopTimer();
    }
    
    // 重置統計
    reset() {
        this.startTime = null;
        this.endTime = null;
        this.isRunning = false;
        this.stopTimer();
        this.updateDisplay({
            total: 0,
            valid: 0,
            anomalous: 0,
            duplicates: 0,
            intervalAnomalies: 0,
            bursts: 0,
            anomalyRate: '0.0',
            healthScore: 100,
            healthLevel: CONFIG.health.excellent
        }, {
            average: 0,
            min: null,
            max: null,
            current: null
        }, []);
        this.elements.timer.textContent = '00:00';
    }
    
    // 開始計時器
    startTimer() {
        this.timer = setInterval(() => {
            if (this.isRunning && this.startTime) {
                this.updateTimer();
            }
        }, 1000);
    }
    
    // 停止計時器
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    // 更新計時器顯示
    updateTimer() {
        const elapsed = this.isRunning ? 
            Date.now() - this.startTime : 
            this.endTime - this.startTime;
        
        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        const timeString = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        this.elements.timer.textContent = timeString;
    }
    
    // 更新統計顯示
    updateDisplay(stats, intervalStats, recentAnomalies) {
        // 更新基本統計
        this.elements.totalClicks.textContent = stats.total.toLocaleString();
        this.elements.validClicks.textContent = stats.valid.toLocaleString();
        this.elements.anomalousClicks.textContent = stats.anomalous.toLocaleString();
        this.elements.anomalyRate.textContent = `${stats.anomalyRate}%`;
        
        // 更新間隔統計
        this.elements.avgInterval.textContent = `${intervalStats.average}ms`;
        this.elements.minInterval.textContent = intervalStats.min !== null ? `${intervalStats.min}ms` : '-';
        this.elements.maxInterval.textContent = intervalStats.max !== null ? `${intervalStats.max}ms` : '-';
        this.elements.currentInterval.textContent = intervalStats.current !== null ? `${intervalStats.current}ms` : '-';
        
        // 更新異常類型統計
        this.elements.duplicateCount.textContent = stats.duplicates;
        this.elements.intervalAnomalyCount.textContent = stats.intervalAnomalies;
        this.elements.burstCount.textContent = stats.bursts;
        
        // 更新健康度
        this.updateHealthDisplay(stats.healthScore, stats.healthLevel);
        
        // 更新異常事件列表
        this.updateAnomalyList(recentAnomalies);
        
        // 更新計時器
        if (this.isRunning) {
            this.updateTimer();
        }
    }
    
    // 更新健康度顯示
    updateHealthDisplay(score, level) {
        this.elements.healthFill.style.width = `${score}%`;
        this.elements.healthFill.style.background = `linear-gradient(90deg, ${level.color}, ${level.color}dd)`;
        this.elements.healthText.textContent = level.text;
        this.elements.healthText.style.color = level.color;
    }
    
    // 更新異常事件列表
    updateAnomalyList(anomalies) {
        const eventsList = this.elements.eventsList;
        const eventCount = this.elements.eventCount;
        
        // 更新計數
        eventCount.textContent = `${anomalies.length} 個異常事件`;
        
        // 清空列表
        eventsList.innerHTML = '';
        
        if (anomalies.length === 0) {
            const noEvents = document.createElement('div');
            noEvents.className = 'no-events';
            noEvents.textContent = '暫無異常事件';
            eventsList.appendChild(noEvents);
            return;
        }
        
        // 添加異常事件
        anomalies.forEach(anomaly => {
            const eventItem = document.createElement('div');
            eventItem.className = 'event-item';
            
            const eventTime = document.createElement('span');
            eventTime.className = 'event-time';
            eventTime.textContent = this.formatTime(anomaly.timestamp);
            
            const eventType = document.createElement('span');
            eventType.className = 'event-type';
            eventType.textContent = anomaly.description;
            
            const eventDetails = document.createElement('span');
            eventDetails.className = 'event-details';
            eventDetails.textContent = this.formatAnomalyDetails(anomaly);
            
            eventItem.appendChild(eventTime);
            eventItem.appendChild(eventType);
            eventItem.appendChild(eventDetails);
            
            eventsList.appendChild(eventItem);
        });
    }
    
    // 格式化時間
    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('zh-TW', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
    
    // 格式化異常詳情
    formatAnomalyDetails(anomaly) {
        const details = anomaly.details;
        
        switch (anomaly.type) {
            case ANOMALY_TYPES.DUPLICATE:
                return `間隔: ${details.interval}ms (< ${details.window}ms)`;
            case ANOMALY_TYPES.INTERVAL:
                return `間隔: ${details.interval}ms (< ${details.threshold}ms)`;
            case ANOMALY_TYPES.BURST:
                return `連擊次數: ${details.count} (在 ${details.window}ms 內)`;
            default:
                return JSON.stringify(details);
        }
    }
    
    // 獲取會話數據
    getSessionData() {
        return {
            startTime: this.startTime,
            endTime: this.endTime || Date.now(),
            duration: this.isRunning ? 
                Date.now() - this.startTime : 
                this.endTime - this.startTime,
            isComplete: !this.isRunning
        };
    }
    
    // 導出統計數據
    exportData(stats, detector) {
        const sessionData = this.getSessionData();
        const intervalStats = detector.getIntervalStats();
        
        return {
            session: sessionData,
            statistics: stats,
            intervals: intervalStats,
            clickHistory: detector.clickHistory.slice(),
            anomalies: detector.anomalies.slice(),
            config: detector.config,
            timestamp: Date.now(),
            version: '1.0.0'
        };
    }
    
    // 計算每分鐘點擊率
    calculateClickRate(totalClicks) {
        if (!this.startTime) return 0;
        
        const duration = this.isRunning ? 
            Date.now() - this.startTime : 
            this.endTime - this.startTime;
        
        const minutes = duration / (1000 * 60);
        return minutes > 0 ? Math.round(totalClicks / minutes) : 0;
    }
    
    // 獲取性能指標
    getPerformanceMetrics(stats, intervalStats) {
        const clickRate = this.calculateClickRate(stats.total);
        const consistency = this.calculateConsistency(intervalStats);
        
        return {
            clickRate,
            consistency,
            accuracy: 100 - parseFloat(stats.anomalyRate),
            stability: this.calculateStability(stats),
            overall: stats.healthScore
        };
    }
    
    // 計算一致性
    calculateConsistency(intervalStats) {
        if (!intervalStats.average || intervalStats.average === 0) return 100;
        
        const variance = Math.abs(intervalStats.max - intervalStats.min);
        const consistency = Math.max(0, 100 - (variance / intervalStats.average * 100));
        
        return Math.round(consistency);
    }
    
    // 計算穩定性
    calculateStability(stats) {
        if (stats.total === 0) return 100;
        
        const stability = Math.max(0, 100 - (stats.anomalous / stats.total * 200));
        return Math.round(stability);
    }
}

// 導出類
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StatisticsManager;
}
