/**
 * Marketing ROI Calculator - Inline App Module
 * Calculate marketing return on investment with detailed analytics
 */

class ROICalculator {
    constructor(containerId) {
        this.containerId = containerId;
        this.data = {
            investment: 0,
            revenue: 0,
            period: 'monthly',
            channels: []
        };
        this.results = {};
        this.charts = {};
        
        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
        this.loadSampleData();
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="roi-calculator-app">
                <div class="app-header">
                    <h3 class="app-title">
                        <span class="app-icon">📊</span>
                        Marketing ROI Calculator
                    </h3>
                    <p class="app-subtitle">Calculate and analyze your marketing return on investment</p>
                </div>

                <div class="calculator-layout">
                    <!-- Input Section -->
                    <div class="calculator-inputs">
                        <div class="input-group">
                            <h4 class="section-title">💰 Investment Details</h4>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Total Marketing Investment</label>
                                    <div class="input-with-currency">
                                        <span class="currency-symbol">$</span>
                                        <input type="number" id="totalInvestment" class="form-input" 
                                               placeholder="10000" min="0" step="100">
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Time Period</label>
                                    <select id="timePeriod" class="form-select">
                                        <option value="monthly">Monthly</option>
                                        <option value="quarterly">Quarterly</option>
                                        <option value="yearly">Yearly</option>
                                        <option value="campaign">Single Campaign</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="input-group">
                            <h4 class="section-title">📈 Revenue & Results</h4>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Revenue Generated</label>
                                    <div class="input-with-currency">
                                        <span class="currency-symbol">$</span>
                                        <input type="number" id="revenueGenerated" class="form-input" 
                                               placeholder="25000" min="0" step="100">
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Leads Generated</label>
                                    <input type="number" id="leadsGenerated" class="form-input" 
                                           placeholder="150" min="0" step="1">
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Conversion Rate (%)</label>
                                    <input type="number" id="conversionRate" class="form-input" 
                                           placeholder="3.5" min="0" max="100" step="0.1">
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Customer Lifetime Value</label>
                                    <div class="input-with-currency">
                                        <span class="currency-symbol">$</span>
                                        <input type="number" id="customerLTV" class="form-input" 
                                               placeholder="500" min="0" step="10">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="input-group">
                            <h4 class="section-title">🎯 Marketing Channels</h4>
                            <div class="channels-container" id="channelsContainer">
                                <!-- Channels will be added dynamically -->
                            </div>
                            <button type="button" class="add-channel-btn" id="addChannelBtn">
                                + Add Marketing Channel
                            </button>
                        </div>

                        <div class="calculation-actions">
                            <button type="button" class="calculate-btn" id="calculateBtn">
                                <span class="btn-icon">🧮</span>
                                Calculate ROI
                            </button>
                            <button type="button" class="reset-btn" id="resetBtn">
                                <span class="btn-icon">🔄</span>
                                Reset
                            </button>
                        </div>
                    </div>

                    <!-- Results Section -->
                    <div class="calculator-results">
                        <div class="results-header">
                            <h4 class="section-title">📊 Results & Analytics</h4>
                            <div class="results-actions">
                                <button type="button" class="export-btn" id="exportBtn" disabled>
                                    <span class="btn-icon">📄</span>
                                    Export Report
                                </button>
                                <button type="button" class="share-btn" id="shareBtn" disabled>
                                    <span class="btn-icon">🔗</span>
                                    Share
                                </button>
                            </div>
                        </div>

                        <div class="results-content" id="resultsContent">
                            <div class="results-placeholder">
                                <div class="placeholder-icon">📊</div>
                                <h4>Enter your data to see results</h4>
                                <p>Fill in your marketing investment and revenue details to calculate ROI and view detailed analytics.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Input event listeners
        const inputs = ['totalInvestment', 'revenueGenerated', 'leadsGenerated', 'conversionRate', 'customerLTV'];
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => this.handleInputChange());
                input.addEventListener('blur', () => this.validateInput(input));
            }
        });

        // Period change
        const periodSelect = document.getElementById('timePeriod');
        if (periodSelect) {
            periodSelect.addEventListener('change', () => this.handleInputChange());
        }

        // Action buttons
        const calculateBtn = document.getElementById('calculateBtn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => this.calculateROI());
        }

        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetCalculator());
        }

        const addChannelBtn = document.getElementById('addChannelBtn');
        if (addChannelBtn) {
            addChannelBtn.addEventListener('click', () => this.addChannel());
        }

        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportReport());
        }

        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareResults());
        }
    }

    handleInputChange() {
        this.updateData();
        this.validateInputs();
        
        // Auto-calculate if all required fields are filled
        if (this.hasRequiredData()) {
            this.calculateROI();
        }
    }

    updateData() {
        this.data.investment = parseFloat(document.getElementById('totalInvestment')?.value) || 0;
        this.data.revenue = parseFloat(document.getElementById('revenueGenerated')?.value) || 0;
        this.data.period = document.getElementById('timePeriod')?.value || 'monthly';
        this.data.leads = parseInt(document.getElementById('leadsGenerated')?.value) || 0;
        this.data.conversionRate = parseFloat(document.getElementById('conversionRate')?.value) || 0;
        this.data.customerLTV = parseFloat(document.getElementById('customerLTV')?.value) || 0;
    }

    hasRequiredData() {
        return this.data.investment > 0 && this.data.revenue > 0;
    }

    validateInput(input) {
        const value = parseFloat(input.value);
        let isValid = true;
        let message = '';

        switch (input.id) {
            case 'totalInvestment':
                if (value <= 0) {
                    isValid = false;
                    message = 'Investment must be greater than 0';
                }
                break;
            case 'revenueGenerated':
                if (value < 0) {
                    isValid = false;
                    message = 'Revenue cannot be negative';
                }
                break;
            case 'conversionRate':
                if (value < 0 || value > 100) {
                    isValid = false;
                    message = 'Conversion rate must be between 0 and 100';
                }
                break;
        }

        this.showInputValidation(input, isValid, message);
        return isValid;
    }

    validateInputs() {
        const inputs = document.querySelectorAll('.roi-calculator-app input');
        let allValid = true;
        
        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                allValid = false;
            }
        });

        return allValid;
    }

    showInputValidation(input, isValid, message) {
        input.classList.toggle('invalid', !isValid);
        input.classList.toggle('valid', isValid && input.value);

        // Remove existing error message
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add error message if invalid
        if (!isValid && message) {
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = message;
            input.parentElement.appendChild(errorElement);
        }
    }

    calculateROI() {
        if (!this.hasRequiredData()) {
            this.showError('Please enter both investment and revenue amounts');
            return;
        }

        this.updateData();
        
        // Calculate basic ROI metrics
        const roi = ((this.data.revenue - this.data.investment) / this.data.investment) * 100;
        const netProfit = this.data.revenue - this.data.investment;
        const profitMargin = (netProfit / this.data.revenue) * 100;
        
        // Calculate advanced metrics
        const costPerLead = this.data.leads > 0 ? this.data.investment / this.data.leads : 0;
        const costPerAcquisition = this.data.conversionRate > 0 ? costPerLead / (this.data.conversionRate / 100) : 0;
        const projectedLTV = this.data.customerLTV * this.data.leads * (this.data.conversionRate / 100);
        
        // Calculate efficiency metrics
        const revenueMultiplier = this.data.investment > 0 ? this.data.revenue / this.data.investment : 0;
        const breakEvenPoint = this.data.customerLTV > 0 ? costPerAcquisition / this.data.customerLTV : 0;

        this.results = {
            roi,
            netProfit,
            profitMargin,
            costPerLead,
            costPerAcquisition,
            projectedLTV,
            revenueMultiplier,
            breakEvenPoint,
            isPositive: roi > 0,
            isProfitable: netProfit > 0,
            efficiency: this.calculateEfficiencyRating(roi, profitMargin)
        };

        this.renderResults();
        this.enableExportButtons();
    }

    calculateEfficiencyRating(roi, profitMargin) {
        if (roi >= 400 && profitMargin >= 80) return { level: 'excellent', score: 95 };
        if (roi >= 200 && profitMargin >= 60) return { level: 'very-good', score: 85 };
        if (roi >= 100 && profitMargin >= 40) return { level: 'good', score: 75 };
        if (roi >= 50 && profitMargin >= 20) return { level: 'fair', score: 60 };
        if (roi >= 0 && profitMargin >= 0) return { level: 'poor', score: 40 };
        return { level: 'losing', score: 20 };
    }

    renderResults() {
        const resultsContent = document.getElementById('resultsContent');
        if (!resultsContent) return;

        resultsContent.innerHTML = `
            <div class="results-grid">
                <!-- Primary Metrics -->
                <div class="metric-card primary ${this.results.isPositive ? 'positive' : 'negative'}">
                    <div class="metric-header">
                        <span class="metric-icon">${this.results.isPositive ? '📈' : '📉'}</span>
                        <span class="metric-label">ROI</span>
                    </div>
                    <div class="metric-value">${this.formatPercentage(this.results.roi)}</div>
                    <div class="metric-subtitle">${this.results.isPositive ? 'Positive Return' : 'Negative Return'}</div>
                </div>

                <div class="metric-card ${this.results.isProfitable ? 'positive' : 'negative'}">
                    <div class="metric-header">
                        <span class="metric-icon">💰</span>
                        <span class="metric-label">Net Profit</span>
                    </div>
                    <div class="metric-value">${this.formatCurrency(this.results.netProfit)}</div>
                    <div class="metric-subtitle">${this.results.isProfitable ? 'Profitable' : 'Loss'}</div>
                </div>

                <div class="metric-card">
                    <div class="metric-header">
                        <span class="metric-icon">📊</span>
                        <span class="metric-label">Profit Margin</span>
                    </div>
                    <div class="metric-value">${this.formatPercentage(this.results.profitMargin)}</div>
                    <div class="metric-subtitle">Revenue to Profit</div>
                </div>

                <!-- Efficiency Rating -->
                <div class="metric-card efficiency-card">
                    <div class="metric-header">
                        <span class="metric-icon">⭐</span>
                        <span class="metric-label">Efficiency Rating</span>
                    </div>
                    <div class="efficiency-rating">
                        <div class="rating-score">${this.results.efficiency.score}/100</div>
                        <div class="rating-level ${this.results.efficiency.level}">${this.formatEfficiencyLevel(this.results.efficiency.level)}</div>
                        <div class="rating-bar">
                            <div class="rating-fill" style="width: ${this.results.efficiency.score}%"></div>
                        </div>
                    </div>
                </div>

                <!-- Advanced Metrics -->
                ${this.data.leads > 0 ? `
                <div class="metric-card">
                    <div class="metric-header">
                        <span class="metric-icon">🎯</span>
                        <span class="metric-label">Cost per Lead</span>
                    </div>
                    <div class="metric-value">${this.formatCurrency(this.results.costPerLead)}</div>
                    <div class="metric-subtitle">${this.data.leads} leads generated</div>
                </div>
                ` : ''}

                ${this.data.conversionRate > 0 ? `
                <div class="metric-card">
                    <div class="metric-header">
                        <span class="metric-icon">💼</span>
                        <span class="metric-label">Cost per Acquisition</span>
                    </div>
                    <div class="metric-value">${this.formatCurrency(this.results.costPerAcquisition)}</div>
                    <div class="metric-subtitle">${this.data.conversionRate}% conversion rate</div>
                </div>
                ` : ''}

                <div class="metric-card">
                    <div class="metric-header">
                        <span class="metric-icon">🔄</span>
                        <span class="metric-label">Revenue Multiplier</span>
                    </div>
                    <div class="metric-value">${this.results.revenueMultiplier.toFixed(2)}x</div>
                    <div class="metric-subtitle">Return per dollar spent</div>
                </div>

                ${this.data.customerLTV > 0 ? `
                <div class="metric-card">
                    <div class="metric-header">
                        <span class="metric-icon">💎</span>
                        <span class="metric-label">Projected LTV</span>
                    </div>
                    <div class="metric-value">${this.formatCurrency(this.results.projectedLTV)}</div>
                    <div class="metric-subtitle">Total customer value</div>
                </div>
                ` : ''}
            </div>

            <!-- Insights and Recommendations -->
            <div class="insights-section">
                <h5 class="insights-title">💡 Insights & Recommendations</h5>
                <div class="insights-list">
                    ${this.generateInsights().map(insight => `
                        <div class="insight-item ${insight.type}">
                            <span class="insight-icon">${insight.icon}</span>
                            <div class="insight-content">
                                <div class="insight-text">${insight.text}</div>
                                ${insight.action ? `<div class="insight-action">${insight.action}</div>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Comparison Chart -->
            <div class="chart-section">
                <h5 class="chart-title">📈 Investment vs Revenue</h5>
                <div class="comparison-chart">
                    <div class="chart-bar">
                        <div class="bar-label">Investment</div>
                        <div class="bar-container">
                            <div class="bar investment-bar" style="width: ${this.getBarWidth(this.data.investment)}%">
                                <span class="bar-value">${this.formatCurrency(this.data.investment)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="chart-bar">
                        <div class="bar-label">Revenue</div>
                        <div class="bar-container">
                            <div class="bar revenue-bar" style="width: ${this.getBarWidth(this.data.revenue)}%">
                                <span class="bar-value">${this.formatCurrency(this.data.revenue)}</span>
                            </div>
                        </div>
                    </div>
                    ${this.results.netProfit > 0 ? `
                    <div class="chart-bar">
                        <div class="bar-label">Net Profit</div>
                        <div class="bar-container">
                            <div class="bar profit-bar" style="width: ${this.getBarWidth(this.results.netProfit)}%">
                                <span class="bar-value">${this.formatCurrency(this.results.netProfit)}</span>
                            </div>
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    generateInsights() {
        const insights = [];

        // ROI insights
        if (this.results.roi > 400) {
            insights.push({
                type: 'success',
                icon: '🚀',
                text: 'Exceptional ROI! Your marketing is performing extremely well.',
                action: 'Consider scaling this successful campaign.'
            });
        } else if (this.results.roi > 100) {
            insights.push({
                type: 'success',
                icon: '✅',
                text: 'Good ROI. Your marketing investment is paying off well.',
                action: 'Look for opportunities to optimize further.'
            });
        } else if (this.results.roi > 0) {
            insights.push({
                type: 'warning',
                icon: '⚠️',
                text: 'Positive but low ROI. There\'s room for improvement.',
                action: 'Analyze which channels are underperforming.'
            });
        } else {
            insights.push({
                type: 'danger',
                icon: '🚨',
                text: 'Negative ROI. Your marketing spend exceeds revenue.',
                action: 'Review and optimize your marketing strategy immediately.'
            });
        }

        // Cost efficiency insights
        if (this.data.leads > 0 && this.results.costPerLead > 0) {
            const industry_avg = 50; // Example industry average
            if (this.results.costPerLead < industry_avg) {
                insights.push({
                    type: 'success',
                    icon: '🎯',
                    text: `Your cost per lead (${this.formatCurrency(this.results.costPerLead)}) is below industry average.`,
                    action: 'Great efficiency! Consider increasing budget to scale.'
                });
            } else {
                insights.push({
                    type: 'info',
                    icon: '📊',
                    text: `Your cost per lead could be optimized. Current: ${this.formatCurrency(this.results.costPerLead)}`,
                    action: 'Focus on higher-converting channels and audiences.'
                });
            }
        }

        // LTV insights
        if (this.data.customerLTV > 0 && this.results.costPerAcquisition > 0) {
            const ltvToCAC = this.data.customerLTV / this.results.costPerAcquisition;
            if (ltvToCAC >= 3) {
                insights.push({
                    type: 'success',
                    icon: '💎',
                    text: 'Excellent LTV to CAC ratio. Your customers are highly valuable.',
                    action: 'Consider increasing customer acquisition investment.'
                });
            } else if (ltvToCAC >= 1) {
                insights.push({
                    type: 'warning',
                    icon: '⚖️',
                    text: 'LTV to CAC ratio is acceptable but could be improved.',
                    action: 'Focus on increasing customer lifetime value.'
                });
            } else {
                insights.push({
                    type: 'danger',
                    icon: '📉',
                    text: 'LTV to CAC ratio is concerning. Acquisition costs too high.',
                    action: 'Reduce acquisition costs or increase customer value.'
                });
            }
        }

        return insights;
    }

    getBarWidth(value) {
        const maxValue = Math.max(this.data.investment, this.data.revenue, this.results.netProfit || 0);
        return maxValue > 0 ? Math.max((value / maxValue) * 100, 5) : 0;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    formatPercentage(value) {
        return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
    }

    formatEfficiencyLevel(level) {
        const levels = {
            'excellent': 'Excellent',
            'very-good': 'Very Good',
            'good': 'Good',
            'fair': 'Fair',
            'poor': 'Poor',
            'losing': 'Losing Money'
        };
        return levels[level] || level;
    }

    addChannel() {
        const channelId = Date.now();
        const channelsContainer = document.getElementById('channelsContainer');
        
        const channelElement = document.createElement('div');
        channelElement.className = 'channel-item';
        channelElement.dataset.channelId = channelId;
        
        channelElement.innerHTML = `
            <div class="channel-header">
                <span class="channel-title">Channel ${this.data.channels.length + 1}</span>
                <button type="button" class="remove-channel-btn" onclick="roiCalculator.removeChannel(${channelId})">×</button>
            </div>
            <div class="channel-inputs">
                <div class="form-group">
                    <label class="form-label">Channel Name</label>
                    <select class="form-select channel-name" onchange="roiCalculator.updateChannel(${channelId})">
                        <option value="">Select channel</option>
                        <option value="google-ads">Google Ads</option>
                        <option value="facebook-ads">Facebook Ads</option>
                        <option value="instagram-ads">Instagram Ads</option>
                        <option value="linkedin-ads">LinkedIn Ads</option>
                        <option value="email-marketing">Email Marketing</option>
                        <option value="content-marketing">Content Marketing</option>
                        <option value="seo">SEO</option>
                        <option value="influencer">Influencer Marketing</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Spend</label>
                    <div class="input-with-currency">
                        <span class="currency-symbol">$</span>
                        <input type="number" class="form-input channel-spend" 
                               placeholder="0" min="0" step="10" 
                               onchange="roiCalculator.updateChannel(${channelId})">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Revenue</label>
                    <div class="input-with-currency">
                        <span class="currency-symbol">$</span>
                        <input type="number" class="form-input channel-revenue" 
                               placeholder="0" min="0" step="10" 
                               onchange="roiCalculator.updateChannel(${channelId})">
                    </div>
                </div>
            </div>
        `;
        
        channelsContainer.appendChild(channelElement);
        
        this.data.channels.push({
            id: channelId,
            name: '',
            spend: 0,
            revenue: 0
        });
    }

    updateChannel(channelId) {
        const channelElement = document.querySelector(`[data-channel-id="${channelId}"]`);
        if (!channelElement) return;

        const channel = this.data.channels.find(c => c.id === channelId);
        if (!channel) return;

        channel.name = channelElement.querySelector('.channel-name').value;
        channel.spend = parseFloat(channelElement.querySelector('.channel-spend').value) || 0;
        channel.revenue = parseFloat(channelElement.querySelector('.channel-revenue').value) || 0;

        this.handleInputChange();
    }

    removeChannel(channelId) {
        this.data.channels = this.data.channels.filter(c => c.id !== channelId);
        const channelElement = document.querySelector(`[data-channel-id="${channelId}"]`);
        if (channelElement) {
            channelElement.remove();
        }
        this.handleInputChange();
    }

    loadSampleData() {
        // Initialize with empty values for production use
        // Users should input their own real data
    }

    resetCalculator() {
        // Clear all inputs
        const inputs = document.querySelectorAll('.roi-calculator-app input, .roi-calculator-app select');
        inputs.forEach(input => {
            input.value = '';
            input.classList.remove('valid', 'invalid');
        });

        // Clear channels
        this.data.channels = [];
        document.getElementById('channelsContainer').innerHTML = '';

        // Reset results
        this.results = {};
        const resultsContent = document.getElementById('resultsContent');
        resultsContent.innerHTML = `
            <div class="results-placeholder">
                <div class="placeholder-icon">📊</div>
                <h4>Enter your data to see results</h4>
                <p>Fill in your marketing investment and revenue details to calculate ROI and view detailed analytics.</p>
            </div>
        `;

        this.disableExportButtons();
    }

    enableExportButtons() {
        document.getElementById('exportBtn').disabled = false;
        document.getElementById('shareBtn').disabled = false;
    }

    disableExportButtons() {
        document.getElementById('exportBtn').disabled = true;
        document.getElementById('shareBtn').disabled = true;
    }

    exportReport() {
        if (!this.results.roi) return;

        const report = this.generateReport();
        const blob = new Blob([report], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `roi-report-${new Date().toISOString().split('T')[0]}.html`;
        a.click();
        URL.revokeObjectURL(url);
    }

    generateReport() {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>Marketing ROI Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 40px; }
        .metric { display: inline-block; margin: 20px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .positive { color: #22c55e; }
        .negative { color: #ef4444; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Marketing ROI Report</h1>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
    </div>
    
    <div class="metrics">
        <div class="metric">
            <h3>ROI</h3>
            <p class="${this.results.isPositive ? 'positive' : 'negative'}">${this.formatPercentage(this.results.roi)}</p>
        </div>
        <div class="metric">
            <h3>Net Profit</h3>
            <p class="${this.results.isProfitable ? 'positive' : 'negative'}">${this.formatCurrency(this.results.netProfit)}</p>
        </div>
        <div class="metric">
            <h3>Profit Margin</h3>
            <p>${this.formatPercentage(this.results.profitMargin)}</p>
        </div>
    </div>
    
    <div class="summary">
        <h3>Summary</h3>
        <p>Investment: ${this.formatCurrency(this.data.investment)}</p>
        <p>Revenue: ${this.formatCurrency(this.data.revenue)}</p>
        <p>Period: ${this.data.period}</p>
        <p>Efficiency Rating: ${this.results.efficiency.level} (${this.results.efficiency.score}/100)</p>
    </div>
</body>
</html>`;
    }

    async shareResults() {
        if (!this.results.roi) return;

        const shareData = {
            title: 'Marketing ROI Results',
            text: `My marketing ROI: ${this.formatPercentage(this.results.roi)} | Net Profit: ${this.formatCurrency(this.results.netProfit)}`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback to clipboard
                await navigator.clipboard.writeText(`${shareData.text} - ${shareData.url}`);
                alert('Results copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    }

    showError(message) {
        // Create temporary error notification using CSS classes
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    showSuccess(message) {
        // Create temporary success notification using CSS classes
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
}

// Make class available globally
window.ROICalculator = ROICalculator;

// Auto-initialize if container exists
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('roiCalculatorApp');
    if (container) {
        window.roiCalculator = new ROICalculator('roiCalculatorApp');
    }
});

// Export for manual initialization
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ROICalculator;
}