// Script to clean up API routes before build
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directories to clean
const apiDirs = [
  path.join(__dirname, '..', 'src', 'app', 'api'),
  path.join(__dirname, '..', '.next', 'server', 'app', 'api'),
  path.join(__dirname, '..', '.next', 'server', 'chunks', 'app', 'api'),
];

// Function to safely remove a directory
function safeRemoveDir(dir) {
  try {
    if (fs.existsSync(dir)) {
      console.log(`Removing directory: ${dir}`);
      fs.rmSync(dir, { recursive: true, force: true });
      return true;
    } else {
      console.log(`Directory does not exist: ${dir}`);
      return false;
    }
  } catch (error) {
    console.error(`Error removing directory ${dir}:`, error);
    return false;
  }
}

// Clean up API routes
console.log('Cleaning up API routes...');
let removedCount = 0;

for (const dir of apiDirs) {
  if (safeRemoveDir(dir)) {
    removedCount++;
  }
}

// Clean the build cache
console.log('Cleaning build cache...');
try {
  execSync('npm run clean', { stdio: 'inherit' });
  console.log('Build cache cleaned successfully.');
} catch (error) {
  console.error('Error cleaning build cache:', error);
}

console.log(`Cleanup complete. Removed ${removedCount} directories.`);
