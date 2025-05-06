// Backup script for Appwrite database
// This script exports contact form submissions to a JSON file for backup purposes
const { Client, Databases, Query } = require('node-appwrite');
const fs = require('fs');
const path = require('path');

// Appwrite configuration
const config = {
  endpoint: process.env.APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1',
  projectId: process.env.APPWRITE_PROJECT_ID || '6816ef35001da24d113d',
  apiKey: process.env.APPWRITE_API_KEY || '', // Replace with your API key
  databaseId: process.env.APPWRITE_DATABASE_ID || 'contact-form-db',
  collectionId: process.env.APPWRITE_CONTACT_COLLECTION_ID || 'contact-submissions',
};

// Backup directory
const backupDir = path.join(__dirname, '../backups');

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId);

// Set API key for server-side SDK
client.setKey(config.apiKey);

const databases = new Databases(client);

// Function to create backup directory if it doesn't exist
function ensureBackupDirExists() {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    console.log(`Created backup directory: ${backupDir}`);
  }
}

// Function to generate backup filename with timestamp
function getBackupFilename() {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-');
  return `contact-submissions-backup-${timestamp}.json`;
}

// Function to fetch all contact form submissions
async function fetchAllSubmissions() {
  console.log('Fetching contact form submissions...');
  
  try {
    // Get total count first
    const result = await databases.listDocuments(
      config.databaseId,
      config.collectionId,
      [
        Query.limit(1)
      ]
    );
    
    const total = result.total;
    console.log(`Found ${total} submissions to backup.`);
    
    if (total === 0) {
      return [];
    }
    
    // Fetch all submissions in batches
    const batchSize = 100;
    const batches = Math.ceil(total / batchSize);
    let allSubmissions = [];
    
    for (let i = 0; i < batches; i++) {
      console.log(`Fetching batch ${i + 1} of ${batches}...`);
      
      const batchResult = await databases.listDocuments(
        config.databaseId,
        config.collectionId,
        [
          Query.limit(batchSize),
          Query.offset(i * batchSize),
          Query.orderDesc('$createdAt')
        ]
      );
      
      allSubmissions = [...allSubmissions, ...batchResult.documents];
      console.log(`Fetched ${allSubmissions.length} of ${total} submissions.`);
    }
    
    return allSubmissions;
  } catch (error) {
    console.error('Error fetching submissions:', error);
    throw error;
  }
}

// Function to save submissions to a JSON file
function saveSubmissionsToFile(submissions, filename) {
  const filePath = path.join(backupDir, filename);
  
  // Add metadata to the backup
  const backupData = {
    metadata: {
      timestamp: new Date().toISOString(),
      totalSubmissions: submissions.length,
      databaseId: config.databaseId,
      collectionId: config.collectionId,
      projectId: config.projectId
    },
    submissions: submissions
  };
  
  fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));
  console.log(`Backup saved to: ${filePath}`);
  
  return filePath;
}

// Function to create a backup
async function createBackup() {
  console.log('Starting Appwrite database backup...');
  
  try {
    // Ensure backup directory exists
    ensureBackupDirExists();
    
    // Generate backup filename
    const filename = getBackupFilename();
    
    // Fetch all submissions
    const submissions = await fetchAllSubmissions();
    
    // Save submissions to file
    const filePath = saveSubmissionsToFile(submissions, filename);
    
    console.log(`Backup completed successfully! ${submissions.length} submissions backed up.`);
    return {
      success: true,
      filePath,
      count: submissions.length
    };
  } catch (error) {
    console.error('Backup failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Function to restore from a backup file
async function restoreFromBackup(backupFilePath) {
  console.log(`Restoring from backup: ${backupFilePath}`);
  
  try {
    // Read backup file
    const backupData = JSON.parse(fs.readFileSync(backupFilePath, 'utf8'));
    const { submissions } = backupData;
    
    console.log(`Found ${submissions.length} submissions in backup file.`);
    
    // Confirm before proceeding
    if (process.argv.includes('--force')) {
      console.log('Force flag detected. Proceeding with restore without confirmation.');
    } else {
      console.log('WARNING: This will overwrite existing data. Use --force to bypass this warning.');
      console.log('Restore operation aborted. Run with --force to proceed.');
      return {
        success: false,
        message: 'Restore operation aborted. Run with --force to proceed.'
      };
    }
    
    // TODO: Implement actual restore logic
    // This would involve creating new documents in the collection
    // For safety, this is not implemented by default
    
    console.log('Restore functionality is not implemented for safety reasons.');
    console.log('To restore, you would need to implement document creation logic.');
    
    return {
      success: false,
      message: 'Restore functionality is not implemented for safety reasons.'
    };
  } catch (error) {
    console.error('Restore failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Function to list available backups
function listBackups() {
  console.log('Listing available backups...');
  
  try {
    // Ensure backup directory exists
    ensureBackupDirExists();
    
    // Get all backup files
    const files = fs.readdirSync(backupDir)
      .filter(file => file.startsWith('contact-submissions-backup-') && file.endsWith('.json'))
      .sort()
      .reverse(); // Most recent first
    
    if (files.length === 0) {
      console.log('No backups found.');
      return [];
    }
    
    console.log(`Found ${files.length} backups:`);
    files.forEach((file, index) => {
      const filePath = path.join(backupDir, file);
      const stats = fs.statSync(filePath);
      const fileSizeKB = (stats.size / 1024).toFixed(2);
      console.log(`${index + 1}. ${file} (${fileSizeKB} KB)`);
    });
    
    return files;
  } catch (error) {
    console.error('Error listing backups:', error);
    return [];
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'backup';
  
  switch (command) {
    case 'backup':
      await createBackup();
      break;
    
    case 'list':
      listBackups();
      break;
    
    case 'restore':
      const backupFile = args[1];
      if (!backupFile) {
        console.error('Error: Backup file not specified.');
        console.log('Usage: node backup-appwrite-data.js restore <backup-file> [--force]');
        process.exit(1);
      }
      
      const backupFilePath = path.join(backupDir, backupFile);
      if (!fs.existsSync(backupFilePath)) {
        console.error(`Error: Backup file not found: ${backupFilePath}`);
        process.exit(1);
      }
      
      await restoreFromBackup(backupFilePath);
      break;
    
    default:
      console.error(`Unknown command: ${command}`);
      console.log('Available commands: backup, list, restore');
      process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main()
    .then(() => {
      console.log('Script completed.');
      process.exit(0);
    })
    .catch(error => {
      console.error('Script failed:', error);
      process.exit(1);
    });
} else {
  // Export functions for use in other scripts
  module.exports = {
    createBackup,
    listBackups,
    restoreFromBackup
  };
}