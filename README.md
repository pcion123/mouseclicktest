# 🖱️ 滑鼠按鍵異常檢測工具

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-Ready-orange.svg)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)

一個專業的前端網頁應用程式，專為檢測滑鼠按鍵異常行為而設計。透過智能算法識別重複點擊、按鍵彈跳、點擊延遲等硬體問題，為電競玩家、硬體測試人員和一般用戶提供可靠的滑鼠健康診斷工具。

## 🖼️ 介面預覽

### 🌙 Dark Mode (深色主題)
![滑鼠檢測工具 - Dark Mode](assets/screenshots/dark-mode-preview.svg)

### ☀️ Light Mode (淺色主題)  
![滑鼠檢測工具 - Light Mode](assets/screenshots/light-mode-preview.svg)

> 💡 **主題切換**: 點擊右上角的 🌙/☀️ 按鈕即可在深淺主題間自由切換

> 📸 **截圖說明**: 上方為 SVG 格式的界面預覽圖。如需更新為實際截圖，請將 PNG/JPG 文件放置到 `assets/screenshots/` 目錄中。

## ✨ 主要特色

### 🎨 雙主題設計
- **🌙 Dark Mode**: 護眼深色主題，適合長時間使用
- **☀️ Light Mode**: 清爽淺色主題，提供經典體驗
- **⚡ 一鍵切換**: 主題偏好自動保存，無縫切換體驗

### 🎯 智能檢測系統
- **多層次異常識別**: 重複點擊檢測、間隔異常分析、連擊模式識別
- **即時回饋機制**: 點擊響應 < 10ms，即時視覺反饋（綠色/紅色波紋效果）
- **健康度評估**: 基於統計算法的 0-100 分健康度評分系統
- **精準算法**: 可調整檢測參數，適應不同使用場景

### 📊 數據分析與視覺化
- **實時統計面板**: 點擊總數、有效點擊、異常率、間隔統計
- **時間軸圖表**: Canvas 繪製的點擊時間分佈圖
- **異常事件記錄**: 詳細的異常類型和發生時間記錄
- **數據導出**: 支援 JSON/CSV 格式導出測試數據

### 🎮 多種測試模式
- **🆓 自由測試**: 不限制點擊頻率，適合基本硬體檢測
- **⏱️ 節奏測試**: 按指定間隔測試，評估點擊一致性
- **🏃 耐久測試**: 長時間測試，檢驗硬體穩定性

### 🛠️ 專業功能
- **參數自定義**: 重複點擊窗口 (10-200ms)、連擊閾值 (2-10次) 等
- **本地數據持久化**: LocalStorage 保存設定和測試歷史
- **響應式設計**: 支援桌面、平板、手機等多種設備
- **離線使用**: 純前端實現，無需網路連接

## 🚀 快速開始

### 💻 直接使用（推薦）

```bash
# 1. 克隆或下載項目
git clone https://github.com/pcion123/mouseclicktest.git

# 2. 進入項目目錄
cd mouseclicktest

# 3. 直接在瀏覽器中打開 index.html
# 或使用本地服務器（避免 CORS 問題）
```

### 🌐 本地服務器部署

```bash
# 使用 Python (推薦)
python -m http.server 8000
# 訪問: http://localhost:8000

# 使用 Node.js
npx http-server
# 或
npx serve .

# 使用 PHP
php -S localhost:8000
```

### 📱 使用步驟

1. **選擇測試模式**: 自由測試 / 節奏測試 / 耐久測試
2. **切換主題** (可選): 點擊右上角的 🌙/☀️ 按鈕切換深淺主題
3. **調整設定** (可選): 點擊設定按鈕自定義檢測參數
4. **開始測試**: 點擊「開始測試」按鈕
5. **進行點擊**: 在藍色測試區域內進行點擊
6. **查看結果**: 觀察實時統計和圖表分析
7. **停止並查看報告**: 點擊「停止測試」查看詳細結果

## 🔬 檢測算法詳解

### 重複點擊檢測 (Duplicate Click Detection)
```javascript
// 檢測原理：短時間內多次觸發
檢測窗口: 50ms (可調整 10-200ms)
觸發條件: 間隔 < 檢測窗口
應用場景: 識別滑鼠按鍵彈跳、硬體故障
```

### 間隔異常檢測 (Interval Anomaly Detection)
```javascript
// 檢測原理：異常短的點擊間隔
正常間隔: 100ms - 2000ms
異常閾值: < 50ms (可調整 10-100ms)
應用場景: 檢測意外的快速點擊、硬體不穩定
```

