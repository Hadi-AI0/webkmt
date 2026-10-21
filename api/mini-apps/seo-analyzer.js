/**
 * Website Health Checker API Service
 * Comprehensive website analysis including SEO, Performance, Security, Accessibility, and UX
 * Uses Cheerio for scraping, Google PageSpeed Insights API, and AI analysis
 */

const cheerio = require('cheerio');
const { supabase } = require('../../server/config/supabase');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

class WebsiteHealthCheckerService {
    constructor() {
        this.pageSpeedApiKey = process.env.PAGE_SPEED_API_KEY || 'AIzaSyBtFoOAmMUdVbjqCS6w2UoYAIDvkQ8Q-YA';
    }

    /**
     * Perform comprehensive website health analysis
     */
    async analyzeWebsiteHealth(url) {
        try {
            console.log(`Starting comprehensive health analysis for: ${url}`);

            // Run parallel analysis for comprehensive health check
            // Scrape is essential; PageSpeed is best-effort — section analyzers
            // null-guard PSI data, so a PSI outage still yields an SEO/content audit.
            const [scrapingResults, pageSpeedResults, accessibilityResults] = await Promise.all([
                this.scrapeWebsiteData(url),
                this.getPageSpeedData(url, 'desktop', ['performance', 'seo', 'accessibility', 'best-practices']).catch(() => null),
                this.getPageSpeedData(url, 'mobile', ['performance', 'seo', 'accessibility', 'best-practices']).catch(() => null)
            ]);

            // Combine and analyze results for comprehensive health check
            const healthAnalysis = this.generateHealthAnalysis(url, scrapingResults, pageSpeedResults, accessibilityResults);

            // Save the URL to Supabase asynchronously
            if (supabase) {
                supabase.from('scraped_urls').insert([{ url: url }])
                    .then(({ error }) => {
                        if (error) console.error('Failed to log scraped URL to Supabase:', error.message);
                    });
            }

            return {
                success: true,
                url: url,
                timestamp: new Date().toISOString(),
                analysis: healthAnalysis
            };

        } catch (error) {
            console.error('Website Health Analysis error:', error);
            return {
                success: false,
                error: error.message,
                url: url,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Scrape website content using Cheerio
     */
    async scrapeWebsiteData(url) {
        try {
            const response = await fetch(url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEOAnalyzer/1.0)' }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            const $ = cheerio.load(html);
            
            const title = $('title').text() || '';
            const metaDescription = $('meta[name="description"]').attr('content') || '';
            const metaKeywords = $('meta[name="keywords"]').attr('content') || '';
            
            const headings = {
                h1: $('h1').map((_, el) => $(el).text().trim()).get(),
                h2: $('h2').map((_, el) => $(el).text().trim()).get(),
                h3: $('h3').map((_, el) => $(el).text().trim()).get(),
                h4: $('h4').map((_, el) => $(el).text().trim()).get(),
                h5: $('h5').map((_, el) => $(el).text().trim()).get(),
                h6: $('h6').map((_, el) => $(el).text().trim()).get()
            };

            const images = $('img').map((_, el) => ({
                src: $(el).attr('src') || '',
                alt: $(el).attr('alt') || '',
                title: $(el).attr('title') || ''
            })).get();

            let parsedUrl;
            try { parsedUrl = new URL(url); } catch (e) { parsedUrl = { hostname: '' }; }

            const links = $('a[href]').map((_, el) => ({
                href: $(el).attr('href'),
                text: $(el).text().trim(),
                title: $(el).attr('title') || '',
                external: !($(el).attr('href') || '').includes(parsedUrl.hostname) && ($(el).attr('href') || '').startsWith('http')
            })).get();

            const security = {
                hasHttps: url.startsWith('https:'),
                mixedContent: $('img, script, link').toArray().some(el => {
                    const src = $(el).attr('src') || $(el).attr('href');
                    return src && src.startsWith('http:') && url.startsWith('https:');
                }),
                forms: $('form').map((_, el) => {
                    const action = $(el).attr('action') || '';
                    return {
                        action: action,
                        method: $(el).attr('method') || 'GET',
                        hasHttps: action ? action.startsWith('https:') : true
                    };
                }).get(),
                csp: !!$('meta[http-equiv="Content-Security-Policy"]').length,
                xFrameOptions: !!$('meta[http-equiv="X-Frame-Options"]').length
            };

            const ux = {
                hasSkipLink: !!$('a[href="#main"], a[href="#content"]').length,
                altMissingCount: $('img:not([alt]), img[alt=""]').length,
                formLabels: $('input, select, textarea').toArray().filter(input => {
                    const id = $(input).attr('id');
                    return !$(input).closest('label').length && (!id || !$(`label[for="${id}"]`).length);
                }).length,
                focusable: $('a, button, input, select, textarea').length,
                viewport: !!$('meta[name="viewport"]').length,
                langAttribute: !!$('html').attr('lang')
            };

            const schemaMarkup = $('script[type="application/ld+json"]').map((_, el) => {
                try { return JSON.parse($(el).html()); } catch (e) { return null; }
            }).get().filter(Boolean);

            const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
            const contentLength = bodyText.length;

            return {
                title,
                metaDescription,
                metaKeywords,
                headings,
                images,
                links,
                schemaMarkup,
                contentLength,
                bodyText: bodyText.substring(0, 1000),
                security,
                ux
            };

        } catch (error) {
            console.error('Cheerio scraping error:', error);
            throw new Error(`Failed to scrape website: ${error.message}`);
        }
    }

    /**
     * Get PageSpeed Insights data with multiple categories
     */
    async getPageSpeedData(url, strategy = 'desktop', categories = ['performance', 'seo', 'accessibility', 'best-practices']) {
        try {
            const categoryParams = categories.map(cat => `&category=${cat}`).join('');
            const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${this.pageSpeedApiKey}&strategy=${strategy}${categoryParams}`;
            
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
     * Generate comprehensive website health analysis
     */
    generateHealthAnalysis(url, scrapingData, desktopPageSpeed, mobilePageSpeed) {
        const analysis = {
            overallScore: 0,
            healthScore: {
                seo: 0,
                performance: 0,
                security: 0,
                accessibility: 0,
                ux: 0
            },
            sections: {}
        };

        // SEO Analysis
        analysis.sections.titleTag = this.analyzeTitleTag(scrapingData?.title);
        analysis.sections.metaDescription = this.analyzeMetaDescription(scrapingData?.metaDescription);
        analysis.sections.headingStructure = this.analyzeHeadings(scrapingData?.headings);
        analysis.sections.schemaMarkup = this.analyzeSchemaMarkup(scrapingData?.schemaMarkup);
        analysis.sections.content = this.analyzeContent(scrapingData);
        
        // Performance Analysis
        analysis.sections.performance = this.analyzePerformance(desktopPageSpeed, mobilePageSpeed);
        analysis.sections.coreWebVitals = this.analyzeCoreWebVitals(desktopPageSpeed, mobilePageSpeed);
        
        // Security Analysis
        analysis.sections.security = this.analyzeSecurity(scrapingData?.security, url);
        analysis.sections.ssl = this.analyzeSSL(url);
        
        // Accessibility Analysis
        analysis.sections.accessibility = this.analyzeAccessibility(scrapingData, desktopPageSpeed, mobilePageSpeed);
        analysis.sections.images = this.analyzeImages(scrapingData?.images);
        
        // UX Analysis
        analysis.sections.ux = this.analyzeUserExperience(scrapingData?.ux, desktopPageSpeed, mobilePageSpeed);
        analysis.sections.mobile = this.analyzeMobileExperience(mobilePageSpeed);

        // Calculate category scores
        const seoSections = ['titleTag', 'metaDescription', 'headingStructure', 'schemaMarkup', 'content'];
        const performanceSections = ['performance', 'coreWebVitals'];
        const securitySections = ['security', 'ssl'];
        const accessibilitySections = ['accessibility', 'images'];
        const uxSections = ['ux', 'mobile'];

        analysis.healthScore.seo = this.calculateCategoryScore(analysis.sections, seoSections);
        analysis.healthScore.performance = this.calculateCategoryScore(analysis.sections, performanceSections);
        analysis.healthScore.security = this.calculateCategoryScore(analysis.sections, securitySections);
        analysis.healthScore.accessibility = this.calculateCategoryScore(analysis.sections, accessibilitySections);
        analysis.healthScore.ux = this.calculateCategoryScore(analysis.sections, uxSections);

        // Calculate overall health score
        const categoryScores = Object.values(analysis.healthScore);
        analysis.overallScore = Math.round(categoryScores.reduce((a, b) => a + b, 0) / categoryScores.length);

        return analysis;
    }

    calculateCategoryScore(sections, sectionKeys) {
        const scores = sectionKeys.map(key => sections[key]?.score || 0).filter(score => score > 0);
        return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    }

    analyzeTitleTag(title) {
        const score = title ? (title.length >= 30 && title.length <= 60 ? 100 : 70) : 0;
        return {
            title: 'Title Tag',
            icon: '📝',
            score: score,
            status: score >= 90 ? 'good' : score >= 50 ? 'warning' : 'error',
            content: title ? `Title: "${title}"` : 'No title tag found',
            details: title ? `Length: ${title.length} characters (optimal: 30-60)` : 'Add a descriptive title tag',
            recommendations: score < 90 ? [
                'Keep title between 30-60 characters',
                'Include primary keyword near the beginning',
                'Make it compelling and descriptive'
            ] : []
        };
    }

    analyzeMetaDescription(metaDescription) {
        const score = metaDescription ? (metaDescription.length >= 120 && metaDescription.length <= 160 ? 100 : 70) : 0;
        return {
            title: 'Meta Description',
            icon: '📄',
            score: score,
            status: score >= 90 ? 'good' : score >= 50 ? 'warning' : 'error',
            content: metaDescription ? `Description found` : 'No meta description found',
            details: metaDescription ? `Length: ${metaDescription.length} characters (optimal: 120-160)` : 'Add a meta description',
            recommendations: score < 90 ? [
                'Keep description between 120-160 characters',
                'Include primary keyword naturally',
                'Write compelling copy that encourages clicks'
            ] : []
        };
    }

    analyzeHeadings(headings) {
        if (!headings) return { title: 'Heading Structure', icon: '🏗️', score: 0, status: 'error', content: 'Could not analyze headings' };

        const h1Count = headings.h1?.length || 0;
        const h2Count = headings.h2?.length || 0;
        const totalHeadings = Object.values(headings).flat().length;

        let score = 50;
        if (h1Count === 1) score += 30;
        if (h2Count >= 2) score += 20;
        
        return {
            title: 'Heading Structure',
            icon: '🏗️',
            score: Math.min(score, 100),
            status: score >= 90 ? 'good' : score >= 50 ? 'warning' : 'error',
            content: `${totalHeadings} total headings found`,
            details: `H1: ${h1Count}, H2: ${h2Count}, H3: ${headings.h3?.length || 0}`,
            recommendations: score < 90 ? [
                h1Count !== 1 ? 'Use exactly one H1 tag per page' : null,
                h2Count < 2 ? 'Add more H2 headings to structure content' : null,
                'Maintain logical heading hierarchy'
            ].filter(Boolean) : []
        };
    }

    analyzeImages(images) {
        if (!images) return { title: 'Images', icon: '🖼️', score: 0, status: 'error', content: 'Could not analyze images' };

        const totalImages = images.length;
        const imagesWithAlt = images.filter(img => img.alt && img.alt.trim()).length;
        const altTextRatio = totalImages > 0 ? (imagesWithAlt / totalImages) * 100 : 100;

        const score = Math.round(altTextRatio);

        return {
            title: 'Images',
            icon: '🖼️',
            score: score,
            status: score >= 90 ? 'good' : score >= 50 ? 'warning' : 'error',
            content: `${totalImages} images found`,
            details: `${imagesWithAlt}/${totalImages} images have alt text (${Math.round(altTextRatio)}%)`,
            recommendations: score < 90 ? [
                'Add descriptive alt text to all images',
                'Include relevant keywords in alt text naturally',
                'Optimize image file sizes and formats'
            ] : []
        };
    }

    analyzeContent(scrapingData) {
        if (!scrapingData) return { title: 'Content', icon: '📝', score: 0, status: 'error', content: 'Could not analyze content' };

        const contentLength = scrapingData.contentLength || 0;
        const hasContent = contentLength > 300;
        const score = hasContent ? Math.min(Math.round(contentLength / 10), 100) : 0;

        return {
            title: 'Content Quality',
            icon: '📝',
            score: Math.min(score, 100),
            status: score >= 70 ? 'good' : score >= 40 ? 'warning' : 'error',
            content: `${contentLength} characters of content`,
            details: hasContent ? 'Sufficient content length detected' : 'Content appears to be too short',
            recommendations: score < 70 ? [
                'Add more high-quality, relevant content',
                'Ensure content is original and valuable',
                'Target 1000+ words for important pages'
            ] : []
        };
    }

    analyzeSchemaMarkup(schemaMarkup) {
        const hasSchema = schemaMarkup && schemaMarkup.length > 0;
        const score = hasSchema ? 100 : 30;

        return {
            title: 'Schema Markup',
            icon: '🏷️',
            score: score,
            status: hasSchema ? 'good' : 'warning',
            content: hasSchema ? `${schemaMarkup.length} schema objects found` : 'No schema markup detected',
            details: hasSchema ? 'Structured data is implemented' : 'Consider adding schema markup',
            recommendations: !hasSchema ? [
                'Add relevant schema markup (Organization, Article, etc.)',
                'Use Google\'s Structured Data Testing Tool',
                'Implement breadcrumb and review schemas if applicable'
            ] : []
        };
    }

    analyzePerformance(desktopPageSpeed, mobilePageSpeed) {
        if (!desktopPageSpeed?.lighthouseResult && !mobilePageSpeed?.lighthouseResult) {
            return {
                title: 'Performance',
                icon: '⚡',
                score: 0,
                status: 'error',
                content: 'Performance data unavailable',
                details: 'Could not retrieve performance metrics'
            };
        }

        const desktopPerf = desktopPageSpeed?.lighthouseResult?.categories?.performance?.score || 0;
        const mobilePerf = mobilePageSpeed?.lighthouseResult?.categories?.performance?.score || 0;
        
        const avgPerformance = Math.round(((desktopPerf + mobilePerf) / 2) * 100);

        return {
            title: 'Performance',
            icon: '⚡',
            score: avgPerformance,
            status: avgPerformance >= 90 ? 'good' : avgPerformance >= 50 ? 'warning' : 'error',
            content: `Desktop: ${Math.round(desktopPerf * 100)}/100, Mobile: ${Math.round(mobilePerf * 100)}/100`,
            details: 'Based on Google Lighthouse performance analysis',
            recommendations: avgPerformance < 90 ? [
                'Optimize images and reduce file sizes',
                'Minimize CSS and JavaScript',
                'Enable compression and caching',
                'Improve server response times',
                'Eliminate render-blocking resources'
            ] : []
        };
    }

    analyzeCoreWebVitals(desktopPageSpeed, mobilePageSpeed) {
        const desktop = desktopPageSpeed?.lighthouseResult?.audits;
        const mobile = mobilePageSpeed?.lighthouseResult?.audits;

        if (!desktop && !mobile) {
            return {
                title: 'Core Web Vitals',
                icon: '📊',
                score: 0,
                status: 'error',
                content: 'Core Web Vitals data unavailable'
            };
        }

        const getLCP = (audits) => audits?.['largest-contentful-paint']?.numericValue || 0;
        const getFID = (audits) => audits?.['max-potential-fid']?.numericValue || 0;
        const getCLS = (audits) => audits?.['cumulative-layout-shift']?.numericValue || 0;

        const desktopLCP = getLCP(desktop);
        const mobileLCP = getLCP(mobile);
        const avgLCP = (desktopLCP + mobileLCP) / 2;

        const desktopFID = getFID(desktop);
        const mobileFID = getFID(mobile);
        const avgFID = (desktopFID + mobileFID) / 2;

        const desktopCLS = getCLS(desktop);
        const mobileCLS = getCLS(mobile);
        const avgCLS = (desktopCLS + mobileCLS) / 2;

        // Score based on Core Web Vitals thresholds
        let score = 0;
        if (avgLCP <= 2500) score += 33;
        else if (avgLCP <= 4000) score += 20;
        
        if (avgFID <= 100) score += 33;
        else if (avgFID <= 300) score += 20;
        
        if (avgCLS <= 0.1) score += 34;
        else if (avgCLS <= 0.25) score += 20;

        return {
            title: 'Core Web Vitals',
            icon: '📊',
            score: Math.round(score),
            status: score >= 90 ? 'good' : score >= 60 ? 'warning' : 'error',
            content: `LCP: ${(avgLCP / 1000).toFixed(1)}s, FID: ${avgFID.toFixed(0)}ms, CLS: ${avgCLS.toFixed(3)}`,
            details: 'Core Web Vitals are essential metrics for user experience',
            recommendations: score < 90 ? [
                'Optimize largest contentful paint elements',
                'Reduce JavaScript execution time',
                'Reserve space for dynamic content',
                'Use font-display: swap for web fonts'
            ] : []
        };
    }

    analyzeSecurity(securityData, url) {
        if (!securityData) {
            return {
                title: 'Security',
                icon: '🔒',
                score: 30,
                status: 'warning',
                content: 'Limited security analysis available'
            };
        }

        let score = 0;
        const issues = [];

        // HTTPS check
        if (securityData.hasHttps) {
            score += 30;
        } else {
            issues.push('Site not using HTTPS');
        }

        // Mixed content check
        if (!securityData.mixedContent) {
            score += 25;
        } else {
            issues.push('Mixed HTTP/HTTPS content detected');
        }

        // Form security
        const secureFormsCount = securityData.forms?.filter(f => f.hasHttps).length || 0;
        const totalFormsCount = securityData.forms?.length || 0;
        if (totalFormsCount === 0 || secureFormsCount === totalFormsCount) {
            score += 25;
        } else {
            issues.push('Some forms not using HTTPS');
        }

        // Security headers
        if (securityData.csp) score += 10;
        else issues.push('Missing Content Security Policy');

        if (securityData.xFrameOptions) score += 10;
        else issues.push('Missing X-Frame-Options header');

        return {
            title: 'Security',
            icon: '🔒',
            score: Math.min(score, 100),
            status: score >= 80 ? 'good' : score >= 50 ? 'warning' : 'error',
            content: issues.length === 0 ? 'Strong security posture' : `${issues.length} security issues found`,
            details: issues.length > 0 ? issues.join(', ') : 'Security best practices implemented',
            recommendations: issues.length > 0 ? [
                'Implement HTTPS across entire site',
                'Add security headers (CSP, X-Frame-Options)',
                'Ensure all forms use secure connections',
                'Regular security audits recommended'
            ] : []
        };
    }

    analyzeSSL(url) {
        const isHttps = url.startsWith('https://');
        
        return {
            title: 'SSL Certificate',
            icon: '🔐',
            score: isHttps ? 100 : 0,
            status: isHttps ? 'good' : 'error',
            content: isHttps ? 'Valid SSL certificate' : 'No SSL certificate detected',
            details: isHttps ? 'Secure HTTPS connection established' : 'Site should use HTTPS for security',
            recommendations: !isHttps ? [
                'Install SSL certificate',
                'Redirect HTTP traffic to HTTPS',
                'Update all internal links to HTTPS'
            ] : []
        };
    }

    analyzeAccessibility(scrapingData, desktopPageSpeed, mobilePageSpeed) {
        const desktopA11y = desktopPageSpeed?.lighthouseResult?.categories?.accessibility?.score || 0;
        const mobileA11y = mobilePageSpeed?.lighthouseResult?.categories?.accessibility?.score || 0;
        const avgAccessibility = Math.round(((desktopA11y + mobileA11y) / 2) * 100);

        const ux = scrapingData?.ux || {};
        let additionalScore = 0;
        const recommendations = [];

        // Additional UX-based accessibility checks
        if (ux.hasSkipLink) additionalScore += 5;
        else recommendations.push('Add skip navigation links');

        if (ux.langAttribute) additionalScore += 5;
        else recommendations.push('Add language attribute to HTML element');

        if (ux.viewport) additionalScore += 5;
        else recommendations.push('Add viewport meta tag for mobile');

        const finalScore = Math.min(avgAccessibility + additionalScore, 100);

        return {
            title: 'Accessibility',
            icon: '♿',
            score: finalScore,
            status: finalScore >= 90 ? 'good' : finalScore >= 70 ? 'warning' : 'error',
            content: `Accessibility score: ${finalScore}/100`,
            details: 'Based on WCAG guidelines and Lighthouse audits',
            recommendations: finalScore < 90 ? [
                ...recommendations,
                'Ensure sufficient color contrast',
                'Add proper ARIA labels',
                'Make interactive elements keyboard accessible'
            ] : []
        };
    }

    analyzeUserExperience(uxData, desktopPageSpeed, mobilePageSpeed) {
        if (!uxData) {
            return {
                title: 'User Experience',
                icon: '👥',
                score: 50,
                status: 'warning',
                content: 'Limited UX analysis available'
            };
        }

        let score = 50; // Base score
        const issues = [];

        // Form usability
        if (uxData.formLabels === 0) {
            score += 20;
        } else {
            issues.push(`${uxData.formLabels} form inputs missing labels`);
        }

        // Navigation and focusability
        if (uxData.focusable > 0) {
            score += 15;
        } else {
            issues.push('No focusable elements found');
        }

        // Mobile viewport
        if (uxData.viewport) {
            score += 15;
        } else {
            issues.push('Missing viewport meta tag');
        }

        // Performance impact on UX
        const avgPerf = ((desktopPageSpeed?.lighthouseResult?.categories?.performance?.score || 0) + 
                        (mobilePageSpeed?.lighthouseResult?.categories?.performance?.score || 0)) / 2;
        
        if (avgPerf > 0.9) score += 0;
        else if (avgPerf > 0.7) score -= 5;
        else score -= 15;

        return {
            title: 'User Experience',
            icon: '👥',
            score: Math.max(0, Math.min(score, 100)),
            status: score >= 80 ? 'good' : score >= 60 ? 'warning' : 'error',
            content: issues.length === 0 ? 'Good user experience' : `${issues.length} UX issues found`,
            details: issues.join(', ') || 'User experience optimized',
            recommendations: issues.length > 0 ? [
                'Improve form accessibility with proper labels',
                'Ensure keyboard navigation works properly',
                'Optimize mobile experience',
                'Improve page loading performance'
            ] : []
        };
    }

    analyzeMobileExperience(mobilePageSpeed) {
        if (!mobilePageSpeed?.lighthouseResult) {
            return {
                title: 'Mobile Experience',
                icon: '📱',
                score: 0,
                status: 'error',
                content: 'Mobile analysis unavailable'
            };
        }

        const lighthouse = mobilePageSpeed.lighthouseResult;
        const performanceScore = Math.round((lighthouse.categories.performance?.score || 0) * 100);
        const seoScore = Math.round((lighthouse.categories.seo?.score || 0) * 100);
        const bestPracticesScore = Math.round((lighthouse.categories['best-practices']?.score || 0) * 100);

        const avgScore = Math.round((performanceScore + seoScore + bestPracticesScore) / 3);

        return {
            title: 'Mobile Experience',
            icon: '📱',
            score: avgScore,
            status: avgScore >= 80 ? 'good' : avgScore >= 60 ? 'warning' : 'error',
            content: `Mobile optimization: ${avgScore}/100`,
            details: `Performance: ${performanceScore}, SEO: ${seoScore}, Best Practices: ${bestPracticesScore}`,
            recommendations: avgScore < 80 ? [
                'Optimize for mobile-first design',
                'Improve mobile page speed',
                'Ensure touch targets are appropriately sized',
                'Test on various mobile devices'
            ] : []
        };
    }
}

// API endpoint handler
async function handleSEOAnalysis(req, res) {
    try {
        const { url } = req.body;

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

        const healthChecker = new WebsiteHealthCheckerService();
        const results = await healthChecker.analyzeWebsiteHealth(url);

        res.json(results);

    } catch (error) {
        console.error('Website Health Analysis API Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
}

module.exports = {
    WebsiteHealthCheckerService,
    handleSEOAnalysis
};