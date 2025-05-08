// scripts/monitor-performance.js
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// Configuration
const config = {
  siteUrl: 'https://jacobbarkin.com',
  lighthouseEndpoint: 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed',
  pagesEndpoint: 'https://api.cloudflare.com/client/v4/accounts/{accountId}/pages/projects/{projectName}/deployments',
  metricsOutputPath: path.join(process.cwd(), 'performance-metrics'),
  pagesToTest: [
    '/',
    '/about',
    '/projects',
    '/contact',
    '/public-transportation'
  ],
  cloudflareAccountId: process.env.CLOUDFLARE_ACCOUNT_ID || '',
  cloudflareApiToken: process.env.CLOUDFLARE_API_TOKEN || '',
  projectName: 'jacob-barkin-portfolio',
  interval: process.env.MONITOR_INTERVAL || 86400000, // Default: once per day (in ms)
};

// Create metrics directory if it doesn't exist
if (!fs.existsSync(config.metricsOutputPath)) {
  fs.mkdirSync(config.metricsOutputPath, { recursive: true });
}

// Lighthouse metrics collector
async function collectLighthouseMetrics(url) {
  try {
    const params = new URLSearchParams({
      url: url,
      category: ['performance', 'accessibility', 'best-practices', 'seo'],
      strategy: 'mobile',
    });

    const response = await fetch(`${config.lighthouseEndpoint}?${params.toString()}`);
    const data = await response.json();

    return {
      timestamp: new Date().toISOString(),
      url: url,
      performance: data.lighthouseResult.categories.performance.score * 100,
      accessibility: data.lighthouseResult.categories.accessibility.score * 100,
      bestPractices: data.lighthouseResult.categories['best-practices'].score * 100,
      seo: data.lighthouseResult.categories.seo.score * 100,
      firstContentfulPaint: data.lighthouseResult.audits['first-contentful-paint'].numericValue,
      largestContentfulPaint: data.lighthouseResult.audits['largest-contentful-paint'].numericValue,
      timeToInteractive: data.lighthouseResult.audits['interactive'].numericValue,
      totalBlockingTime: data.lighthouseResult.audits['total-blocking-time'].numericValue,
      cumulativeLayoutShift: data.lighthouseResult.audits['cumulative-layout-shift'].numericValue,
    };
  } catch (error) {
    console.error(`Error collecting Lighthouse metrics for ${url}:`, error);
    return {
      timestamp: new Date().toISOString(),
      url: url,
      error: error.message,
    };
  }
}

// Cloudflare Pages metrics collector
async function collectCloudflareDeploymentMetrics() {
  if (!config.cloudflareAccountId || !config.cloudflareApiToken) {
    console.warn('Cloudflare credentials not provided. Skipping deployment metrics collection.');
    return null;
  }

  try {
    const endpoint = config.pagesEndpoint
      .replace('{accountId}', config.cloudflareAccountId)
      .replace('{projectName}', config.projectName);

    const response = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${config.cloudflareApiToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.errors[0].message || 'Unknown Cloudflare API error');
    }

    // Get the latest deployment
    const latestDeployment = data.result[0];

    return {
      timestamp: new Date().toISOString(),
      deploymentId: latestDeployment.id,
      deploymentTimestamp: latestDeployment.created_on,
      buildTime: latestDeployment.build_time,
      status: latestDeployment.stage,
      buildConfig: latestDeployment.build_config,
    };
  } catch (error) {
    console.error('Error collecting Cloudflare deployment metrics:', error);
    return {
      timestamp: new Date().toISOString(),
      error: error.message,
    };
  }
}

// Collect all metrics
async function collectAllMetrics() {
  console.log('Starting performance monitoring...');
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const results = { timestamp, pages: {}, cloudflare: null };

  // Collect Lighthouse metrics for all pages
  for (const page of config.pagesToTest) {
    console.log(`Testing page: ${page}`);
    const url = `${config.siteUrl}${page}`;
    results.pages[page] = await collectLighthouseMetrics(url);
  }

  // Collect Cloudflare deployment metrics
  results.cloudflare = await collectCloudflareDeploymentMetrics();

  // Save results to file
  const outputFile = path.join(config.metricsOutputPath, `metrics-${timestamp}.json`);
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  console.log(`Performance metrics saved to: ${outputFile}`);

  // Generate HTML report
  generateHtmlReport(results, timestamp);

  return results;
}

