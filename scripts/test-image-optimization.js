// Test script for image optimization
const fs = require('fs');
const path = require('path');

// Define paths to check
const appDir = path.join(__dirname, '../src/app');
const appOptimizedDir = path.join(__dirname, '../src/app/optimized');

// Function to get file size in KB
function getFileSizeInKB(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return (stats.size / 1024).toFixed(2);
  } catch (error) {
    return 'N/A';
  }
}

// Function to check if optimized images exist and compare sizes
function checkOptimizedImages() {
  console.log('Checking optimized images...');
  console.log('----------------------------');

  // Check app icons
  const appIcons = ['apple-icon.png', 'icon.png'];
  
  for (const icon of appIcons) {
    const originalPath = path.join(appDir, icon);
    const optimizedPath = path.join(appOptimizedDir, icon);
    
    const originalSize = getFileSizeInKB(originalPath);
    const optimizedSize = getFileSizeInKB(optimizedPath);
    
    console.log(`${icon}:`);
    console.log(`  Original: ${originalSize} KB`);
    console.log(`  Optimized: ${optimizedSize} KB`);
    
    if (optimizedSize !== 'N/A') {
      const reduction = ((1 - (parseFloat(optimizedSize) / parseFloat(originalSize))) * 100).toFixed(2);
      console.log(`  Reduction: ${reduction}%`);
    } else {
      console.log(`  Optimized file not found. Run 'npm run optimize-images' first.`);
    }
    
    console.log('----------------------------');
  }
}

// Run the check
checkOptimizedImages();