#!/usr/bin/env node

/**
 * This script cancels a stuck GitHub workflow run.
 * Usage: node scripts/cancel-workflow.js <workflow-run-id>
 */

const { execSync } = require('child_process');

// Get the workflow run ID from the command line arguments
const workflowRunId = process.argv[2];

if (!workflowRunId) {
  console.error('Please provide a workflow run ID');
  console.error('Usage: node scripts/cancel-workflow.js <workflow-run-id>');
  process.exit(1);
}

try {
  // Cancel the workflow run using the GitHub CLI
  console.log(`Cancelling workflow run ${workflowRunId}...`);
  execSync(`gh run cancel ${workflowRunId}`, { stdio: 'inherit' });
  console.log('Workflow run cancelled successfully');
} catch (error) {
  console.error('Failed to cancel workflow run:', error.message);
  process.exit(1);
}
