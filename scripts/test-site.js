const http = require('http');
const { execSync } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Define the pages to test
const pagesToTest = [
  '/',
  '/about',
  '/projects',
  '/contact',
  '/public-transportation',
  '/macos-apple-tv',
  '/macbook-pro-opencore',
];

// Function to check if a URL is accessible
async function checkUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      const { statusCode } = res;
      resolve({
        url,
        statusCode,
        success: statusCode === 200,
      });
    }).on('error', (err) => {
      resolve({
        url,
        statusCode: 0,
        success: false,
        error: err.message,
      });
    });
  });
}

// Function to check if the build directory exists and has files
async function checkBuildOutput() {
  try {
    const outDir = path.join(__dirname, '../out');
    const exists = fs.existsSync(outDir);
    
    if (!exists) {
      return {
        success: false,
        message: 'Build directory "out" does not exist. Run "npm run build" first.',
      };
    }
    
    const files = await readdir(outDir);
    const hasFiles = files.length > 0;
    
    return {
      success: hasFiles,
      message: hasFiles 
        ? `Build directory contains ${files.length} files/directories.` 
        : 'Build directory exists but is empty.',
      files: files.slice(0, 5), // Show first 5 files
    };
  } catch (error) {
    return {
      success: false,
      message: `Error checking build output: ${error.message}`,
    };
  }
}

// Main function to run tests
async function runTests() {
  console.log('🧪 Running site tests...\n');
  
  // Check if the build output exists
  console.log('📦 Checking build output...');
  const buildCheck = await checkBuildOutput();
  console.log(buildCheck.message);
  if (buildCheck.files) {
    console.log(`Sample files: ${buildCheck.files.join(', ')}`);
  }
  console.log();
  
  // Start the server
  console.log('🚀 Starting server...');
  const serverProcess = require('child_process').spawn('npm', ['run', 'start'], {
    stdio: 'ignore',
    detached: true,
  });
  
  // Give the server time to start
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Test each page
  console.log('🔍 Testing pages...');
  const results = [];
  
  for (const page of pagesToTest) {
    const url = `http://localhost:3000${page}`;
    const result = await checkUrl(url);
    results.push(result);
    
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${page} - Status: ${result.statusCode}`);
  }
  
  // Kill the server
  process.kill(-serverProcess.pid);
  
  // Summary
  const successCount = results.filter(r => r.success).length;
  console.log(`\n📊 Summary: ${successCount}/${results.length} pages passed`);
  
  if (successCount === results.length) {
    console.log('✨ All tests passed! The site is ready for production.');
  } else {
    console.log('⚠️ Some tests failed. Please check the issues before deploying.');
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
});
