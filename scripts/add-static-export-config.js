// This script adds the static export configurations to all API routes
// Run this script after starting the migration to Turbopack

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const API_ROUTES_PATTERN = 'src/app/api/**/route.ts';
const STATIC_EXPORT_CONFIG = `
// Configure static export compatibility
export const dynamic = "force-static";
export const revalidate = false;
`;

// Find all API route files
const apiRouteFiles = glob.sync(API_ROUTES_PATTERN, { cwd: process.cwd() });

console.log(`Found ${apiRouteFiles.length} API route files to process`);

// Process each file
apiRouteFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if the file already has the static export config
  if (content.includes('export const dynamic = "force-static"')) {
    console.log(`✓ Already configured: ${file}`);
    return;
  }
  
  // Find a good place to insert the config (after imports)
  const lines = content.split('\n');
  let insertIndex = 0;
  
  // Try to find the end of imports
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('import ') || line.includes('} from ')) {
      insertIndex = i + 1;
    } else if (line.startsWith('// ') || line === '') {
      // Skip comments and empty lines
      continue;
    } else {
      // Found first non-import statement
      break;
    }
  }
  
  // Insert the static export config
  lines.splice(insertIndex, 0, STATIC_EXPORT_CONFIG);
  const updatedContent = lines.join('\n');
  
  // Write the updated content back to the file
  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log(`✓ Updated: ${file}`);
});