### 連擊檢測 (Burst Click Detection)
```javascript
// 檢測原理：短時間內過多點擊
檢測窗口: 500ms (可調整 100-1000ms)
觸發閾值: ≥ 3次 (可調整 2-10次)
應用場景: 識別滑鼠雙擊故障、意外連擊
```

### 健康度評分算法
```javascript
健康度分數 = 有效點擊率 × 100 - (異常點擊數 × 2)
分級標準:
- 95-100分: 優秀 (綠色)
- 85-94分:  良好 (青色)
- 70-84分:  普通 (黃色)
- 50-69分:  較差 (橙色)
- 0-49分:   異常 (紅色)
```

## 🏗️ 技術架構

### 前端技術棧
- **HTML5**: 語義化結構，Canvas 圖表
- **CSS3**: Flexbox/Grid 布局，漸變動畫，響應式設計
- **Vanilla JavaScript (ES6+)**: 模組化架構，無外部依賴
- **Web APIs**: LocalStorage、Canvas 2D、Mouse Events

### 項目結構
```
mouseclicktest/
├── 📄 index.html              # 主應用程式入口
├── 📁 css/                    # 樣式文件
│   ├── styles.css            # 主要樣式 (布局、主題)
│   ├── components.css        # 組件樣式 (按鈕、對話框、動畫)
│   └── themes.css            # 主題系統 (Dark/Light 模式)
├── 📁 js/                     # JavaScript 模組
│   ├── config.js             # 配置常數與設定
│   ├── detector.js           # 核心檢測算法
│   ├── statistics.js         # 統計數據管理
│   ├── chart.js              # Canvas 圖表繪製
│   ├── ui.js                 # 用戶界面管理
│   └── app.js                # 主應用程式控制器
├── 📁 assets/                 # 靜態資源
│   └── screenshots/          # 應用截圖
│       ├── dark-mode-preview.svg    # Dark Mode 預覽
│       └── light-mode-preview.svg   # Light Mode 預覽
├── 📄 README.md               # 項目說明文檔
├── 📄 LICENSE                 # MIT 開源協議
└── 📄 .gitignore              # Git 忽略規則
```

### 核心類別系統
```javascript
// 主要類別
MouseClickTestApp          // 應用程式主控制器
MouseAnomalyDetector      // 異常檢測核心算法
StatisticsManager         // 統計數據管理與顯示
ChartManager             // Canvas 圖表繪製
UIManager                // 用戶界面交互管理

// 事件驅動架構
document.addEventListener('mousetest:*', handler)
```

## 📈 性能與相容性

### 性能指標
- **點擊響應時間**: < 10ms
- **記憶體使用**: < 50MB
- **數據處理能力**: 支援 1000+ 點擊記錄
- **圖表刷新率**: 100ms 間隔 (10 FPS)

### 瀏覽器支援
| 瀏覽器 | 版本要求 | 測試狀態 |
|--------|----------|----------|
| Chrome | 80+ | ✅ 完全支援 |
| Firefox | 75+ | ✅ 完全支援 |
| Safari | 13+ | ✅ 完全支援 |
| Edge | 80+ | ✅ 完全支援 |

### 設備相容性
- 🖥️ **桌面電腦**: Windows、macOS、Linux
- 💻 **筆記型電腦**: 內建觸控板與外接滑鼠
- 📱 **觸控設備**: 基本支援 (觸控事件模擬點擊)

## 🔧 自定義與擴展

### 參數配置
```javascript
// config.js 中的可調整參數
CONFIG.detection = {
    duplicateWindow: 50,      // 重複點擊檢測窗口
    burstWindow: 500,         // 連擊檢測窗口  
    burstThreshold: 3,        // 連擊次數閾值
    intervalThreshold: 50,    // 異常間隔閾值
    normalIntervalMin: 100,   // 正常間隔最小值
    normalIntervalMax: 2000   // 正常間隔最大值
}
```

### 擴展方向
- 🎯 **新檢測算法**: 滑鼠軌跡分析、點擊壓力檢測
- 📊 **更多圖表**: 散點圖、熱力圖、頻率分佈圖
- 🌐 **雲端功能**: 數據同步、社群比較、遠程診斷
- 📱 **跨平台**: Electron 桌面版、PWA 移動版

## 🧪 測試與品質保證

### 自動化測試
完整的測試指南：