// Generate HTML report
function generateHtmlReport(results, timestamp) {
  const reportFile = path.join(config.metricsOutputPath, `report-${timestamp}.html`);

  let html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Performance Report - ${timestamp}</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; line-height: 1.6; }
      h1, h2, h3 { margin-top: 30px; color: #333; }
      table { border-collapse: collapse; width: 100%; margin-bottom: 30px; }
      th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
      th { background-color: #f5f5f5; }
      .score { font-weight: bold; }
      .good { color: #0caa0c; }
      .average { color: #e67700; }
      .poor { color: #dd2222; }
      .metric-card { background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
      .section { margin-bottom: 40px; }
    </style>
  </head>
  <body>
    <h1>Performance Report - ${new Date(timestamp).toLocaleString()}</h1>

    <div class="section">
      <h2>Pages Performance</h2>
  `;

  // Add page metrics
  for (const [page, metrics] of Object.entries(results.pages)) {
    if (metrics.error) {
      html += `
      <div class="metric-card">
        <h3>${page}</h3>
        <p>Error: ${metrics.error}</p>
      </div>`;
      continue;
    }

    const getScoreClass = (score) => {
      if (score >= 90) return 'good';
      if (score >= 75) return 'average';
      return 'poor';
    };

    html += `
    <div class="metric-card">
      <h3>${page}</h3>
      <table>
        <tr>
          <th>Metric</th>
          <th>Value</th>
        </tr>
        <tr>
          <td>Performance</td>
          <td class="score ${getScoreClass(metrics.performance)}">${Math.round(metrics.performance)}%</td>
        </tr>
        <tr>
          <td>Accessibility</td>
          <td class="score ${getScoreClass(metrics.accessibility)}">${Math.round(metrics.accessibility)}%</td>
        </tr>
        <tr>
          <td>Best Practices</td>
          <td class="score ${getScoreClass(metrics.bestPractices)}">${Math.round(metrics.bestPractices)}%</td>
        </tr>
        <tr>
          <td>SEO</td>
          <td class="score ${getScoreClass(metrics.seo)}">${Math.round(metrics.seo)}%</td>
        </tr>
        <tr>
          <td>First Contentful Paint</td>
          <td>${(metrics.firstContentfulPaint / 1000).toFixed(2)}s</td>
        </tr>
        <tr>
          <td>Largest Contentful Paint</td>
          <td>${(metrics.largestContentfulPaint / 1000).toFixed(2)}s</td>
        </tr>
        <tr>
          <td>Time To Interactive</td>
          <td>${(metrics.timeToInteractive / 1000).toFixed(2)}s</td>
        </tr>
        <tr>
          <td>Total Blocking Time</td>
          <td>${metrics.totalBlockingTime.toFixed(0)}ms</td>
        </tr>
        <tr>
          <td>Cumulative Layout Shift</td>
          <td>${metrics.cumulativeLayoutShift.toFixed(3)}</td>
        </tr>
      </table>
    </div>`;
  }

  // Add Cloudflare deployment metrics
  html += `
    </div>

    <div class="section">
      <h2>Cloudflare Deployment</h2>
  `;

  if (!results.cloudflare) {
    html += `<p>No Cloudflare deployment metrics available. Ensure CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN are set.</p>`;
  } else if (results.cloudflare.error) {
    html += `<p>Error retrieving Cloudflare metrics: ${results.cloudflare.error}</p>`;
  } else {
    html += `
    <div class="metric-card">
      <table>
        <tr>
          <th>Metric</th>
          <th>Value</th>
        </tr>
        <tr>
          <td>Deployment ID</td>
          <td>${results.cloudflare.deploymentId}</td>
        </tr>
        <tr>
          <td>Deployment Time</td>
          <td>${new Date(results.cloudflare.deploymentTimestamp).toLocaleString()}</td>
        </tr>
        <tr>
          <td>Build Time</td>
          <td>${results.cloudflare.buildTime}s</td>
        </tr>
        <tr>
          <td>Status</td>
          <td>${results.cloudflare.status}</td>
        </tr>
      </table>
    </div>`;
  }

  html += `
    </div>

    <div class="section">
      <h2>Recommendations</h2>
      <div class="metric-card">
        <ul>
  `;

  // Generate recommendations based on metrics
  const allMetrics = Object.values(results.pages).filter(m => !m.error);
  if (allMetrics.length > 0) {
    const avgPerformance = allMetrics.reduce((sum, m) => sum + m.performance, 0) / allMetrics.length;
    const avgLCP = allMetrics.reduce((sum, m) => sum + m.largestContentfulPaint, 0) / allMetrics.length;
    const avgTTI = allMetrics.reduce((sum, m) => sum + m.timeToInteractive, 0) / allMetrics.length;
    const avgCLS = allMetrics.reduce((sum, m) => sum + m.cumulativeLayoutShift, 0) / allMetrics.length;

    if (avgPerformance < 90) {
      html += `<li>Overall performance score (${Math.round(avgPerformance)}%) could be improved. Consider further optimizations.</li>`;
    }

    if (avgLCP > 2500) {
      html += `<li>Largest Contentful Paint (${(avgLCP / 1000).toFixed(2)}s) is above the recommended 2.5s. Consider optimizing critical rendering path.</li>`;
    }

    if (avgTTI > 3500) {
      html += `<li>Time to Interactive (${(avgTTI / 1000).toFixed(2)}s) is above the recommended 3.5s. Consider reducing JavaScript execution time.</li>`;
    }

    if (avgCLS > 0.1) {
      html += `<li>Cumulative Layout Shift (${avgCLS.toFixed(3)}) is above the recommended 0.1. Fix elements that shift during page load.</li>`;
    }
  } else {
    html += `<li>No metrics available to generate recommendations.</li>`;
  }

  html += `
        </ul>
      </div>
    </div>
  </body>
  </html>
  `;

  fs.writeFileSync(reportFile, html);
  console.log(`HTML report generated: ${reportFile}`);
}

// Run the script
if (require.main === module) {
  collectAllMetrics().catch(console.error);

  // Set up periodic monitoring if MONITOR_INTERVAL is set
  if (process.env.MONITOR_INTERVAL) {
    console.log(`Setting up periodic monitoring every ${config.interval / 1000 / 60} minutes`);
    setInterval(collectAllMetrics, config.interval);
  }
}

module.exports = {
  collectAllMetrics,
  collectLighthouseMetrics,
  collectCloudflareDeploymentMetrics,
};
