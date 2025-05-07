// scripts/optimize-all-images.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Define directories
const publicImagesDir = path.join(__dirname, '../public/images');
const optimizedDir = path.join(publicImagesDir, 'optimized');

// Create optimized directory if it doesn't exist
if (!fs.existsSync(optimizedDir)) {
  fs.mkdirSync(optimizedDir, { recursive: true });
}

// Get all image files from public/images
const imageFiles = fs.readdirSync(publicImagesDir).filter(file => {
  const ext = path.extname(file).toLowerCase();
  return ['.jpg', '.jpeg', '.png'].includes(ext) && !file.includes('optimized');
});

// Process each image
async function processImages() {
  console.log(`Found ${imageFiles.length} images to optimize`);
  
  for (const file of imageFiles) {
    const inputPath = path.join(publicImagesDir, file);
    const fileNameWithoutExt = path.parse(file).name;
    const outputPath = path.join(optimizedDir, `${fileNameWithoutExt}.webp`);
    
    try {
      // Get image info
      const metadata = await sharp(inputPath).metadata();
      console.log(`Processing: ${file} (${metadata.width}x${metadata.height}, ${(fs.statSync(inputPath).size / 1024 / 1024).toFixed(2)}MB)`);
      
      // Optimize image
      await sharp(inputPath)
        .webp({ quality: 85 })
        .toFile(outputPath);
      
      // Get optimized size
      const optimizedSize = fs.statSync(outputPath).size;
      const originalSize = fs.statSync(inputPath).size;
      const savingsPercent = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);
      
      console.log(`✅ Saved to: ${path.relative(publicImagesDir, outputPath)}`);
      console.log(`   Size reduction: ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(optimizedSize / 1024 / 1024).toFixed(2)}MB (${savingsPercent}% smaller)`);
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }
}

// Run the optimization
processImages().then(() => {
  console.log('Image optimization complete!');
  console.log('\nTo use optimized images, update your image paths to:');
  console.log('"/images/optimized/[filename].webp"');
}).catch(err => {
  console.error('Error during optimization:', err);
});