1. **基本載入測試**: 頁面渲染、資源載入
2. **功能測試**: 點擊檢測、異常識別、模式切換
3. **性能測試**: 記憶體使用、響應速度、長時間運行
4. **相容性測試**: 多瀏覽器、多設備測試
5. **數據完整性**: 統計準確性、持久化功能

### 手動測試建議
```bash
# 基本功能驗證
✅ 正常點擊顯示綠色波紋
✅ 快速雙擊顯示紅色波紋  
✅ 統計數據即時更新
✅ 圖表繪製點擊軌跡
✅ 設定保存與載入

# 異常檢測驗證
✅ 重複點擊檢測 (快速雙擊)
✅ 連擊檢測 (500ms 內 3+ 次點擊)
✅ 間隔異常檢測 (< 50ms 間隔)
```

## 📊 數據格式與 API

### 點擊事件數據結構
```javascript
{
  timestamp: 1640995200000,    // Unix 時間戳
  x: 150,                     // 點擊 X 座標
  y: 200,                     // 點擊 Y 座標  
  button: 0,                  // 滑鼠按鍵 (0:左鍵, 1:中鍵, 2:右鍵)
  interval: 250,              // 與前次點擊間隔 (ms)
  anomalies: ['duplicate']    // 異常類型陣列
}
```

### 統計數據結構
```javascript
{
  total: 100,                 // 總點擊數
  valid: 95,                  // 有效點擊數
  anomalous: 5,               // 異常點擊數
  anomalyRate: "5.0",         // 異常率百分比
  healthScore: 87,            // 健康度分數 (0-100)
  duplicates: 2,              // 重複點擊次數
  intervalAnomalies: 1,       // 間隔異常次數
  bursts: 2                   // 連擊異常次數
}
```

### 導出數據格式
```bash
# JSON 格式
{
  "session": { ... },         # 會話資訊
  "statistics": { ... },      # 統計數據
  "clickHistory": [ ... ],    # 完整點擊記錄
  "anomalies": [ ... ]        # 異常事件記錄
}

# CSV 格式  
timestamp,x,y,button,interval,hasAnomaly,anomalyTypes
1640995200000,150,200,0,250,false,""
1640995200100,180,220,0,100,true,"duplicate"
```

## 🤝 貢獻指南

我們歡迎社群貢獻！請遵循以下步驟：

### 開發環境設置
```bash
# 1. Fork 並克隆項目
git clone https://github.com/YOUR_USERNAME/mouseclicktest.git

# 2. 創建功能分支
git checkout -b feature/your-feature-name

# 3. 本地開發與測試
# 在瀏覽器中打開 index.html 進行測試

# 4. 提交變更
git add .
git commit -m "feat: add your feature description"

# 5. 推送並創建 Pull Request
git push origin feature/your-feature-name
```

### 貢獻類型
- 🐛 **Bug 修復**: 錯誤報告與修復
- ✨ **新功能**: 檢測算法、UI 改進、新測試模式
- 📚 **文檔**: README、註釋、使用指南改進
- 🎨 **設計**: UI/UX 優化、視覺效果改進
- ⚡ **性能**: 算法優化、記憶體使用改進

### 代碼規範
- 使用 ES6+ 語法
- 遵循 JSDoc 註釋規範
- 保持模組化架構
- 確保跨瀏覽器相容性

## 📄 授權與聲明

本項目使用 [MIT 授權](LICENSE)，允許商業和非商業使用。

### 免責聲明
此工具僅用於硬體檢測參考，不能替代專業硬體診斷。檢測結果僅供參考，實際硬體狀況請以專業檢測為準。

## 📞 支援與聯絡

### 🆘 獲取幫助
- 📋 [提交 Issue](https://github.com/pcion123/mouseclicktest/issues) - 錯誤報告與功能請求
- 💬 [討論區](https://github.com/pcion123/mouseclicktest/discussions) - 使用問題與建議
- 📖 [Wiki](https://github.com/pcion123/mouseclicktest/wiki) - 詳細文檔與教程

### 🌟 社群
如果這個工具對您有幫助，請給我們一個 ⭐ Star！您的支持是我們持續改進的動力。

---

<div align="center">

**🖱️ 讓我們一起打造更好的滑鼠檢測體驗！✨**

Made with ❤️ by [pcion123](https://github.com/pcion123)

</div>滑鼠按鍵異常檢測工具

一個專業的前端網頁應用程式