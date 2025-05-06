// scripts/optimize-package-json.js
const fs = require('fs');
const path = require('path');

// Read current package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Create copy for optimization
const optimizedPackageJson = JSON.parse(JSON.stringify(packageJson));

// List of dependencies to remove (appear to be unused)
const dependenciesToRemove = [
  // These dependencies appear to be unused or can be replaced by better alternatives
  'date-fns',
  'tw-animate-css'
];

// For tracking changes
const changes = {
  removed: [],
  suggestion: []
};

// Remove unused dependencies
dependenciesToRemove.forEach(dep => {
  if (optimizedPackageJson.dependencies && optimizedPackageJson.dependencies[dep]) {
    delete optimizedPackageJson.dependencies[dep];
    changes.removed.push({ name: dep, type: 'dependency' });
  } else if (optimizedPackageJson.devDependencies && optimizedPackageJson.devDependencies[dep]) {
    delete optimizedPackageJson.devDependencies[dep];
    changes.removed.push({ name: dep, type: 'devDependency' });
  }
});

// Add optimization notes to suggest import optimizations for heavy packages
changes.suggestion.push({
  name: 'react-icons',
  suggestion: 'Import specific icons directly (e.g., import { FaGithub } from "react-icons/fa") instead of importing the whole package'
});

changes.suggestion.push({
  name: 'framer-motion',
  suggestion: 'Consider using dynamic imports to lazy-load animations'
});

// Add a note about importing only specific Radix UI components
changes.suggestion.push({
  name: '@radix-ui/*',
  suggestion: 'Import only specific components you need from each Radix UI package'
});

// Output optimized package.json
const optimizedPath = path.join(process.cwd(), 'package.optimized.json');
fs.writeFileSync(optimizedPath, JSON.stringify(optimizedPackageJson, null, 2));

// Print the changes
console.log('📦 Package.json Optimization Summary:');

if (changes.removed.length > 0) {
  console.log('\n🗑️ Removed Dependencies:');
  changes.removed.forEach(item => {
    console.log(`  - ${item.name} (${item.type})`);
  });
}

if (changes.suggestion.length > 0) {
  console.log('\n💡 Suggested Import Optimizations:');
  changes.suggestion.forEach(item => {
    console.log(`  - ${item.name}: ${item.suggestion}`);
  });
}

console.log(`\n✅ Optimized package.json written to: ${optimizedPath}`);
console.log('\n⚠️ Important: Please test your application thoroughly after applying these changes!');
console.log('After verifying the changes work, run: npm prune');
