// 圖表管理器
class ChartManager {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.data = [];
        this.maxPoints = CONFIG.ui.chartMaxPoints;
        this.colors = {
            normal: '#28a745',
            anomaly: '#dc3545',
            grid: '#e2e8f0',
            text: '#6c757d',
            background: '#ffffff'
        };
        this.setupCanvas();
    }
    
    // 設置畫布
    setupCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        this.width = rect.width;
        this.height = rect.height;
        this.padding = {
            top: 20,
            right: 20,
            bottom: 40,
            left: 60
        };
        
        this.chartWidth = this.width - this.padding.left - this.padding.right;
        this.chartHeight = this.height - this.padding.top - this.padding.bottom;
    }
    
    // 更新數據
    updateData(timelineData) {
        this.data = timelineData.slice(-this.maxPoints);
        this.draw();
    }
    
    // 清除圖表
    clear() {
        this.data = [];
        this.draw();
    }
    
    // 繪製圖表
    draw() {
        // 清除畫布
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        if (this.data.length === 0) {
            this.drawEmptyState();
            return;
        }
        
        // 計算數據範圍
        const intervals = this.data.map(d => d.interval).filter(i => i !== null);
        if (intervals.length === 0) {
            this.drawEmptyState();
            return;
        }
        
        const minInterval = Math.min(...intervals);
        const maxInterval = Math.max(...intervals);
        const range = maxInterval - minInterval || 1;
        
        // 繪製網格
        this.drawGrid(minInterval, maxInterval);
        
        // 繪製數據點和線條
        this.drawDataPoints(minInterval, range);
        
        // 繪製軸線和標籤
        this.drawAxes(minInterval, maxInterval);
    }
    
    // 繪製空狀態
    drawEmptyState() {
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('開始點擊以查看時間軸', this.width / 2, this.height / 2);
    }
    
    // 繪製網格
    drawGrid(minInterval, maxInterval) {
        this.ctx.strokeStyle = this.colors.grid;
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([2, 2]);
        
        // 水平網格線
        const yLines = 5;
        for (let i = 0; i <= yLines; i++) {
            const y = this.padding.top + (this.chartHeight / yLines) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(this.padding.left, y);
            this.ctx.lineTo(this.padding.left + this.chartWidth, y);
            this.ctx.stroke();
        }
        
        // 垂直網格線
        const xLines = Math.min(10, this.data.length);
        for (let i = 0; i <= xLines; i++) {
            const x = this.padding.left + (this.chartWidth / xLines) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(x, this.padding.top);
            this.ctx.lineTo(x, this.padding.top + this.chartHeight);
            this.ctx.stroke();
        }
        
        this.ctx.setLineDash([]);
    }
    
    // 繪製數據點
    drawDataPoints(minInterval, range) {
        if (this.data.length < 2) return;
        
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        // 繪製連線
        this.ctx.strokeStyle = this.colors.normal;
        this.ctx.beginPath();
        
        let firstPoint = true;
        this.data.forEach((point, index) => {
            if (point.interval === null) return;
            
            const x = this.padding.left + (index / (this.data.length - 1)) * this.chartWidth;
            const y = this.padding.top + this.chartHeight - 
                     ((point.interval - minInterval) / range) * this.chartHeight;
            
            if (firstPoint) {
                this.ctx.moveTo(x, y);
                firstPoint = false;
            } else {
                this.ctx.lineTo(x, y);
            }
        });
        
        this.ctx.stroke();
        
        // 繪製數據點
        this.data.forEach((point, index) => {
            if (point.interval === null) return;
            
            const x = this.padding.left + (index / (this.data.length - 1)) * this.chartWidth;
            const y = this.padding.top + this.chartHeight - 
                     ((point.interval - minInterval) / range) * this.chartHeight;
            
            // 選擇顏色
            const color = point.hasAnomaly ? this.colors.anomaly : this.colors.normal;
            const radius = point.hasAnomaly ? 4 : 3;
            
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 異常點添加邊框
            if (point.hasAnomaly) {
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }
        });
    }
    
    // 繪製軸線和標籤
    drawAxes(minInterval, maxInterval) {
        this.ctx.strokeStyle = this.colors.text;
        this.ctx.lineWidth = 1;
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = '12px Arial';
        
        // X軸
        this.ctx.beginPath();
        this.ctx.moveTo(this.padding.left, this.padding.top + this.chartHeight);
        this.ctx.lineTo(this.padding.left + this.chartWidth, this.padding.top + this.chartHeight);
        this.ctx.stroke();
        
        // Y軸
        this.ctx.beginPath();
        this.ctx.moveTo(this.padding.left, this.padding.top);
        this.ctx.lineTo(this.padding.left, this.padding.top + this.chartHeight);
        this.ctx.stroke();
        
        // X軸標籤
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText('時間', this.padding.left + this.chartWidth / 2, 
                         this.padding.top + this.chartHeight + 25);
        
        // Y軸標籤
        this.ctx.save();
        this.ctx.translate(15, this.padding.top + this.chartHeight / 2);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('間隔 (ms)', 0, 0);
        this.ctx.restore();
        
        // Y軸刻度
        this.ctx.textAlign = 'right';
        this.ctx.textBaseline = 'middle';
        const yTicks = 5;
        for (let i = 0; i <= yTicks; i++) {
            const y = this.padding.top + this.chartHeight - (this.chartHeight / yTicks) * i;
            const value = minInterval + (maxInterval - minInterval) * (i / yTicks);
            this.ctx.fillText(Math.round(value), this.padding.left - 5, y);
        }
        
        // 繪製圖例
        this.drawLegend();
    }
    
    // 繪製圖例
    drawLegend() {
        const legendX = this.width - 150;
        const legendY = 30;
        
        // 正常點擊圖例
        this.ctx.fillStyle = this.colors.normal;
        this.ctx.beginPath();
        this.ctx.arc(legendX, legendY, 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('正常點擊', legendX + 10, legendY);
        
        // 異常點擊圖例
        this.ctx.fillStyle = this.colors.anomaly;
        this.ctx.beginPath();
        this.ctx.arc(legendX, legendY + 20, 4, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        this.ctx.fillStyle = this.colors.text;
        this.ctx.fillText('異常點擊', legendX + 10, legendY + 20);
    }
    
    // 獲取點擊位置的數據點
    getDataPointAt(x, y) {
        if (this.data.length === 0) return null;
        
        const rect = this.canvas.getBoundingClientRect();
        const canvasX = x - rect.left;
        const canvasY = y - rect.top;
        
        // 轉換為圖表座標
        const chartX = canvasX - this.padding.left;
        const chartY = canvasY - this.padding.top;
        
        if (chartX < 0 || chartX > this.chartWidth || 
            chartY < 0 || chartY > this.chartHeight) {
            return null;
        }
        
        // 找到最近的數據點
        const index = Math.round((chartX / this.chartWidth) * (this.data.length - 1));
        return this.data[index] || null;
    }
    
    // 重置畫布大小
    resize() {
        this.setupCanvas();
        this.draw();
    }
    
    // 導出圖表為圖片
    exportAsImage() {
        return this.canvas.toDataURL('image/png');
    }
}

// 導出類
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChartManager;
}
