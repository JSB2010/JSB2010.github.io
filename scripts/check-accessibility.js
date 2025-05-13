#!/usr/bin/env node

/**
 * Accessibility Checker Script
 * 
 * This script runs accessibility checks on the website using axe-core.
 * It can be used to check for accessibility issues during development.
 */

const { AxePuppeteer } = require('@axe-core/puppeteer');
const puppeteer = require('puppeteer');
const chalk = require('chalk');

// Pages to check
const pagesToCheck = [
  'http://localhost:3000',
  'http://localhost:3000/about',
  'http://localhost:3000/projects',
  'http://localhost:3000/contact',
  'http://localhost:3000/public-transportation',
  'http://localhost:3000/macbook-pro-opencore',
];

// Accessibility rules to check
const rulesToCheck = [
  'wcag2a',
  'wcag2aa',
  'wcag21a',
  'wcag21aa',
  'best-practice',
];

// Run accessibility checks
async function runAccessibilityChecks() {
  console.log(chalk.blue('🔍 Running accessibility checks...'));
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  let hasViolations = false;
  let totalViolations = 0;
  
  try {
    for (const pageUrl of pagesToCheck) {
      console.log(chalk.cyan(`\nChecking ${pageUrl}...`));
      
      const page = await browser.newPage();
      
      try {
        await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 30000 });
        
        // Run axe analysis
        const results = await new AxePuppeteer(page)
          .withTags(rulesToCheck)
          .analyze();
        
        // Process violations
        if (results.violations.length > 0) {
          hasViolations = true;
          totalViolations += results.violations.length;
          
          console.log(chalk.red(`❌ Found ${results.violations.length} accessibility violations:`));
          
          results.violations.forEach((violation, index) => {
            console.log(chalk.red(`\n${index + 1}. ${violation.help} - ${violation.impact} impact`));
            console.log(chalk.yellow(`   Rule: ${violation.id}`));
            console.log(chalk.yellow(`   Description: ${violation.description}`));
            console.log(chalk.yellow(`   Help URL: ${violation.helpUrl}`));
            
            violation.nodes.forEach((node, nodeIndex) => {
              console.log(chalk.gray(`   Element ${nodeIndex + 1}:`));
              console.log(chalk.gray(`     ${node.html}`));
              console.log(chalk.gray(`     ${node.failureSummary}`));
            });
          });
        } else {
          console.log(chalk.green('✅ No accessibility violations found!'));
        }
        
        // Log passes
        console.log(chalk.green(`\n✅ Passed ${results.passes.length} accessibility checks`));
      } catch (error) {
        console.error(chalk.red(`Error checking ${pageUrl}: ${error.message}`));
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
  
  // Summary
  console.log(chalk.blue('\n📊 Accessibility Check Summary:'));
  console.log(chalk.blue(`Pages checked: ${pagesToCheck.length}`));
  
  if (hasViolations) {
    console.log(chalk.red(`Total violations: ${totalViolations}`));
    console.log(chalk.yellow('Please fix these accessibility issues before deploying.'));
    process.exit(1);
  } else {
    console.log(chalk.green('No accessibility violations found across all pages!'));
    process.exit(0);
  }
}

// Check if the development server is running
async function checkServerRunning() {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    const page = await browser.newPage();
    
    try {
      await page.goto('http://localhost:3000', { timeout: 5000 });
      await browser.close();
      return true;
    } catch (error) {
      await browser.close();
      return false;
    }
  } catch (error) {
    return false;
  }
}

// Main function
async function main() {
  console.log(chalk.blue('🌐 Accessibility Checker'));
  console.log(chalk.blue('======================='));
  
  const isServerRunning = await checkServerRunning();
  
  if (!isServerRunning) {
    console.log(chalk.red('❌ Development server is not running!'));
    console.log(chalk.yellow('Please start the development server with:'));
    console.log(chalk.yellow('  npm run dev'));
    process.exit(1);
  }
  
  await runAccessibilityChecks();
}

// Run the main function
main().catch(error => {
  console.error(chalk.red(`Error: ${error.message}`));
  process.exit(1);
});
