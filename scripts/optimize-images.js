const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = path.join(__dirname, '../public/images');
const outputDir = path.join(__dirname, '../public/images/optimized');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Get all image files
const imageFiles = fs.readdirSync(inputDir).filter(file => {
  const ext = path.extname(file).toLowerCase();
  return ['.jpg', '.jpeg', '.png'].includes(ext) && !file.includes('optimized');
});

// Process each image
async function processImages() {
  console.log(`Found ${imageFiles.length} images to optimize`);

  for (const file of imageFiles) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);

    // Skip directories
    if (fs.statSync(inputPath).isDirectory()) continue;

    try {
      const ext = path.extname(file).toLowerCase();

      if (ext === '.png') {
        await sharp(inputPath)
          .png({ compressionLevel: 9 })
          .toFile(outputPath);
        console.log(`Optimized PNG: ${file}`);
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

  console.log('Image optimization complete!');
}

processImages();
