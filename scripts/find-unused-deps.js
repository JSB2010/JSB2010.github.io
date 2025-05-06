// scripts/find-unused-deps.js
const fs = require('fs');
const path = require('path');

console.log('Starting dependency analysis...');

// Get the package.json dependencies
const packageJsonPath = path.join(process.cwd(), 'package.json');
console.log(`Reading package.json from: ${packageJsonPath}`);
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const dependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies
};

console.log(`Found ${Object.keys(dependencies).length} total dependencies`);

// Define patterns for import statements
const importPatterns = [
  /import\s+?(?:(?:(?:[\w*\s{},]*)\s+from\s+?)|)['"]([^'"]+)['"]/g, // ES6 imports
  /require\s*?\(\s*?['"]([^'"]+)['"]\s*?\)/g, // CommonJS requires
  /import\s*?\(\s*?['"]([^'"]+)['"]\s*?\)/g, // Dynamic imports
  /from\s+['"]([^'"]+)['"]/g, // from statements
];

// Function to recursively search for files
function walkDir(dir, callback) {
  console.log(`Scanning directory: ${dir}`);
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filepath = path.join(dir, file);
      try {
        const stats = fs.statSync(filepath);
        
        if (stats.isDirectory() && 
            !filepath.includes('node_modules') && 
            !filepath.includes('.next') &&
            !filepath.includes('.git')) {
          walkDir(filepath, callback);
        } else if (stats.isFile() && 
                (filepath.endsWith('.js') || 
                filepath.endsWith('.jsx') || 
                filepath.endsWith('.ts') || 
                filepath.endsWith('.tsx') ||
                filepath.endsWith('.mjs') ||
                filepath.endsWith('.cjs'))) {
          callback(filepath);
        }
      } catch (err) {
        console.log(`Error processing file ${filepath}: ${err.message}`);
      }
    });
  } catch (err) {
    console.log(`Error reading directory ${dir}: ${err.message}`);
  }
}

// Track used dependencies
const usedDependencies = new Set();
const allSourceFiles = [];

// Root directory to search
const rootDir = process.cwd();
console.log(`Searching for imports in ${rootDir}...`);

// Search for imports in files
walkDir(rootDir, (filepath) => {
  allSourceFiles.push(filepath);
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    
    importPatterns.forEach(pattern => {
      let match;
      pattern.lastIndex = 0; // Reset the RegExp index
      while ((match = pattern.exec(content)) !== null) {
        const importPath = match[1];
        
        // If it's a package import (not relative or absolute path)
        if (!importPath.startsWith('.') && !importPath.startsWith('/') && !importPath.startsWith('@/')) {
          // Get the package name (before any '/' if it's a submodule)
          const packageName = importPath.startsWith('@') 
            ? importPath.split('/').slice(0, 2).join('/')  // Scoped package
            : importPath.split('/')[0];  // Regular package
          
          usedDependencies.add(packageName);
        }
      }
    });
  } catch (err) {
    console.log(`Error reading file ${filepath}: ${err.message}`);
  }
});

console.log(`Found ${usedDependencies.size} used dependencies across ${allSourceFiles.length} files`);

// Find unused dependencies
const unusedDependencies = [];

for (const dep of Object.keys(dependencies)) {
  // Check special cases for some packages that might be used indirectly
  const specialCases = [
    'typescript', 'eslint', 'next', 
    'tailwindcss', 'postcss', 'jest', 
    'sharp', 'wrangler', 'nodemailer',
    '@tailwindcss/postcss', 'shadcn-ui',
    'tw-animate-css', 'eslint-config-next',
    'jest-environment-jsdom', 'sharp-cli'
  ];
  
  if (!usedDependencies.has(dep) && !specialCases.includes(dep)) {
    // Check if it's referenced in package.json scripts
    let isUsedInScripts = false;
    if (packageJson.scripts) {
      for (const script of Object.values(packageJson.scripts)) {
        if (script.includes(dep)) {
          isUsedInScripts = true;
          break;
        }
      }
    }
    
    if (!isUsedInScripts) {
      unusedDependencies.push(dep);
    }
  }
}

// Output results
console.log('🔍 Dependency Analysis Results:');
console.log(`📄 Total source files analyzed: ${allSourceFiles.length}`);
console.log(`📦 Total dependencies: ${Object.keys(dependencies).length}`);
console.log(`✅ Used dependencies: ${usedDependencies.size}`);
console.log(`❌ Potentially unused dependencies: ${unusedDependencies.length}`);

if (unusedDependencies.length > 0) {
  console.log('\n🚨 Potentially unused dependencies:');
  unusedDependencies.forEach(dep => {
    console.log(`  - ${dep} (${dependencies[dep]})`);
  });
  
  console.log('\n⚠️ Note: Some dependencies may be used indirectly or through dynamic imports.');
  console.log('Please verify before removing any packages.');
}

// List the used dependencies for verification
console.log('\n✅ Used dependencies:');
[...usedDependencies].sort().forEach(dep => {
  console.log(`  - ${dep}`);
});
