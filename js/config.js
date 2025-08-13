// 應用程式配置
const CONFIG = {
    // 檢測參數
    detection: {
        duplicateWindow: 50,        // 重複點擊檢測窗口 (ms)
        burstWindow: 500,           // 連擊檢測窗口 (ms)
        burstThreshold: 3,          // 連擊次數閾值
        intervalThreshold: 50,      // 異常間隔閾值 (ms)
        normalIntervalMin: 100,     // 正常間隔最小值 (ms)
        normalIntervalMax: 2000,    // 正常間隔最大值 (ms)
        longIntervalMax: 5000       // 長間隔最大值 (ms)
    },
    
    // 測試模式
    modes: {
        free: {
            name: '自由測試',
            description: '隨意點擊進行測試',
            timeout: null
        },
        rhythm: {
            name: '節奏測試',
            description: '按照指定節奏點擊',
            targetInterval: 1000,
            tolerance: 200
        },
        endurance: {
            name: '耐久測試',
            description: '長時間連續點擊測試',
            duration: 300000, // 5分鐘
            targetRate: 60    // 每分鐘60次
        }
    },
    
    // UI 設定
    ui: {
        updateInterval: 100,        // UI 更新間隔 (ms)
        chartMaxPoints: 100,        // 圖表最大點數
        feedbackDuration: 600,      // 反饋效果持續時間 (ms)
        eventListMaxItems: 50       // 事件列表最大項目數
    },
    
    // 健康度評估
    health: {
        excellent: { min: 95, color: '#28a745', text: '優秀' },
        good: { min: 85, color: '#20c997', text: '良好' },
        fair: { min: 70, color: '#ffc107', text: '普通' },
        poor: { min: 50, color: '#fd7e14', text: '較差' },
        bad: { min: 0, color: '#dc3545', text: '異常' }
    },
    
    // 本地存儲鍵
    storage: {
        settings: 'mousetest_settings',
        history: 'mousetest_history',
        lastSession: 'mousetest_last_session'
    }
};

// 異常類型定義
const ANOMALY_TYPES = {
    DUPLICATE: 'duplicate',
    INTERVAL: 'interval', 
    BURST: 'burst',
    TIMEOUT: 'timeout'
};

// 異常類型描述
const ANOMALY_DESCRIPTIONS = {
    [ANOMALY_TYPES.DUPLICATE]: '重複點擊',
    [ANOMALY_TYPES.INTERVAL]: '間隔異常',
    [ANOMALY_TYPES.BURST]: '連擊異常',
    [ANOMALY_TYPES.TIMEOUT]: '超時異常'
};

// 導出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, ANOMALY_TYPES, ANOMALY_DESCRIPTIONS };
}
