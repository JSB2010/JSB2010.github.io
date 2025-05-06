const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Define directories for optimization
const publicInputDir = path.join(__dirname, '../public/images');
const publicOutputDir = path.join(__dirname, '../public/images/optimized');

// Add src/app directory for app icons
const appInputDir = path.join(__dirname, '../src/app');
const appOutputDir = path.join(__dirname, '../src/app/optimized');

// Create output directories if they don't exist
if (!fs.existsSync(publicOutputDir)) {
  fs.mkdirSync(publicOutputDir, { recursive: true });
}

if (!fs.existsSync(appOutputDir)) {
  fs.mkdirSync(appOutputDir, { recursive: true });
}

// Get all image files from public/images
const publicImageFiles = fs.readdirSync(publicInputDir).filter(file => {
  const ext = path.extname(file).toLowerCase();
  return ['.jpg', '.jpeg', '.png'].includes(ext) && !file.includes('optimized');
});

// Get specific large icon files from src/app
const appImageFiles = fs.readdirSync(appInputDir).filter(file => {
  return ['apple-icon.png', 'icon.png'].includes(file);
});

// Process images from a directory
async function processDirectoryImages(inputDir, outputDir, files, options = {}) {
  console.log(`Processing ${files.length} images from ${inputDir}`);

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);

    // Skip directories
    if (fs.statSync(inputPath).isDirectory()) continue;

    try {
      const ext = path.extname(file).toLowerCase();

      if (ext === '.png') {
        // For app icons, use higher quality settings
        if (options.isAppIcon) {
          console.log(`Optimizing app icon: ${file} (${fs.statSync(inputPath).size / 1024} KB)`);
          await sharp(inputPath)
            .resize(options.resize || { width: 512, height: 512 }) // Resize large app icons
            .png({ compressionLevel: 9, quality: 90 })
            .toFile(outputPath);
          console.log(`Optimized app icon: ${file} (${fs.statSync(outputPath).size / 1024} KB)`);
        } else {
          await sharp(inputPath)
            .png({ compressionLevel: 9 })
            .toFile(outputPath);
          console.log(`Optimized PNG: ${file}`);
        }
      } else if (['.jpg', '.jpeg'].includes(ext)) {
        // For JPG files, check if they're empty
        const stats = fs.statSync(inputPath);
        if (stats.size === 0) {
          console.log(`Skipping empty file: ${file}`);
          // Create a small placeholder image
          await sharp({
            create: {
              width: 800,
              height: 600,
              channels: 3,
              background: { r: 100, g: 100, b: 100 }
            }
          })
          .jpeg({ quality: 80 })
          .toFile(outputPath);
          console.log(`Created placeholder for: ${file}`);
        } else {
          // Process normal JPG file
          const imageBuffer = fs.readFileSync(inputPath);
          await sharp(imageBuffer)
            .jpeg({ quality: 80 })
            .toFile(outputPath);
          console.log(`Optimized JPEG: ${file}`);
        }
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }
}

// Main process function
async function processImages() {
  // Process public images
  await processDirectoryImages(publicInputDir, publicOutputDir, publicImageFiles);

  // Process app icons with special settings
  await processDirectoryImages(appInputDir, appOutputDir, appImageFiles, { 
    isAppIcon: true,
    resize: { width: 512, height: 512 }
  });

  console.log('Image optimization complete!');
}

processImages();
