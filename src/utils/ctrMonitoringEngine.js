// CTR Monitoring Engine - Track Click-Through Rates by Cluster
// Monitor blog performance and optimize high-performing clusters

export class CTRMonitoringEngine {
  constructor() {
    this.clusterMetrics = {
      'e-waste-basics': {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        conversionRate: 0,
        lastUpdated: null,
        performance: 'unknown'
      },
      'data-security': {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        conversionRate: 0,
        lastUpdated: null,
        performance: 'unknown'
      },
      'buyback-pricing': {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        conversionRate: 0,
        lastUpdated: null,
        performance: 'unknown'
      },
      'location-specific': {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        conversionRate: 0,
        lastUpdated: null,
        performance: 'unknown'
      },
      'compliance-legal': {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        conversionRate: 0,
        lastUpdated: null,
        performance: 'unknown'
      }
    };

    this.thresholds = {
      highCTR: 5.0,      // 5% CTR is considered high
      lowCTR: 1.0,       // 1% CTR is considered low
      highConversionRate: 3.0,  // 3% conversion rate is high
      lowConversionRate: 0.5,  // 0.5% conversion rate is low
      minImpressions: 100,  // Minimum impressions for reliable metrics
      analysisPeriod: 60 * 24 * 60 * 60 * 1000 // 60 days in milliseconds
    };
  }

  // Track page impression
  trackImpression(clusterName, postId, userId = null) {
    const cluster = this.clusterMetrics[clusterName];
    if (!cluster) return;

    cluster.impressions++;
    cluster.lastUpdated = new Date().toISOString();

    // Store detailed impression data
    this.storeInteraction('impression', {
      clusterName,
      postId,
      userId,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server'
    });
  }

  // Track CTA click
  trackClick(clusterName, postId, ctaType, userId = null) {
    const cluster = this.clusterMetrics[clusterName];
    if (!cluster) return;

    cluster.clicks++;
    cluster.lastUpdated = new Date().toISOString();

    // Calculate new CTR
    cluster.ctr = cluster.impressions > 0 ? (cluster.clicks / cluster.impressions) * 100 : 0;

    // Store detailed click data
    this.storeInteraction('click', {
      clusterName,
      postId,
      ctaType,
      userId,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server'
    });
  }

  // Track conversion
  trackConversion(clusterName, postId, conversionType, value = 0, userId = null) {
    const cluster = this.clusterMetrics[clusterName];
    if (!cluster) return;

    cluster.conversions++;
    cluster.lastUpdated = new Date().toISOString();

    // Calculate new conversion rate
    cluster.conversionRate = cluster.clicks > 0 ? (cluster.conversions / cluster.clicks) * 100 : 0;

    // Store detailed conversion data
    this.storeInteraction('conversion', {
      clusterName,
      postId,
      conversionType,
      value,
      userId,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server'
    });
  }

  // Store interaction data
  storeInteraction(type, data) {
    const key = `ctr_interactions_${type}`;
    const existing = this.getStoredData(key);
    existing.push(data);
    
    // Keep only last 1000 interactions per type to manage storage
    if (existing.length > 1000) {
      existing.splice(0, existing.length - 1000);
    }
    
    this.setStoredData(key, existing);
  }

