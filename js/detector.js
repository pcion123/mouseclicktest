// 滑鼠異常檢測器
class MouseAnomalyDetector {
    constructor(config = CONFIG.detection) {
        this.config = { ...config };
        this.clickHistory = [];
        this.anomalies = [];
        this.reset();
    }
    
    reset() {
        this.clickHistory = [];
        this.anomalies = [];
        this.lastClickTime = null;
        this.stats = {
            total: 0,
            valid: 0,
            anomalous: 0,
            duplicates: 0,
            intervalAnomalies: 0,
            bursts: 0,
            timeouts: 0
        };
    }
    
    // 更新配置
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
    
    // 處理點擊事件
    processClick(clickEvent) {
        const timestamp = clickEvent.timestamp || Date.now();
        const interval = this.lastClickTime ? timestamp - this.lastClickTime : null;
        
        // 創建點擊數據
        const clickData = {
            timestamp,
            x: clickEvent.x || 0,
            y: clickEvent.y || 0,
            button: clickEvent.button || 0,
            interval,
            anomalies: []
        };
        
        // 檢測異常
        this.detectAnomalies(clickData);
        
        // 更新歷史記錄
        this.clickHistory.push(clickData);
        this.lastClickTime = timestamp;
        
        // 限制歷史記錄長度
        if (this.clickHistory.length > 1000) {
            this.clickHistory.shift();
        }
        
        // 更新統計
        this.updateStats(clickData);
        
        return clickData;
    }
    
    // 檢測異常
    detectAnomalies(clickData) {
        const timestamp = clickData.timestamp;
        const interval = clickData.interval;
        
        // 檢測重複點擊
        if (this.detectDuplicateClicks(timestamp)) {
            clickData.anomalies.push(ANOMALY_TYPES.DUPLICATE);
            this.addAnomaly(ANOMALY_TYPES.DUPLICATE, timestamp, {
                interval: interval,
                window: this.config.duplicateWindow
            });
        }
        
        // 檢測間隔異常
        if (interval !== null && this.detectIntervalAnomaly(interval)) {
            clickData.anomalies.push(ANOMALY_TYPES.INTERVAL);
            this.addAnomaly(ANOMALY_TYPES.INTERVAL, timestamp, {
                interval: interval,
                threshold: this.config.intervalThreshold
            });
        }
        
        // 檢測連擊異常
        if (this.detectBurstClicks(timestamp)) {
            clickData.anomalies.push(ANOMALY_TYPES.BURST);
            this.addAnomaly(ANOMALY_TYPES.BURST, timestamp, {
                count: this.getBurstCount(timestamp),
                window: this.config.burstWindow
            });
        }
    }
    
    // 檢測重複點擊
    detectDuplicateClicks(timestamp) {
        if (!this.lastClickTime) return false;
        
        const interval = timestamp - this.lastClickTime;
        return interval < this.config.duplicateWindow;
    }
    
    // 檢測間隔異常
    detectIntervalAnomaly(interval) {
        return interval < this.config.intervalThreshold;
    }
    
    // 檢測連擊
    detectBurstClicks(timestamp) {
        const recentClicks = this.clickHistory.filter(click => 
            timestamp - click.timestamp <= this.config.burstWindow
        );
        
        return recentClicks.length >= this.config.burstThreshold - 1;
    }
    
    // 獲取連擊次數
    getBurstCount(timestamp) {
        return this.clickHistory.filter(click => 
            timestamp - click.timestamp <= this.config.burstWindow
        ).length + 1;
    }
    
    // 添加異常記錄
    addAnomaly(type, timestamp, details) {
        const anomaly = {
            type,
            timestamp,
            details,
            description: ANOMALY_DESCRIPTIONS[type]
        };
        
        this.anomalies.push(anomaly);
        
        // 限制異常記錄長度
        if (this.anomalies.length > CONFIG.ui.eventListMaxItems) {
            this.anomalies.shift();
        }
    }
    
    // 更新統計
    updateStats(clickData) {
        this.stats.total++;
        
        if (clickData.anomalies.length === 0) {
            this.stats.valid++;
        } else {
            this.stats.anomalous++;
            
            // 統計各類異常
            clickData.anomalies.forEach(anomaly => {
                switch (anomaly) {
                    case ANOMALY_TYPES.DUPLICATE:
                        this.stats.duplicates++;
                        break;
                    case ANOMALY_TYPES.INTERVAL:
                        this.stats.intervalAnomalies++;
                        break;
                    case ANOMALY_TYPES.BURST:
                        this.stats.bursts++;
                        break;
                    case ANOMALY_TYPES.TIMEOUT:
                        this.stats.timeouts++;
                        break;
                }
            });
        }
    }
    
    // 獲取統計數據
    getStats() {
        const stats = { ...this.stats };
        
        // 計算異常率
        stats.anomalyRate = stats.total > 0 ? 
            ((stats.anomalous / stats.total) * 100).toFixed(1) : '0.0';
        
        // 計算健康度
        stats.healthScore = this.calculateHealthScore();
        stats.healthLevel = this.getHealthLevel(stats.healthScore);
        
        return stats;
    }
    
    // 計算健康度分數
    calculateHealthScore() {
        if (this.stats.total === 0) return 100;
        
        const validRate = (this.stats.valid / this.stats.total) * 100;
        const anomalyPenalty = Math.min(this.stats.anomalous * 2, 50); // 每個異常扣2分，最多扣50分
        
        return Math.max(0, Math.min(100, validRate - anomalyPenalty));
    }
    
    // 獲取健康度等級
    getHealthLevel(score) {
        for (const [level, config] of Object.entries(CONFIG.health)) {
            if (score >= config.min) {
                return {
                    level,
                    ...config
                };
            }
        }
        return CONFIG.health.bad;
    }
    
    // 獲取間隔統計
    getIntervalStats() {
        const intervals = this.clickHistory
            .filter(click => click.interval !== null)
            .map(click => click.interval);
        
        if (intervals.length === 0) {
            return {
                average: 0,
                min: null,
                max: null,
                current: null
            };
        }
        
        const sum = intervals.reduce((a, b) => a + b, 0);
        const average = Math.round(sum / intervals.length);
        const min = Math.min(...intervals);
        const max = Math.max(...intervals);
        const current = intervals[intervals.length - 1];
        
        return { average, min, max, current };
    }
    
    // 獲取最近的異常事件
    getRecentAnomalies(limit = 10) {
        return this.anomalies
            .slice(-limit)
            .reverse();
    }
    
    // 獲取時間軸數據
    getTimelineData(maxPoints = CONFIG.ui.chartMaxPoints) {
        if (this.clickHistory.length === 0) return [];
        
        const step = Math.max(1, Math.floor(this.clickHistory.length / maxPoints));
        const data = [];
        
        for (let i = 0; i < this.clickHistory.length; i += step) {
            const click = this.clickHistory[i];
            data.push({
                timestamp: click.timestamp,
                interval: click.interval,
                hasAnomaly: click.anomalies.length > 0,
                anomalyTypes: click.anomalies
            });
        }
        
        return data;
    }
    
    // 清除歷史數據
    clearHistory() {
        this.reset();
    }
}

// 導出類
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MouseAnomalyDetector;
}
