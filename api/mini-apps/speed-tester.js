/**
 * Speed Tester API Service
 * Uses Google PageSpeed Insights API for comprehensive performance analysis
 */

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

class SpeedTesterService {
    constructor() {
        this.pageSpeedApiKey = process.env.PAGE_SPEED_API_KEY || '';
    }

    /**
     * Perform comprehensive speed test
     */
    async testWebsiteSpeed(url, strategy = 'desktop', categories = ['performance']) {
        try {
            console.log(`Starting speed test for: ${url} (${strategy})`);

            // Get PageSpeed data for both mobile and desktop if not specified
            const strategies = strategy === 'both' ? ['mobile', 'desktop'] : [strategy];
            const results = {};

            for (const currentStrategy of strategies) {
                const pageSpeedData = await this.getPageSpeedData(url, currentStrategy, categories);
                results[currentStrategy] = this.processPageSpeedResults(url, pageSpeedData, currentStrategy);
            }

            return {
                success: true,
                url: url,
                timestamp: new Date().toISOString(),
                results: strategy === 'both' ? results : results[strategy]
            };

        } catch (error) {
            console.error('Speed Test error:', error);
            return {
                success: false,
                error: error.message,
                url: url,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Get PageSpeed Insights data
     */
    async getPageSpeedData(url, strategy = 'desktop', categories = ['performance']) {
        try {
            const categoryParams = categories.map(cat => `&category=${cat}`).join('');
            const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}${this.pageSpeedApiKey ? '&key=' + this.pageSpeedApiKey : ''}&strategy=${strategy}${categoryParams}`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(`PageSpeed API error: ${data.error?.message || 'Unknown error'}`);
            }

            return data;

        } catch (error) {
            console.error('PageSpeed API error:', error);
            throw new Error(`Failed to get PageSpeed data: ${error.message}`);
        }
    }

    /**
     * Process and format PageSpeed results
     */
    processPageSpeedResults(url, pageSpeedData, strategy) {
        const lighthouse = pageSpeedData.lighthouseResult;
        const loadingExperience = pageSpeedData.loadingExperience;
        
        if (!lighthouse) {
            throw new Error('No Lighthouse data available');
        }

        // Extract Core Web Vitals
        const metrics = this.extractCoreWebVitals(lighthouse);
        
        // Extract performance score
        const performanceScore = Math.round((lighthouse.categories.performance?.score || 0) * 100);
        
        // Extract opportunities and diagnostics
        const opportunities = this.extractOpportunities(lighthouse);
        const diagnostics = this.extractDiagnostics(lighthouse);
        
        // Extract field data if available
        const fieldData = this.extractFieldData(loadingExperience);

        return {
            url: url,
            strategy: strategy,
            timestamp: new Date().toISOString(),
            overallScore: performanceScore,
            metrics: metrics,
            fieldData: fieldData,
            opportunities: opportunities,
            diagnostics: diagnostics,
            categories: this.extractCategoryScores(lighthouse.categories)
        };
    }

    /**
     * Extract Core Web Vitals metrics
     */
    extractCoreWebVitals(lighthouse) {
        const audits = lighthouse.audits;
        
        const metrics = {
            // Core Web Vitals
            lcp: this.formatMetric(audits['largest-contentful-paint'], 'Largest Contentful Paint', 's', '⏱️', [2.5, 4.0]),
            fid: this.formatMetric(audits['max-potential-fid'], 'Max Potential First Input Delay', 'ms', '👆', [100, 300]),
            cls: this.formatMetric(audits['cumulative-layout-shift'], 'Cumulative Layout Shift', '', '📐', [0.1, 0.25]),
            
            // Other important metrics
            fcp: this.formatMetric(audits['first-contentful-paint'], 'First Contentful Paint', 's', '🎨', [1.8, 3.0]),
            si: this.formatMetric(audits['speed-index'], 'Speed Index', 's', '📊', [3.4, 5.8]),
            tbt: this.formatMetric(audits['total-blocking-time'], 'Total Blocking Time', 'ms', '⏳', [200, 600]),
            tti: this.formatMetric(audits['interactive'], 'Time to Interactive', 's', '🖱️', [3.8, 7.3])
        };

        return metrics;
    }

    /**
     * Format individual metric data
     */
    formatMetric(audit, name, unit, icon, thresholds) {
        if (!audit || audit.score === null) {
            return {
                name: name,
                value: 'N/A',
                numericValue: 0,
                score: 0,
                status: 'error',
                icon: icon
            };
        }

        const numericValue = audit.numericValue;
        const displayValue = audit.displayValue || `${numericValue}${unit}`;
        const score = Math.round(audit.score * 100);
        
        let status = 'good';
        if (thresholds && thresholds.length === 2) {
            if (numericValue > thresholds[1]) {
                status = 'error';
            } else if (numericValue > thresholds[0]) {
                status = 'warning';
            }
        }

        return {
            name: name,
            value: displayValue,
            numericValue: numericValue,
            score: score,
            status: status,
            icon: icon,
            description: audit.description
        };
    }

    /**
     * Extract optimization opportunities
     */
    extractOpportunities(lighthouse) {
        const opportunities = [];
        const opportunityAudits = [
            'render-blocking-resources',
            'unused-css-rules',
            'unused-javascript',
            'modern-image-formats',
            'offscreen-images',
            'unminified-css',
            'unminified-javascript',
            'efficient-animated-content',
            'duplicated-javascript',
            'legacy-javascript'
        ];

        opportunityAudits.forEach(auditId => {
            const audit = lighthouse.audits[auditId];
            if (audit && audit.details && audit.details.overallSavingsMs > 50) {
                opportunities.push({
                    title: audit.title,
                    description: audit.description,
                    savings: audit.displayValue || `${Math.round(audit.details.overallSavingsMs / 1000)}s`,
                    score: Math.round(audit.score * 100)
                });
            }
        });

        return opportunities.slice(0, 5); // Return top 5 opportunities
    }

    /**
     * Extract diagnostic information
     */
    extractDiagnostics(lighthouse) {
        const diagnostics = [];
        const diagnosticAudits = [
            'uses-long-cache-ttl',
            'dom-size',
            'critical-request-chains',
            'user-timings',
            'bootup-time',
            'mainthread-work-breakdown',
            'font-display',
            'third-party-summary'
        ];

        diagnosticAudits.forEach(auditId => {
            const audit = lighthouse.audits[auditId];
            if (audit && audit.score !== null && audit.score < 1) {
                diagnostics.push({
                    title: audit.title,
                    description: audit.description,
                    displayValue: audit.displayValue,
                    score: Math.round(audit.score * 100)
                });
            }
        });

        return diagnostics.slice(0, 5); // Return top 5 diagnostics
    }

    /**
     * Extract field data from Chrome User Experience Report
     */
    extractFieldData(loadingExperience) {
        if (!loadingExperience || !loadingExperience.metrics) {
            return null;
        }

        const fieldMetrics = {};
        const metrics = loadingExperience.metrics;

        // Map field data metrics
        Object.keys(metrics).forEach(metricKey => {
            const metric = metrics[metricKey];
            fieldMetrics[metricKey] = {
                percentile: metric.percentile,
                distributions: metric.distributions,
                category: metric.category
            };
        });

        return {
            id: loadingExperience.id,
            metrics: fieldMetrics,
            overallCategory: loadingExperience.overall_category,
            initialUrl: loadingExperience.initial_url
        };
    }

    /**
     * Extract category scores
     */
    extractCategoryScores(categories) {
        const scores = {};
        
        Object.keys(categories).forEach(categoryKey => {
            const category = categories[categoryKey];
            scores[categoryKey] = {
                score: Math.round(category.score * 100),
                title: category.title
            };
        });

        return scores;
    }

    /**
     * Generate optimization recommendations based on results
     */
    generateRecommendations(results) {
        const recommendations = [];
        const metrics = results.metrics;

        // LCP recommendations
        if (metrics.lcp && metrics.lcp.status !== 'good') {
            recommendations.push({
                metric: 'LCP',
                title: 'Improve Largest Contentful Paint',
                suggestions: [
                    'Optimize and compress images',
                    'Upgrade web hosting or CDN',
                    'Remove render-blocking JavaScript and CSS',
                    'Improve server response time'
                ]
            });
        }

        // FID recommendations
        if (metrics.fid && metrics.fid.status !== 'good') {
            recommendations.push({
                metric: 'FID',
                title: 'Improve First Input Delay',
                suggestions: [
                    'Minimize JavaScript execution time',
                    'Break up long-running tasks',
                    'Use web workers for heavy processing',
                    'Reduce JavaScript bundle sizes'
                ]
            });
        }

        // CLS recommendations
        if (metrics.cls && metrics.cls.status !== 'good') {
            recommendations.push({
                metric: 'CLS',
                title: 'Improve Cumulative Layout Shift',
                suggestions: [
                    'Add size attributes to images and videos',
                    'Reserve space for ads and embeds',
                    'Use font-display: swap for web fonts',
                    'Avoid inserting content above existing content'
                ]
            });
        }

        return recommendations;
    }
}

// API endpoint handler
async function handleSpeedTest(req, res) {
    try {
        const { url, strategy = 'desktop', categories = ['performance'] } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                error: 'URL parameter is required'
            });
        }

        // Validate URL format
        try {
            new URL(url);
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: 'Invalid URL format'
            });
        }

        const speedTester = new SpeedTesterService();
        const results = await speedTester.testWebsiteSpeed(url, strategy, categories);

        // Add recommendations if successful
        if (results.success && results.results) {
            if (strategy === 'both') {
                results.results.desktop.recommendations = speedTester.generateRecommendations(results.results.desktop);
                results.results.mobile.recommendations = speedTester.generateRecommendations(results.results.mobile);
            } else {
                results.results.recommendations = speedTester.generateRecommendations(results.results);
            }
        }

        res.json(results);

    } catch (error) {
        console.error('Speed Test API Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
}

module.exports = {
    SpeedTesterService,
    handleSpeedTest
};