  // Get stored data from localStorage
  getStoredData(key) {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
      } catch (error) {
        console.error('Error reading stored data:', error);
        return [];
      }
    }
    return [];
  }

  // Set stored data in localStorage
  setStoredData(key, data) {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error('Error storing data:', error);
      }
    }
  }

  // Calculate cluster performance
  calculateClusterPerformance() {
    const results = {};

    for (const [clusterName, metrics] of Object.entries(this.clusterMetrics)) {
      // Skip clusters with insufficient data
      if (metrics.impressions < this.thresholds.minImpressions) {
        metrics.performance = 'insufficient_data';
        results[clusterName] = { ...metrics, recommendation: 'Gather more data' };
        continue;
      }

      // Determine performance based on CTR and conversion rate
      let performance = 'average';
      let recommendations = [];

      if (metrics.ctr >= this.thresholds.highCTR) {
        performance = 'excellent';
        recommendations.push('High CTR indicates strong interest - consider expanding this cluster');
      } else if (metrics.ctr <= this.thresholds.lowCTR) {
        performance = 'poor';
        recommendations.push('Low CTR - improve titles, meta descriptions, and content quality');
      }

      if (metrics.conversionRate >= this.thresholds.highConversionRate) {
        if (performance === 'excellent') performance = 'outstanding';
        recommendations.push('High conversion rate - optimize and scale this cluster');
      } else if (metrics.conversionRate <= this.thresholds.lowConversionRate) {
        if (performance === 'poor') performance = 'critical';
        recommendations.push('Low conversion rate - review CTAs, user experience, and offer relevance');
      }

      metrics.performance = performance;
      results[clusterName] = {
        ...metrics,
        recommendations
      };
    }

    return results;
  }

  // Generate performance report
  generatePerformanceReport() {
    const performance = this.calculateClusterPerformance();
    const report = {
      generatedAt: new Date().toISOString(),
      analysisPeriod: this.thresholds.analysisPeriod / (24 * 60 * 60 * 1000), // days
      clusters: performance,
      summary: {
        totalImpressions: 0,
        totalClicks: 0,
        totalConversions: 0,
        averageCTR: 0,
        averageConversionRate: 0,
        topPerformingCluster: null,
        worstPerformingCluster: null
      },
      recommendations: []
    };

    // Calculate summary metrics
    let topCTR = 0;
    let worstCTR = 100;
    let topConversionRate = 0;
    let worstConversionRate = 100;

    for (const [clusterName, metrics] of Object.entries(performance)) {
      report.summary.totalImpressions += metrics.impressions;
      report.summary.totalClicks += metrics.clicks;
      report.summary.totalConversions += metrics.conversions;

      if (metrics.ctr > topCTR) {
        topCTR = metrics.ctr;
        report.summary.topPerformingCluster = clusterName;
      }
      if (metrics.ctr < worstCTR && metrics.impressions >= this.thresholds.minImpressions) {
        worstCTR = metrics.ctr;
        report.summary.worstPerformingCluster = clusterName;
      }
      if (metrics.conversionRate > topConversionRate) {
        topConversionRate = metrics.conversionRate;
      }
      if (metrics.conversionRate < worstConversionRate && metrics.clicks > 0) {
        worstConversionRate = metrics.conversionRate;
      }
    }

    // Calculate averages
    report.summary.averageCTR = report.summary.totalImpressions > 0 
      ? (report.summary.totalClicks / report.summary.totalImpressions) * 100 
      : 0;
    report.summary.averageConversionRate = report.summary.totalClicks > 0 
      ? (report.summary.totalConversions / report.summary.totalClicks) * 100 
      : 0;

    // Generate overall recommendations
    if (report.summary.topPerformingCluster) {
      const topCluster = performance[report.summary.topPerformingCluster];
      report.recommendations.push({
        type: 'scale_up',
        cluster: report.summary.topPerformingCluster,
        message: `Scale up ${report.summary.topPerformingCluster} cluster - ${topCluster.ctr.toFixed(1)}% CTR, ${topCluster.conversionRate.toFixed(1)}% conversion rate`,
        priority: 'high'
      });
    }

    if (report.summary.worstPerformingCluster) {
      const worstCluster = performance[report.summary.worstPerformingCluster];
      report.recommendations.push({
        type: 'optimize_or_pause',
        cluster: report.summary.worstPerformingCluster,
        message: `Optimize or pause ${report.summary.worstPerformingCluster} cluster - ${worstCluster.ctr.toFixed(1)}% CTR, ${worstCluster.conversionRate.toFixed(1)}% conversion rate`,
        priority: 'medium'
      });
    }

    return report;
  }

  // Get optimization suggestions for a specific cluster
  getClusterOptimizations(clusterName) {
    const cluster = this.clusterMetrics[clusterName];
    if (!cluster) {
      return { error: 'Cluster not found' };
    }

    const optimizations = [];

    // CTR optimizations
    if (cluster.ctr < this.thresholds.lowCTR) {
      optimizations.push({
        type: 'ctr',
        priority: 'high',
        suggestions: [
          'Improve blog titles with more compelling language',
          'Enhance meta descriptions with clear value propositions',
          'Add more engaging introduction paragraphs',
          'Include numbers and statistics in titles',
          'Use emotional triggers in content'
        ]
      });
    }

    // Conversion rate optimizations
    if (cluster.conversionRate < this.thresholds.lowConversionRate && cluster.clicks > 0) {
      optimizations.push({
        type: 'conversion',
        priority: 'high',
        suggestions: [
          'Review CTA placement and visibility',
          'Test different CTA button colors and text',
          'Add urgency elements to CTAs',
          'Improve content-to-CTA relevance',
          'Add social proof near CTAs',
          'Simplify conversion process'
        ]
      });
    }

    // Content optimizations
    if (cluster.impressions >= this.thresholds.minImpressions && cluster.clicks === 0) {
      optimizations.push({
        type: 'content',
        priority: 'critical',
        suggestions: [
          'Review content quality and relevance',
          'Check for technical issues preventing clicks',
          'Improve page load speed',
          'Ensure mobile responsiveness',
          'Add more internal links',
          'Include better visual elements'
        ]
      });
    }

    return {
      clusterName,
      currentMetrics: cluster,
      optimizations,
      status: cluster.performance || 'unknown'
    };
  }

  // Initialize tracking for a blog post
  initializePostTracking(postId, clusterName) {
    // Track impression when page loads
    this.trackImpression(clusterName, postId);

    // Set up click tracking for CTAs
    if (typeof window !== 'undefined') {
      // Track CTA clicks
      document.addEventListener('click', (event) => {
        const ctaElement = event.target.closest('.cta-card a, .paa-cta, .service-link');
        if (ctaElement) {
          const ctaType = this.getCTAType(ctaElement);
          this.trackClick(clusterName, postId, ctaType);
        }
      });

      // Track form submissions as conversions
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        form.addEventListener('submit', () => {
          this.trackConversion(clusterName, postId, 'form_submission');
        });
      });

      // Track phone number clicks
      const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
      phoneLinks.forEach(link => {
        link.addEventListener('click', () => {
          this.trackConversion(clusterName, postId, 'phone_call');
        });
      });
    }
  }

  // Determine CTA type from element
  getCTAType(element) {
    if (element.classList.contains('btn-primary')) return 'primary_cta';
    if (element.classList.contains('btn-secondary')) return 'secondary_cta';
    if (element.classList.contains('paa-cta')) return 'paa_cta';
    if (element.classList.contains('service-link')) return 'service_link';
    return 'unknown_cta';
  }

  // Export data for analysis
  exportData() {
    return {
      clusterMetrics: this.clusterMetrics,
      interactions: {
        impressions: this.getStoredData('ctr_interactions_impression'),
        clicks: this.getStoredData('ctr_interactions_click'),
        conversions: this.getStoredData('ctr_interactions_conversion')
      },
      report: this.generatePerformanceReport()
    };
  }

  // Import data from backup
  importData(data) {
    if (data.clusterMetrics) {
      this.clusterMetrics = { ...this.clusterMetrics, ...data.clusterMetrics };
    }
    
    if (data.interactions) {
      Object.entries(data.interactions).forEach(([key, value]) => {
        this.setStoredData(key, value);
      });
    }
  }

  // Reset all tracking data
  resetData() {
    Object.keys(this.clusterMetrics).forEach(cluster => {
      this.clusterMetrics[cluster] = {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        conversionRate: 0,
        lastUpdated: null,
        performance: 'unknown'
      };
    });

    // Clear stored interaction data
    if (typeof window !== 'undefined' && window.localStorage) {
      ['ctr_interactions_impression', 'ctr_interactions_click', 'ctr_interactions_conversion'].forEach(key => {
        localStorage.removeItem(key);
      });
    }
  }

  // Get real-time metrics dashboard
  getDashboard() {
    const report = this.generatePerformanceReport();
    
    return {
      overview: {
        totalImpressions: report.summary.totalImpressions,
        totalClicks: report.summary.totalClicks,
        totalConversions: report.summary.totalConversions,
        averageCTR: report.summary.averageCTR.toFixed(2),
        averageConversionRate: report.summary.averageConversionRate.toFixed(2)
      },
      clusters: Object.entries(report.clusters).map(([name, metrics]) => ({
        name,
        performance: metrics.performance,
        ctr: metrics.ctr.toFixed(2),
        conversionRate: metrics.conversionRate.toFixed(2),
        impressions: metrics.impressions,
        clicks: metrics.clicks,
        conversions: metrics.conversions,
        status: this.getClusterStatus(metrics)
      })),
      recommendations: report.recommendations,
      lastUpdated: new Date().toISOString()
    };
  }

  // Get cluster status for dashboard
  getClusterStatus(metrics) {
    if (metrics.impressions < this.thresholds.minImpressions) return 'collecting_data';
    if (metrics.performance === 'outstanding') return 'excellent';
    if (metrics.performance === 'excellent') return 'good';
    if (metrics.performance === 'critical') return 'critical';
    if (metrics.performance === 'poor') return 'needs_attention';
    return 'average';
  }
}

export default CTRMonitoringEngine;
